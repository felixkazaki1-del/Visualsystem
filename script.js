
let alters = JSON.parse(localStorage.getItem("alters")) || [];
let frontList = JSON.parse(localStorage.getItem("frontList")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

function save(){

localStorage.setItem("alters",JSON.stringify(alters));
localStorage.setItem("frontList",JSON.stringify(frontList));
localStorage.setItem("history",JSON.stringify(history));

}

function render(){

let alterContainer=document.getElementById("alterContainer");
alterContainer.innerHTML="";

alters.forEach(a=>{

let card=document.createElement("div");
card.className="alter";

card.style.borderColor = a.color || "#ccc";

card.innerHTML=`
<img src="${a.avatar || ""}">
<h3>${a.name}</h3>
<div class="bio">${markdown(a.bio || "")}</div>
<button onclick="addFront('${a.id}')">Front</button>
`;

alterContainer.appendChild(card);

});

renderFront();
renderHistory();

}

function renderFront(){

let c=document.getElementById("frontContainer");
c.innerHTML="";

frontList.forEach(a=>{

let div=document.createElement("div");
div.className="front";

div.innerHTML=`
<b>${a.name}</b>
<button onclick="removeFront('${a.id}')">Remove</button>
`;

c.appendChild(div);

});

}

function renderHistory(){

let h=document.getElementById("historyContainer");
h.innerHTML="";

history.slice().reverse().forEach(item=>{

let li=document.createElement("li");
li.textContent=item;

h.appendChild(li);

});

}

function addFront(id){

let alter=alters.find(a=>a.id===id);
if(!alter) return;

if(!frontList.find(a=>a.id===id)){

frontList.push(alter);

history.push(alter.name+" fronted at "+new Date().toLocaleString());

save();
render();

}

}

function removeFront(id){

frontList=frontList.filter(a=>a.id!==id);

history.push("Alter left front at "+new Date().toLocaleString());

save();
render();

}

function markdown(text){

return text.replace(/\*\*(.*?)\*\*/g,"<b>$1</b>");

}

function toggleTheme(){

document.body.classList.toggle("dark");

localStorage.setItem("theme",
document.body.classList.contains("dark")?"dark":"light");

}

function loadTheme(){

if(localStorage.getItem("theme")==="dark"){

document.body.classList.add("dark");

}

}

function searchAlters(){

let q=document.getElementById("searchBar").value.toLowerCase();

document.querySelectorAll(".alter").forEach(card=>{

let name=card.querySelector("h3").innerText.toLowerCase();

card.style.display=name.includes(q)?"block":"none";

});

}

async function importFromPluralKit(){

let id=document.getElementById("pkSystemId").value.trim();

if(!id){

alert("Enter PluralKit system ID");
return;

}

let res = await fetch(`https://api.pluralkit.me/v2/systems/${id}/members`);
let data = await res.json();

alters=data.map(m=>({
id:m.id,
name:m.name,
avatar:m.avatar_url,
bio:m.description || "",
color:m.color || "#ccc"
}));

save();
render();

}

function exportBackup(){

let data={alters,frontList,history};

let blob=new Blob([JSON.stringify(data)],{type:"application/json"});

let a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="oksystem-backup.json";

a.click();

}

function importBackup(event){

let file=event.target.files[0];

if(!file) return;

let reader=new FileReader();

reader.onload=function(){

let data=JSON.parse(reader.result);

alters=data.alters || [];
frontList=data.frontList || [];
history=data.history || [];

save();
render();

};

reader.readAsText(file);

}

loadTheme();
render();
