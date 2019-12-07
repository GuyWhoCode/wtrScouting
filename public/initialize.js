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
let downButton = "https://cdn.glitch.com/14d27a3a-8205-462a-b9d9-b36a9ebfed13%2Fsort-down.png?v=1573261554345"
let upButton = "https://cdn.glitch.com/14d27a3a-8205-462a-b9d9-b36a9ebfed13%2Fcaret-arrow-up.png?v=1573263206955"
let autoToggle = true
let teleToggle = true
let endToggle = true
let creditToggle = true
let submitInfo = {auto:{}, tele:{}, end:{}};

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