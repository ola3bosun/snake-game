
// Initialization: basically scaling to preserve quality
let CANVAS_WIDTH = 512;
let CANVAS_HEIGHT = 512;

const canvas = document.getElementById('gameCanvas');

const dpr = window.devicePixelRatio || 1;
canvas.width = CANVAS_WIDTH * dpr;
canvas.height = CANVAS_HEIGHT * dpr;

canvas.style.setProperty('width', CANVAS_WIDTH + 'px');
canvas.style.setProperty('height', CANVAS_HEIGHT + 'px');

const ctx = canvas.getContext('2d');
ctx.scale(dpr, dpr); // This is important to ensure everything draws correctly at scale of different displays

// Canvas grid - divides the canvas into a 25 x 25 grid
const cellSize = 20; // Cell size in pixels
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
          difficulty = 10;
          break;
        case 'hard':
          difficulty = 15;
          break;
        case 'insane':
          difficulty = 35;
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
    alert("Game Over! You bit yourself, you fucking cannibal!");
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


// FOR SMALLER DEVICES
// MEDIA QUERIES

const mediaQuery = window.matchMedia('(max-width: 768px)');

if (mediaQuery.matches) {
  console.log("Small screen detected");
} else {
  console.log("Big screen detected");
}

// TOUCH EVENT LISTENERS

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

window.addEventListener('touchstart', function(e) {
    e.preventDefault();
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, {passive : true});

window.addEventListener('touchend', function(e) {
    e.preventDefault();
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeDirection();
}, {passive : true});

function handleSwipeDirection() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    //swipe sensitivity
    const minSwipeDistance = 30; //as in 30 pixels

    //absolute values
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    //to check if swipe was long enough
    if(Math.max(absX, absY) < minSwipeDistance){
        console.log("swipe harder lil bro");
        return;
    }


    // Compare horizontal vs vertical swipe
    if (absX > absY) {
        // Horizontal Swipe
        if (diffX > 0) { // Swipe Right
            // Check if currently moving vertically (direction.x is 0)
            if (direction.x === 0) {
                direction = { x: 1, y: 0 };
                console.log("Swiped Right");
            }
        } else { // Swipe Left
            // Check if currently moving vertically (direction.x is 0)
            if (direction.x === 0) {
                direction = { x: -1, y: 0 };
                console.log("Swiped Left");
            }
        }
    } else {
        // Vertical Swipe
        if (diffY > 0) { // Swipe Down
            // Check if currently moving horizontally (direction.y is 0)
            if (direction.y === 0) {
                direction = { x: 0, y: 1 };
                console.log("Swiped Down");
            }
        } else { // Swipe Up
             // Check if currently moving horizontally (direction.y is 0)
            if (direction.y === 0) {
                direction = { x: 0, y: -1 };
                console.log("Swiped Up");
            }
        }
    }

    // Reset coordinates for next swipe
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
}
