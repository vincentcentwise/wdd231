import { temple } from '../data/temple.js';

console.log(temple);

const showhere = document.querySelector("#showhere");
const mydialog = document.querySelector("#mydialog");
const mytitle = document.querySelector("#mydialog h2");
const myclose = document.querySelector("#mydialog button");
const myinfo = document.querySelector("#mydialog p");

myclose.addEventListener("click", () => mydialog.close());

function displayitem(data) {
    data.forEach(x => {
        const card = document.createElement("div");
        card.className = "itemCard";

        const photo = document.createElement("img");
        photo.src = `images/${x.image}`;  // corrected
        photo.alt = x.name;
       

        const title = document.createElement("h3");
        title.textContent = x.name;

        card.appendChild(photo);
        card.appendChild(title);

        card.addEventListener("click", () => {
            mytitle.textContent = x.name;
            myinfo.textContent = `${x.address} • ${x.phone}`;
            photo.src = x.image;
            mydialog.showModal();
        });

        showhere.appendChild(card);
    });
}

displayitem(temple);


// LOCALSTORAGE VISIT MESSAGE
const VISIT_KEY = "discover-last-visit";
const visitorMsg = document.querySelector("#visitorMessage");

const now = Date.now();
const lastVisit = Number(localStorage.getItem(VISIT_KEY));

if (!lastVisit) {
    visitorMsg.textContent = "Welcome! Let us know if you have any questions.";
} else {
    const days = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
    if (days < 1) visitorMsg.textContent = "Back so soon! Awesome!";
    else visitorMsg.textContent = `You last visited ${days} day${days > 1 ? "s" : ""} ago.`;
}

localStorage.setItem(VISIT_KEY, now);