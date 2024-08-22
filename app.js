// ================================
// DOM Queries
// ================================
const gamesBoardContainer = document.getElementById('gamesboard-container');
const optionsContainer = document.querySelector('.options-container');
const flipButton = document.getElementById('flip-button');



// ================================
// Functions
// ================================
/**
 * Toggles the rotation of all child elements within the optionsContainer
 * between 0 and 90 deg.
 * Called by: `flipButton`
 */
let angle = 0;
function flip () {
    const optionsShips = Array.from(optionsContainer.children);

    angle = angle === 0 ? 90 : 0;
    for (let optionShip of optionsShips) {
        optionShip.style.transform = `rotate(${angle}deg)`;
    }
}

/**
 * Creates a div with classname 'game-board'.
 * Div is then attached to gamesBoardContainer
 * Style defined in styles.css.
 * Parameters: color - Color used for background color.
 * Invoked immediately.
 */
// Board Creation
const width = 10
function createBoard(color) {
    const gameBoardContainer = document.createElement('div');
    gameBoardContainer.classList.add('game-board');
    gameBoardContainer.style.backgroundColor = color;

    gamesBoardContainer.append(gameBoardContainer);
}

createBoard('yellow');
createBoard('pink');

// ================================
// Event Listeners
// ================================
flipButton.addEventListener('click', flip);