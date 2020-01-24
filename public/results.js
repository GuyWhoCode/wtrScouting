var resultSocket = io("/");
resultSocket.emit("callDB")
resultSocket.on("receieveDB", (data, avg) => {
  data.map((team, index) => createTeamData(team, avg[team.teamNum]))
})
let showElmGrid = elm => elm.style.display = "grid"

// resultSocket.on("receieveResults", data => {
//   fillTeamInfo(data)
// })

let resultsBox = document.getElementById('results')
let returnHome = document.getElementById('returnHome')
let teamInfo = document.getElementById('teamInfo')

returnHome.addEventListener('click', ()=> {
  window.location = "/"
})

var makeInputPretty = input => {
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

var genMatchTitle = num => {
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

  let results = document.createElement("div")
  results.id = data._id
  
  let teamName = document.createElement('h1')
  teamName.innerHTML = `Team #${data.teamNum}`
  teamName.id = data.teamNum
  results.appendChild(teamName)
  
  
  let matchNum = document.createElement('h2')
  matchNum.innerHTML = `Matches: ${data.matchNum}`
  results.appendChild(matchNum)
  
  
  Object.keys(avg).map((avgName, index) => {
    let avgTitle = ""
    if (index < Object.keys(avg).length-2) {
      let avgStr = avgName.slice(3)
      avgTitle = document.createElement('h3')
      avgTitle.innerHTML = "Average " + makeInputPretty(avg) + ":" + avg[avgName]
    } else if (index == Object.keys(avg).length-1) {
      avgTitle = document.createElement('h3')
      avgTitle.innerHTML = "Has " + avg[avgName] + " out of "+ Object.values(avg)[Object.keys(avg).length-1] + " Possible Game Items"
    }
    // console.log(avg[avgName])
    avgTitle != "" ? results.appendChild(avgTitle) : undefined
  })
  
  
  let seeMatch = document.createElement('button')
  seeMatch.innerHTML = "All Matches"
  seeMatch.onclick = function(){searchTeam(data.teamNum)}
  results.appendChild(seeMatch)
  resultsBox.appendChild(results)
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
    returnResult.appendChild(matchTitle)
    let matchData = Object.values(matches)

    for (var num = 0; num < 3; num++) { //objective scope
      let objSectionName = Object.keys(matches)[num]

      let objFeatures = document.createElement('p')
      objFeatures.className = "section " + objSectionName
      
      let objArea = matches[objSectionName]

      let objList = Object.values(objArea)
      objList[objList.length-1][index]
      ? (
        Object.keys(objArea).map((val, ind) => {
          if (val != "enabled") {
            let newElm = ""
            newElm = document.createTextNode(makeInputPretty(val) + `: ${Object.values(objArea)[ind][index]}`) 
            
            let newLine = document.createElement('br')
            objFeatures.appendChild(newElm)
            objFeatures.appendChild(newLine)
          }
        })
      )
      : objFeatures.innerHTML = `Robot Has No ${objSectionName}`
      returnResult.appendChild(objFeatures)
    }
    returnArea.appendChild(returnResult)
  }
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

const clearSelection = () => {
    let selection = teamInfo
    Object.values(selection.childNodes).map(val => selection.removeChild(val))
}
resultSocket.on("foundTeam", team => {  
  fillTeamInfo(team, teamInfo)
})