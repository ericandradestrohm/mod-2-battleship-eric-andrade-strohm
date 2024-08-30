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
    angle = angle === 270 ? 0 : angle + 90;
    //angle = angle === 0 ? 90 : 0;
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

/**
 * Places the pieces for the player,
 * For the computer, generates random piece placements
 * Generates a 50-50 on if the ship will be horizontal.
 * The starting index is randomized as a block between 0 and 100.
 * Starting index is adjusted so it doesn't go off the board vertically or horizontally.
 * positions are stored in an array and then validated for positioning.
 * Runs again if placement is invalid or overlaps.
 * 
 * Parameter:
 * user - player or CPU
 * ship - The ship Object
 * startId - ID of the piece
 * 
 * Invoked when creating ship placements.
 */
function addShipPiece(user, ship, startId) {
    const allBoardBlocks = document.querySelectorAll(`#${user} div`);
    // 50-50 on true or false
    let randomBoolean = Math.random() < 0.5;
    let isHorizontal = user === 'player' ? (angle === 0 || angle === 180): randomBoolean;
    // Generates random starting position
    let randomStartIndex = Math.floor(Math.random() * width * width);
    let startIndex = startId ? startId : randomStartIndex;

    // CHECK IF RANDOM START IS TOO CLOSE TO EDGE
    // Sets a valid start position if startIndex is too big/long
    let validStart = 
        isHorizontal ? 
            startIndex <= width * width - ship.length ? 
                startIndex : 
                width * width - ship.length 
            : 
        // if Not Horizontal
        startIndex <= width * width - (ship.length*width) ?
            startIndex :
            startIndex - (ship.length * width) + width;
    
    // STORE PIECES INTO ARRAY
    let shipBlocks = [];
    // Loops to place ship blocks
    for (let i = 0; i < ship.length; i++) {
        if (isHorizontal) {
            // Selects the board pieces and 'converts' to make sure randomStartIndex is a number
            shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
            
        } else {
            shipBlocks.push(allBoardBlocks[Number(validStart) + (i * width)]);
        }
    }
    
    // CHECK TO MAKE SURE PIECES DON'T OVERFLOW TO NEW ROW
    let noOverflow = true;
    if (isHorizontal) {
        /*
        if horizontal, check that each piece doesn't equal a spot that will overflow
        shipBlocks[0].id % width = column that the piece is in
        shipBlocks.length - (index + 1) will help iterate through each piece; index helps it count
        width - (shipBlocks.length - (index + 1)) will go through each column that the starting position can't be
        */ 
        noOverflow = shipBlocks.every((_shipBlock, index) => shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)))
    }
    // CHECK TO MAKE SURE PIECES DON'T OVERLAP WITH ANOTHER PIECE
    const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'));

    // RUNS IF VALID, OTHERWISE LOOPS
    if(noOverflow && notTaken){
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name);
            shipBlock.classList.add('taken');
        })
    } else {
        if (user === 'computer') addShipPiece(user, ship);
        if (user === 'player') notDropped = true;
    }
}

// Player functions
let draggedShip;
const optionShips = Array.from(optionsContainer.children);
let notDropped;

function dragStart(e) {
    notDropped = false;
    draggedShip = e.target;
}
function dragOver(e) {
    e.preventDefault();

}
function dropShip(e) {
    const startId = e.target.id;
    const ship = ships[draggedShip.id];
    console.log(e.id);
    addShipPiece('player', ship, startId);
    if (!notDropped) {
        draggedShip.remove();
    }
}
// ================================
// Constructors
// ================================
class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
    }
}
// ================================
// Objects
// ================================
const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

// Array of ship Objects
const ships = [destroyer, submarine, cruiser, battleship, carrier];

// ================================
// Function Calls
// ================================
// Create Board
createBoard('#7fbcc7', 'player');
createBoard('#98d0e0', 'computer');

ships.forEach(ship => addShipPiece('computer', ship));

// ================================
// Event Listeners
// ================================
flipButton.addEventListener('click', flip);

// For dragging player ships
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart));
// DOM Query to grab playerblocks AFTER they're generated
const allPlayerBlocks = document.querySelectorAll('#player div');
allPlayerBlocks.forEach(playerBlock => {
    playerBlock.addEventListener('dragover', dragOver)
    playerBlock.addEventListener('drop', dropShip)
});
console.log(allPlayerBlocks)