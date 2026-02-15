import { addGlobalEventListener, loadStatisticsFromStorage, newStatistics, statistics } from "./main.js";

/**
 * Was used to renders the navigation bar. Included the skeletal HTML, sidebar toggle and theme switch logic. Retransferred back to html file to avoid innerHTML.
 */
export function renderNavbar() {
  // Toggles sidebar by clicking the toggler.
  addGlobalEventListener("click", '.js-navbar__sidebar-toggler', () => {
    const sidebar = document.querySelector('.js-sidebar');
    sidebar?.classList.toggle('show');
    // document.body.classList.toggle('no-sidebar');
  });


  // Theme toggler.
  let lightmode = localStorage.getItem('lightmode');
  if (lightmode === 'true') {
    document.body.classList.add('light');
  };
  addGlobalEventListener("click", '.js-dark-mode-toggler', () => {
    document.body.classList.toggle('light');
    lightmode === 'true'
      ? localStorage.setItem('lightmode', 'false')
      : localStorage.setItem('lightmode', 'true');
    lightmode = localStorage.getItem('lightmode');
  });
};




/**
 * Created all the popups (before innerHTML was removed), including from the navigation bar buttons and the end screen after finishing a game.
 */
export function createPopups() {
  /**
   * Enables the closing of popup windows by clicking outside the window.
   * @param {HTMLElement | null} popup Reference to the popup object or node.
   */
  function easyClosePopup(popup, wrapper) {
    popup.addEventListener("click", e =>
      !wrapper.contains(e.target) && popup.close());
  };
  
  
  addGlobalEventListener("click", ".js-statistics-popup", () => {
    const statisticsPopup = document.getElementById("popup-statistics");
    const statisticsWrapper = document.querySelector('.js-wrapper-statistics');
    renderStatistics();
    statisticsPopup.showModal();
    easyClosePopup(statisticsPopup, statisticsWrapper);
  });

  // addGlobalEventListener("click", ".popup-statistics__close-button", () => {
  //   statisticsPopup.close();
  // });



  const helpPopup = document.getElementById("popup-help");
  const helpWrapper = document.querySelector(".js-wrapper-help");
  addGlobalEventListener("click", ".js-help-popup", () => {
    helpPopup.showModal();
  });
  // addGlobalEventListener("click", ".popup-help__close-button", () => {
  //   helpPopup.close();
  // });
  easyClosePopup(helpPopup, helpWrapper);


  const settingsPopup = document.getElementById("popup-settings");
  const settingsWrapper = document.querySelector(".js-wrapper-settings");
  addGlobalEventListener("click", ".js-settings-popup", () => {
    settingsPopup.showModal();
  })
  // addGlobalEventListener("click", ".popup-settings__close-button", () => {
  //   settingsPopup.close();
  // });
  easyClosePopup(settingsPopup, settingsWrapper);
};





/**
 * Responsible for the rendered statistics, which can be displayed by clicking the button in the navigation bar.
 */
export function renderStatistics() {
  loadStatisticsFromStorage();


  const statisticsHTML = document.querySelector(
    '.js-popup-statistics__statistics');
    
  // reset statistics upon clicking
  addGlobalEventListener("click", ".popup-settings__reset-statistics", () => {
    statisticsHTML.replaceChildren();
    localStorage.setItem("hangmanStatistics", JSON.stringify(newStatistics));
  });
  
  statisticsHTML.replaceChildren();

  Object.entries(statistics).forEach(statistic => {
    const statisticObject = statistic[1];

    const statsColumn = document.createElement("div");
    statsColumn.classList.add("stats-column");

    const statsNumber = document.createElement("div");
    statsNumber.classList.add("stats-num");
    statsNumber.innerText = `${statisticObject.number}`;
    
    const statsLabel = document.createElement("div");
    statsLabel.classList.add("stats-label");
    statsLabel.innerText = `${statisticObject.label}`;

    statsColumn.appendChild(statsNumber);
    statsColumn.appendChild(statsLabel);
    statisticsHTML.appendChild(statsColumn);

    // statisticsHTML.insertAdjacentHTML("beforeend", `
    // <div class="stats-column">
    //   <div class="stats-num">${statisticObject.number}</div>
    //   <div class="stats-label">${statisticObject.label}</div>
    // </div>
    // `);
  });
};