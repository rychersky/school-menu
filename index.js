'use strict';

function getLS() {
  return JSON.parse(localStorage.getItem('holcomb-menu'));
}

function setLS(object) {
  localStorage.setItem('holcomb-menu', JSON.stringify(object));
}

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function getConfigValues() {
  return {
    year: Number(document.querySelector('input#year').value),
    month: document.querySelector('select#month').value,
    meal: document.querySelector('select#meal').value,
  };
}

function createDayKeys() {
  // prettier-ignore
  const dayKeys = [
    '0-2', '0-3', '0-4', '0-5',
    '1-2', '1-3', '1-4', '1-5',
    '2-2', '2-3', '2-4', '2-5',
    '3-2', '3-3', '3-4', '3-5',
    '4-2', '4-3', '4-4', '4-5',
  ];
  const newObj = { days: {}, title: '', blurb: '' };
  dayKeys.forEach((k) => (newObj['days'][k] = ''));
  return newObj;
}

function setupLocalStorageYear(year, isInitial = false) {
  // prettier-ignore
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const obj = {};
  months.forEach(
    (m) =>
      (obj[m] = {
        Breakfast: createDayKeys(),
        Lunch: createDayKeys(),
        Other: createDayKeys(),
      })
  );
  if (isInitial) {
    const month = months[new Date().getMonth()];
    setLS({
      selectedMonth: month,
      selectedMeal: 'breakfast',
      selectedYear: year,
      [year]: obj,
    });
  } else {
    const storage = getLS();
    storage[year] = obj;
    setLS(storage);
  }
}

function initCalendar() {
  // setup title data handling
  const calendarTitle = document.querySelector('p.calendar-title');
  calendarTitle.addEventListener('focusout', (e) => {
    const storage = getLS();
    const { year, month, meal } = getConfigValues();
    storage[year][month][meal]['title'] = e.target.textContent;
    setLS(storage);
  });

  // setup blurb data handling
  const blurb = document.querySelector('div.blurb p');
  blurb.addEventListener('focusout', (e) => {
    const storage = getLS();
    const { year, month, meal } = getConfigValues();
    storage[year][month][meal]['blurb'] = e.target.innerHTML
      .replaceAll('<div>', '<br>')
      .replaceAll('</div>', '');
    setLS(storage);
  });

  // create calendar days and setup data handling
  let row = 0;
  let day = 2;

  for (let i = 0; i < 20; i++) {
    const calendarDay = document.createElement('div');
    calendarDay.innerHTML = /* html */ `
      <p class="day-number"></p>
      <div class="day-content"><p contenteditable></p></div>
    `;
    calendarDay.setAttribute('data-day-position', `${row}-${day}`);
    calendarDay.classList.add('calendar-day');
    calendarDay
      .querySelector('div.day-content p')
      .addEventListener('focusout', (e) => {
        const storage = getLS();
        const { year, month, meal } = getConfigValues();
        const position =
          e.target.parentElement.parentElement.getAttribute(
            'data-day-position'
          );
        const text = e.target.innerHTML
          .replaceAll('<div>', '<br>')
          .replaceAll('</div>', '');
        storage[year][month][meal]['days'][position] = text;
        setLS(storage);
      });
    document.querySelector('div.calendar-days').append(calendarDay);
    day++;
    if (day > 5) {
      row++;
      day = 2;
    }
  }
}

function updateCalendar() {
  const storage = getLS();
  const { year, month, meal } = getConfigValues();
  const monthDays = {
    January: {
      days: 31,
      index: 0,
    },
    February: {
      days: isLeapYear(year) ? 29 : 28,
      index: 1,
    },
    March: {
      days: 31,
      index: 2,
    },
    April: {
      days: 30,
      index: 3,
    },
    May: {
      days: 31,
      index: 4,
    },
    June: {
      days: 30,
      index: 5,
    },
    July: {
      days: 31,
      index: 6,
    },
    August: {
      days: 31,
      index: 7,
    },
    September: {
      days: 30,
      index: 8,
    },
    October: {
      days: 31,
      index: 9,
    },
    November: {
      days: 30,
      index: 10,
    },
    December: {
      days: 31,
      index: 11,
    },
  };

  // set calendar titles
  const calendarTitle =
    storage[year][month][meal]['title'] || `Holcomb ${meal} Menu`;
  document.querySelector('p.calendar-title').innerHTML = calendarTitle;
  document.querySelector(
    'p.calendar-month-year'
  ).innerHTML = `${month} ${year}`;

  // set blurb
  const blurb = document.querySelector('div.blurb p');
  blurb.innerHTML = storage[year][month][meal]['blurb'];

  // reset day numbers
  [...document.querySelectorAll('p.day-number')].forEach((node) => {
    node.innerHTML = '';
  });

  // set day numbers
  let row = 0;
  for (let day = 1; day <= monthDays[month].days; day++) {
    const date = new Date(year, monthDays[month].index, day);
    if ([2, 3, 4, 5].includes(date.getDay())) {
      document.querySelector(
        `div[data-day-position="${row}-${date.getDay()}"] p`
      ).innerHTML = String(day);
    }
    if (date.getDay() === 5) {
      row++;
    }
  }

  // fetch calendar content
  [...document.querySelectorAll('div.calendar-day')].forEach((node) => {
    const position = node.getAttribute('data-day-position');
    const content = storage[year][month][meal]['days'][position];
    node.querySelector('div.day-content p').innerHTML = content;
  });
}

function setupConfigSection() {
  const yearSelector = document.querySelector('#year');
  const monthSelector = document.querySelector('#month');
  const mealSelector = document.querySelector('#meal');

  yearSelector.addEventListener('change', (e) => {
    const storage = getLS();
    storage.selectedYear = e.target.value;
    setLS(storage);
    const { year } = getConfigValues();
    if (!storage[year]) {
      setupLocalStorageYear(e.target.value);
    }
    updateCalendar();
  });
  monthSelector.addEventListener('change', (e) => {
    const storage = getLS();
    storage.selectedMonth = e.target.value;
    setLS(storage);
    updateCalendar();
  });
  mealSelector.addEventListener('change', (e) => {
    const storage = getLS();
    storage.selectedMeal = e.target.value;
    setLS(storage);
    updateCalendar();
  });
}

function initPage() {
  const yearSelector = document.querySelector('#year');
  if (!yearSelector.value) {
    yearSelector.value = new Date().getFullYear();
  }
  if (!getLS()) {
    setupLocalStorageYear(yearSelector.value, true);
  }
  if (!getLS()[yearSelector.value]) {
    setupLocalStorageYear(yearSelector.value);
  }
  initCalendar();
  updateCalendar();
  setupConfigSection();
}

document.querySelector('#year').addEventListener('input', (e) => {
  if (!/^[1-9]?[0-9]?[0-9]?[0-9]?$/.test(e.target.value)) {
    e.target.value = '';
    e.target.setCustomValidity('Must be a number');
    e.target.reportValidity();
  } else {
    e.target.setCustomValidity('');
  }
});
initPage();
