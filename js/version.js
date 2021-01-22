// Add previous version to gVersion array
function pushPrevVersion() {
    var version = {
        game: {...gGame },
        board: copyBoard(),
        visited: copyVisited(),
    };
    gVersions.push(version);
}

// Copy gBoard - deep copy
function copyBoard() {
    var board = [];

    for (var i = 0; i < gBoard.length; i++) {
        board[i] = [];
        for (var j = 0; j < gBoard[i].length; j++) {
            board[i][j] = {...gBoard[i][j] };
        }
    }
    return board;
}

// Copy gVisited array - deep copy
function copyVisited() {
    var visited = [];

    for (var i = 0; i < gVisited.length; i++) {
        visited[i] = gVisited[i].slice();
    }
    return visited;
}

// Undo
function undo() {
    if (!gGame.lives || !gVersions.length || !gGame.isOn) return;
    var version = gVersions.pop();
    renderVersion(version);
}

// Render version
function renderVersion(version) {
    gGame = version.game;
    gBoard = version.board;
    gVisited = version.visited;

    document.querySelector('.remaining-marks').innerText = gLevel.MINES - gGame.markedCount;
    document.querySelector('.lives').innerText = '❤️'.repeat(gGame.lives);
    document.querySelector('.hints').innerText = gGame.hints;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j];
            var elCell = document.querySelector(`.cell${i}-${j}`);
            var cellValue;

            if (!cell.isShown) {
                cellValue = cell.isMarked ? FLAG : EMPTY;
                elCell.classList.remove('shown');
            } else {
                if (cell.isMine) cellValue = MINE_IMG;
                else {
                    cellValue = cell.minesAroundCount || EMPTY;
                    setNumberColor(elCell, cellValue);
                }
                elCell.classList.add('shown');
            }
            elCell.innerHTML = cellValue;
        }
    }
}