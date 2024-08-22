// ================================
// DOM Queries
// ================================
const flipButton = document.getElementById('flip-button');
const optionsContainer = document.querySelector('.options-container');

// ================================
// Variables
// ================================
// Used for flip()'s angle
let angle = 0;

// ================================
// Functions
// ================================
/**
     * Toggles the rotation of all child elements within the optionsContainer
     * between 0 and 90 deg.
     * Used by: `flipButton`
     */
function flip () {
    const optionsShips = Array.from(optionsContainer.children);

    angle = angle === 0 ? 90 : 0;
    for (let optionShip of optionsShips) {
        optionShip.style.transform = `rotate(${angle}deg)`;
    }
}

// ================================
// Event Listeners
// ================================
flipButton.addEventListener('click', flip);