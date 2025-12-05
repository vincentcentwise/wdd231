// -------------------------------
// CONFIG
// -------------------------------
const LEVELS_PER_DIFFICULTY = 5;   // you chose Option C (5 levels)
const QUESTIONS_PER_LEVEL = 7;     // "more?" -> default to 7 (changeable)

// Subjects and difficulties for convenience
const SUBJECTS = ["mathematics","english","general"];
const DIFFICULTIES = ["easy","medium","hard"];

// -------------------------------
// QUESTION BANK (sample real Qs + auto-generation)
// structure: questionBank[subject][difficulty][level] = [ {question, answers[], correct} ... ]
// We'll include a few real sample questions per subject/difficulty/level.
// Remaining slots are filled with generated placeholders so the game is playable immediately.
// -------------------------------
const sampleBank = {
  mathematics: {
    easy: {
      1: [
        { question: "2 + 2 = ?", answers: ["3","4","5","6"], correct: "4" },
        { question: "5 - 2 = ?", answers: ["2","3","4","1"], correct: "3" },
      ],
      2: [
        { question: "3 x 3 = ?", answers: ["6","9","12","15"], correct: "9" },
        { question: "10 / 2 = ?", answers: ["5","2","8","4"], correct: "5" }
      ],
      // levels 3-5 left sparse intentionally
    },
    medium: {
      1: [
        { question: "Square of 8?", answers: ["64","56","72","60"], correct: "64" },
        { question: "12 ÷ 3 = ?", answers: ["2","3","4","6"], correct: "4" },
      ],
    },
    hard: {
      1: [
        { question: "Square root of 144?", answers: ["10","12","14","16"], correct: "12" },
        { question: "5 + 7 x 2 = ?", answers: ["19","24","17","20"], correct: "19" },
      ],
    }
  },

  english: {
    easy: {
      1: [
        { question: "Choose the correct article: '___ apple'", answers: ["a","an","the","none"], correct: "an" },
        { question: "Plural of 'child' is?", answers:["childs","children","childes","childer"], correct:"children" },
      ]
    },
    medium: {
      1: [
        { question: "Synonym of 'happy'?", answers:["sad","joyful","angry","quiet"], correct:"joyful" },
      ]
    },
    hard: {
      1: [
        { question: "Identify the adverb: 'She sings beautifully.'", answers:["She","sings","beautifully","none"], correct:"beautifully" },
      ]
    }
  },

  general: {
    easy: {
      1: [
        { question: "Which color do you get mixing red and white?", answers:["Pink","Green","Brown","Orange"], correct:"Pink" },
      ]
    },
    medium: {
      1: [
        { question: "Capital of Nigeria?", answers:["Lagos","Abuja","Kano","Ibadan"], correct:"Abuja" }
      ]
    },
    hard: {
      1: [
        { question: "Who discovered penicillin?", answers:["Newton","Fleming","Darwin","Curie"], correct:"Fleming" }
      ]
    }
  }
};

// We'll build the final questionBank by copying sampleBank and auto-filling placeholders
const questionBank = {};

// build structure
for (const subject of SUBJECTS) {
  questionBank[subject] = {};
  for (const difficulty of DIFFICULTIES) {
    questionBank[subject][difficulty] = {};
    for (let lvl = 1; lvl <= LEVELS_PER_DIFFICULTY; lvl++) {
      const base = (sampleBank[subject] && sampleBank[subject][difficulty] && sampleBank[subject][difficulty][lvl]) || [];
      // copy existing
      questionBank[subject][difficulty][lvl] = [...base];
      // auto-generate placeholders until we reach QUESTIONS_PER_LEVEL
      let i = 1;
      while (questionBank[subject][difficulty][lvl].length < QUESTIONS_PER_LEVEL) {
        const qNum = questionBank[subject][difficulty][lvl].length + 1;
        questionBank[subject][difficulty][lvl].push({
          question: `(${subject.toUpperCase()} - ${difficulty} - L${lvl}) Placeholder question ${qNum}`,
          answers: [
            `Option A`,
            `Option B`,
            `Option C`,
            `Option D`
          ],
          correct: `Option A`
        });
        i++;
        if (i>100) break; // safety
      }
    }
  }
}

