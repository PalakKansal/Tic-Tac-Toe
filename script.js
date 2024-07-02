const board = document.getElementById('board');
const message = document.getElementById('message');
const cells = Array.from(document.querySelectorAll('.cell'));
const humanPlayer = 'X';
const aiPlayer = 'O';
let currentPlayer = humanPlayer;
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    checkResult();

    if (gameActive) {
        currentPlayer = currentPlayer === humanPlayer ? aiPlayer : humanPlayer;
        if (currentPlayer === aiPlayer) {
            setTimeout(computerMove, 500);
        }
    }
}

function computerMove() {
    let bestMove = getBestMove();
    gameState[bestMove] = aiPlayer;
    cells[bestMove].innerHTML = aiPlayer;

    checkResult();

    currentPlayer = humanPlayer;
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            gameState[i] = aiPlayer;
            let score = minimax(gameState, 0, false);
            gameState[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(board, humanPlayer)) {
        return -10 + depth;
    } else if (checkWin(board, aiPlayer)) {
        return 10 - depth;
    } else if (!board.includes("")) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = aiPlayer;
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = humanPlayer;
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        message.innerHTML = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        message.innerHTML = "Game ended in a draw!";
        gameActive = false;
        return;
    }
}

function checkWin(board, player) {
    return winningConditions.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
