var data = {
  input: document.querySelector(".date-input"),
  result: document.querySelector(".result-of-regress-age"),
  startButton: document.querySelector(".button-regress-age"),
  key: "birthDate",
  resetButton: document.querySelector(".button-reset"),
  toggleButton: document.querySelector(".button-Changes"),
  container: document.querySelector(".container-input-date"),
};

var countdownDisplay = document.createElement("p");
data.result.appendChild(countdownDisplay);

var timer;

function parseDateBR(value) {
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-");
    return new Date(`${year}-${month}-${day}`);
  }
  return new Date(value);
}

function toggleInputType() {
  const input = data.input;
  const currentType = input.getAttribute("type");

  input.setAttribute("type", currentType === "date" ? "text" : "date");
  input.value = "";
}

data.input.addEventListener("input", function () {
  if (this.getAttribute("type") === "text") {
    this.value = this.value.replace(/\D/g, "");

    if (this.value.length > 8) {
      this.value = this.value.slice(0, 8);
    }
    if (this.value.length > 2) {
      this.value = this.value.slice(0, 2) + "-" + this.value.slice(2);
    }
    if (this.value.length > 5) {
      this.value = this.value.slice(0, 5) + "-" + this.value.slice(5);
    }
  }
});

data.toggleButton.addEventListener("click", toggleInputType);

function startCountdown(birthValue) {
  var birthDate = parseDateBR(birthValue);
  if (isNaN(birthDate)) {
    alert("Data inválida.");
    return;
  }

  generateMonthTimeline(birthDate);
  console.log(birthDate);

  var maxAge = 120;
  var deathDate = new Date(
    birthDate.getFullYear() + maxAge,
    birthDate.getMonth(),
    birthDate.getDate()
  );

  function update() {
    var now = new Date();
    var diff = deathDate - now;

    if (diff <= 0) {
      countdownDisplay.textContent = "Você atingiu 120 anos!";
      countdownDisplay.style.color = "red";
      clearInterval(timer);
      return;
    }

    var diasPassados = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));
    var years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    var months = Math.floor(
      (diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44)
    );
    var days = Math.floor(
      (diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24)
    );
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    countdownDisplay.textContent = `${years} anos, ${months} meses, ${days} dias e ${minutes} minutos restantes | Já viveu ${diasPassados} dias.`;
    countdownDisplay.style.color = "black";
  }

  clearInterval(timer);
  update();
  timer = setInterval(update, 1000);
}
function generateYearTimeline(birthDate) {
  const container = document.querySelector(".yearTimeline");
  container.innerHTML = "";

  const today = new Date();
  const startYear = birthDate.getFullYear();
  const currentYear = today.getFullYear();

  for (let year = startYear; year <= currentYear; year++) {
    const box = document.createElement("div");
    box.classList.add("year-box");

    const isCurrentYear = year === currentYear;
    box.innerText = year;

    if (isCurrentYear) {
      box.classList.add("current");
    } else {
      box.classList.add("past");
    }

    container.appendChild(box);
  }
}

function generateMonthTimeline() {
  const container = document.querySelector(".monthTimeline");
  container.innerHTML = "";

  const today = new Date();
  const monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  let current = new Date(today.getFullYear(), today.getMonth() - 11, 1);

  while (current <= today) {
    const box = document.createElement("div");
    box.classList.add("month-box");

    const isCurrentMonth =
      current.getFullYear() === today.getFullYear() &&
      current.getMonth() === today.getMonth();

    box.innerText = monthNames[current.getMonth()];
    box.classList.add(isCurrentMonth ? "current" : "past");

    container.appendChild(box);
    current.setMonth(current.getMonth() + 1);
  }
}

function generateCalendar(month, year, birthDate) {
  const calendar = document.getElementById("calendar");
  if (!calendar || !birthDate) return;
  calendar.innerHTML = "";

  ["D", "S", "T", "Q", "Q", "S", "S"].forEach((d) => {
    const div = document.createElement("div");
    div.classList.add("calendar-day-header");
    div.innerText = d;
    calendar.appendChild(div);
  });

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();

  document.getElementById("monthYear").innerText = firstDay.toLocaleString(
    "pt-BR",
    { month: "long", year: "numeric" }
  );

  for (let i = 0; i < firstDay.getDay(); i++) {
    const empty = document.createElement("div");
    empty.classList.add("calendar-empty");
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const cell = document.createElement("div");
    cell.classList.add("day");
    cell.innerText = day;

    const dayDate = new Date(year, month, day);
    if (dayDate >= birthDate && dayDate <= today) {
      cell.classList.add("lived");
    }

    calendar.appendChild(cell);
  }
}

data.resetButton.addEventListener("click", () => {
  localStorage.removeItem(data.key);
  data.input.value = "";
  countdownDisplay.textContent = "";
  countdownDisplay.style.color = "black";
  clearInterval(timer);
});

window.addEventListener("DOMContentLoaded", () => {
  let savedDate = localStorage.getItem(data.key);
  let birthDateObj;

  if (savedDate) {
    birthDateObj = parseDateBR(savedDate);
    data.input.value = savedDate;
  } else {
    birthDateObj = new Date(2007, 4, 27);
  }
  generateYearTimeline(birthDateObj);
  generateMonthTimeline(birthDateObj);
  generateCalendar(
    new Date().getMonth(),
    new Date().getFullYear(),
    birthDateObj
  );
  startCountdown(savedDate || "27-05-2007");
});

data.startButton.addEventListener("click", () => {
  var birthValue = data.input.value.trim();
  if (!birthValue) {
    alert("Selecione sua data de nascimento.");
    return;
  }

  startCountdown(birthValue);
  localStorage.setItem(data.key, birthValue);
});
