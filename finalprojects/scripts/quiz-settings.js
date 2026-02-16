// js/quiz-settings.js
// ES module for index page interactions - difficulty → subject → level
const DIFFICULTIES = ['easy','medium','hard'];
const SUBJECTS = ['mathematics','english','general'];
const LEVELS = 5;

const diffGrid = document.getElementById('difficulty-grid');
const subjGrid = document.getElementById('subject-grid');
const lvlGrid = document.getElementById('level-grid');
const totalItems = document.getElementById('total-items');

function renderDifficulties() {
  diffGrid.innerHTML = '';
  DIFFICULTIES.forEach(d => {
    const div = document.createElement('div');
    div.className = 'courseBox';
    div.innerHTML = `<h3>${d.toUpperCase()}</h3><p>Play ${d} quizzes</p>`;
    div.addEventListener('click', () => selectDifficulty(d));
    diffGrid.appendChild(div);
  });
  totalItems.textContent = DIFFICULTIES.length;
}

function selectDifficulty(d) {
  // show subject grid
  subjGrid.classList.remove('hidden');
  subjGrid.innerHTML = '';
  SUBJECTS.forEach(s => {
    const div = document.createElement('div');
    div.className = 'courseBox';
    div.innerHTML = `<h3>${capitalize(s)}</h3>`;
    div.addEventListener('click', () => selectSubject(d, s));
    subjGrid.appendChild(div);
  });
  totalItems.textContent = SUBJECTS.length;
  window.scrollTo({top: subjGrid.offsetTop - 80, behavior: 'smooth'});
}

function selectSubject(difficulty, subject) {
  // show levels
  lvlGrid.classList.remove('hidden');
  lvlGrid.innerHTML = '';
  for(let i=1;i<=LEVELS;i++){
    const div = document.createElement('div');
    div.className = 'courseBox';
    div.innerHTML = `<h3>Level ${i}</h3>`;
    div.addEventListener('click', () => startQuiz(difficulty, subject, i));
    lvlGrid.appendChild(div);
  }
  totalItems.textContent = LEVELS;
  window.scrollTo({top: lvlGrid.offsetTop - 80, behavior: 'smooth'});
}

function startQuiz(difficulty, subject, level) {
  const settings = { difficulty, subject, level };
  localStorage.setItem('quizSettings', JSON.stringify(settings));
  // navigate to quiz page - adjust filename if your quiz page is game.html or quiz.html
  window.location.href = 'form.html';
}

function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

document.addEventListener('DOMContentLoaded', () => {
  if(diffGrid) renderDifficulties();
});
