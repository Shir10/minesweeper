const START_EMOJI = '😊';
const WIN_EMOJI = '😎';
const LOSE_EMOJI = '😫';
const FLAG = '🚩';
const EMPTY = '';

var gGame;
var gLevel;
var gBoard;
var gVisited;
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
    gVisited = initVisitdMatrix(gLevel.SIZE);

    document.querySelector('.remaining-marks').innerText = gLevel.MINES;
    document.querySelector('.emoji').innerText = START_EMOJI;
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
            board[i][j] = {
                minesAroundCount: -1,
                isShown: false,
                isMine: false,
                isMarked: false
            };
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

    printBoard(); // ------ TO DELETE ------
}

// Sets numbers on the board
function setNumbers(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j];

            if (!cell.isMine) {
                cell.minesAroundCount = countMinesAround(i, j, board);
            }
        }
    }
}

// Handle cell click
function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];

    if (cell.isMarked) return;
    if (!gGame.shownCount) startGame(i, j);
    if (!gGame.isOn || cell.isShown) return;

    if (cell.isMine) {
        elCell.style.backgroundColor = 'red';
        renderAllMines(gBoard);
        gameOver(false);
    } else {
        expandShown(i, j, gBoard, gVisited);
    }
}

// Expand shown cells - if no mines around
function expandShown(row, col, board, visited) {
    if (visited[row][col]) return;

    var cell = board[row][col];
    visited[row][col] = true;
    cell.isShown = true;
    gGame.shownCount++;

    var cellVal = cell.minesAroundCount;

    // If cell if empty - start DFS search
    if (cellVal === 0) {
        cellVal = EMPTY;

        // DFS search
        var len = board.length;
        for (var i = row - 1; i <= row + 1; i++) {

            if (i < 0 || i >= len) continue;
            for (var j = col - 1; j <= col + 1; j++) {
                if (j < 0 || j >= len) continue;
                expandShown(i, j, board, visited);
            }
        }
    }

    renderCell({ i: row, j: col }, cellVal);
    var elCell = document.querySelector(`.cell${row}-${col}`);
    elCell.classList.add('shown');
    setNumberColor(cellVal, elCell);

    if (isVictory()) gameOver(true);
}

// Toggle mark cell - activated by right-clicking
function toggleMarkCell(i, j) {
    var cell = gBoard[i][j];

    // If cell is shown - return
    if (cell.isShown) return;
    // If game is over - return
    if (!gGame.isOn && gGame.shownCount !== 0) return;

    // handle cell fields
    cell.isMarked = !cell.isMarked;
    var cellDisplay = cell.isMarked ? FLAG : EMPTY;
    renderCell({ i, j }, cellDisplay);

    // handle game fields
    gGame.markedCount += cell.isMarked ? 1 : -1;
    var remainingMarks = gLevel.MINES - gGame.markedCount;
    document.querySelector('.remaining-marks').innerText = remainingMarks;

    if (isVictory()) gameOver(true);
}

// Game Over
function gameOver(isVictory) {
    gGame.isOn = false;
    stopTimer();
    document.querySelector('.emoji').innerText = isVictory ? WIN_EMOJI : LOSE_EMOJI;
}

// Restart game
function restart() {
    stopTimer();
    initGame();
}

// Is victory
function isVictory() {
    // The player wins when all mines are marked and all the other cells (the numbers) are shown
    var numbersCount = Math.pow(gLevel.SIZE, 2) - gLevel.MINES;
    return gGame.markedCount === gLevel.MINES && gGame.shownCount === numbersCount;
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
    var elapsedTimeInSec = (elapsedTime / 1000).toFixed(0);

    document.querySelector('.time').innerText = elapsedTimeInSec;
    gGame.secsPassed = elapsedTimeInSec;
}

// Change level
function changeLevel(elLevel, level) {
    switch (level) {
        case 0:
            var size = 4;
            var mines = 2;
            break;
        case 1:
            var size = 8;
            var mines = 12;
            break;
        case 2:
            var size = 12;
            var mines = 30;
            break;
    }

    gLevel = {
        SIZE: size,
        MINES: mines
    };

    var elLevels = document.querySelectorAll('.level');
    for (var i = 0; i < elLevels.length; i++) {
        elLevels[i].style.color = 'blue';
    }
    elLevel.style.color = 'purple';

    restart();
}

function setNumberColor(cellVal, elCell) {
    var cellClass;

    switch (cellVal) {
        case 1:
            cellClass = 'one';
            break;
        case 2:
            cellClass = 'two';
            break;
        case 3:
            cellClass = 'three';
            break;
        case 4:
            cellClass = 'four';
            break;
        case 5:
            cellClass = 'five';
            break;
        case 6:
            cellClass = 'six';
            break;
        case 7:
            cellClass = 'seven';
            break;
        case 8:
            cellClass = 'eight';
            break;
    }

    elCell.classList.add(cellClass);
}