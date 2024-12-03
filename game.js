const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = 500;

// Game Variables
let players = [
    { x: 50, y: 400, width: 30, height: 30, color: "red", velocity: 0, score: 0 },
    { x: 100, y: 400, width: 30, height: 30, color: "blue", velocity: 0, score: 0 }
];
let obstacles = [];
let powerUps = [];
let score = 0;
let gameSpeed = 5;
let weather = 0; // 0 = sunny, 1 = rainy, 2 = night
let savedState = null;

// Power-ups
const generatePowerUp = () => {
    const powerUp = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 50),
        width: 30,
        height: 30,
        color: "yellow",
        type: Math.random() > 0.5 ? "shield" : "boost" // Random type
    };
    powerUps.push(powerUp);
};

// Obstacles
const generateObstacle = () => {
    const height = Math.random() * 50 + 20;
    obstacles.push({ 
        x: canvas.width, 
        y: canvas.height - height, 
        width: 20, 
        height, 
        color: "black" 
    });
};

// Draw Functions
const drawPlayer = (player) => {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
};
const drawObstacles = () => {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        obstacle.x -= gameSpeed;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
};
const drawPowerUps = () => {
    powerUps.forEach(powerUp => {
        ctx.fillStyle = powerUp.color;
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        powerUp.x -= gameSpeed;
    });
    powerUps = powerUps.filter(powerUp => powerUp.x + powerUp.width > 0);
};

// Update Functions
const updatePlayer = (player) => {
    if (player.y < canvas.height - player.height) player.velocity += 0.5;
    else player.velocity = 0;
    player.y += player.velocity;
};

const updateGameTime = () => {
    weather += 0.01;
    if (weather >= 3) weather = 0; // Cycle between weather states
    if (weather < 1) {
        canvas.style.background = "linear-gradient(to bottom, #87CEEB, #4CAF50)";
    } else if (weather < 2) {
        canvas.style.background = "linear-gradient(to bottom, #9e9e9e, #607d8b)"; // Rainy
    } else {
        canvas.style.background = "linear-gradient(to bottom, #2c3e50, #34495e)"; // Night
    }
};

// Collision Detection
const checkCollisions = () => {
    players.forEach(player => {
        obstacles.forEach(obstacle => {
            if (player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y) {
                alert("Game Over! Player: " + player.color);
                location.reload();
            }
        });

        powerUps.forEach((powerUp, index) => {
            if (player.x < powerUp.x + powerUp.width &&
                player.x + player.width > powerUp.x &&
                player.y < powerUp.y + powerUp.height &&
                player.y + player.height > powerUp.y) {
                if (powerUp.type === "shield") player.color = "gold";
                else gameSpeed += 2; // Boost
                powerUps.splice(index, 1);
            }
        });
    });
};

// Event Listeners
document.addEventListener("keydown", e => {
    if (e.code === "Space" && players[0].y >= canvas.height - players[0].height) {
        players[0].velocity = -10; // Player 1 jump
    }
    if (e.code === "ArrowUp" && players[1].y >= canvas.height - players[1].height) {
        players[1].velocity = -10; // Player 2 jump
    }
});
canvas.addEventListener("touchstart", () => {
    players[0].velocity = -10; // Touch to jump
});

// Main Game Loop
const updateGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    players.forEach(updatePlayer);
    drawObstacles();
    drawPowerUps();
    players.forEach(drawPlayer);
    updateGameTime();
    checkCollisions();

    // Update scores
    players.forEach(player => player.score++);
    document.getElementById("score").textContent = players[0].score;

    // Spawn obstacles and power-ups
    if (Math.random() < 0.02) generateObstacle();
    if (Math.random() < 0.01) generatePowerUp();
};

// Game Start
setInterval(updateGame, 30);
