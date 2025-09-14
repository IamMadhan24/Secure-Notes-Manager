const API = '/api';
const tokenKey = 'notes_token';

// Toggle login/register forms
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
if (showRegisterLink) showRegisterLink.onclick = () => {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
};
if (showLoginLink) showLoginLink.onclick = () => {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
};

// ---------- LOGIN ----------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  const loginError = document.getElementById('loginError');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('logEmail').value.trim();
    const password = document.getElementById('logPass').value.trim();
    const res = await fetch(API + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) loginError.textContent = data.message || 'Incorrect email or password';
    else { localStorage.setItem(tokenKey, data.token); location.href = '/notes.html'; }
  });
}

// ---------- REGISTER ----------
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  const registerError = document.getElementById('registerError');
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPass').value.trim();
    const res = await fetch(API + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) registerError.textContent = data.message || 'User already exists';
    else { localStorage.setItem(tokenKey, data.token); location.href = '/notes.html'; }
  });
}

// ---------- NOTES PAGE ----------
if (location.pathname.endsWith('notes.html')) {
  const noteForm = document.getElementById('create');
  const noteTitle = document.getElementById('noteTitle');
  const noteBody = document.getElementById('noteBody');
  const notesList = document.getElementById('notesList');
  const logoutBtn = document.getElementById('logout');

  logoutBtn.onclick = () => { localStorage.removeItem(tokenKey); location.href = '/'; };

  async function loadNotes() {
    const token = localStorage.getItem(tokenKey);
    const res = await fetch(API + '/notes', { headers: { 'Authorization': 'Bearer ' + token } });
    const notes = await res.json();
    notesList.innerHTML = '';
    notes.forEach(note => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${note.title}</strong>
        <p>${note.body}</p>
        <div class="note-actions">
          <button class="edit-btn" data-id="${note.id}">Edit</button>
          <button class="delete-btn" data-id="${note.id}">Delete</button>
        </div>
      `;
      notesList.appendChild(li);
    });
  }

  noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = noteTitle.value.trim();
    const body = noteBody.value.trim();
    if (!title && !body) return;
    const token = localStorage.getItem(tokenKey);
    await fetch(API + '/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ title, body })
    });
    noteTitle.value = '';
    noteBody.value = '';
    loadNotes();
  });

  notesList.onclick = async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    const token = localStorage.getItem(tokenKey);
    if (e.target.classList.contains('delete-btn')) {
      await fetch(API + '/notes/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
      loadNotes();
    }
    if (e.target.classList.contains('edit-btn')) {
      const li = e.target.closest('li');
      const newTitle = prompt('Title', li.querySelector('strong').textContent) || '';
      const newBody = prompt('Body', li.querySelector('p').textContent) || '';
      await fetch(API + '/notes/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ title: newTitle, body: newBody })
      });
      loadNotes();
    }
  };

  loadNotes();
}
