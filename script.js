const searchInput = document.getElementById("search");
const results = document.getElementById("results");
const modeInputs = document.querySelectorAll("input[name='mode']");

function normalize(text) {
  // Keep Cyrillic (including extended Tajik letters), Latin letters, digits and spaces
  return String(text)
    .toLowerCase()
    .replace(/[^\u0400-\u04FFa-z0-9\s]/gi, "")
    .normalize("NFC");
}

// Получаем первые буквы слов
function getFirstLetters(text) {
  return normalize(text)
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word[0])
    .join("");
}

function getMode() {
  return [...modeInputs].find(i => i.checked).value;
}

let currentPage = 1;
const pageSize = 10;
let lastFiltered = [];

function render(list) {
  results.innerHTML = "";
  lastFiltered = list;
  const totalPages = Math.ceil(list.length / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = list.slice(start, end);

  if (!pageItems.length) {
    results.innerHTML = "<p>Ничего не найдено</p>";
    renderPagination(1, 1);
    return;
  }

  pageItems.forEach(item => {
    results.innerHTML += `
      <div class="card">
        <div class="question">${item.question}</div>
        <div class="answer">${item.answer.replace(/\n/g, '<br>')}</div>
      </div>
    `;
  });
  renderPagination(currentPage, totalPages);
}

function renderPagination(page, totalPages) {
  let html = "";
  if (totalPages > 1) {
    html += `<div class="pagination" style="display:flex;justify-content:center;gap:10px;margin-top:20px;">
      <button id="prevPage" ${page === 1 ? 'disabled' : ''}>Назад</button>
      <span>Страница ${page} из ${totalPages}</span>
      <button id="nextPage" ${page === totalPages ? 'disabled' : ''}>Вперёд</button>
    </div>`;
  }
  results.innerHTML += html;
  if (totalPages > 1) {
    document.getElementById("prevPage").onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        render(lastFiltered);
      }
    };
    document.getElementById("nextPage").onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        render(lastFiltered);
      }
    };
  }
}

function search() {
  const rawQuery = searchInput.value || "";
  const mode = getMode();
  const normQuery = normalize(rawQuery).replace(/\s+/g, "");

  if (!rawQuery.trim()) {
    currentPage = 1;
    render(data);
    return;
  }

  const filtered = data.filter(item => {
    if (mode === "normal") {
      const q = normalize(item.question);
      const a = normalize(item.answer);
      const nq = normalize(rawQuery);
      return q.includes(nq) || a.includes(nq);
    }

    if (mode === "letters") {
      const qLetters = getFirstLetters(item.question);
      const aLetters = getFirstLetters(item.answer);
      return (
        qLetters.startsWith(normQuery) ||
        aLetters.startsWith(normQuery)
      );
    }

    return false;
  });

  currentPage = 1;
  render(filtered);
}

searchInput.addEventListener("input", search);
modeInputs.forEach(i => i.addEventListener("change", search));

render(data);
