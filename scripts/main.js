import { wordList } from "./data/word-list.js";
import { createPopups, renderNavbar, renderStatistics } from "./navbar.js";

renderNavbar();
createPopups();
// renderStatistics();

export let statistics;
export function loadStatisticsFromStorage() {
  statistics = JSON.parse(localStorage.getItem('hangmanStatistics')) || {
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
        label: 'Current<br>Streak',
      },
      maxStreak: {
        number: 0,
        label: 'Max<br>Streak',
      },
    };
};

loadStatisticsFromStorage();

function saveStatisticsToStorage() {
  localStorage.setItem('hangmanStatistics', JSON.stringify(statistics));
};

/**
 * @type {Array<string>}
 */
let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
        't', 'u', 'v', 'w', 'x', 'y', 'z'];

// let alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 97));

const hangmanComponents = [
    '<rect id="hangman__pole" x="15" width="8" height="150" fill="#7B5E3D"/>',
    '<rect id="hangman__crossbeam" x="145" width="8" height="122" transform="rotate(90 145 0)" fill="#7B5E3D"/>',
    '<rect id="hangman__crosspiece" x="57.4264" y="2" width="8" height="60" transform="rotate(45 57.4264 2)" fill="#7B5E3D"/>',
    '<rect id="hangman__rope" x="115" y="8" width="3" height="18" fill="#B36832"/>',
    '<circle id="hangman__head" cx="116.5" cy="38.5" r="12.5" fill="#CA994A"/>',
    '<rect id="hangman__torso" x="114" y="51" width="5" height="41" fill="#CA994A"/>',
    '<rect id="hangman__left-arm" width="4" height="29" transform="matrix(-0.906308 -0.422618 -0.422618 0.906308 117.881 52.6905)" fill="#CA994A"/>',
    '<rect id="hangman__right-arm" x="115" y="52.6905" width="4" height="29" transform="rotate(-25 115 52.6905)" fill="#CA994A"/>',
    '<rect id="hangman__left-foot" width="4" height="29" transform="matrix(-0.906308 -0.422618 -0.422618 0.906308 117.881 88.6905)" fill="#CA994A"/>',
    '<rect id="hangman__right-foot" x="115" y="88.6905" width="4" height="29" transform="rotate(-25 115 88.6905)" fill="#CA994A"/>'
  ];

/**
 * Get a random word from an array of word objects
 * @param {number} max - length of word list parameter
 * @param {number} min - default: 0
 * @returns {string}
 */
function getRandomWord(max = wordList.length, min = 0) {
  const index = Math.floor(Math.random() * (max - min)) + min;
  const { word } = wordList[index];
  console.log(word);
  return word;
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

// Closes popup when clicking outside of the window.
addGlobalEventListener("click", '.popup__overlay', e => {
  e.target.style.display = 'none';
});



let word;
let displayArray;
let hangmanHTML;
let wrongGuessCounter;
const wordDisplay = document.querySelector('.js-word-display');


function playGame() {
  function initializeData(desiredLives = 3) {
    word = getRandomWord();
    displayArray = Array.from(word).map(() => '_');
    hangmanHTML = '<rect id="hangman__base" y="150" width="160" height="10" fill="#167611"/>';
    wrongGuessCounter = 10 - desiredLives;

    for (let i = 0; i < wrongGuessCounter; i++) {
      hangmanHTML += hangmanComponents[i];
    };
    
    wordDisplay.innerHTML = hangmanHTML;
    renderWord();
  };
  
  initializeData();


  function pressKey(button, letter) {
    button.disabled = true;
  
    if (!word.includes(letter)) {
      hangmanHTML += hangmanComponents[wrongGuessCounter];
      wrongGuessCounter++;
    } else {
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
          displayArray[i] = letter;
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
  

  function createButtons() {
    const buttonsAll = document.querySelector('.keyboard');
    buttonsAll.innerHTML = '';
    for (const letter of alphabet) {
      const button = document.createElement('button');
      button.textContent = letter;
      button.classList.add('keyboard__key', 'js-keyboard__key', `js-keyboard__key-${letter}`);
  
      buttonsAll?.appendChild(button);
    };
  };
  
  createButtons();
  
  
  function renderWord() {
    wordDisplay.textContent = displayArray.join(' ');
    document.getElementById('Frame 1').innerHTML = hangmanHTML;
    if (!displayArray.includes('_')) {
      statistics.gamesWon.number++;
      statistics.currentStreak.number++;
      if (statistics.currentStreak.number > statistics.maxStreak.number) {
        statistics.maxStreak.number++;
      };
      displayResultPopup('won');
    } else if (wrongGuessCounter >= hangmanComponents.length) {
      statistics.currentStreak.number = 0;
      displayResultPopup('lost');
    };
  };
  

  function resetGame() {
    const popup = document.getElementById('popup-result');
    popup.close();
    isResultPopup = false;
    document.querySelectorAll('.js-keyboard__key')
      .forEach(button => button.disabled = false);
    
    initializeData(); // resets game;
  };
  
  const resetButton = document.querySelector('.js-reset-button')
  resetButton.addEventListener("click", () => {
    resetButton.blur();
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

playGame();
