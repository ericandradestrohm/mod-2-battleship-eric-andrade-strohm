// ================================
// DOM Queries
// ================================
const flipButton = document.getElementById('flip-button');
const gamesboardContainer = document.getElementById('gamesboard-container');
const optionsContainer = document.querySelector('.options-container');



// ================================
// Functions
// ================================
/**
 * Toggles the rotation of all child elements within the optionsContainer
 * between 0 and 90 deg.
 * Used by: `flipButton`
 */
// Used for flip()'s angle
let angle = 0;

function flip () {
    const optionsShips = Array.from(optionsContainer.children);

    angle = angle === 0 ? 90 : 0;
    for (let optionShip of optionsShips) {
        optionShip.style.transform = `rotate(${angle}deg)`;
    }
}
/**
 * Creates game boards
 */
// Board Creation
const width = 10
function createBoard() {
    const gameBoardContainer = document.createElement('div');
    gameBoardContainer.classList.add('game-board');
}

// ================================
// Event Listeners
// ================================
flipButton.addEventListener('click', flip);