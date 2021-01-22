const BEGINNER = 0;
const MEDIUM = 1;
const EXPERT = 2;

// Change level
function changeLevel(level) {
    switch (level) {
        case BEGINNER:
            var size = 4;
            var mines = 2;
            break;
        case MEDIUM:
            var size = 8;
            var mines = 12;
            break;
        case EXPERT:
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
        var elLevel = elLevels[i];
        if (elLevel.dataset.level === level.toString()) elLevel.classList.add('bold');
        else elLevel.classList.remove('bold');
    }

    restart();
}