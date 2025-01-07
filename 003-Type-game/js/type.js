async function fetchWords() {
  try {
    const response = await fetch('https://random-word-api.herokuapp.com/word?number=60');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const words = await response.json();
    return words;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}
const $game = document.querySelector('#game')
const $time = document.querySelector('#time');
const $text = document.querySelector('#text');
const $input = document.querySelector('#input');
const $wpm = document.querySelector('#wpm');
const $results = document.querySelector('#res')
const $acc = document.querySelector('#acc')

const INITIAL_TIME = 30;
const INITIAL_TEXT = await fetchWords();
console.log(INITIAL_TEXT)
let words = [];
let currrentTime = INITIAL_TIME;


initGame();
initEvent();
const IntervalidId = setInterval(() => {
  currrentTime--;
  $time.textContent = currrentTime;
  if (currrentTime === 0) {
    clearInterval(IntervalidId);
    gameOver();
  }
}, 1000)

function gameOver() {
  const correctWords = $text.querySelectorAll ('x-word.correct').length;
  const correctletter = $text.querySelectorAll ('x-letter.correct').length;
  const incorrectletter = $text.querySelectorAll ('x-letter.incorrect').length;

  const totalLetters = correctletter + incorrectletter;

  const accuarancyLetters = totalLetters > 0 ? (correctletter/totalLetters) * 100 : 0;


  const wpm = correctWords * 60 / 30;

  $wpm.textContent = wpm.toFixed(2)

  $acc.textContent = accuarancyLetters.toFixed(2) + '%'

  
}
function initGame() {
  const words = INITIAL_TEXT.slice(0, 60);
  currrentTime = INITIAL_TIME;

  $time.textContent = currrentTime;
  $text.innerHTML = words.map((word, index) => {
    const letter = word.split('');

    return `<x-word>
    ${letter.map(letter => `<x-letter>${letter}</x-letter>`).join('')
      }
    </x-word>
    `
  }).join('');

  const $firstWord = document.querySelector('x-word');
  $firstWord.classList.add('active');
  $firstWord.querySelector('x-letter').classList.add('active');
};

function initEvent() {
  document.addEventListener('keydown', () => {
    $input.focus();

  })
  $input.addEventListener('keydown', KeyDown);
  $input.addEventListener('keyup', keyUp);
};
function KeyDown(event) {
  const { key } = event;
  const $currentWord = document.querySelector('x-word.active');
  const $currentLetter = $currentWord.querySelector('x-letter.active');

  if (key === ' ') {
    event.preventDefault();
    const $nextWord = $currentWord.nextElementSibling;
    const $nextLetter = $nextWord.querySelector('x-letter');

    $currentWord.classList.remove('active', 'word-incorrect');
    $currentLetter.classList.remove('active');

    $nextWord.classList.add('active');
    $nextLetter.classList.add('active');

    $input.value = '';


    const hasIncorrectLetters = $currentWord.querySelectorAll('x-letter:not(.correct)').length > 0;

    const addClassWord = hasIncorrectLetters   ? 'word-incorrect' : 'correct';

    $currentWord.classList.add(addClassWord);

    return
  }

  if (key === 'Backspace'){
    const $prevWord = $currentWord.previousElementSibling;
    const $prevLetter = $currentLetter.previousElementSibling;

    if(!$prevWord && !$prevLetter ){
      event.preventDefault();
      return
    }
    const $wordMarked = $text.querySelector('x-word.word-incorrect');
    if(!$prevLetter){
      event.preventDefault();
      $prevWord.classList.remove('word-incorrect');
      $prevWord.classList.add('active');
      
      const $letterToGO = $prevWord.querySelector('x-letter:last-child');

      $currentLetter.classList.remove('active');
      $letterToGO.classList.add('active');

      $input.value = [ 
        ...$prevWord.querySelectorAll('x-letter.correct, x-letter.incorrect')
      ].map(letter => {
        return letter.classList.contains('correct') ? letter.innerText : 'ç'
      }).join('');
  }
}
}
function keyUp(){
  const $currentWord = document.querySelector('x-word.active');
  const $currentLetter = $currentWord.querySelector('x-letter.active');

  const currentWord = $currentWord.innerText.trim();
  $input.maxLength = currentWord.length;

  const $AllLetters = $currentWord.querySelectorAll('x-letter');

  $AllLetters.forEach(letter => letter.classList.remove('correct', 'incorrect') );
  $input.value.split('').forEach((char, index) => {
    const $letter = $AllLetters[index];
    const letterToCheck = currentWord[index];

    const isCorrect = char === letterToCheck;
    const letterClass = isCorrect ? 'correct' : 'incorrect'
    $letter.classList.add(letterClass);
  });
  $currentLetter.classList.remove('active', 'lastLetter')
  const inputLenght = $input.value.length;
  const $nextActiveLetter  = $AllLetters[inputLenght];

  if($nextActiveLetter){
    $nextActiveLetter.classList.add('active')
  }else{
    $currentLetter.classList.add('active', "lastLetter")
  }
}
