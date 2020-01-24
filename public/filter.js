let sectionFilter = document.getElementById("sectionFilter")
let selectionTitle = document.getElementById("selection")
let resetFilter = document.getElementById("reset")
let bestFilter = document.getElementById("bestTeamFilter")

sectionFilter.addEventListener("change", ()=> {
  let selection = ""
  if (sectionFilter.value != "undefined") selection = sectionFilter.value 
  if (selection != "") filterSection(selection)
})

bestFilter.addEventListener("change", ()=> {
  let selection = bestFilter.value
  if (selection != "") findBestTeam(document.getElementById("teamInfo").className)
})

resetFilter.addEventListener('click', ()=> {
  filterSection("section")
  document.getElementById('sectionFilter').value = "undefined"
})

const filterSection = name => {
  Object.values(document.getElementsByClassName("section")).map(val => val.style.display = "none")  
  Object.values(document.getElementsByClassName(name)).map(val => val.style.display = "block")  
  if (name == "section") {
      selectionTitle.innerHTML = ""
  }  else {
      selectionTitle.innerHTML = `Filtered for ${name.charAt(0).toUpperCase() + name.split("").slice(1,name.length).join("")}`
  }
}

const findBestTeam = team => {
  console.log("team")
}