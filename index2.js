"use strict";

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
  const { month, meal, year } = getConfigValues();
  console.table(getConfigValues());
}

initPage();
