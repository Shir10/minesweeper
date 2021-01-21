// Render board
function renderBoard(board) {
    var elBoard = document.querySelector('.borad');
    var htmlStr = '';

    for (var i = 0; i < board.length; i++) {
        htmlStr += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            htmlStr += `<td class="cell cell${i}-${j}" onclick="cellClicked(this, ${i}, ${j})" 
            oncontextmenu="toggleMarkCell(${i}, ${j})"></td>`
        }
        htmlStr += '</tr>';
    }
    elBoard.innerHTML = htmlStr;
}

// Render cell with location such as: {i: 2, j: 3}
function renderCell(coord, value) {
    var elCell = document.querySelector(`.cell${coord.i}-${coord.j}`);
    elCell.innerHTML = value;
}

function getBoardCoords(board) {
    var coords = [];

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            coords.push({ i, j });
        }
    }
    return coords;
}

// Get shuffled coordinates
function getSuffledCoords(board) {
    var suffledCoords = getBoardCoords(board);
    var len = suffledCoords.length;

    suffledCoords.sort(function(coord1, coord2) {
        return Math.random(0, len) > 0.5 ? 1 : -1;
    });

    return suffledCoords;
}

// ------ TO DELETE ------
// For debug
function printBoard() {
    var str = '';

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j];
            str += cell.isMine ? MINE : cell.minesAroundCount;
            str += ' ';
        }
        str += '\n';
    }
    console.log(str);
}

function initVisitdMatrix(size) {
    var visited = [];

    for (var i = 0; i < size; i++) {
        visited[i] = [];
        for (var j = 0; j < size; j++) {
            visited[i][j] = false;
        }
    }
    return visited;
}