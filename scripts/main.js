import { createPopups, renderNavbar, renderStatistics } from "./navbar.js";
import { renderOptionSelection } from "./optionsSelection.js";

let groups;
async function startGame() {
  try {
    groups = await renderOptionSelection();
    playGame();
  } catch (error) {
    console.error(error);
  }
};
startGame();

renderNavbar();
createPopups();

export let statistics;
export let newStatistics = {
  gamesPlayed: {
    number: 0,
    label: 'Played',
  },
  gamesWon: {
    number: 0,
    label: 'Won',
  },
  winPercentage: {
    number: 0,
    label: 'Win %',
  },
  currentStreak: {
    number: 0,
    label: 'Current\nStreak',
  },
  maxStreak: {
    number: 0,
    label: 'Max\nStreak',
  },
};

export function loadStatisticsFromStorage() {
  statistics = JSON.parse(localStorage.getItem('hangmanStatistics')) || newStatistics;
};

loadStatisticsFromStorage();

function saveStatisticsToStorage() {
  localStorage.setItem('hangmanStatistics', JSON.stringify(statistics));
};

/**
 * @type {Array<string>}
 */
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
        't', 'u', 'v', 'w', 'x', 'y', 'z'];
const fullAlphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

// let alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 97));


/**
 * Gets a random word to guess from objects inside an array, which has an array of category names attached at the end.
 * @param {Object} fullObject - Object in the form of { categoryObjects: [...], groups: [...]}. categoryObjects is an array of arrays of objects.
 * @returns {string} - Random word to guess.
 */
function getRandomWord(fullObject) {
  const {categoryObjects, groups} = fullObject;
  const doubleObjectIndex = randomInterval(categoryObjects);
  const category = groups[doubleObjectIndex];

  const categoryObject = categoryObjects[doubleObjectIndex][category];
  const categoryObjectIndex = randomInterval(categoryObject);
  const lastObject = categoryObject[categoryObjectIndex];
  
  let name;
  if (category === "countries") {
    name = lastObject.country;
  } else {
    name = lastObject.name;
  };
  // animals, fruits...
  console.log(name);
  return name;
};

/**
 * Given an array parameter, an index integer between 0 and the length of the array is returned.
 * @param {Array} array - array
 * @returns {number} - random integer
 */
function randomInterval(array) {
  const number = Math.floor(Math.random() * array.length);
  return number;
};

/**
 * @callback arrayCallback
 * @param {Event} e - Passes event (usually click) to callback function.
 */

/**
 * Wrapper function for simpler eventListeners.
 * @param {string} type click, keydown...
 * @param {string} selector classname, idname,...
 * @param {arrayCallback} callback Callback function.
 * @param {Document} parent Object from class Document, default: 'document'.
 */
export function addGlobalEventListener(type, selector, callback, parent = document) {
  parent.addEventListener(type, e => {
    if (e.target.matches(selector)) {
      callback(e);
    };
  });
};

// Closes popup when clicking outside of the reset window. Replaced.
// addGlobalEventListener("click", '.popup__overlay', e => {
//   e.target.style.display = 'none';
// });



let word;
let displayArray;
let wrongGuessCounter;
const wordDisplay = document.querySelector('.js-word-display');
const hangmanSVGContainer = document.querySelector('.hangman-svg__container');
const hangmanSVGContainerChildren = hangmanSVGContainer.children;
const maxLives = hangmanSVGContainer.childElementCount;


/**
 * Main function of the project. Is executed asynchronously after the JSON files have been loaded by selecting the desired categories in the dropdown menu.
 */
