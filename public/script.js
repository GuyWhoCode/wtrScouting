var internalSocket = io("/");
let hideElm = elm => elm.style.display = "none"
let showElm = elm => elm.style.display = "flex"
let showElmBlock = elm => elm.style.display = "block"
let showElmGrid = elm => elm.style.display = "grid"

let startButton = document.getElementById('startButton') 
let startScreen = document.getElementById('startScreen')
let mainContent = document.getElementById('main-content')
let autoContent = document.getElementById('autoToggle')
let teleOpContent = document.getElementById('teleOpToggle')
let endGameContent = document.getElementById('endgameToggle')
let teamInput = document.getElementById('teamInput')
let formInput = document.getElementById('formInput')
let teamNumTitle = document.getElementById('teamNumTitle')
let credit = document.getElementById('creditToggle')
let creditBox = document.getElementById('credit')
let center = document.getElementById('center')
let submitButton = document.getElementById('submitButton')
let resultsButton = document.getElementById('sendResults')
let downButton = "https://cdn.glitch.com/14d27a3a-8205-462a-b9d9-b36a9ebfed13%2Fsort-down.png?v=1573261554345"
let upButton = "https://cdn.glitch.com/14d27a3a-8205-462a-b9d9-b36a9ebfed13%2Fcaret-arrow-up.png?v=1573263206955"
let autoToggle = true
let teleToggle = true
let endToggle = true
let creditToggle = true
let submitInfo = {auto:{}, tele:{}, end:{}};
let generated = false;
let submit = false;

const toggleArrow = (setting, index) => {
  let elm = document.getElementsByClassName('button')[index] 
  let affectElm = "";
  index == 3
  ? affectElm = creditBox
  : affectElm = document.getElementsByClassName('input')[index]  
  
  if (setting) {
    elm.src = downButton
    elm.className = 'button downButton'   
    hideElm(affectElm)
  } else {
    elm.src = upButton,
    elm.className = 'button upButton'  
    index == 3 
    ? showElmGrid(affectElm)
    : showElm(affectElm)
  }
  
}
const preventStupidInputs = inputElm => {
  let input = inputElm.value
  if (input.length >= 6 || input.length == 0) {
    alert('Retry again stoopid')
    document.getElementById('teamNum').value = ""
    return false
  } else if (input.includes(".") || input.includes("-")) {
    alert("Hey! Illegal characters, only numbers")
    document.getElementById('teamNum').value = ""
    return false
  }
  return true
}

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

resultsButton.addEventListener('click', ()=> {
  window.location = "/results"
})

startButton.addEventListener('click', ()=> {
  hideElm(startButton)
  showElm(teamInput)
})

formInput.addEventListener("submit", (event)=> {
  event.preventDefault()
  if (preventStupidInputs(document.getElementById('teamNum'))){
    showElm(mainContent)
    hideElm(startScreen)
    hideElm(credit)
    showElm(center)
    hideElm(creditBox)
    showElmBlock(submitButton)
    teamNumTitle.innerHTML = `Team ${document.getElementById('teamNum').value}`
    toggleFeatures()
    
  }
})

autoContent.addEventListener('click', ()=> {
  autoToggle ? autoToggle = false : autoToggle = true
  toggleArrow(autoToggle, 0)
})
teleOpContent.addEventListener('click', ()=> {
  teleToggle ? teleToggle = false : teleToggle = true
  toggleArrow(teleToggle, 1)
})
endGameContent.addEventListener('click', ()=> {
  endToggle ? endToggle = false : endToggle = true
  toggleArrow(endToggle, 2)
})
credit.addEventListener('click', ()=> {
  creditToggle ? creditToggle = false : creditToggle = true
  toggleArrow(creditToggle, 3)
})

