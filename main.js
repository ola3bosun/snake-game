
// ------- Initialization: basically scaling to preserve quality -------
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;

const canvas = document.getElementById('gameCanvas');

const dpr = window.devicePixelRatio || 1;
canvas.width = CANVAS_WIDTH * dpr;
canvas.height = CANVAS_HEIGHT * dpr;

canvas.style.setProperty('width', CANVAS_WIDTH + 'px');
canvas.style.setProperty('height', CANVAS_HEIGHT + 'px');

const ctx = canvas.getContext('2d');
ctx.scale(dpr, dpr); // This is important to ensure everything draws correctly at scale of different displays

// Canvas grid - divides the canvas into a 25 x 25 grid
const cellSize = 16; // Cell size in pixels
const rows = Math.floor(CANVAS_HEIGHT / cellSize);
const columns = Math.floor(CANVAS_WIDTH / cellSize);




// Snake initialization
let snake = [
  { x: 10, y: 10 }, // Head
  { x: 9, y: 10 },  // Body
  { x: 8, y: 10 },  // Tail
];

let score = 0;
// Snake movement
let direction = { x: 1, y: 0 }; // Moving right initially

// Key press event listener
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
    case "s":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
    case "a":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
    case "d":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
}); // snake can't reverse, its a freaking snake not fucking Ayo & Teo


function updateScore() {
    const scoreDiv = document.getElementById('score');
    if (scoreDiv) {
      scoreDiv.innerText = score;
    }
}

// Game loop setup
let lastRenderTime = 0;
let difficulty = 25;
let snakeSpeed = difficulty; // moves per second - create difficulty levels by increasing snake speed
const popUp = document.getElementById('pop-up');

const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.addEventListener('click', function () {
      const level = button.textContent.toLowerCase();
  
      switch(level) {
        case 'easy':
          difficulty = 25;
          break;
        case 'hard':
          difficulty = 40;
          break;
        case 'insane':
          difficulty = 60;
          break;
      }
  
      snakeSpeed = difficulty;
      popUp.style.visibility = 'hidden';
    });
  });
  
 window.addEventListener('keydown', function(e){
    if (e.key === 'p' || e.key === 'P' || e.key === ' '){
        difficulty = 0;
        popUp.style.visibility = 'visible';
    }
 });

 function gameLoop(currentTime) {
    if (gamePaused) return;
  
    window.requestAnimationFrame(gameLoop);
  
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / snakeSpeed) return;
  
    lastRenderTime = currentTime;
  
    update();
    draw();
  }
  

function update() {
  moveSnake();
  // Collision and apple logic handled in moveSnake()
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears the canvas before redrawing
  drawSnake();
  drawApple();
}

// Apple drawing function
function drawApple() {
  ctx.fillStyle = 'red'; // Color
  ctx.fillRect(apple.x * cellSize, apple.y * cellSize, cellSize, cellSize); // Location
}

// Snake drawing function
function drawSnake() {
  ctx.fillStyle = 'limegreen';
  snake.forEach(part => {
    ctx.fillRect(part.x * cellSize, part.y * cellSize, cellSize, cellSize);
  });
}

// Apple spawning
let apple = appleSpawn();

function appleSpawn() {
  const foodX = Math.floor(Math.random() * columns); // Multiply by columns
  const foodY = Math.floor(Math.random() * rows);    // Multiply by rows
  return { x: foodX, y: foodY }; // Return as {x, y}
}

// Snake movement logic
function moveSnake() {
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  // Screen wrapping
  if (head.x >= columns) {
    head.x = 0;
  }
  if (head.x < 0) {
    head.x = columns - 1;
  }
  if (head.y >= rows) {
    head.y = 0;
  }
  if (head.y < 0) {
    head.y = rows - 1;
  }

  // Self-collision detection (moved inside moveSnake)
  if (snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)) {
    alert("Game Over! You ate yourself, you fucking cannibal! 🐍");
    resetGame();
    return; // Exit moveSnake so further processing doesn't occur
  }

  // Food collision detection
  if (head.x === apple.x && head.y === apple.y) {
    snake.push({ ...snake[snake.length - 1] }); // Increase snake length (clone last segment)
    apple = appleSpawn(); // Spawn a new apple
    score++;               // Increment score
    updateScore();         // Update the score display
  }
  snake.unshift(head); // Add new head
  snake.pop(); // Remove the tail
}

// Resetting game
function resetGame() {
  // Reset the snake and apple to initial states
  snake = [
    { x: 10, y: 10 }, // Head
    { x: 9, y: 10 },  // Body
    { x: 8, y: 10 }   // Tail
  ];
  direction = { x: 1, y: 0 }; // Reset direction to right
  apple = appleSpawn();// New apple
  score = 0;// Reset score to 0
  updateScore();  // Update the score display
}

// Start the game loop
requestAnimationFrame(gameLoop);

let gamePaused = false;

window.addEventListener('keydown', function(e) {
  if (e.key === 'p' || e.key === 'P' || e.key === ' ') {
    gamePaused = !gamePaused;

    if (gamePaused) {
      popUp.style.visibility = 'visible';
    } else {
      popUp.style.visibility = 'hidden';
      requestAnimationFrame(gameLoop); // Resume loop
    }
  }
});
