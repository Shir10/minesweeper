const MINE = '💣';
// const ZERO = '';
// const ONE = '1';
// const TWO = '2';
// const THRE = '3';
// const FOUR = '4';
// const FIVE = '5';
// const SIX = '6';
// const SEVEN = '7';
// const EIGHT = '8';

var gGame;
var gLevel;
var gBoard;
var gTimeInterval;

// Initialize the game
function initGame() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };

    if (!gLevel) {
        gLevel = {
            SIZE: 4,
            MINES: 2
        };
    }
    document.querySelector('.remaining-mines').innerText = gLevel.MINES;
    document.querySelector('.time').innerText = 0;

    gBoard = buildBoard();

    renderBoard(gBoard);
}

// Build board
function buildBoard() {
    var board = [];

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];

        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = '';
        }
    }
    return board;
}

// Start game
function startGame(i, j) {
    gGame.isOn = true;
    setMines(gBoard, i, j);
    setNumbers(gBoard);
    startTimer();

    console.log(gBoard);
}

// Sets mines on the board
function setMines(board, row, col) {
    var shuffledCoords = getSuffledCoords(board);

    for (var idx = 0; idx < gLevel.MINES; idx++) {
        var { i, j } = shuffledCoords.pop();

        // This condition ensures that on our first click we do not get a mine
        if (i === row && j === col) {
            idx--;
            continue;
        }
        board[i][j] = MINE;
    }
}

// Sets numbers on the board
function setNumbers(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] !== MINE) {
                board[i][j] = countMinesAround(i, j, board);
                if (board[i][j] === 0) board[i][j] = '';
            }
        }
    }
}

// Count mines neighbors of specific cell
function countMinesAround(row, col, board) {
    var minesCount = 0;

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j] === MINE) minesCount++;
        }
    }
    return minesCount;
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) startGame(i, j);

    var cellVal = gBoard[i][j];
    if (cellVal === MINE) {
        document.querySelector(`.cell${i}-${j}`).style.backgroundColor = 'red';
        renderAllMines(gBoard);
        gameOver(false);
    } else {
        gGame.shownCount++;
        renderCell({ i, j }, cellVal);
    }

    console.log(elCell);
}

// Render all mines
function renderAllMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === MINE) {
                renderCell({ i, j }, MINE);
            }
        }
    }
}

function gameOver(isVictory) {

}

function cellMarked(elCell) {

}

function checkGameOver() {

}

function expandShown(board, elCell, i, j) {

}


// Start timer
function startTimer() {
    var startTime = Date.now();
    gTimeInterval = setInterval(() => renderTime(startTime), 1000);
}

// Stop timer
function stopTimer() {
    clearInterval(gTimeInterval);
}

// Render time
function renderTime(startTime) {
    var elapsedTime = Date.now() - startTime;
    document.querySelector('.time').innerText = (elapsedTime / 1000).toFixed(0);
}