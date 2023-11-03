const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Set up the game variables
let snake = [{ x: 10, y: 10 }];
let direction = "right";
let food = {};
let score = 0;
let gameInterval = null;
let isGameOver = false;

// Set up the game board
const boardSize = 20;
const boardWidth = canvas.width / boardSize;
const boardHeight = canvas.height / boardSize;

// Draw the snake on the board
function drawSnake() {
    ctx.fillStyle = "#000";
    snake.forEach((segment) => {
        ctx.fillRect(segment.x * boardSize, segment.y * boardSize, boardSize, boardSize);
    });
}

// Draw the food on the board
function drawFood() {
    ctx.fillStyle = "#F00";
    ctx.fillRect(food.x * boardSize, food.y * boardSize, boardSize, boardSize);
}

// Move the snake on the board
function moveSnake() {
    // Remove the last segment of the snake
    snake.pop();

    // Calculate the new position of the snake's head
    let newHead = { x: snake[0].x, y: snake[0].y };
    if (direction === "right") {
        newHead.x++;
    } else if (direction === "left") {
        newHead.x--;
    } else if (direction === "up") {
        newHead.y--;
    } else if (direction === "down") {
        newHead.y++;
    }

    // Add the new head to the front of the snake
    snake.unshift(newHead);
}

// Check if the snake has collided with the wall or itself
function checkCollision() {
    // Check if the snake has collided with the wall
    if (snake[0].x < 0 || snake[0].x >= boardWidth || snake[0].y < 0 || snake[0].y >= boardHeight) {
        return true;
    }

    // Check if the snake has collided with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Generate a new food location
function generateFood() {
    // Generate random coordinates for the food
    let foodX = Math.floor(Math.random() * boardWidth);
    let foodY = Math.floor(Math.random() * boardHeight);

    // Check if the food has spawned on the snake
    for (let i = 0; i < snake.length; i++) {
        if (foodX === snake[i].x && foodY === snake[i].y) {
            // If the food has spawned on the snake, generate a new location
            return generateFood();
        }
    }

    // Set the food variable to the new location
    food = { x: foodX, y: foodY };
}

// Update the score on the screen
function updateScore() {
    document.getElementById("score").innerHTML = "Score: " + score;
}

// Game loop
function gameLoop() {
    // Move the snake
    moveSnake();

    // Check for collisions
    if (checkCollision()) {
        isGameOver = true;
        clearInterval(gameInterval);
        showMenu();
        return;
    }

    // Check if the snake has eaten the food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        // Increase the score and generate a new food location
        score++;
        generateFood();
        updateScore();// Add a new segment to the snake
        snake.push({});
    }

    // Clear the canvas and redraw the snake and food
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

// Start the game
function startGame() {
    // Reset the game variables
    snake = [{ x: 10, y: 10 }];
    direction = "right";
    food = {};
    score = 0;
    isGameOver = false;

    // Generate the initial food location and update the score
    generateFood();
    updateScore();

    // Start the game loop
    gameInterval = setInterval(gameLoop, 100);
}

// Handle keyboard input
document.addEventListener("keydown", (event) => {
    if (event.keyCode === 37 && direction !== "right") {
        direction = "left";
    } else if (event.keyCode === 38 && direction !== "down") {
        direction = "up";
    } else if (event.keyCode === 39 && direction !== "left") {
        direction = "right";
    } else if (event.keyCode === 40 && direction !== "up") {
        direction = "down";
    }
});

// Show the game over menu
function showMenu() {
    document.getElementById("game-over").style.display = "block";
    document.getElementById("final-score").innerHTML = "Final Score: " + score;
}

// Restart the game
function restartGame() {
    document.getElementById("game-over").style.display = "none";
    startGame();
}

// Start the game on page load
startGame();
