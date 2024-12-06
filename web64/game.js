// main.js

import { enemy, moveEnemy } from './enemy.js'; // Import enemy and its moveEnemy function

// Setup canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game constants (default values)
let FOV = Math.PI / 3; // Field of view (60 degrees)
let playerSpeed = 2; // Player movement speed
let rotationSpeed = 0.05; // Speed at which the player turns

// Map layout: 0 = empty, 1 = wall
const worldMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Player state
let player = {
    x: 150, // X position on the map
    y: 150, // Y position on the map
    angle: Math.PI / 4, // Angle the player is facing (45 degrees)
    speed: playerSpeed, // Movement speed
    rotationSpeed: rotationSpeed // Turn speed
};

// Grid size
const TILE_SIZE = 100; // Size of each grid square (tile)
const NUM_COLS = worldMap[0].length;
const NUM_ROWS = worldMap.length;

// Raycasting function (same as before)
function castRays() {
    const numRays = canvas.width; // Number of rays to cast (screen width)
    const rayDistance = 1000; // Maximum distance a ray can travel

    for (let i = 0; i < numRays; i++) {
        let rayAngle = player.angle - FOV / 2 + (i / numRays) * FOV;

        let rayX = player.x;
        let rayY = player.y;
        let distance = 0;

        while (distance < rayDistance) {
            rayX += Math.cos(rayAngle);
            rayY += Math.sin(rayAngle);

            const mapX = Math.floor(rayX / TILE_SIZE); // Convert to grid coordinates
            const mapY = Math.floor(rayY / TILE_SIZE);

            if (worldMap[mapY] && worldMap[mapY][mapX] === 1) {
                distance = Math.sqrt((rayX - player.x) ** 2 + (rayY - player.y) ** 2);
                break;
            }
        }

        const wallHeight = canvas.height / (distance * Math.cos(rayAngle - player.angle));
        const color = "white";
        ctx.fillStyle = color;
        ctx.fillRect(i, (canvas.height - wallHeight) / 2, 1, wallHeight);
    }
}

// Movement functions for player (same as before)
function movePlayer() {
    if (keys.w) {
        player.x += Math.cos(player.angle) * player.speed;
        player.y += Math.sin(player.angle) * player.speed;
    }
    if (keys.s) {
        player.x -= Math.cos(player.angle) * player.speed;
        player.y -= Math.sin(player.angle) * player.speed;
    }
    if (keys.a) {
        player.angle -= player.rotationSpeed;
    }
    if (keys.d) {
        player.angle += player.rotationSpeed;
    }
}

// Display settings and game information (same as before)
function drawInfo() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`FOV: ${(FOV * 180 / Math.PI).toFixed(1)}°`, 10, 30);
    ctx.fillText(`Speed: ${player.speed}`, 10, 60);
    ctx.fillText(`Rotation Speed: ${player.rotationSpeed}`, 10, 90);
    ctx.fillText(`Position: (${Math.floor(player.x)}, ${Math.floor(player.y)})`, 10, 120);
    ctx.fillText(`Enemy Position: (${Math.floor(enemy.x)}, ${Math.floor(enemy.y)})`, 10, 150);
}

// Keyboard controls (same as before)
const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === '1') {
        // Increase FOV
        FOV = Math.min(FOV + 0.05, Math.PI); // Max FOV at 180 degrees
    } else if (e.key === '2') {
        // Increase Player Speed
        player.speed = Math.min(player.speed + 0.1, 5); // Max speed
    } else if (e.key === '3') {
        // Increase Rotation Speed
        player.rotationSpeed = Math.min(player.rotationSpeed + 0.01, 0.2); // Max rotation speed
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// Pause/Settings menu (same as before)
let settingsMenuVisible = false;

function toggleSettingsMenu() {
    settingsMenuVisible = !settingsMenuVisible;
}

function drawSettingsMenu() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Settings Menu', canvas.width / 2 - 100, 100);

    ctx.font = '20px Arial';
    ctx.fillText(`1. FOV: ${(FOV * 180 / Math.PI).toFixed(1)}°`, canvas.width / 2 - 100, 150);
    ctx.fillText(`2. Speed: ${player.speed}`, canvas.width / 2 - 100, 200);
    ctx.fillText(`3. Rotation Speed: ${player.rotationSpeed}`, canvas.width / 2 - 100, 250);
    ctx.fillText('Press 1, 2, or 3 to adjust', canvas.width / 2 - 100, 300);
    ctx.fillText('Press P to close', canvas.width / 2 - 100, 350);
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the screen

    if (settingsMenuVisible) {
        drawSettingsMenu();
    } else {
        castRays(); // Cast rays and draw the world
        movePlayer(); // Move the player
        moveEnemy(player.x, player.y); // Move the enemy along the path
        drawInfo(); // Display info about game settings
    }

    requestAnimationFrame(gameLoop); // Keep the loop going
}

// Start the game
window.addEventListener('keydown', (e) => {
    if (e.key === 'p') {
        toggleSettingsMenu(); // Toggle the settings menu on 'P' press
    }
});

gameLoop();