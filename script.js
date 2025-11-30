const data = {
  input: document.querySelector(".date-input"),
  result: document.querySelector(".result-of-regress-age"),
  key: "birthDate",
  resetButton: document.querySelector(".button-reset"),
  container: document.querySelector(".container-input-date"),
};

function parseDateBR(value) {
  const birthDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!birthDateRegex.test(value)) return null;

  const [day, month, year] = value.split("/").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function getAgeDetails(birthDate, today) {
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

const ElapsedTime = () => {
  const inputValue = data.input.value.trim();
  const birthDate = parseDateBR(inputValue);

  if (!birthDate) {
    data.result.textContent = "";
    return;
  }

  const today = new Date();
  if (birthDate > today) {
    data.result.textContent = "A data de nascimento não pode ser no futuro.";
    data.result.style.color = "red";
    return;
  }

  const daysLived = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
  const age = getAgeDetails(birthDate, today);

  const lifeExpectancyYears = 76.8;
  const expectedEndDate = new Date(birthDate);
  expectedEndDate.setFullYear(
    expectedEndDate.getFullYear() + lifeExpectancyYears
  );

  const limit120 = new Date(birthDate);
  limit120.setFullYear(limit120.getFullYear() + 120);

  function calculateRemainingTime(endDate) {
    let years = endDate.getFullYear() - today.getFullYear();
    let months = endDate.getMonth() - today.getMonth();
    let days = endDate.getDate() - today.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return { years, months, days };
  }

  const remainingToExpectancy = calculateRemainingTime(expectedEndDate);
  const remainingTo120 = calculateRemainingTime(limit120);

  data.result.textContent =
    `🗓️ Dias vividos: ${daysLived}\n` +
    `🧭 Tempo vivido: ${age.years}a ${age.months}m ${age.days}d\n` +
    `📊 Expectativa de vida (BR): ${lifeExpectancyYears} anos\n` +
    `⏳ Faltam: ${remainingToExpectancy.years}a ${remainingToExpectancy.months}m ${remainingToExpectancy.days}d\n` +
    `🧬 Até 120 anos: ${remainingTo120.years}a ${remainingTo120.months}m ${remainingTo120.days}d`;
  data.result.style.color = "black";
};

const timelineYears = (birthDate, today) => {
  const containerTimelineYears = document.querySelector(".yearTimeline");
  containerTimelineYears.innerHTML = "";

  const birthYear = birthDate.getFullYear();
  const todayYear = today.getFullYear();

  for (let year = birthYear; year <= todayYear; year++) {
    const box = document.createElement("div");
    box.classList.add("year-box");
    box.textContent = year;
    box.classList.add(year === todayYear ? "current" : "past");
    containerTimelineYears.appendChild(box);
  }
};

function timelineMonth(birthDate) {
  const containerTimelineMonth = document.querySelector(".monthTimeline");
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

  containerTimelineMonth.innerHTML = "";

  const today = new Date();
  let current = new Date(today.getFullYear(), today.getMonth() - 11, 1);

  for (let i = 0; i < 12; i++) {
    const box = document.createElement("div");
    box.classList.add("month-box");
    box.textContent = monthNames[current.getMonth()];

    const isCurrentMonth =
      current.getFullYear() === today.getFullYear() &&
      current.getMonth() === today.getMonth();

    box.classList.add(isCurrentMonth ? "current" : "past");

    containerTimelineMonth.appendChild(box);

    current.setMonth(current.getMonth() + 1);
  }
}

const saveLocalStorage = (value) => {
  localStorage.setItem(data.key, value || "07/07/1988");
};

const loadLocalStorage = () => {
  const savedDate = localStorage.getItem(data.key);
  data.input.value = savedDate || "07/07/1988";
};

window.addEventListener("load", () => {
  loadLocalStorage();
  const savedDate = data.input.value.trim();
  const birthDate = parseDateBR(savedDate);
  const today = new Date();

  if (birthDate) {
    ElapsedTime();
    timelineYears(birthDate, today);
    timelineMonth(birthDate, today);
    generateCalendar(today.getMonth(), today.getFullYear(), birthDate);
  } else {
    data.result.textContent = "⚠️ Nenhuma data informada.";
    data.result.style.color = "red";
  }
});

const resetData = () => {
  localStorage.removeItem(data.key);
  data.input.value = "";
  document.querySelector(".yearTimeline").innerHTML = "";
  document.querySelector(".monthTimeline").innerHTML = "";
  document.getElementById("calendar").innerHTML = "";
  document.getElementById("monthYear").innerText = "";
  data.result.textContent = "✅ Dados foram limpos com sucesso.";
  data.result.style.color = "green";
};

let inputTimer;
data.input.addEventListener("input", (e) => {
  clearTimeout(inputTimer);
  e.target.value = e.target.value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 10);

  inputTimer = setTimeout(() => {
    const inputValue = e.target.value.trim();
    const birthDate = parseDateBR(inputValue);
    const today = new Date();

    if (!inputValue) {
      data.result.textContent = "⚠️ Nenhuma data informada.";
      data.result.style.color = "red";
      return;
    }

    if (birthDate) {
      ElapsedTime();
      saveLocalStorage(inputValue);
      timelineYears(birthDate, today);
      timelineMonth(birthDate, today);
      generateCalendar(today.getMonth(), today.getFullYear(), birthDate);
      data.result.style.color = "black";
    } else {
      data.result.textContent = "❌ Formato de data inválido. Use DD/MM/AAAA.";
      data.result.style.color = "red";
    }
  }, 300);
});

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

function atualizarCalendario() {
  const inputValue = data.input.value.trim();
  const birthDate = parseDateBR(inputValue);
  const today = new Date();

  if (birthDate) {
    generateCalendar(today.getMonth(), today.getFullYear(), birthDate);
  }
}

setInterval(atualizarCalendario, 1000);

atualizarCalendario();

data.resetButton.addEventListener("click", resetData);
