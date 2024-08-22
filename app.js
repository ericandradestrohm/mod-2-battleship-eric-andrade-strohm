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
 * Creates a div with classname 'game-board' with specified player and background color.
 * Div is then attached to gamesBoardContainer
 * Also generates 100 divs for grid placement.
 * 
 * Style defined in styles.css.
 * 
 * Parameters: 
 * color - Color used for background color.
 * user - Specifies if it's a player or computer.
 * 
 * Invoked immediately.
 */
// Board Creation
const width = 10
function createBoard(color, user) {
    const gameBoardContainer = document.createElement('div');
    gameBoardContainer.classList.add('game-board');
    gameBoardContainer.style.backgroundColor = color;
    gameBoardContainer.id = user;

    for (let i = 0; i < width * width; i++){
        const block = document.createElement('div');
        block.classList.add('block');
        block.id = i;
        gameBoardContainer.append(block);
    }

    gamesBoardContainer.append(gameBoardContainer);
}

createBoard('yellow', 'player');
createBoard('pink', 'computer');

// ================================
// Event Listeners
// ================================
flipButton.addEventListener('click', flip);