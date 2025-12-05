// -------------------
// HTML ELEMENTS
// -------------------
const diffBtn = document.getElementById("chooseDifficulty");
const subjectBtn = document.getElementById("chooseSubject");
const levelBtn = document.getElementById("chooseLevel");

const certGrid = document.getElementById("certGrid");
const totalCredit = document.getElementById("totalCredit");

// -------------------
// GAME CONFIG
// -------------------
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const SUBJECTS = ["Mathematics", "English", "General Knowledge"];
const LEVELS = 5;

let chosenDifficulty = null;
let chosenSubject = null;

// ------------------------------------
// STEP 1 — DISPLAY DIFFICULTY OPTIONS
// ------------------------------------
diffBtn.addEventListener("click", (e) => {
    e.preventDefault();
    certGrid.innerHTML = "";
    let count = 0;

    DIFFICULTIES.forEach(diff => {
        const box = document.createElement("div");
        box.classList.add("courseBox");
        box.innerHTML = `<h3>${diff}</h3>`;
        box.onclick = () => selectDifficulty(diff);
        certGrid.appendChild(box);
        count++;
    });

    totalCredit.textContent = count;
});

function selectDifficulty(diff) {
    chosenDifficulty = diff;
    subjectBtn.style.display = "inline-block";
    alert(`Difficulty selected: ${diff}`);
}

// ---------------------------------
// STEP 2 — SUBJECT SELECTION
// ---------------------------------
subjectBtn.addEventListener("click", (e) => {
    e.preventDefault();
    certGrid.innerHTML = "";
    let count = 0;

    SUBJECTS.forEach(sub => {
        const box = document.createElement("div");
        box.classList.add("courseBox");
        box.innerHTML = `<h3>${sub}</h3>`;
        box.onclick = () => selectSubject(sub);
        certGrid.appendChild(box);
        count++;
    });

    totalCredit.textContent = count;
});

function selectSubject(sub) {
    chosenSubject = sub;
    levelBtn.style.display = "inline-block";
    alert(`Subject selected: ${sub}`);
}

// ---------------------------------
// STEP 3 — LEVEL SELECTION
// ---------------------------------
levelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    certGrid.innerHTML = "";
    let count = 0;

    for (let i = 1; i <= LEVELS; i++) {
        const box = document.createElement("div");
        box.classList.add("courseBox");
        box.innerHTML = `<h3>Level ${i}</h3>`;
        box.onclick = () => startGame(i);
        certGrid.appendChild(box);
        count++;
    }

    totalCredit.textContent = count;
});

// ---------------------------------
// STEP 4 — SEND DATA TO GAME PAGE
// ---------------------------------
function startGame(level) {
    const gameData = {
        difficulty: chosenDifficulty,
        subject: chosenSubject,
        level: level
    };

    localStorage.setItem("quizSettings", JSON.stringify(gameData));
    window.location.href = "game.html"; // your quiz page
}
