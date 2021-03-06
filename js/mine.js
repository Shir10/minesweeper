const MINE = '💣';
const MINE_IMG = '<img class="mine" src="img/mine.png"/>';

// Sets mines on board
function setMines(board, row, col) {
    var shuffledCoords = getSuffledCoords(board);

    for (var idx = 0; idx < gLevel.MINES; idx++) {
        var { i, j } = shuffledCoords.pop();

        // This condition ensures that on our first click we do not get a mine
        if (i === row && j === col) {
            idx--;
            continue;
        }

        board[i][j].isMine = true;
    }
}

// Count mines around specific cell
function countMinesAround(row, col, board) {
    var minesCount = 0;

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;

            var cell = board[i][j];
            if (cell !== EMPTY && cell.isMine) minesCount++;
        }
    }
    return minesCount;
}

// Render all mines
function renderAllMines(board, elCell) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine && !board[i][j].isMarked) {
                renderCell({ i, j }, MINE_IMG);
                document.querySelector(`.cell${i}-${j}`).classList.add('shown');
            }
        }
    }
    elCell.classList.add('red');
}