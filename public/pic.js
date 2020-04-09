let pictureButton = document.getElementById('roboPics')
let matchNumLabel = document.getElementById('matchNumLabel')
let mainButton = document.getElementById('main')
let addPic = document.getElementById('addPic')
let robotPicture = document.getElementById('robotPicture')
let qualMatch = document.getElementById('qualMatch')
let previewPic = document.getElementById('previewPic')

let picEnabled = false;
pictureButton.addEventListener("click", ()=> {
    if (matchNumLabel.style.display != "none") {
        hideElm(matchNumLabel)
        showElmBlock(addPic)
        pictureButton.className = "activeTab"
        mainButton.className = ""
        picEnabled = true
        qualMatch.required = false;
    }
})

mainButton.addEventListener("click", () => {
    if (matchNumLabel.style.display == "none") {
        showElmBlock(matchNumLabel)
        hideElm(addPic)
        mainButton.className = "activeTab"
        pictureButton.className = ""
        picEnabled = false
        qualMatch.required = true;
    }   
})

addPic.addEventListener("click", () => {
    robotPicture.click()
    let file = robotPicture.files[0]
    if (file != undefined) {
      let reader = new FileReader()
      reader.onloadend = ()=> {
          previewPic.src = reader.result
      };
      reader.readAsDataURL(file)
    }
}, false)
// function submit() {
//     let file = fileUpload.files[0]
//     let saveFile = ""
//     if (file != undefined) {
//         let reader = new FileReader()
//         reader.onloadend = ()=> {
//             resultImg.src = reader.result
//             saveFile = reader.result
//             // localStorage.setItem(`${Math.random()}`, saveFile)
//             //maximum of 117 images saved on local storage
//         };
//         reader.readAsDataURL(file)
//     }
// }