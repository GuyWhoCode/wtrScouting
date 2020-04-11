Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}

let status = document.getElementById('status')
var online = false;
const checkOnline = () => {
    setInterval(() => {
        online = navigator.onLine
        online
        ? (status.innerHTML = "Online Mode",
            status.style.backgroundColor = "var(--light-green)" 
            )
        : (status.innerHTML = "Offline Mode",
            status.style.backgroundColor = "crimson" 
        )
    }, 4000);
}
checkOnline()
//To-do list: 
//add in queue to upload multiple (or one) instances of scout data at once

// pictureButton.addEventListener("click", ()=> {
//     console.log("picture please")
// })