const toggleFeatures = () => {
  Object.values(document.getElementsByClassName("toggleFeats toggleCheck"))
  .map((val, index) => {
    val.addEventListener('click', ()=> {
      val.checked
      ? showElmBlock(document.getElementsByClassName('robotFeats')[index])
      : hideElm(document.getElementsByClassName('robotFeats')[index])
    })
  })
}
const parseJSON = json => {
  if (generated) {
    return;
  }
  let gameContainer = Object.keys(json)
  for (var area = 0; area < gameContainer.length; area++) {
    let gameArea = gameContainer[area]
    let areaContainer = document.getElementById(gameArea + "Feats")
    let gameSection = Object.keys(json[gameArea])
    
    for (var obj = 0; obj < gameSection.length; obj++) {
      let objContainer = document.createElement('div')
      let objName = gameSection[obj]
      let objType = Object.values(json[gameArea])[obj]
      
      let objLabel = document.createElement('label')
      objLabel.innerHTML = makeInputPretty(objName) + ":"
      
      let inputContainer = document.createElement('div')
      inputContainer.appendChild(objLabel)

      if (objType == "T/F") {
        //Checkbox        
        let checkBoxSpan = document.createElement('span')
        checkBoxSpan.className = 'checkBox'
        
        let checkBoxContainer = document.createElement('label')
        checkBoxContainer.className = 'checkBoxContainer true'
        checkBoxContainer.innerHTML = 'Yes'
        
        let hiddenCheck = document.createElement('input')
        hiddenCheck.type = 'checkBox'
        hiddenCheck.className = 'defaultCheck'
        hiddenCheck.id = objName
        
        checkBoxContainer.appendChild(hiddenCheck)
        checkBoxContainer.appendChild(checkBoxSpan)
        inputContainer.appendChild(checkBoxContainer)

      } else if (objType == "Num") {
        //Number Input
        let numInput = document.createElement('input')
        numInput.type = "number"
        numInput.className = "numInput"
        numInput.id = objName
        
        inputContainer.appendChild(numInput)
      }
      areaContainer.appendChild(inputContainer)
    }
  }
  generated = true;
}


const finalSubmit = () => {
  internalSocket.emit('callbackJSON')
  internalSocket.on('callJSON', data => {
    let objectiveList = data;
    for (var index=0; index < Object.keys(objectiveList).length; index++) {
      //ex. auto, tele, end
      let sectionName = Object.keys(objectiveList)[index]
      //objectives list 
      let objectives = Object.values(objectiveList)[index]
      
      let objectiveNameList = Object.keys(objectives)
      for (var obj=0; obj < objectiveNameList.length; obj++) {
        let objName = objectiveNameList[obj]
        
        switch (document.getElementById(objName).type) {
          case 'checkbox':
            submitInfo[sectionName][objName] = document.getElementById(objName).checked
            break;
          default:
            submitInfo[sectionName][objName] = document.getElementById(objName).value
            break;
        }
      }
      submitInfo[sectionName].enabled = document.getElementsByClassName("toggleFeats toggleCheck")[index].checked
    }
    submitInfo.teamName = document.getElementById('teamNum').value
    internalSocket.emit("sendResults", submitInfo)
    resetScreen()
    hideElm(mainContent)
    hideElm(submitButton)
    showElm(credit)
    showElm(startScreen)
  })
}
const resetScreen = () => {
  Object.values(document.getElementsByClassName('defaultCheck'))
    .map(val => val.checked = false)
  
  Object.values(document.getElementsByClassName('numInput'))
    .map(val => val.value = "")
  
  Object.values(document.getElementsByClassName('toggleFeats toggleCheck'))
    .map(val => val.checked = true)
  
  Object.values(document.getElementsByClassName('robotFeats'))
    .map(val => showElmBlock(val))
  document.getElementById('teamNum').value = ""
  if (submit == false) {
    alert("Your Scouting Form has been Submitted")
    submit = true
  } else if (submit) {
    submit = false
  }
}
internalSocket.emit("readJSON")
internalSocket.on("sendJSON", data => {
  parseJSON(data)
})