// -------------------------------
// GAME STATE + DOM refs
// -------------------------------
let selectedDifficulty = null;
let selectedSubject = null;
let currentLevel = 1;
let currentIndex = 0;
let score = 0;
let timerInterval = null;
let timeLeft = 20;

const modeScreen = document.getElementById('mode-screen');
const subjectRow = document.getElementById('subject-row');
const quizContainer = document.getElementById('quiz-container');

const modeLabel = document.getElementById('mode-label');
const subjectLabel = document.getElementById('subject-label');
const levelEl = document.getElementById('level');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('next-btn');
const timerFill = document.getElementById('timer-fill');
const leaderboardEl = document.getElementById('leaderboard');
const leaderboardQuizEl = document.getElementById('leaderboard-quiz');

const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
const bgMusic = document.getElementById('bg-music');

let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// make sure audio exists
if (bgMusic) { try { bgMusic.volume = 0.25; } catch(e){} }

// -------------------------------
// UI: Mode & Subject selection events
// -------------------------------
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedDifficulty = btn.dataset.mode; // easy/medium/hard
    subjectRow.style.display = 'block';
    // show/hide leaderboard for mode if you like
    renderLeaderboard();
  });
});

document.querySelectorAll('.subject-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedSubject = btn.dataset.subject; // mathematics/english/general
    // hide mode screen and show quiz
    modeScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    // initialize labels and start
    modeLabel.textContent = capitalize(selectedDifficulty);
    subjectLabel.textContent = capitalize(selectedSubject);
    startGame();
  });
});

document.getElementById('quit-btn').addEventListener('click', () => {
  // stop timers and return to mode screen
  clearInterval(timerInterval);
  quizContainer.style.display = 'none';
  modeScreen.style.display = 'block';
  subjectRow.style.display = 'none';
});

// -------------------------------
// GAME FUNCTIONS
// -------------------------------
function startGame() {
  currentLevel = 1;
  currentIndex = 0;
  score = 0;
  scoreEl.textContent = `Score: ${score}`;
  levelEl.textContent = `Level ${currentLevel}`;
  loadQuestion();
  renderLeaderboard();
}

function loadQuestion() {
  clearInterval(timerInterval);
  // safety checks
  const lvlData = questionBank[selectedSubject][selectedDifficulty][currentLevel];
  if (!lvlData || lvlData.length === 0) {
    finishGame();
    return;
  }

  const q = lvlData[currentIndex];
  questionEl.textContent = q.question;
  answersEl.innerHTML = '';

  // shuffle answers
  const answers = shuffleArray([...q.answers]);
  for (const ans of answers) {
    const b = document.createElement('button');
    b.textContent = ans;
    b.onclick = () => handleAnswer(ans, b);
    answersEl.appendChild(b);
  }

  // UI reset
  nextBtn.style.display = 'none';
  quizContainer.classList.remove('correct','wrong');

  // timer
  timeLeft = 20;
  updateTimerFill();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerFill();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      onTimeUp();
    }
  }, 1000);
}

function handleAnswer(selected, btnEl) {
  clearInterval(timerInterval);

  const q = questionBank[selectedSubject][selectedDifficulty][currentLevel][currentIndex];
  const correct = q.correct;

  // disable buttons
  answersEl.querySelectorAll('button').forEach(b=>b.disabled = true);

  if (selected === correct) {
    score += 10;
    scoreEl.textContent = `Score: ${score}`;
    if (correctSound) try { correctSound.play(); } catch(e){}
    quizContainer.classList.add('correct');
    btnEl.style.background = 'linear-gradient(90deg,#4caf50,#81c784)';
    // confetti hook
    if (typeof launchConfetti === 'function') launchConfetti();
  } else {
    if (wrongSound) try { wrongSound.play(); } catch(e){}
    quizContainer.classList.add('wrong');
    btnEl.style.background = 'linear-gradient(90deg,#f44336,#ef9a9a)';
    // highlight correct
    answersEl.querySelectorAll('button').forEach(b=>{
      if (b.textContent === correct) b.style.background = 'linear-gradient(90deg,#4caf50,#81c784)';
    });
  }

  nextBtn.style.display = 'inline-block';
}

