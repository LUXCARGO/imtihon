const searchInput = document.getElementById("search");
const results = document.getElementById("results");
const modeInputs = document.querySelectorAll("input[name='mode']");

// ✅ Универсальная нормализация (поддержка таджикского языка)
function normalize(text) {
  return text
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[^\p{L}0-9\s]/gu, "");
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

function render(list) {
  results.innerHTML = "";

  if (!list.length) {
    results.innerHTML = "<p>Ничего не найдено</p>";
    return;
  }

  list.forEach(item => {
    results.innerHTML += `
      <div class="card">
        <div class="question">${item.question}</div>
        <div class="answer">${item.answer}</div>
      </div>
    `;
  });
}

function search() {
  const query = normalize(searchInput.value.trim());
  const mode = getMode();

  if (!query) {
    render(data);
    return;
  }

  const filtered = data.filter(item => {
    if (mode === "normal") {
      return (
        normalize(item.question).includes(query) ||
        normalize(item.answer).includes(query)
      );
    }

    if (mode === "letters") {
      const qLetters = getFirstLetters(item.question);
      const aLetters = getFirstLetters(item.answer);

      return (
        qLetters.startsWith(query) ||
        aLetters.startsWith(query)
      );
    }
  });

  render(filtered);
}

searchInput.addEventListener("input", search);
modeInputs.forEach(i => i.addEventListener("change", search));

render(data);
