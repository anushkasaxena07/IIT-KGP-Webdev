let currentPlayer = 'X';
let gameBoard = [];
let isGameActive = true;
let isSoloMode = false;

const playerTurnElement = document.getElementById('player-turn');
const gameBoardElement = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const modal = document.getElementById('modal');
const confirmResetButton = document.getElementById('confirm-reset');
const cancelResetButton = document.getElementById('cancel-reset');
const boardSizeSelector = document.getElementById('board-size');
const soloModeButton = document.getElementById('solo-mode');

function updateTurnIndicator() {
    playerTurnElement.textContent = `${currentPlayer}'s Turn`;
}

function checkWinCondition(size) {
    const winConditions = [];

    // Rows
    for (let i = 0; i < size; i++) {
        const rowCondition = [];
        for (let j = 0; j < size; j++) {
            rowCondition.push(i * size + j);
        }
        winConditions.push(rowCondition);
    }

    // Columns
    for (let i = 0; i < size; i++) {
        const colCondition = [];
        for (let j = 0; j < size; j++) {
            colCondition.push(j * size + i);
        }
        winConditions.push(colCondition);
    }

    // Diagonal (Top-Left to Bottom-Right)
    const diagonal1 = [];
    for (let i = 0; i < size; i++) {
        diagonal1.push(i * size + i);
    }
    winConditions.push(diagonal1);

    // Diagonal (Top-Right to Bottom-Left)
    const diagonal2 = [];
    for (let i = 0; i < size; i++) {
        diagonal2.push(i * size + (size - 1 - i));
    }
    winConditions.push(diagonal2);

    // Check win conditions
    for (let condition of winConditions) {
        const firstCell = gameBoard[condition[0]];
        if (firstCell && condition.every(index => gameBoard[index] === firstCell)) {
            return firstCell;
        }
    }

    // Check for tie
    return gameBoard.includes(null) ? null : 'Tie';
}

function handleSquareClick(index, size) {
    if (!isGameActive || gameBoard[index]) return;

    gameBoard[index] = currentPlayer;
    renderBoard(size);

    const result = checkWinCondition(size);
    if (result) {
        playerTurnElement.textContent = result === 'Tie' ? "It's a tie!" : `${result} wins!`;
        isGameActive = false;
        setTimeout(() => resetBoard(size), 5000);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnIndicator();
        if (isSoloMode && currentPlayer === 'O') {
            setTimeout(() => makeRandomMove(size), 500);
        }
    }
}

function makeRandomMove(size) {
    const emptyIndices = gameBoard.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    handleSquareClick(randomIndex, size);
}

function createBoard(size) {
    return Array(size * size).fill(null);
}

function renderBoard(size) {
    gameBoardElement.innerHTML = '';
    gameBoardElement.className = `grid-${size}x${size}`;
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.textContent = cell;
        cellElement.addEventListener('click', () => handleSquareClick(index, size));
        gameBoardElement.appendChild(cellElement);
    });
}

function resetBoard(size) {
    gameBoard = createBoard(size);
    currentPlayer = 'X';
    isGameActive = true;
    updateTurnIndicator();
    renderBoard(size);
}

resetButton.addEventListener('click', () => {
    modal.style.display = 'flex';
});

confirmResetButton.addEventListener('click', () => {
    const size = parseInt(boardSizeSelector.value);
    resetBoard(size);
    modal.style.display = 'none';
});

cancelResetButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

boardSizeSelector.addEventListener('change', () => {
    const size = parseInt(boardSizeSelector.value);
    resetBoard(size);
});

soloModeButton.addEventListener('click', () => {
    isSoloMode = !isSoloMode;
    soloModeButton.textContent = isSoloMode ? 'Play with Friend' : 'Play Solo';
    const size = parseInt(boardSizeSelector.value);
    resetBoard(size);
});

// Initialize the game board
const initialSize = parseInt(boardSizeSelector.value);
resetBoard(initialSize);
