// admin.js – CRUD for admin panel using Supabase client
import { supabase } from './api/supabaseClient.js';

let studentsData = [];
let currentPage = 1;
const rowsPerPage = 7;
let deleteTargetId = null;

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text}`);
  }
  return await response.json();
}

function compareNoPeserta(a, b) {
  const parse = (value) => {
    const num = parseInt(String(value).replace(/[^0-9]/g, ''), 10);
    return Number.isFinite(num) ? num : Number.MAX_SAFE_INTEGER;
  };

  return parse(a.no_peserta) - parse(b.no_peserta);
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  const totalPages = Math.max(1, Math.ceil(studentsData.length / rowsPerPage));

  if (studentsData.length === 0) {
    pagination.innerHTML = '';
    return;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  pagination.innerHTML = `
    <button data-page="prev" class="pagination-button" ${currentPage === 1 ? 'disabled' : ''}>Sebelumnya</button>
    ${pages
      .map(
        (page) => `
      <button data-page="${page}" class="pagination-button ${page === currentPage ? 'active' : ''}">${page}</button>
    `,
      )
      .join('')}
    <button data-page="next" class="pagination-button" ${currentPage === totalPages ? 'disabled' : ''}>Selanjutnya</button>
  `;

  pagination.querySelectorAll('button[data-page]').forEach((button) => {
    button.addEventListener('click', () => {
      const page = button.dataset.page;
      if (page === 'prev' && currentPage > 1) {
        currentPage -= 1;
      } else if (page === 'next' && currentPage < totalPages) {
        currentPage += 1;
      } else if (!isNaN(page)) {
        currentPage = Number(page);
      }
      renderTablePage();
    });
  });
  pagination.classList.add('pagination-bar');
}

function renderTablePage() {
  const tbody = document.getElementById('tblBody');
  tbody.innerHTML = '';

  if (!studentsData.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Belum ada data siswa.</td></tr>';
    renderPagination();
    return;
  }

  const start = (currentPage - 1) * rowsPerPage;
  const pageItems = studentsData.slice(start, start + rowsPerPage);

  pageItems.forEach((s) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.no_peserta ?? ''}</td>
      <td>${s.nisn ?? ''}</td>
      <td>${s.nama ?? ''}</td>
      <td>${s.jk ?? ''}</td>
      <td>${s.keterangan ?? ''}</td>
      <td>${s.rata_rata ?? ''}</td>
      <td>
        <div class="action-buttons">
          <button class="edit" data-id="${s.id}">Edit</button>
          <button class="del" data-id="${s.id}">Delete</button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.edit').forEach((btn) => btn.addEventListener('click', () => openModal('edit', btn.dataset.id)));
  document.querySelectorAll('.del').forEach((btn) => btn.addEventListener('click', () => openDeleteConfirm(btn.dataset.id)));

  renderPagination();
}

async function loadStudents() {
  const { data, error } = await supabase.from('students').select('*');

  if (error) {
    alert('Gagal memuat data: ' + error.message);
    return;
  }

  studentsData = data.sort(compareNoPeserta);
  const totalPages = Math.max(1, Math.ceil(studentsData.length / rowsPerPage));
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  renderTablePage();
}

async function openModal(mode, id = null) {
  const modal = document.getElementById('studentModal');
  const title = document.getElementById('modalTitle');
  const form = document.getElementById('studentForm');
  form.reset();
  document.getElementById('studentId').value = '';

  if (mode === 'edit') {
    title.textContent = 'Edit Siswa';
    const { data: stu, error } = await supabase.from('students').select('*').eq('id', id).single();

    if (error) {
      alert('Gagal memuat data: ' + error.message);
      return;
    }

    document.getElementById('studentId').value = stu.id;
    document.getElementById('noPeserta').value = stu.no_peserta || '';
    document.getElementById('nisn').value = stu.nisn || '';
    document.getElementById('nama').value = stu.nama || '';
    document.getElementById('jk').value = stu.jk || '';
    document.getElementById('keterangan').value = stu.keterangan || '';
    document.getElementById('rataRata').value = stu.rata_rata ?? '';
  } else {
    title.textContent = 'Tambah Siswa';
  }

  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('studentModal').classList.remove('active');
}

async function submitForm(e) {
  e.preventDefault();

  const id = document.getElementById('studentId').value;
  const payload = {
    no_peserta: document.getElementById('noPeserta').value.trim(),
    nisn: document.getElementById('nisn').value.trim(),
    nama: document.getElementById('nama').value.trim(),
    jk: document.getElementById('jk').value,
    keterangan: document.getElementById('keterangan').value,
    rata_rata: parseFloat(document.getElementById('rataRata').value) || 0,
  };

  try {
    if (id) {
      const { error } = await supabase.from('students').update(payload).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('students').insert(payload);
      if (error) throw error;
    }

    closeModal();
    await loadStudents();
  } catch (err) {
    alert('Gagal menyimpan: ' + err.message);
  }
}

function openDeleteConfirm(id) {
  deleteTargetId = id;
  document.getElementById('confirmModal').classList.add('active');
}

function closeDeleteConfirm() {
  deleteTargetId = null;
  document.getElementById('confirmModal').classList.remove('active');
}

async function confirmDelete() {
  if (!deleteTargetId) return;

  try {
    const { error } = await supabase.from('students').delete().eq('id', deleteTargetId);

    if (error) throw error;
    closeDeleteConfirm();
    await loadStudents();
  } catch (err) {
    alert('Gagal menghapus: ' + err.message);
  }
}

document.getElementById('btnAdd').addEventListener('click', () => openModal('add'));
document.getElementById('btnClose').addEventListener('click', closeModal);
document.getElementById('confirmCancel').addEventListener('click', closeDeleteConfirm);
document.getElementById('confirmDelete').addEventListener('click', confirmDelete);
document.getElementById('studentForm').addEventListener('submit', submitForm);

(async () => {
  try {
    await loadStudents();
  } catch (e) {
    console.error('Initial data load failed:', e);
  }
})();
