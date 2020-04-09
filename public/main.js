var internalSocket = io("/");
const hideElm = elm => elm.style.display = "none"
const showElm = elm => elm.style.display = "flex"
const showElmBlock = elm => elm.style.display = "block"
const showElmGrid = elm => elm.style.display = "grid"

let startScreen = document.getElementById('startScreen')
let mainContent = document.getElementById('main-content')
let autoContent = document.getElementById('autoToggle')
let teleOpContent = document.getElementById('teleOpToggle')
let endGameContent = document.getElementById('endgameToggle')
let teamInput = document.getElementById('teamInput')
let formInput = document.getElementById('formInput')
let teamNumTitle = document.getElementById('teamNumTitle')
let creditBox = document.getElementById('credit')
let center = document.getElementById('center')
let submitButton = document.getElementById('submitButton')
let submitAlert = document.getElementById('submitAlert')
let errorAlert = document.getElementById('errorAlert')
let credit = document.getElementById('credits')
let closeCredit = document.getElementById('close')
let robotNotes = document.getElementById('robotNotes')
let downButton = "https://cdn.glitch.com/14d27a3a-8205-462a-b9d9-b36a9ebfed13%2Fsort-down.png?v=1573261554345"
let upButton = "https://cdn.glitch.com/14d27a3a-8205-462a-b9d9-b36a9ebfed13%2Fcaret-arrow-up.png?v=1573263206955"
let autoToggle = true
let teleToggle = true
let endToggle = true
let submitInfo = {auto:{}, tele:{}, end:{}};
let generated = false;
let inputsGood = true;
let preventSubmit = true;

const toggleArrow = (setting, index) => {
  let elm = document.getElementsByClassName('button')[index] 
  let affectElm = "";
  affectElm = document.getElementsByClassName('input')[index] 
  if (setting) {
    elm.src = upButton
    elm.className = 'button upButton'   
    showElm(affectElm)
  } else {
    elm.src = downButton,
    elm.className = 'button downButton'  
    hideElm(affectElm)
  }
  
}
const preventStupidInputs = (inputElm, inputNum) => {
  let input = inputElm.value
  if (input.length >= inputNum || input.length == 0 || input.includes(".") || input.includes("-")) {
    inputElm.value = ""
    return false
  } 
  return true
}

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

const toggleFeatures = () => {
  Object.values(document.getElementsByClassName("toggleFeats toggleCheck"))
  .map((val, index) => {
    if (index != 0) {
      val.addEventListener('click', ()=> {
        val.checked
        ? showElmBlock(document.getElementsByClassName('robotFeats')[index-1])
        : hideElm(document.getElementsByClassName('robotFeats')[index-1])
      })
    } else {
      val.addEventListener('click', ()=> {
        val.checked
        ? Object.values(document.getElementsByClassName('robotFeats')).map(val => showElmBlock(val))
        : (Object.values(document.getElementsByClassName('robotFeats')).map(val => hideElm(val)),
        Object.values(document.getElementsByClassName("toggleFeats toggleCheck")).map(val => val.checked = false)
        )
      })
    } 
  })
}

//form submit for start screen
formInput.addEventListener("submit", (event)=> {
  event.preventDefault()
  if (picEnabled) {
    console.log("this is toggleable")
  }
  else if (preventStupidInputs(document.getElementById('teamNum'), 6) && preventStupidInputs(document.getElementById('qualMatch'), 3) && picEnabled == false) {  
    submit = false;
    showElm(mainContent)
    hideElm(startScreen)
    showElm(center)
    hideElm(creditBox)
    showElmBlock(robotNotes)
    showElmBlock(submitButton)
    teamNumTitle.innerHTML = `Team ${document.getElementById('teamNum').value}`
    toggleFeatures()
  } 
  else {
    showElm(errorAlert)
    setTimeout(()=> {hideElm(errorAlert)}, 1500)
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
  showElmGrid(creditBox)
})
closeCredit.addEventListener('click', ()=> {
  hideElm(creditBox)
})

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
      inputContainer.classList.add("input-container");
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
        numInput.value = 1
        
        inputContainer.appendChild(numInput)
      }
      areaContainer.appendChild(inputContainer)
    }
  }
  generated = true;
}

const finalSubmit = () => {
  submitButton.disabled = true;
  internalSocket.emit('callbackJSON')
  internalSocket.on('callJSON', data => {
    if (preventSubmit) {
    
    preventSubmit = false
    let objectiveList = data;
    for (var index=0; index < 3; index++) {
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
            let objTrue = preventStupidInputs(document.getElementById(objName), 3)
            objTrue ? (
              submitInfo[sectionName][objName] = document.getElementById(objName).value
              ): inputsGood = false
            
            document.getElementById(objName).value == "" 
            ? submitInfo[sectionName][objName] = "0"
            : undefined
            break;
        }
      }
    submitInfo[sectionName].enabled = document.getElementsByClassName("toggleFeats toggleCheck")[index].checked
    }
    submitInfo.teamName = document.getElementById('teamNum').value
    submitInfo.qualificationMatch = document.getElementById("qualMatch").value
    if (robotNotes.value == "") {
      submitInfo.robotNotes = "No Notes"
    } else {
      submitInfo.robotNotes = robotNotes.value
    }
    console.log(submitInfo)
    if (inputsGood) {
      internalSocket.emit("sendResults", submitInfo)
      showElm(submitAlert)
      setTimeout(()=> {hideElm(submitAlert)
        resetScreen()
        hideElm(mainContent)
        hideElm(submitButton)
        showElm(startScreen) 
        hideElm(robotNotes)
      }, 2000)
    } else {
      showElm(errorAlert)
      setTimeout(()=> {hideElm(errorAlert)}, 2000)
      inputsGood = true
      submitButton.disabled = false
    }
  }
  })
}

internalSocket.on('redirect', (destination) => {
  window.location.href = destination
})

const resetScreen = () => {
  Object.values(document.getElementsByClassName('defaultCheck'))
    .map(val => val.checked = false)
  
  Object.values(document.getElementsByClassName('numInput'))
    .map(val => val.value = "1")
  
  Object.values(document.getElementsByClassName('toggleFeats toggleCheck'))
    .map(val => val.checked = true)
  
  Object.values(document.getElementsByClassName('robotFeats'))
    .map(val => showElmBlock(val))
  document.getElementById('teamNum').value = ""
  document.getElementById('qualMatch').value = ""
  robotNotes.value = ""
  submitButton.disabled = false;
  preventSubmit = true
}

internalSocket.emit("readJSON")
internalSocket.on("sendJSON", data => {
  parseJSON(data)
})