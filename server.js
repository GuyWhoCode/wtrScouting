require("dotenv").config()
const express = require("express");
const app = express();
const fileReader = require('graceful-fs')

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://admin:" + process.env.Password + "@scoutingapp-pblik.mongodb.net/test?retryWrites=true&w=majority";
const DBclient = new MongoClient(url);
let lastAddress = "";
let lastTime = 0;

app.use(express.static(__dirname + "/public"));
app.get("/", function(request, response) {
    response.sendFile(__dirname + "/public/index.html");
});

app.get("/results", function(request, response) {
    response.sendFile(__dirname + "/public/results.html");
});

const server = app.listen(3000, function() {
    console.log("Your app is listening on port " + server.address().port);
});
const socket = require('socket.io')(server)

DBclient.connect(() => {
    socket.on('connection', (io) => {
        console.log("A User has connected")
        lastAddress =  io.handshake.address
        io.on("sendResults", async (data) => {
            if (io.handshake.address == lastAddress && Date.now()-lastTime >= 5000) {
                let teamDb = DBclient.db("wtr_scouting").collection("teamInfo")      
                let doesTeamExist = await teamDb.find({"teamNum": data.teamName}).toArray()
                
                if (doesTeamExist.length == 0) {
                    let teamNum = data.teamName
                    delete data.teamName
                    
                    let robotNotes = data.robotNotes
                    delete data.robotNotes
        
                    let qualMatch = data.qualificationMatch
                    delete data.qualificationMatch

                    for (var sec=0; sec < 3; sec++) { //section area scope
                        let sectionName = Object.keys(data)[sec]
                        let objArea = data[sectionName]
                        Object.keys(objArea).map((val, index) => {
                            objArea[val] = [objArea[val]]
                        })
                    }
                    teamDb.insertOne({
                        "teamNum": teamNum,
                        "matchNum": 1,
                        "matches": data,
                        "robotNotes": [robotNotes],
                        "qualificationMatch": [qualMatch]
                    })
                    lastTime = Date.now()
                    console.log("Team created!")
                } else {
                    console.log("Team updated!")
                    let matchNum = doesTeamExist[0].matchNum + 1
                    let matchList = doesTeamExist[0].matches
                    for (var sec=0; sec < 3; sec++) { //section area scope
                        let sectionName = Object.keys(data)[sec]
                        let objArea = matchList[sectionName]
                        Object.keys(objArea).map((val, index) => {
                            objArea[val].push(data[sectionName][val])
                        })
                    }
                    let updatedRobotNotes = [...doesTeamExist[0].robotNotes, data.robotNotes]
                    let updatedMatch = [...doesTeamExist[0].qualificationMatch, data.qualificationMatch]
                    lastTime = Date.now()
                    teamDb.updateOne({"teamNum": data.teamName}, 
                    {$set: {"matchNum": matchNum, "matches": matchList, "robotNotes": updatedRobotNotes, "qualificationMatch": updatedMatch}})
                }

            } else if (io.handshake.address == lastAddress && Date.now()-lastTime <= 5000){
                let destination = "./badSubmit.html"
                socket.emit("redirect", destination)
            }
        })
        
        io.on("readJSON", ()=>{
            let inputData = fileReader.readFileSync("./objectives.json", "utf8")
            socket.emit("sendJSON", JSON.parse(inputData))
        })
    
        io.on('callbackJSON', ()=> {
            let inputData = fileReader.readFileSync("./objectives.json", "utf8")
            socket.emit('callJSON', JSON.parse(inputData))
        })
    
        io.on('callDB', async ()=> { 
            let teamMatchDB = DBclient.db("wtr_scouting").collection("teamInfo")
            let entireDB = await teamMatchDB.find({}).toArray()  
            let averages = {}
            for (var team = 0; team < entireDB.length; team++) {//team scope
                let matches = entireDB[team].matches
                let teamNum = entireDB[team].teamNum
                let returnObj = {}
                for (var index=0; index < 3; index++) { //section area scope
                    let sectionName = Object.keys(matches)[index]
                    let objArea = matches[sectionName]
                    Object.keys(objArea).map((val, index) => {
                        var arrayVal = objArea[val]
                        let typeVal = typeof arrayVal[0]

                        if (typeVal == "string") {
                            arrayVal = arrayVal.map(val => parseInt(val))
                            arrayVal = Math.round(arrayVal.reduce((val, prev) => val + prev)/arrayVal.length) //average function
                            returnObj[sectionName + "." + val] = arrayVal
                        }
                    })
                }
                averages[`${teamNum}`] = returnObj
            }
            socket.emit('receieveDB', entireDB, averages)
        })
      
        io.on('searchTeam', async (num) => {
            let teamMatchDB = DBclient.db("wtr_scouting").collection("teamInfo")
            let team = await teamMatchDB.find({"teamNum": num}).toArray()
            socket.emit('foundTeam', team[0])
        })
      
        io.on("resetDB", async (password) => {
            if (password == process.env.Reset_Password) {
                let teamMatchDB = DBclient.db("wtr_scouting").collection("teamInfo")
                await teamMatchDB.deleteMany({});
                socket.emit('resetMsg')
            }
        })
    
        io.on("resetTeam", async (password, teamNum) => {
            if (password == process.env.Reset_Password) {
                let teamMatchDB = DBclient.db("wtr_scouting").collection("teamInfo")
                await teamMatchDB.deleteOne({"teamNum": teamNum});
                socket.emit('resetMsg')
            }
        })
    
        io.on("uploadPic", entry => {
            let teamImages = client.db("wtr_scouting").collection("teamImages")
            teamImages.insertOne(entry)
        })
    })
})


// var request = require('request');
// request({
//   method: 'GET',
//   url: 'https://www.thebluealliance.com/api/v3/events/2020',
//   headers: {
//     'Accept': 'application/json',
//     'X-TBA-Auth-Key': process.env.API_Key
//   }}, function (error, response, body) {
//   console.log('Status:', response.statusCode);
//   console.log('Response:', body);
// });