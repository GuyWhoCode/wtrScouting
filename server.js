const express = require("express");
const app = express();
const fileReader = require('graceful-fs')

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://admin:" + process.env.Password + "@scoutingapp-pblik.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(express.static(__dirname + "/public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

app.get("/results", function(request, response) {
  response.sendFile(__dirname + "/public/results.html");
});

const server = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + server.address().port);
});
const socket = require('socket.io').listen(server)

socket.on('connection', (io) => {
  console.log("A User has connected")
  io.on("sendResults", data => {
    client.connect( async(err, client) => {
      
      let db = client.db("wtr_scouting")
      let teamDb = db.collection("teamInfo")      
      let doesTeamExist = await teamDb.find({"teamNum": data.teamName}).toArray()
      
      if (doesTeamExist.length == 0) {
        let teamNum = data.teamName
        delete data.teamName
        
        for (var sec=0; sec < 3; sec++) { //section area scope
          let sectionName = Object.keys(data)[sec]
          let objArea = data[sectionName]
          Object.keys(objArea).map((val, index) => {
            objArea[val] = [objArea[val]]
          })
        }
        teamDb.insertOne({"teamNum": teamNum,
                          "matchNum": 1,
                          "matches": data
        })
        console.log("Team created!")
      } else {
        console.log("Team is updated!")
        let matchNum = doesTeamExist[0].matchNum + 1
        let matchList = doesTeamExist[0].matches
        for (var sec=0; sec < 3; sec++) { //section area scope
          let sectionName = Object.keys(data)[sec]
          let objArea = matchList[sectionName]
          Object.keys(objArea).map((val, index) => {
            objArea[val].push(data[sectionName][val])
          })
        }
        teamDb.updateOne({"teamNum": data.teamName}, {$set: {"matchNum": matchNum, "matches": matchList}})
      }
    });
    // socket.emit('receieveResults', data)
  })
  io.on("readJSON", ()=>{
    let inputData = fileReader.readFileSync("public/objectives.json", "utf8")
    socket.emit("sendJSON", JSON.parse(inputData))
  })
  
  io.on('callbackJSON', ()=> {
    let inputData = fileReader.readFileSync("public/objectives.json", "utf8")
    socket.emit('callJSON', JSON.parse(inputData))
  })
  
  io.on('callDB', ()=> { 
    client.connect( async(err, client) => {
      let teamMatchDB = client.db("wtr_scouting").collection("teamInfo")
      let entireDB = await teamMatchDB.find({}).toArray()  
      let averages = {}
      for (var team = 0; team < entireDB.length; team++) {//team scope
        let matches = entireDB[team].matches
        let teamNum = entireDB[team].teamNum
        let returnObj = {}
        let hasItNums = -3
        let totalNum = -3
        for (var index=0; index < 3; index++) { //section area scope
            let sectionName = Object.keys(matches)[index]
            let objArea = matches[sectionName]
            Object.keys(objArea).map((val, index) => {
              var arrayVal = objArea[val]
              let typeVal = typeof arrayVal[0]
              
              if (typeVal == "boolean") {
                arrayVal = arrayVal.map(val => val ? 1 : 0)
                arrayVal = Math.round(arrayVal.reduce((val, prev) => val + prev)/arrayVal.length) //average function
                if (arrayVal == 1) {
                  hasItNums ++;
                  totalNum ++;
                } else if (arrayVal == 0){
                  totalNum ++;
                }
              } else if (typeVal == "string") {
                arrayVal = arrayVal.map(val => parseInt(val))
                arrayVal = Math.round(arrayVal.reduce((val, prev) => val + prev)/arrayVal.length) //average function
                returnObj["Avg" + val] = arrayVal
              }
            })
        }
        returnObj["hasObj"] = hasItNums
        returnObj["totalObj"] = totalNum
        averages[`${teamNum}`] = returnObj
      }
      socket.emit('receieveDB', entireDB, averages)
    })
  })
  
  io.on('searchTeam', num => {
    client.connect( async(err, client) => {
      let teamMatchDB = client.db("wtr_scouting").collection("teamInfo")
      let team = await teamMatchDB.find({"teamNum": num}).toArray()
      socket.emit('foundTeam', team[0])
    })
  })
  
})