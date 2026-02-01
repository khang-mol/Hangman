import { wordList } from "./data/word-list.js";

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

function getRandomWord(max = wordList.length, min = 0) {
  const index = Math.floor(Math.random() * (max - min)) + min;
  const { word } = wordList[index];
  console.log(word);
  return word;
};

function addGlobalEventListener(type, selector, callback, parent = document) {
  parent.addEventListener(type, e => {
    if (e.target.matches(selector)) {
      callback(e);
    };
  });
};


let word;
let displayArray;
let hangmanHTML;
let wrongGuessCounter;
const wordDisplay = document.querySelector('.js-word-display');

let wins = 0;
let losses = 0;


function playGame() {
  function initializeData(desiredLives = 6) {
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

  addGlobalEventListener('click', '.js-keyboard__key', e => {
    // e.target.classList.toggle('new-class');
    const button = e.target;
    button.disabled = true;
    const letter = button.textContent;
    console.log(letter);

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

  }, document.querySelector('.keyboard'));

  function createButtons() {
    const buttonsAll = document.querySelector('.keyboard');
    buttonsAll.innerHTML = '';
    for (const letter of alphabet) {
      const button = document.createElement('button');
      button.textContent = letter;
      button.classList.add('keyboard__key', 'js-keyboard__key');
  
      buttonsAll.appendChild(button);
    };
  };
  
  createButtons();
  
  
  function renderWord() {
    wordDisplay.textContent = displayArray.join(' ');
    document.getElementById('Frame 1').innerHTML = hangmanHTML;
    if (!displayArray.includes('_')) {
      displayPopup('You won!');
    } else if (wrongGuessCounter >= hangmanComponents.length) 
    { displayPopup('You lost!');
    };
  };
  

  document.querySelector('.js-reset-button')
    .addEventListener('click', () => {
      const popup = document.querySelector('.js-popup')
      popup.style.display = 'none';
      document.querySelectorAll('.js-keyboard__key')
        .forEach(button => button.disabled = false);
      
      initializeData(); // resets game;
    });
  
  function displayPopup(message) {
    document.querySelector('.js-popup__message').textContent = message;
    document.querySelector('.js-popup__word-reveal')
      .textContent = `The word was ${word}`;
    const popup = document.querySelector('.js-popup');
    popup.style.display = 'flex';
  };
};

playGame();
