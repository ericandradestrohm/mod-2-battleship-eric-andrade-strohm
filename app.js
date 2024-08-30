// ================================
// DOM Queries
// ================================
const gamesBoardContainer = document.getElementById('gamesboard-container');
const optionsContainer = document.querySelector('.options-container');
const flipButton = document.getElementById('flip-button');
const startButton = document.getElementById('start-button')
const infoDisplay = document.getElementById('info-display');
const turnDisplay = document.getElementById('turn-display');
// ================================
// Functions
// ================================
/**
 * Toggles the rotation of all child elements within the optionsContainer
 * between 0 and 90 deg.
 * Called by: `flipButton`
 */
let angle = 0;
function flip() {
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

    for (let i = 0; i < width * width; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.id = i;
        gameBoardContainer.append(block);
    }

    gamesBoardContainer.append(gameBoardContainer);
}

/**
 * Handles checking if placement/generation for pieces is valid.
 * Specifically checks:
 * Is starting index valid
 * Will the ship overflow to a new row
 * Is the piece overlapping with another
 * 
 * Parameters:
 * allBoardBlocks - DOM query for all the board blocks
 * isHorizontal - Is the piece horizontal or vertical
 * startIndex - starting Index for the piece
 * ship - type of ship
 * 
 * Invoked by addShipPiece and highlightArea.
 * 
 * Returns:
 * shipBlocks - location for pieces
 * noOverflow - check for if pieces overflow
 * notTaken - check for it pieces overlap
 */
function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
    // CHECK IF RANDOM START IS TOO CLOSE TO EDGE
    // Sets a valid start position if startIndex is too big/long
    let validStart =
        isHorizontal ?
            startIndex <= width * width - ship.length ?
                startIndex :
                width * width - ship.length
            :
            // if Not Horizontal
            startIndex <= width * width - (ship.length * width) ?
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

    return { shipBlocks, noOverflow, notTaken };
}

/**
 * Places the pieces for the player,
 * For the computer, generates random piece placements
 * Generates a 50-50 on if the ship will be horizontal.
 * The starting index is randomized as a block between 0 and 100.
 * Starting index is adjusted so it doesn't go off the board vertically or horizontally.
 * positions are stored in an array and then validated for positioning (handled by getValidity()).
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
    let isHorizontal = user === 'player' ? (angle === 0 || angle === 180) : randomBoolean;
    // Generates random starting position
    let randomStartIndex = Math.floor(Math.random() * width * width);
    let startIndex = startId ? startId : randomStartIndex;

    const { shipBlocks, noOverflow, notTaken } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);
    // RUNS IF VALID, OTHERWISE LOOPS
    if (noOverflow && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name);
            shipBlock.classList.add('taken');
        })
    } else {
        if (user === 'computer') addShipPiece(user, ship, startId);
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
    const ship = ships[draggedShip.id];
    highlightArea(e.target.id, ship, "over");
}
function dragLeave(e) {
    e.preventDefault();
    const ship = ships[draggedShip.id];
    highlightArea(e.target.id, ship, "leaving");
}
function dropShip(e) {
    const startId = e.target.id;
    const ship = ships[draggedShip.id];
    highlightArea(e.target.id, ship, "leaving");
    addShipPiece('player', ship, startId);
    if (!notDropped) {
        draggedShip.remove();
    }

}

/**
 * Highlights the area where the piece will be dropped.
 * Also handles unhighlighting the area.
 * 
 * Used by dragOver, dropLeave, and dropShip.
 */
function highlightArea(startIndex, ship, dragStatus) {
    const allBoardBlocks = document.querySelectorAll('#player div');
    let isHorizontal = (angle === 0 || angle === 180);

    const { shipBlocks, noOverflow, notTaken } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

    if (noOverflow && notTaken && (dragStatus === 'over')) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add('hover');
            //shipBlock.classList.remove('hover');
        })
    } else {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.remove('hover');
        })
    }
}

// GAME PLAY STARTING AND HANDLING
let gameOver = false;
let playerTurn;
// Starts the game when you click the start button
function startGame() {
    if (optionsContainer.children.length !== 0) {
        infoDisplay.textContent = 'Please place all your pieces first!';
    } else {
        const allBoardBlocks = document.querySelectorAll('#computer div');
        allBoardBlocks.forEach(block => block.addEventListener('click', handleClick));
    }
}

let playerHits = [];
let computerHits = [];
const playerSunkShips = [];
const computerSunkShips = [];
/**
 * Function for handling clicks.
 * Tracks what ship is hit, and marks it as such.
 * It only records the name of the ship that was hit.
 */
