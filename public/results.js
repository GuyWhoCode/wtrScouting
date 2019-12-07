var resultSocket = io("/");

resultSocket.on("receieveResults", (data) => {
  console.log(data)
  translateData(data)
})

let resultsBox = document.getElementById('results')
let returnHome = document.getElementById('returnHome')

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

const translateData = data => {
  let results = document.createElement("div")
  let teamName = document.createElement('h1')
  teamName.innerHTML = `Team #${data.teamName}`
  results.appendChild(teamName)
  //Auto Translating
  for (var index = 0; index < Object.keys(data).length-1; index++) {
    let objSectionName = Object.keys(data)[index]
      let objSection = document.createElement('h1')
      objSection.className = "section"
      
      objSection.innerHTML = objSectionName.charAt(0).toUpperCase() + objSectionName.split("").slice(1,objSectionName.length).join("") + ":"
      
      let objFeatures = document.createElement('p')
      
      data[objSectionName].enabled
      ? (
        Object.keys(data[objSectionName]).map((val, index) => {
          if (index < Object.keys(data[objSectionName]).length == true) {
            let newElm = ""
            console.log(Object.values(data[objSectionName])[index])
            if (Object.values(data[objSectionName])[index] == "") {
              newElm = document.createTextNode(makeInputPretty(val) + `: 0`)
            } else {
              newElm = document.createTextNode(makeInputPretty(val) + `: ${Object.values(data[objSectionName])[index]}`) 
            }
            let newLine = document.createElement('br')
            objFeatures.appendChild(newElm)
            objFeatures.appendChild(newLine)
          }
        })
      )
      : objFeatures.innerHTML = `Robot Has No ${objSectionName}`
      objSection.appendChild(objFeatures)
      results.appendChild(objSection)
  }
  resultsBox.appendChild(results)
}