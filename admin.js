// admin.js – CRUD for admin panel using Supabase client
import { supabase } from './api/supabaseClient.js';
// Helper to fetch JSON with error handling
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

// Load students into table with full schema
async function loadStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('*');
  if (error) {
    alert('Gagal memuat data: ' + error.message);
    return;
  }
  const tbody = document.getElementById('tblBody');
  tbody.innerHTML = '';
  data.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.no_peserta ?? ''}</td>
      <td>${s.nisn ?? ''}</td>
      <td>${s.nama ?? ''}</td>
      <td>${s.jk ?? ''}</td>
      <td>${s.keterangan ?? ''}</td>
      <td>${s.rata_rata ?? ''}</td>
      <td>
        <button class="edit" data-id="${s.id}">Edit</button>
        <button class="del" data-id="${s.id}">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });

  // Attach listeners
  document.querySelectorAll('.edit').forEach(btn =>
    btn.addEventListener('click', () => openModal('edit', btn.dataset.id)));
  document.querySelectorAll('.del').forEach(btn =>
    btn.addEventListener('click', () => deleteStudent(btn.dataset.id)));
}

// Open modal for add / edit – populate all fields
async function openModal(mode, id = null) {
  const modal = document.getElementById('studentModal');
  const title = document.getElementById('modalTitle');
  const form = document.getElementById('studentForm');
  form.reset();
  document.getElementById('studentId').value = '';
  if (mode === 'edit') {
    title.textContent = 'Edit Siswa';
    const { data: stu, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      alert('Gagal memuat data: ' + error.message);
      return;
    }
    // Fill fields – use same property names as DB columns
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

// Submit – create or update record using full schema
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

// Delete a student record
async function deleteStudent(id) {
  if (!confirm('Yakin ingin menghapus data ini?')) return;
  try {
    const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await loadStudents();
  } catch (err) {
    alert('Gagal menghapus: ' + err.message);
  }
}

// UI bindings
document.getElementById('btnAdd').addEventListener('click', () => openModal('add'));
document.getElementById('btnClose').addEventListener('click', closeModal);
document.getElementById('studentForm').addEventListener('submit', submitForm);

// Initial load – wrapped to prevent fatal errors
(async () => {
  try {
    await loadStudents();
  } catch (e) {
    console.error('Initial data load failed:', e);
  }
})();
