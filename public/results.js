Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}

var resultSocket = io("/");
resultSocket.emit("callDB")
resultSocket.on("receieveDB", (data, avg) => {
    localStorage.setObject("entireDb", data)
    localStorage.setObject("entireAvg", avg)
    data.map((team, index) => createTeamData(team, avg[team.teamNum]))
})
const showElmGrid = elm => elm.style.display = "grid"
const hideElm = elm => elm.style.display = "none"

let resultsBox = document.getElementById('results')
let teamInfo = document.getElementById('teamInfo')
let filterToggle = document.getElementById('filterToggle')
let filter = document.getElementById("filters")

filterToggle.addEventListener("click", ()=> {
    filterToggle.open ? hideElm(filter) : showElmGrid(filter)
})

const makeInputPretty = input => {
    let newInput = input
        .split("")
        .map((val, index) => 
            val == val.toLowerCase().toUpperCase()
            ? " "+val
            : val
        )
        .join("")
  //ex. word is 'moved'
  //newFirstWord = 'M' + 'oved'
    let newFirstWord = newInput.split(" ")[0].charAt(0).toUpperCase() + 
    newInput.split(" ")[0].split("").slice(1, newInput.split(" ")[0].length).join("")

  let restOfWord = newInput.split(" ").slice(1, newInput.split(" ").length)
    restOfWord.splice(0,0, newFirstWord)
    newInput = restOfWord.join(" ")
    return newInput
}

const clearSelection = () => {
    let selection = teamInfo
    Object.values(selection.childNodes).map(val => selection.removeChild(val))
}

const searchTeam = team => {
    clearSelection()
    let loadingText = document.createElement('h1')
    loadingText.innerHTML = 'Loading...'
    loadingText.id = "loading"
    teamInfo.appendChild(loadingText)
    teamInfo.className = team
    resultSocket.emit("searchTeam", team)
}

const genMatchTitle = num => {
    let returnTitle = ""
    switch (num){    
        case 1: 
            returnTitle = num + "st"
            break;
        case 2:
            returnTitle = num + "nd"
            break;
        case 3:
            returnTitle = num + "rd"
            break;
        default:
            returnTitle = num + "th"
            break;
    }
   return returnTitle + " Match"
}

const createTeamData = (data, avg) => {

    let results = document.createElement("details")
    results.className = "teamStats stats " + data.teamNum

    let teamName = document.createElement('summary')
    teamName.innerHTML = `#${data.teamNum}`
    teamName.className = "teamName"
    teamName.id = data.teamNum
    results.appendChild(teamName)
  
    let matchNum = document.createElement("h2")
    matchNum.innerHTML = `${data.matchNum}`
    matchNum.className = "matchNum stats " + data.teamNum

    let placement = document.createElement('div')
    placement.className = "placement stats " + data.teamNum

    Object.keys(avg).map((avgName, index) => {
        let avgTitle = ""
        if (index < Object.keys(avg).length-2) {
            let avgStr = avgName.split(".")
            avgTitle = document.createElement('h3')
            avgTitle.innerHTML = "Average " + makeInputPretty(avgStr[1]) + ":" + avg[avgName]
            avgTitle.className = "section " + avgStr[0] + " avg " + data.teamNum
        } 
        avgTitle != "" ? results.appendChild(avgTitle) : undefined
    })
  
    let seeMatchNumbers = document.createElement('h3')
    seeMatchNumbers.className = `matchNumbers ${data.teamNum}` 
    seeMatchNumbers.innerHTML = `Match Numbers: ` + data.qualificationMatch
    results.appendChild(seeMatchNumbers)

    let seeMatch = document.createElement('button')
    seeMatch.innerHTML = "All Matches"
    seeMatch.onclick = function(){searchTeam(data.teamNum)}
    seeMatch.className = "seeMatch"
    results.appendChild(seeMatch)

    resultsBox.appendChild(results)
    resultsBox.appendChild(matchNum)
    resultsBox.appendChild(placement)
    findBestTeam()
    Object.values(document.getElementById('results').childNodes)
    .filter((val, index) => index > 6)
    .map((val, index) => (index % 6) < 3 ? val.style.backgroundColor = "gray": (val.style.backgroundColor = "#a9a9a9"))
}

const fillTeamInfo = (info, returnArea) => {
    clearSelection()
    showElmGrid(document.getElementById('filters'))
    let matches = info.matches

    // Auto Translating
    for (var index = 0; index < info.matchNum; index++) { //match scope
        let returnResult = document.createElement('div')
        
        let matchTitle = document.createElement('h1')
        matchTitle.innerHTML = genMatchTitle(index+1)
        matchTitle.className = "title"
        returnResult.appendChild(matchTitle)
        
        let matchNumber = document.createElement('h1')
        matchNumber.className = "objInfo"
        matchNumber.innerHTML = `Qualification Match: ${info.qualificationMatch[index]}`
        returnResult.appendChild(matchNumber)
        
        let matchData = Object.values(matches)
        
        for (var num = 0; num < 3; num++) { //objective scope
            let objSectionName = Object.keys(matches)[num]
            
            let objFeatures = document.createElement('div')
            objFeatures.className = "section " + objSectionName
            
            let objArea = matches[objSectionName]
            
            let objList = Object.values(objArea)
            objList[objList.length-1][index]
            ? (
                Object.keys(objArea).map((val, ind) => {
                      if (val != "enabled") {
                            let newElm = document.createElement("h2")
                            newElm.className = "objInfo"
                            newElm.innerHTML = makeInputPretty(val) + `: ${Object.values(objArea)[ind][index]}`
                            objFeatures.appendChild(newElm)
                      }
                })
            )
            : objFeatures.innerHTML = `Robot Has No ${objSectionName}`
            returnResult.appendChild(objFeatures)
        }
        let notes = document.createElement("h3")
        notes.innerHTML = "Notes: " + info.robotNotes[index]
        returnResult.appendChild(notes)
        returnArea.appendChild(returnResult)
    }
}

resultSocket.on("foundTeam", team => {  
    fillTeamInfo(team, teamInfo)
})

resultSocket.on("resetMsg", () => {
    console.log("database has been reset!")
})