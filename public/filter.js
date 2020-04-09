let sectionFilter = document.getElementById("sectionFilter")
let selectionTitle = document.getElementById("selection")
let resetFilter = document.getElementById("reset")
let teamSearch = document.getElementById('teamSearch')
const clearSearch = section => {
  section.map(val => val.style.display = "none")  
}

sectionFilter.addEventListener("change", ()=> {
  let selection = ""
  if (sectionFilter.value != "undefined") selection = sectionFilter.value 
  if (selection != "") filterSection(selection)
})

resetFilter.addEventListener('click', ()=> {
  filterSection("section")
  document.getElementById('sectionFilter').value = "undefined"
})

teamSearch.addEventListener('input', ()=> {
  let stats = Object.values(document.getElementsByClassName("stats"))
  let teamNameContainer = Object.values(document.getElementsByClassName("teamName"))
  clearSearch(stats)
  let searchResult = teamNameContainer.map(val => val.id.includes(teamSearch.value))
  searchResult.map((val, index) => val ? (teamNameContainer[index].id): undefined)
  .filter(val => val != undefined)
  .map(val => Object.values(document.getElementsByClassName("stats " + val)).map(val => val.style.display = "block"))
})

const filterSection = name => {
  clearSearch(Object.values(document.getElementsByClassName("section")))
  Object.values(document.getElementsByClassName(name)).map(val => val.style.display = "block")  
  if (name == "section") {
      selectionTitle.innerHTML = ""
  }  else {
      selectionTitle.innerHTML = `Filtered for ${name.charAt(0).toUpperCase() + name.split("").slice(1,name.length).join("")}`
  }
}
