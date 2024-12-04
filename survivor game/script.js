const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    color: 'white',
    speed: 5,
    dx: 0,
    dy: 0,
    health: 100,
    invincible: false,
    attackRadius: 20,
    sprite: new Image()
};
player.sprite.src = 'path/to/player-sprite.png';

let enemies = [];
let powerUps = [];
let score = 0;
let keys = {};
let attackCooldown = false;
let gamePaused = false;
let attackAnimation = null;

function drawPlayer() {
    ctx.drawImage(player.sprite, player.x, player.y, player.size, player.size);
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y - 10, player.size * (player.health / 100), 5);
}

function createEnemy() {
    let size = Math.random() * 20 + 10;
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let health = size * 2; // Enemy health based on size
    let sprite = new Image();
    sprite.src = 'path/to/enemy-sprite.png';
    enemies.push({ x, y, size, speed: Math.random() * 2 + 1, health, sprite });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemy.sprite, enemy.x, enemy.y, enemy.size, enemy.size);
        ctx.fillStyle = 'green';
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.size * (enemy.health / (enemy.size * 2)), 5);
    });
}

function moveEnemies() {
    enemies.forEach(enemy => {
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        enemy.x += (dx / distance) * enemy.speed;
        enemy.y += (dy / distance) * enemy.speed;
    });
}

function detectCollisions() {
    enemies.forEach((enemy, index) => {
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.size / 2 + enemy.size / 2) {
            // Collision detected
            if (!player.invincible) {
                player.health -= 10; // Reduce player health on collision
                score -= 10; // Reduce score on collision
            }
            enemies.splice(index, 1);
            if (player.health <= 0) {
                alert('Game Over');
                document.location.reload();
            }
        }
    });
}

function createPowerUp() {
    let size = 25; // Increased size of power-ups
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let type = Math.random();
    let color;
    if (type < 0.33) {
        color = 'pink'; // Health power-up
    } else if (type < 0.66) {
        color = 'gold'; // Invincibility power-up
    } else {
        color = 'green'; // Attack radius power-up
    }
    powerUps.push({ x, y, size, color, type });
}

function drawPowerUps() {
    powerUps.forEach(powerUp => {
        ctx.fillStyle = powerUp.color;
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.size, powerUp.size);
    });
}

function collectPowerUps() {
    powerUps.forEach((powerUp, index) => {
        let dx = player.x - powerUp.x;
        let dy = player.y - powerUp.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.size / 2 + powerUp.size / 2) {
            // Power-up collected
            if (powerUp.color === 'pink') {
                player.health = Math.min(player.health + 20, 100); // Restore health
            } else if (powerUp.color === 'gold') {
                player.invincible = true;
                setTimeout(() => player.invincible = false, 5000); // Temporary invincibility
            } else if (powerUp.color === 'green') {
                player.attackRadius = 50;
                setTimeout(() => player.attackRadius = 20, 5000); // Increase attack radius temporarily
            }
            powerUps.splice(index, 1);
        }
    });
}

function updateScore() {
    score += 0.1; // Increase score more slowly over time
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + Math.floor(score), 10, 20);
}

function update() {
    if (!gamePaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawEnemies();
        moveEnemies();
        detectCollisions();
        drawPowerUps();
        collectPowerUps();
        updateScore();
        movePlayer();
        if (attackAnimation) {
            drawAttackAnimation();
        }
    }
    requestAnimationFrame(update);
}

function movePlayer() {
    if (keys['ArrowUp']) player.dy = -player.speed;
    if (keys['ArrowDown']) player.dy = player.speed;
    if (keys['ArrowLeft']) player.dx = -player.speed;
    if (keys['ArrowRight']) player.dx = player.speed;

    player.x += player.dx;
    player.y += player.dy;

    // Prevent player from moving out of bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.size > canvas.width) player.x = canvas.width - player.size;
    if (player.y < 0) player.y = 0;
    if (player.y + player.size > canvas.height) player.y = canvas.height - player.size;

    // Reset dx and dy for smooth movement
    player.dx = 0;
    player.dy = 0;
}

function handleKeyDown(e) {
    keys[e.key] = true;
    if (e.key === ' ') {
        if (!attackCooldown) {
            slashAttack();
            attackCooldown = true;
            setTimeout(() => attackCooldown = false, 500); // Cooldown period for attack
        }
    }
    if (e.key === 'Escape') {
        togglePauseMenu();
    }
}

function handleKeyUp(e) {
    keys[e.key] = false;
}

function slashAttack() {
    attackAnimation = { x: player.x, y: player.y, size: player.attackRadius, duration: 10 };
    enemies.forEach((enemy, index) => {
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.attackRadius + enemy.size) {
            enemy.health -= 20; // Reduce enemy health on attack
            if (enemy.health <= 0) {
                enemies.splice(index, 1); // Remove enemy if health is 0
            }
        }
    });
}

function drawAttackAnimation() {
    if (attackAnimation.duration > 0) {
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(attackAnimation.x + player.size / 2, attackAnimation.y + player.size / 2, attackAnimation.size, 0, Math.PI * 2);
        ctx.stroke();
        attackAnimation.duration--;
    } else {
        attackAnimation = null;
    }
}

function togglePauseMenu() {
    gamePaused = !gamePaused;
    document.getElementById('pauseMenu').style.display = gamePaused ? 'block' : 'none';
}

function saveGame() {
    const gameState = {
        player,
        enemies,
        powerUps,
        score
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    alert('Game Saved');
}

function loadGame() {
    const gameState = JSON.parse(localStorage.getItem('gameState'));
    if (gameState) {
        player = gameState.player;
        enemies = gameState.enemies;
        powerUps = gameState.powerUps;
        score = gameState.score;
        alert('Game Loaded');
    } else {
        alert('No saved game found');
    }
}

function openSettings() {
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('settingsMenu').style.display = 'block';
}

function closeSettings() {
    document.getElementById('settingsMenu').style.display = 'none';
    document.getElementById('pauseMenu').style.display = 'block';
}

function applySettings() {
    const gameWidth = document.getElementById('gameWidth').value;
    const gameHeight = document.getElementById('gameHeight').value;
    const playerSpeed = document.getElementById('playerSpeed').value;
    const enemySpeed = document.getElementById('enemySpeed').value;

    canvas.width = gameWidth;
    canvas.height = gameHeight;
    player.speed = parseFloat(playerSpeed);
    enemies.forEach(enemy => enemy.speed = parseFloat(enemySpeed));

    closeSettings();
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

// Create enemies and power-ups at intervals
setInterval(createEnemy, 1000);
setInterval(createPowerUp, 5000);

update();