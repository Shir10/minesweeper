// Safe click - mark a random covered cell (for a few seconds) that is safe to click (does not contain a MINE).
function safeClick() {
    if (!gGame.isOn || !gGame.safeClicks) return;

    // Get safe coordinate
    var safeCoords = getSafeCoords(gBoard);
    if (!safeCoords.length) return;
    var idx = getRandomIntegerExclusive(0, safeCoords.length);
    var { i, j } = safeCoords[idx];

    // Update gGame
    gGame.safeClicks--;
    document.querySelector('.safe-clicks').innerText = gGame.safeClicks;

    // Mark cell as safe
    var elCell = document.querySelector(`.cell${i}-${j}`);
    elCell.classList.add('safe');

    setTimeout(() => {
        elCell.classList.remove('safe');
    }, 500);
}

// Get safe coordinats array
function getSafeCoords(board) {
    var safeCoords = [];

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j];
            if (!cell.isShown && !cell.isMarked && !cell.isMine) safeCoords.push({ i, j });
        }
    }
    return safeCoords;
}