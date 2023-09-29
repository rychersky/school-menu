"use strict";

function initDays() {
  let row = 0;
  let day = 2;

  for (let i = 0; i < 20; i++) {
    const calendarDay = document.createElement("div");
    calendarDay.innerHTML = /* html */ `
      <p class="day-number" data-day-position="${row}-${day}"></p>
      <div class="day-content"><p contenteditable></p></div>
    `;
    calendarDay.classList.add("calendar-day");
    document.querySelector("div.calendar-days").append(calendarDay);
    day++;
    if (day > 5) {
      row++;
      day = 2;
    }
  }
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

  [...document.querySelectorAll("p.day-number")].forEach((node) => {
    node.innerHTML = "";
  });
  document.querySelector(
    "p.calendar-month-label"
  ).innerHTML = `${monthInfo[month].name} ${year}`;

  let row = 0;
  for (let day = 1; day <= monthInfo[month].days; day++) {
    const date = new Date(year, month, day);
    if ([2, 3, 4, 5].includes(date.getDay())) {
      document.querySelector(
        `p[data-day-position="${row}-${date.getDay()}"]`
      ).innerHTML = day;
    }
    if (date.getDay() === 5) {
      row++;
    }
  }
}

document.querySelector("select#month").addEventListener("input", setupCalendar);
document
  .querySelector("input#year")
  .addEventListener("focusout", setupCalendar);

initDays();
setupCalendar();
