const dictionary = ['audio', 'apple', 'plane', 'peach', 'brown', 'black', 'earth', 'crane', 'drink', 'block']
const state = { 
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
}

function updateGrid() {
    for(let i = 0 ; i < state.grid.length; i++) {
        for(let j = 0 ; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = '') { 
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

function drawGrid(container) { 
    const grid = document.createElement('div');
    grid.className = 'grid'

    for(let i = 0 ; i < 6 ; i++) {
        for(let j = 0 ; j < 5 ; j++) {
            drawBox(grid, i, j);
        }
    }

    container.appendChild(grid);
}

function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        if(key === 'Enter') {
            if(state.currentCol === 5) {
                const word = getCurrentWord();
                if (isWordValid(word)) {
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                }
                else {
                    alert('Invalid word');
                }
            }
        }
        if(key === 'Backspace') {
            removeLetter();
        }
        if(isLetter(key)) {
            addLetter(key);
        }

        updateGrid();

    }
}

function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
    return dictionary.includes(word);
}

function revealWord(guess) {
    const row = state.currentRow;
    
    for(let i = 0 ; i < 5 ; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        if(letter === state.secret[i]) {
            box.classList.add('right');
        }
        else if(state.secret.includes(letter)) {
            box.classList.add('wrong');
        }
        else {
            box.classList.add('empty');
        }
    }

    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;

    if(isWinner) {
        setTimeout(
            () => {
                alert('Congrats!');
                location.reload();
            }, 
            2000
        )
    }
    if(isGameOver) {
        setTimeout(
            () => {
                alert(`Game over. The word was ${state.secret}`);
                location.reload();
            }, 
            2000
        )
    }
    
}

function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
    if(state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if(state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;  
}

function startup() {
    const game = document.getElementById('game');
    drawGrid(game);
    registerKeyboardEvents();
}

startup();