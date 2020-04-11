let pictureButton = document.getElementById('roboPics')
let matchNumLabel = document.getElementById('matchNumLabel')
let mainButton = document.getElementById('main')
let robotPicture = document.getElementById('robotPicture')
let qualMatch = document.getElementById('qualMatch')
let previewImg = document.getElementById('previewImg')

let picEnabled = false;
pictureButton.addEventListener("click", ()=> {
    if (matchNumLabel.style.display != "none") {
        hideElm(matchNumLabel)
        showElmBlock(robotPicture)
        showElmBlock(previewImg)
        pictureButton.className = "activeTab"
        mainButton.className = ""
        picEnabled = true
        qualMatch.required = false;
        robotPicture.required = true;
    }
})

mainButton.addEventListener("click", () => {
    if (matchNumLabel.style.display == "none") {
        showElmBlock(matchNumLabel)
        hideElm(robotPicture)
        hideElm(previewImg)
        mainButton.className = "activeTab"
        pictureButton.className = ""
        picEnabled = false
        qualMatch.required = true;
        robotPicture.required = false;
    }   
})

robotPicture.addEventListener("change", ()=> {
    let file = robotPicture.files[0]
    if (file != undefined) {
      let reader = new FileReader()
      reader.onloadend = ()=> {
        previewImg.src = reader.result
      };
      reader.readAsDataURL(file)
    }
})

const getPic = () => {
    //maximum of 117 images saved on local storage
    return previewImg.src
}

const generateNewPicEntry = (name, pic) => {
    let returnObj = {}
    returnObj.teamName = name
    returnObj.pic = pic
    return returnObj
}

const clearPicSubmission = () => {
    previewImg.src = ""
    document.getElementById('teamNum').value = ""
    robotPicture.value = ""
    showElmBlock(matchNumLabel)
    hideElm(robotPicture)
    hideElm(previewImg)
    mainButton.className = "activeTab"
    pictureButton.className = ""
    picEnabled = false
    qualMatch.required = true;
    robotPicture.required = false;
}