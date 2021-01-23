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
        id: level,
        SIZE: size,
        MINES: mines,
        bestTime: Infinity
    };

    getBestTime();

    // Handle level elements css
    var elLevels = document.querySelectorAll('.level');
    for (var i = 0; i < elLevels.length; i++) {
        var elLevel = elLevels[i];
        if (elLevel.dataset.level === level.toString()) elLevel.classList.add('bold');
        else elLevel.classList.remove('bold');
    }

    restart();
}

// Get level best time
function getBestTime() {
    var bestTime = localStorage.getItem(`bestTime-${gLevel.id}`);

    if (!bestTime) {
        localStorage.setItem(`bestTime-${gLevel.id}`, Infinity);
        document.querySelector('.best-time-container').style.display = 'none';
    } else if (bestTime === Infinity.toString()) {
        document.querySelector('.best-time-container').style.display = 'none';
    } else {
        document.querySelector('.best-time').innerText = bestTime;
        document.querySelector('.best-time-container').style.display = 'block';
    }
}