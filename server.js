const express = require("express");
const app = express();
const fileReader = require('graceful-fs')

app.use(express.static("public"));

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

// console.log(process.env.PasswordTest)
socket.on('connection', (io) => {
  console.log("A User has connected")
  io.on("sendResults", data => {
    // console.log(data.auto)
    socket.emit('receieveResults', data)
  })
  io.on("readJSON", ()=>{
    let inputData = fileReader.readFileSync("public/objectives.json", "utf8")
    socket.emit("sendJSON", JSON.parse(inputData))
  })
  io.on('callbackJSON', ()=> {
    let inputData = fileReader.readFileSync("public/objectives.json", "utf8")
    socket.emit('callJSON', JSON.parse(inputData))
  })
})

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://admin:psythoenti@scoutingapp-pblik.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect((err, client) => {
//   const db = client.db("wtr_scouting").collection("teamInfo")
//   // perform actions on the collection object
//   console.log(db)
//   console.log("Database connected")
//   client.close();
// });
//https://docs.mongodb.com/guides/server/drivers/