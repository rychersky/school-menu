"use strict";

function init() {
  let row = 0;
  let day = 2;

  for (let i = 0; i < 20; i++) {
    const calendarDay = document.createElement("div");
    const content = localStorage.getItem(`holcomb-menu-${row}-${day}`)
      ? localStorage
          .getItem(`holcomb-menu-${row}-${day}`)
          .replaceAll("<div>", "<br>")
          .replaceAll("</div>", "")
      : "";
    calendarDay.innerHTML = /* html */ `
      <p class="day-number"></p>
      <div class="day-content"><p contenteditable>${content}</p></div>
    `;
    calendarDay.setAttribute("data-day-position", `${row}-${day}`);
    calendarDay.classList.add("calendar-day");
    // arrow function scope funzies
    const row2 = row;
    const day2 = day;
    calendarDay
      .querySelector("div.day-content p")
      .addEventListener("focusout", (e) => {
        localStorage.setItem(
          `holcomb-menu-${row2}-${day2}`,
          e.target.innerHTML
            .replaceAll("<div>", "<br>")
            .replaceAll("</div>", "")
        );
      });
    document.querySelector("div.calendar-days").append(calendarDay);
    day++;
    if (day > 5) {
      row++;
      day = 2;
    }
  }

  document.querySelector("select#month").value = localStorage.getItem(
    "holcomb-menu-month"
  )
    ? localStorage.getItem("holcomb-menu-month")
    : "0";
  document.querySelector("input#year").value = localStorage.getItem(
    "holcomb-menu-year"
  )
    ? localStorage.getItem("holcomb-menu-year")
    : `${new Date().getFullYear()}`;
}

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function setupCalendar() {
  const month = Number(document.querySelector("select#month").value);
  const year = Number(document.querySelector("input#year").value);
  const monthInfo = [
    { name: "January", days: 31 },
    { name: "February", days: isLeapYear(year) ? 29 : 28 },
    { name: "March", days: 31 },
    { name: "April", days: 30 },
    { name: "May", days: 31 },
    { name: "June", days: 30 },
    { name: "July", days: 31 },
    { name: "August", days: 31 },
    { name: "September", days: 30 },
    { name: "October", days: 31 },
    { name: "November", days: 30 },
    { name: "December", days: 31 },
  ];

  // reset day numbers
  [...document.querySelectorAll("p.day-number")].forEach((node) => {
    node.innerHTML = "";
  });
  // set calendar month/year label
  document.querySelector(
    "p.calendar-month-year"
  ).innerHTML = `${monthInfo[month].name} ${year}`;

  let row = 0;
  for (let day = 1; day <= monthInfo[month].days; day++) {
    const date = new Date(year, month, day);
    if ([2, 3, 4, 5].includes(date.getDay())) {
      document.querySelector(
        `div[data-day-position="${row}-${date.getDay()}"] p`
      ).innerHTML = day;
    }
    if (date.getDay() === 5) {
      row++;
    }
  }
}

document.querySelector("select#month").addEventListener("change", (e) => {
  localStorage.setItem("holcomb-menu-month", e.target.value);
  setupCalendar();
});
document.querySelector("input#year").addEventListener("change", (e) => {
  localStorage.setItem("holcomb-menu-year", e.target.value);
  setupCalendar();
});

init();
setupCalendar();
