// enemy.js

// Enemy state
export let enemy = {
    x: 350,
    y: 350,
    path: [],
    speed: 1 // Enemy speed
};

// Grid size and map constants (same as main.js)
const TILE_SIZE = 100; // Size of each grid square (tile)
const NUM_COLS = 10;
const NUM_ROWS = 10;
const worldMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// A* Pathfinding algorithm (same as before)
function findPath(startX, startY, targetX, targetY) {
    const openList = [];
    const closedList = [];
    const parentMap = new Map();
    const gScore = new Map();
    const fScore = new Map();

    // Heuristic function (Manhattan Distance)
    function heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    openList.push({ x: startX, y: startY });
    gScore.set(`${startX},${startY}`, 0);
    fScore.set(`${startX},${startY}`, heuristic({ x: startX, y: startY }, { x: targetX, y: targetY }));

    while (openList.length > 0) {
        // Get the node with the lowest fScore
        let current = openList.reduce((lowest, node) => fScore.get(`${node.x},${node.y}`) < fScore.get(`${lowest.x},${lowest.y}`) ? node : lowest);
        if (current.x === targetX && current.y === targetY) {
            // Reconstruct the path
            let path = [];
            while (parentMap.has(`${current.x},${current.y}`)) {
                path.push(current);
                current = parentMap.get(`${current.x},${current.y}`);
            }
            return path.reverse();
        }

        // Move the current node to the closed list
        openList.splice(openList.indexOf(current), 1);
        closedList.push(current);

        // Check neighbors
        const neighbors = [
            { x: current.x + 1, y: current.y }, // right
            { x: current.x - 1, y: current.y }, // left
            { x: current.x, y: current.y + 1 }, // down
            { x: current.x, y: current.y - 1 } // up
        ];

        for (const neighbor of neighbors) {
            if (neighbor.x < 0 || neighbor.x >= NUM_COLS || neighbor.y < 0 || neighbor.y >= NUM_ROWS || worldMap[neighbor.y][neighbor.x] === 1) {
                continue; // Ignore out-of-bound or wall cells
            }

            if (closedList.some(c => c.x === neighbor.x && c.y === neighbor.y)) {
                continue; // Ignore already visited nodes
            }

            const tentativeGScore = gScore.get(`${current.x},${current.y}`) + 1;
            if (!openList.some(o => o.x === neighbor.x && o.y === neighbor.y)) {
                openList.push(neighbor);
            } else if (tentativeGScore >= gScore.get(`${neighbor.x},${neighbor.y}`)) {
                continue; // This path is not better
            }

            parentMap.set(`${neighbor.x},${neighbor.y}`, current);
            gScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore);
            fScore.set(`${neighbor.x},${neighbor.y}`, tentativeGScore + heuristic(neighbor, { x: targetX, y: targetY }));
        }
    }

    return []; // No path found
}

// Move the enemy along the path
export function moveEnemy(playerX, playerY) {
    if (enemy.path.length === 0) {
        // Find a new path if the enemy has no path
        enemy.path = findPath(enemy.x / TILE_SIZE, enemy.y / TILE_SIZE, playerX / TILE_SIZE, playerY / TILE_SIZE);
    }

    if (enemy.path.length > 0) {
        const nextNode = enemy.path[0];
        const targetX = nextNode.x * TILE_SIZE + TILE_SIZE / 2;
        const targetY = nextNode.y * TILE_SIZE + TILE_SIZE / 2;

        // Move towards the next point on the path
        const angleToTarget = Math.atan2(targetY - enemy.y, targetX - enemy.x);
        enemy.x += Math.cos(angleToTarget) * enemy.speed;
        enemy.y += Math.sin(angleToTarget) * enemy.speed;

        // If we are close enough to the target, remove it from the path
        if (Math.abs(enemy.x - targetX) < enemy.speed && Math.abs(enemy.y - targetY) < enemy.speed) {
            enemy.path.shift();
        }
    }
}