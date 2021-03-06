const START_EMOJI = '😊';
const WIN_EMOJI = '😎';
const LOSE_EMOJI = '😫';
const FLAG = '🚩';
const LIFE = '❤️';
const EMPTY = '';

var gGame;
var gLevel;
var gBoard;
var gVisited;
var gTimeInterval;
var gVersions;

// Initialize the game
function initGame() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        safeClicks: 3,
    };

    if (!gLevel) changeLevel(MEDIUM);
    gVisited = initVisitdMatrix(gLevel.SIZE);
    gVersions = [];
    gBoard = buildBoard();
    renderBoard(gBoard);

    document.querySelector('.marks').innerText = gLevel.MINES;
    document.querySelector('.emoji').innerText = START_EMOJI;
    document.querySelector('.time').innerText = 0;
    document.querySelector('.lives').innerText = LIFE.repeat(3);
    document.querySelector('.safe-clicks').innerText = 3;
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
    printBoard(); // For debug
}

// Sets numbers on board
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
    if (!gGame.shownCount && !gGame.secsPassed) startGame(i, j);
    if (!gGame.isOn || cell.isShown) return;

    if (cell.isMine) {
        gGame.lives--;
        if (!gGame.lives) {
            addLastVersion();
            renderAllMines(gBoard, elCell);
            gameOver(false);
            document.querySelector('.lives').innerText = '';
        } else handleMistake(elCell, i, j);
    } else {
        addLastVersion();
        expandShown(i, j, gBoard, gVisited);
    }
}

// Handle mistake - when the player clicked on a mine
function handleMistake(elCell, i, j) {
    renderCell({ i, j }, MINE_IMG);
    elCell.classList.add('shown', 'red');

    setTimeout(() => {
        renderCell({ i, j }, EMPTY);
        elCell.classList.remove('shown', 'red');
        document.querySelector('.lives').innerText = LIFE.repeat(gGame.lives);
    }, 300);
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
    setNumberColor(elCell, cellVal);

    if (isVictory()) gameOver(true);
}

// Toggle mark cell - activated by right-clicking
function toggleMarkCell(i, j) {
    var cell = gBoard[i][j];

    // If cell is shown - return
    if (cell.isShown) return;
    // If game is over - return
    if (!gGame.isOn && gGame.shownCount !== 0) return;
    addLastVersion();

    // Update cell
    cell.isMarked = !cell.isMarked;
    var cellDisplay = cell.isMarked ? FLAG : EMPTY;
    renderCell({ i, j }, cellDisplay);

    // Update game
    gGame.markedCount += cell.isMarked ? 1 : -1;
    var remainingMarks = gLevel.MINES - gGame.markedCount;
    document.querySelector('.marks').innerText = remainingMarks;

    if (isVictory()) gameOver(true);
}

// Game Over
function gameOver(isWin) {
    gGame.isOn = false;
    stopTimer();
    document.querySelector('.emoji').innerText = isWin ? WIN_EMOJI : LOSE_EMOJI;

    // Update best time
    if (isWin && gGame.secsPassed < gLevel.bestTime) {
        gLevel.bestTime = gGame.secsPassed;
        localStorage.setItem(`bestTime-${gLevel.id}`, gLevel.bestTime);
        document.querySelector('.best-time').innerHTML = gGame.secsPassed;
        document.querySelector('.best-time-container').style.display = 'block';
    }
}

// Is victory - The player wins when all mines are marked and all the other cells (the numbers) are shown
function isVictory() {
    var numbersCount = Math.pow(gLevel.SIZE, 2) - gLevel.MINES;
    return gGame.markedCount === gLevel.MINES && gGame.shownCount === numbersCount;
}

// Restart game
function restart() {
    stopTimer();
    initGame();
}

// Start timer
function startTimer() {
    var startTime = Date.now();
    gTimeInterval = setInterval(() => renderTime(startTime), 10);
}

// Stop timer
function stopTimer() {
    clearInterval(gTimeInterval);
}

// Render time
function renderTime(startTime) {
    var elapsedTime = Date.now() - startTime;
    var elapsedTimeInSec = (elapsedTime / 1000).toFixed(2);

    document.querySelector('.time').innerText = elapsedTimeInSec;
    gGame.secsPassed = parseFloat(elapsedTimeInSec);
}

// Set number color
function setNumberColor(elCell, cellVal) {
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