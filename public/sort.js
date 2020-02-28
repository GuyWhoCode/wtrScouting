let bestFilter = document.getElementById("bestTeamFilter")
let teamNames = document.getElementsByClassName("teamName")
let result = document.getElementById('results')
bestFilter.addEventListener("change", ()=> {
    let selection = bestFilter.value
    if (selection != "") findBestTeam()
    else location.reload()
})

const getKeysByValue = (obj, val) => {
    let returnItem = Object.keys(obj).find(key => obj[key] === val)
    delete obj[returnItem]
    return returnItem 
}

const genPlacement = num => {
    let returnTitle = ""
    let strNum = num.toString().split("")[num.toString().length-1]
    if (num.toString().split("")[0].includes("1") && num.toString().split("")[0].length != 1) {
        returnTitle = num + "th"
    } else if (strNum.includes("1")) {
        returnTitle = num + "st"
    } else if (strNum.includes("2")) {
        returnTitle = num + "nd"
    } else if (strNum.includes("3")) {
        returnTitle = num + "rd"
    } else {
        returnTitle = num + "th"
    }
   return returnTitle
}

const findBestTeam = () => {
    let finalAvgList = {}
    let avgCount = Object.values(document.getElementsByClassName("teamStats")[0].childNodes).map(val => val.className).filter(val => val.includes("section")).length
    let teamsList = Object.values(teamNames).map(val => val.innerHTML.split("#")[1])
    teamsList.map((val, index) => {
        finalAvgList[val] = teamsList.map(val => Object.values(document.getElementsByClassName("section " + val)))[index].map(val => parseInt(val.innerHTML.split(":")[1]))
        finalAvgList[val] = Math.round(finalAvgList[val].reduce((val, prev) => val + prev)/finalAvgList[val].length)
    })
    var sortedArray = Object.values(finalAvgList).sort((a, b)=> a-b)
    sortedArray = sortedArray.map(val => getKeysByValue(finalAvgList, val))
    for (var i=0; i < sortedArray.length; i++) {
        let teamName = sortedArray[i]
        let genPlace = Math.abs(i-sortedArray.length)
        document.getElementsByClassName("placement " + teamName)[0].innerHTML = genPlacement(genPlace)
        result.insertBefore(document.getElementsByClassName("placement " + teamName)[0], result.childNodes[7])
        result.insertBefore(document.getElementsByClassName("matchNum " + teamName)[0], result.childNodes[7])
        result.insertBefore(document.getElementsByClassName("teamStats " + teamName)[0], result.childNodes[7])
    }
} 
