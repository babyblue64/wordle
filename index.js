import fullDictionary from "dictionary.js";
//UI
function makeBox(container, row, col) {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = '';

    container.appendChild(box);
}

function makeGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for(let i = 0 ; i < 6 ; i++) {
        for(let j = 0 ; j < 5 ; j++) {
            makeBox(grid, i, j);
        }
    }

    container.appendChild(grid);
}

//data
const Dictionary = fullDictionary;
    //['apple', 'peach', 'crane', 'brown', 'fresh', 'juice', 'sugar', 'dairy', 'diary', 
                    //'light', 'truth', 'range', 'plane', 'sheet', 'greet', 'anger', 'index','teeth', 'beach'];
const State = {
    secret: Dictionary[Math.floor(Math.random()*Dictionary.length)],
    hint: Array(5).fill(''),
    grid: Array(6).fill().map(() => Array(5).fill('')),
    row: 0,
    col: 0,
}

//backend
function syncUI() {
    for(let i = 0 ; i < State.grid[State.row].length ; i++) {
        const box = document.getElementById(`box${State.row}${i}`);
        box.textContent = State.grid[State.row][i];
    }
}

function syncUIwhenEnter() {
    for(let i = 0 ; i < 5 ; i++) {
        const box = document.getElementById(`box${State.row}${i}`);
        box.classList.add(State.hint[i]);
    }
}

function listenForKeyPress() {
    document.body.onkeydown = (input) => {
        const key = input.key;

        if(isLetter(key)) {
            addLetter(key);
        }
        if(key === 'Backspace') {
            clearLetter();
        }
        if(key === 'Enter' && State.col === 5) {
            const word = getCurrentWord();
            if(isWordValid(word)) {
                revealWord(word);
                syncUIwhenEnter();
                State.row++;
                State.col = 0;
            }
            else{
                alert("Invalid word");
            }
        } 
        else {
            syncUI();
        }
    }
}

function isLetter(letter) {
    return letter.length === 1 && letter.match(/[a-z]/i);
}

function addLetter(letter) {
    if(State.col === 5) return;
    State.grid[State.row][State.col] = letter;
    State.col++;
}

function clearLetter() {
    if(State.col === 0) return;
    State.grid[State.row][State.col - 1] = ''; 
    State.col--;
}

function getCurrentWord() {
    return State.grid[State.row].reduce((prev, curr) => prev + curr);
}

function isWordValid(guess) {
    return Dictionary.includes(guess);
}

function revealWord(guess) {
    for(let i = 0 ; i < 5 ; i++) {
        const letter = State.grid[State.row][i];
        if(letter === State.secret[i]) {
            State.hint[i] = "rightPlace";
        }
        else if(State.secret.includes(letter)) {
            State.hint[i] = "wrongPlace";
        }
        else {
            State.hint[i] = "noMatch";
        }
    }

    const isWinner = State.secret === guess;
    const isGameOver = State.row === 5;

    if(isWinner) {
        setTimeout (
            () => {
                alert('Congrats!');
                location.reload();
            }, 
            2000,
        )
    }
    if(isGameOver) {
        setTimeout (
            () => {
                alert(`Game over! The word was ${State.secret}`);
                location.reload();
            },
            2000,
        )
    }
}

function startup() {
    const game = document.getElementById('game');
    makeGrid(game);
    listenForKeyPress();
}

startup();
