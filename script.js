const searchInput = document.getElementById("search");
const results = document.getElementById("results");
const modeInputs = document.querySelectorAll("input[name='mode']");

function normalize(text) {
  return text.toLowerCase().replace(/[^a-zа-яё0-9\s]/gi, "");
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
  const query = searchInput.value.toLowerCase().trim();
  const mode = getMode();

  if (!query) {
    render(data);
    return;
  }

  const filtered = data.filter(item => {
    if (mode === "normal") {
      return (
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
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
