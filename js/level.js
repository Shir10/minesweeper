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

    // Handle level css
    var elLevels = document.querySelectorAll('.level');
    for (var i = 0; i < elLevels.length; i++) {
        elLevels[i].style.color = 'blue';
    }
    elLevel.style.color = 'purple';

    restart();
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