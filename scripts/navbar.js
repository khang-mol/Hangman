import { addGlobalEventListener } from "./main.js";

export function renderNavbar() {
  let navbarHTML = `
    <button class="navbar__button-default js-navbar__sidebar-toggler">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="none">
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
      </svg>
    </button>

    <div style="flex: 1;"></div>

    <button class="navbar__button-default js-help-popup">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M513.5-254.5Q528-269 528-290t-14.5-35.5Q499-340 478-340t-35.5 14.5Q428-311 428-290t14.5 35.5Q457-240 478-240t35.5-14.5ZM442-394h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
    </button>
    
    <button class="navbar__button-default js-statistics-popup">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M640-160v-280h160v280H640Zm-240 0v-640h160v640H400Zm-240 0v-440h160v440H160Z"/></svg>
    </button>
    
    <button class="navbar__button-default dark-mode-toggler js-dark-mode-toggler">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"/></svg>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z"/></svg>
    </button>

    <button class="navbar__button-default js-settings-popup">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z"/></svg>
    </button>
  `;

  document.querySelector('.js-navbar').innerHTML = navbarHTML;

  
  const wrapper = document.querySelector(".wrapper");
  /**
   * Enables the closing of popup windows by clicking outside the window.
   * @param {HTMLElement | null} popup Reference to the popup object or node.
   */
  function easyClosePopup(popup) {
    popup.addEventListener("click", e =>
      !wrapper.contains(e.target) && popup.close());
  };
  
  
  const statisticsPopup = document.getElementById("popup-statistics");
  addGlobalEventListener("click", ".js-statistics-popup", () => {
    statisticsPopup.showModal();
  });

  addGlobalEventListener("click", ".popup-statistics__close-button", () => {
    statisticsPopup.close();
  });

  easyClosePopup(statisticsPopup);


  const helpPopup = document.getElementById("popup-help");
  addGlobalEventListener("click", ".js-help-popup", () => {
    helpPopup.showModal();
  });
  addGlobalEventListener("click", ".popup-help__close-button", () => {
    helpPopup.close();
  });
  easyClosePopup(helpPopup);


  const settingsPopup = document.getElementById("popup-settings");
  addGlobalEventListener("click", ".js-settings-popup", () => {
    settingsPopup.showModal();
  })
  addGlobalEventListener("click", ".popup-settings__close-button", () => {
    settingsPopup.close();
  });
  easyClosePopup(settingsPopup);
};