export function playGame() {
  function initializeData(desiredLives = 6) {
    word = getRandomWord(groups);
    displayArray = Array.from(word).map(char => 
      fullAlphabet.includes(char) ? '_' : char
    );
    wrongGuessCounter = maxLives - desiredLives;

    for (let i = 0; i < wrongGuessCounter; i++) {
      hangmanSVGContainerChildren[i].classList.add("activated");
    };
    renderWord();
  };
  
  initializeData();


  /**
   * Handles the logic, after a button has been interacted with.
   * @param {Object} button - button HTMLElement
   * @param {string} letter - pressed letter
   */
  function pressKey(button, letter) {
    button.disabled = true;
  
    if (!word.toLowerCase().includes(letter)) {
      hangmanSVGContainerChildren[wrongGuessCounter].classList.add("activated");
      wrongGuessCounter++;
    } else {
      for (let i = 0; i < word.length; i++) {
        if (word[i].toLowerCase() === letter) {
          displayArray[i] = word[i];
        };
      };
    };
  
    renderWord();
  };
  
  document.addEventListener("keydown", event => {
    const keypress = event.key;
    if (!alphabet.includes(keypress) || event.metaKey === true) {
      return;
    };
    const button = document.querySelector(`.js-keyboard__key-${keypress}`);

    pressKey(button, keypress);
  });

  addGlobalEventListener("click", '.js-keyboard__key', e => {
    const button = e.target;
    const letter = button?.textContent;
    
    pressKey(button, letter);

  }, document.querySelector('.keyboard'));
  

  /**
   * Creates the keyboard buttons, which will later be interactive.
   */
  function createButtons() {
    const buttonsAll = document.querySelector('.keyboard');
    for (const letter of alphabet) {
      const button = document.createElement('button');
      button.textContent = letter;
      button.classList.add('keyboard__key', 'js-keyboard__key', `js-keyboard__key-${letter}`);
  
      buttonsAll?.appendChild(button);
    };
  };
  
  createButtons();
  
  
  /**
   * Renders the random word to guess, with each letter initially replaced with a blank character.
   */
  function renderWord() {
    wordDisplay.textContent = displayArray.join(' ');
    if (!displayArray.includes('_')) {
      statistics.gamesWon.number++;
      statistics.currentStreak.number++;
      if (statistics.currentStreak.number > statistics.maxStreak.number) {
        statistics.maxStreak.number++;
      };
      displayResultPopup('won');
    } else if (wrongGuessCounter >= maxLives) {
      statistics.currentStreak.number = 0;
      displayResultPopup('lost');
    };
  };
  

  /**
   * The game is reset when clicking the reset button, which shows up inside a popup dialog after finishing a round.
   */
  function resetGame() {
    const popup = document.getElementById('popup-result');
    popup.close();
    isResultPopup = false;
    document.querySelectorAll('.js-keyboard__key')
      .forEach(button => button.disabled = false);
    
    for (let i = 0; i < maxLives; i++) {
      hangmanSVGContainerChildren[i].classList.remove("activated");
    }
    
    initializeData(); // resets game;
  };
  
  const resetButton = document.querySelector('.js-reset-button')
  resetButton.addEventListener("click", () => {
    // resetButton.blur();
    resetGame();
  });

  document.addEventListener("keydown", event => {
    if (event.key === ' ' && isResultPopup) {
      resetButton.click();
    };
  });
  
  /**
   * At the end of the game, a popup appears with a message and the word.
   * @param {string} message Winning/Losing message to be displayed
   */
  let isResultPopup;
  function displayResultPopup(result) {
    statistics.gamesPlayed.number++;
    
    statistics.winPercentage.number = statistics.gamesWon.number === 0
      ? 0
      : Math.round((statistics.gamesWon.number * 100) / (statistics.gamesPlayed.number));
      
    saveStatisticsToStorage();

    document.querySelectorAll('.js-keyboard__key')
      .forEach(button => button.disabled = true);

    document.querySelector('.js-popup-result__message').textContent = `You ${result}!`;
    document.querySelector('.js-popup-result__word-reveal')
      .textContent = `The word was ${word}.`;
      
    const popup = document.getElementById('popup-result');
    isResultPopup = true;
    popup.showModal();
    popup.blur();
  };
};