// next button
nextBtn.addEventListener('click', () => {
  currentIndex++;
  const lvlData = questionBank[selectedSubject][selectedDifficulty][currentLevel];
  if (currentIndex >= lvlData.length) {
    // level finished
    currentLevel++;
    currentIndex = 0;
    if (currentLevel > LEVELS_PER_DIFFICULTY) {
      // finished all levels in this difficulty + subject
      finishGame();
      return;
    } else {
      levelEl.textContent = `Level ${currentLevel}`;
      // small delay so user sees the level change
      setTimeout(loadQuestion, 200);
      return;
    }
  }
  // load next question in same level
  setTimeout(loadQuestion, 150);
});

// time up logic
function onTimeUp(){
  quizContainer.classList.add('wrong');
  if (wrongSound) try { wrongSound.play(); } catch(e){}
  nextBtn.style.display = 'inline-block';
  // do not change score; user can continue
}

// finish game
function finishGame() {
  clearInterval(timerInterval);
  alert(`Quiz finished! Your score: ${score}`);

  // store leaderboard (simple: push score)
  leaderboard.push({score, subject: selectedSubject, mode: selectedDifficulty, date: Date.now()});
  // sort and keep top 10
  leaderboard.sort((a,b)=>b.score - a.score);
  if (leaderboard.length > 10) leaderboard = leaderboard.slice(0,10);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

  // go back to selection
  quizContainer.style.display = 'none';
  modeScreen.style.display = 'block';
  subjectRow.style.display = 'none';
  renderLeaderboard();
}

// render leaderboard (two lists: main and quiz-specific)
function renderLeaderboard() {
  // render global top scores at the mode screen
  const globalList = document.getElementById('leaderboard');
  if (globalList) {
    globalList.innerHTML = leaderboard.map(item => `<li>${item.score} — ${capitalize(item.subject)} / ${capitalize(item.mode)}</li>`).join('');
  }
  // render quiz-specific board inside quiz UI
  if (leaderboardQuizEl) {
    const filtered = leaderboard.filter(i => (!selectedSubject || i.subject === selectedSubject) && (!selectedDifficulty || i.mode === selectedDifficulty));
    leaderboardQuizEl.innerHTML = (filtered.length ? filtered : leaderboard).map(i => `<li>${i.score} • ${capitalize(i.subject)} / ${capitalize(i.mode)}</li>`).join('');
  }
}

// -------------------------------
// Helpers
// -------------------------------
function shuffleArray(arr){
  return arr.sort(()=>Math.random() - 0.5);
}
function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
function updateTimerFill(){ timerFill.style.width = (timeLeft/20*100) + '%'; }

// -------------------------------
// confetti placeholder
// If you included previous confetti.js that exposes launchConfetti(), it will run.
// -------------------------------
function launchConfetti(){
  if (typeof window.launchConfetti === 'function') {
    window.launchConfetti();
  }
}

// -------------------------------
// initialize UI with any pre-existing leaderboard
// -------------------------------
(function init(){
  // populate automatically created bank -- already done above
  // render leaderboard from storage
  try {
    const stored = JSON.parse(localStorage.getItem('leaderboard'));
    if (Array.isArray(stored)) leaderboard = stored;
  } catch(e){}
  renderLeaderboard();

  // autoplay background music (may be blocked by browser until user interacts)
    try { if (bgMusic) bgMusic.play().catch(() => { }); } catch (e) { }
})();