function handleClick(e) {
    if (!gameOver) {
        if (e.target.classList.contains('taken') && !e.target.classList.contains('boom')) {
            e.target.classList.add('boom');
            infoDisplay.textContent = "YOU HIT THE COMPUTER"
            let classes = Array.from(e.target.classList);
            classes = classes.filter(className => className !== 'block');
            classes = classes.filter(className => className !== 'boom');
            classes = classes.filter(className => className !== 'taken');
            playerHits.push(...classes);
            checkScore('player', playerHits, playerSunkShips);
        }
        if (!e.target.classList.contains('taken')) {
            infoDisplay.textContent = "You missed!"
            e.target.classList.add('miss');
        }
        playerTurn = false;
        const allBoardBlocks = document.querySelectorAll('#computer div');
        // Removes event listeners
        allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)));
        setTimeout(computerGo, 3000);
    }
}

/**
 * Function to handle computer's turn.
 * turnDisplay and infoDisplay are updated accordingly.
 * Computer 'selects' a random spot on the board. If statement handles logic.
 * After that it passes control back to player. 
 * 
 * Invoked by handleClick
 */
function computerGo() {
    if (!gameOver) {
        turnDisplay.textContent = "Computer's turn";
        infoDisplay.textContent = "Computer is thinking...";
        setTimeout(() => {
            let randomGo = Math.floor(Math.random() * width * width);
            const allBoardBlocks = document.querySelectorAll('#player div');

            // Computer goes again if space picked was already selected.
            if (allBoardBlocks[randomGo].classList.contains('taken') &&
                allBoardBlocks[randomGo].classList.contains('boom')
            ) {
                computerGo();
                return;
            } else if (
                allBoardBlocks[randomGo].classList.contains('taken') &&
                !allBoardBlocks[randomGo].classList.contains('boom')
            ) {
                allBoardBlocks[randomGo].classList.add('boom');
                infoDisplay.textContent = "THE COMPUTER HIT YOUR SHIP!";
                let classes = Array.from(allBoardBlocks[randomGo].classList);
                classes = classes.filter(className => className !== 'block');
                classes = classes.filter(className => className !== 'boom');
                classes = classes.filter(className => className !== 'taken');
                computerHits.push(...classes);
                checkScore('computer', computerHits, computerSunkShips);
            } else {
                infoDisplay.textContent = "MISS!";
                allBoardBlocks[randomGo].classList.add('miss');
            }
            
        }, 2500);

        // Changes turn back to player turn
        setTimeout(() => {
            playerTurn = true;
            turnDisplay.textContent = "Player's turn";
            infoDisplay.textContent = "It's your turn!"
            const allBoardBlocks = document.querySelectorAll('#computer div');
            allBoardBlocks.forEach(block => block.addEventListener('click', handleClick));
        }, 3500);
    }
}

/**
 * Function for updating the score.
 * 
 * Invoked by handleClick and computerGo, after the player and computer take their turns.
 */
function checkScore(user, userHits, userSunkShips) {
    
    // Handles checking which ships got sunk/hit
    function checkShip(shipName, shipLength) {
        if (
            userHits.filter(storedShipName => storedShipName === shipName).length === shipLength
        ) {
            if (user === 'player') {
                playerHits = userHits.filter(storedShipName => storedShipName !== shipName);
                infoDisplay.textContent = `computer's ${shipName} has been sunk!`.toUpperCase();
            }
            if (user === 'computer') {
                computerHits = userHits.filter(storedShipName => storedShipName !== shipName);
                infoDisplay.textContent = `player's ${shipName} has been sunk!`.toUpperCase();
            }
            userSunkShips.push(shipName);
        }
    }

    checkShip('destroyer', 2);
    checkShip('submarine', 3);
    checkShip('cruiser', 3);
    checkShip('battleship', 4);
    checkShip('carrier', 5);
    
    if(playerSunkShips.length === 5) {
        infoDisplay.textContent = "you sunk all all the computer's battleships! You win!".toUpperCase();
        gameOver = true;
    }
    
    if(computerSunkShips.length === 5) {
        infoDisplay.textContent = "the computer sunk all your battleships. you lose".toLowerCase();
        gameOver = true;
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
// DOM Query to grab playerBlocks AFTER they're generated
const allPlayerBlocks = document.querySelectorAll('#player div');
allPlayerBlocks.forEach(playerBlock => {
    playerBlock.addEventListener('dragover', dragOver)
    playerBlock.addEventListener('dragleave', dragLeave)
    playerBlock.addEventListener('drop', dropShip)
});


startButton.addEventListener('click', startGame);