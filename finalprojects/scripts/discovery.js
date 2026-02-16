// js/discovery.js
import { openModal, closeModal } from './modal.js';

const listEl = document.getElementById('subject-list');
const modal = document.getElementById('info-modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const closeBtn = document.getElementById('close-modal');

const DATA_URL = './data/subjects.json';
const LIKED_KEY = 'likedItems';

async function fetchSubjects(){
  try {
    const res = await fetch(DATA_URL, {cache: "no-cache"});
    if (!res.ok) throw new Error(`Network error ${res.status}`);
    const data = await res.json();
    return data.items || [];
  } catch(err) {
    console.error('Fetch failed:', err);
    return [];
  }
}

function renderItems(items){
  // ensure at least 15 items displayed (slice)
  const toShow = items.slice(0, 15);
  listEl.innerHTML = '';
  toShow.forEach(item => {
    const el = document.createElement('article');
    el.className = 'courseBox';
    el.setAttribute('tabindex', '0');

    // show 4 properties: title, subject, difficulty, summary (4 props)
    el.innerHTML = `
      <h3>${item.title}</h3>
      <p><strong>Subject:</strong> ${item.subject}</p>
      <p><strong>Difficulty:</strong> ${item.difficulty}</p>
      <p>${item.summary}</p>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:8px;">
        <button class="detail-btn" data-id="${item.id}">Details</button>
        <button class="like-btn" data-id="${item.id}">${isLiked(item.id)?'♥':'♡'}</button>
      </div>
    `;
    listEl.appendChild(el);
  });

  // attach event handlers using delegation
  listEl.querySelectorAll('.detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => openDetails(e.target.dataset.id, items));
  });
  listEl.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => toggleLike(e.target.dataset.id, e.target));
  });
}

function openDetails(id, items){
  const item = items.find(x => x.id === id);
  if (!item) return;
  modalTitle.textContent = item.title;
  modalContent.innerHTML = `
    <strong>Subject:</strong> ${item.subject}<br>
    <strong>Difficulty:</strong> ${item.difficulty}<br>
    <strong>Author:</strong> ${item.author}<br>
    <p>${item.full}</p>
  `;
  openModal('info-modal');
}

function isLiked(id){
  const store = JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');
  return store.includes(id);
}

function toggleLike(id, btnEl){
  const store = JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');
  const idx = store.indexOf(id);
  if (idx === -1) { store.push(id); btnEl.textContent = '♥'; }
  else { store.splice(idx,1); btnEl.textContent = '♡'; }
  localStorage.setItem(LIKED_KEY, JSON.stringify(store));
}

// init
(async function init(){
  const items = await fetchSubjects();
  if (items.length === 0) {
    listEl.innerHTML = '<p>Unable to load data. Please try again later.</p>';
    return;
  }
  // use array methods — show only items where active:true for example
  const active = items.filter(i => i.active).map(i => i); // demonstrates filter + map
  renderItems(active);
})();

// modal close
if (closeBtn) closeBtn.addEventListener('click', ()=> closeModal('info-modal'));
