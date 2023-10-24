"use strict";

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

const dayKeys = [
  '0-2', '0-3', '0-4', '0-5',
  '1-2', '1-3', '1-4', '1-5',
  '2-2', '2-3', '2-4', '2-5',
  '3-2', '3-3', '3-4', '3-5',
  '4-2', '4-3', '4-4', '4-5',
];

function createDayKeys() {
  const obj = {};
  dayKeys.forEach(k => obj[k] = '');
  return obj;
}

function initYearObject() {
  const obj = {};
  monthInfo.forEach(m => obj[m.name] = {
    'breakfast': createDayKeys(),
    'lunch': createDayKeys(),
    'other': createDayKeys(),
  });
  return obj;
}

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function getConfigValues() {
  return {
    month: Number(document.querySelector("select#month").value),
    meal: document.querySelector("select#meal").value,
    year: Number(document.querySelector("input#year").value),
  };
}

function initPage() {
  if (!localStorage.getItem("holcomb-menu")) {
    localStorage.setItem("holcomb-menu", JSON.stringify({}));
  }
  const storage = JSON.parse(localStorage.getItem('holcomb-menu'));
  const { year } = getConfigValues();
  if (!storage[year]) {
    storage[year] = initYearObject();
    localStorage.setItem('holcomb-menu', JSON.stringify(storage));
  }
}


initPage();

const storage = JSON.parse(localStorage.getItem('holcomb-menu'));