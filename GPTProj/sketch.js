const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.style.background = 'radial-gradient(circle, #000428, #004e92)';

let particles = [];
let enemies = [];
let bullets = [];
let score = 0;
let gameOver = false;
const keys = {};
let enemySpeedMultiplier = 1;
let starField = [];

// Constants
const CHARACTER_SIZE = 20;
const CHARACTER_SPEED = 6;
const BULLET_SPEED = 7;
const BULLET_SIZE = 5;
const ENEMY_SIZE = 30;
const ENEMY_BASE_SPEED = 1;
const STAR_COUNT = 100;
const ENEMY_SPAWN_INTERVAL = 2000; // Spawn an enemy every 2 seconds
const ENEMY_EMOJI = '👾';
const BULLET_EMOJI = '🔥';
const CHARACTER_EMOJI = '🚀';

// Initialize Starfield
for (let i = 0; i < STAR_COUNT; i++) {
    starField.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.5,
    });
}

// Character Object
const character = {
    x: canvas.width / 2,
    y: canvas.height - CHARACTER_SIZE - 10,
    size: CHARACTER_SIZE,
    speed: CHARACTER_SPEED,
    dx: 0,
    dy: 0,
};

// Particle Pool
class Particle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.color = '';
        this.alpha = 1;
    }

    initialize(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.color = color;
        this.alpha = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.02;
        if (this.alpha < 0) this.alpha = 0;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class ObjectPool {
    constructor(type, maxSize) {
        this.pool = [];
        this.maxSize = maxSize;
        for (let i = 0; i < maxSize; i++) {
            this.pool.push(new type());
        }
    }

    get(x, y, color) {
        if (this.pool.length) {
            const obj = this.pool.pop();
            obj.initialize(x, y, color);
            return obj;
        }
        return new Particle(x, y, color);
    }

    release(obj) {
        if (this.pool.length < this.maxSize) this.pool.push(obj);
    }
}

const particlePool = new ObjectPool(Particle, 300);

// Enemy Class
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = ENEMY_SIZE;
        this.speed = Math.random() * ENEMY_BASE_SPEED + enemySpeedMultiplier;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = -this.size;
            this.x = Math.random() * (canvas.width - this.size);
        }
    }

    draw() {
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(ENEMY_EMOJI, this.x + this.size / 2, this.y + this.size);
    }
}

// Bullet Class
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = BULLET_SIZE;
        this.speed = BULLET_SPEED;
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.font = `${this.size * 2}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(BULLET_EMOJI, this.x + this.size / 2, this.y);
    }
}

// Functions
function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    starField.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function createExtravagantExplosion(x, y) {
    const colors = ['red', 'orange', 'yellow', 'white'];
    for (let i = 0; i < 50; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(particlePool.get(x, y, color));
    }
}

function updateParticles() {
    particles = particles.filter(particle => {
        if (particle.alpha > 0) {
            particle.update();
            particle.draw();
            return true;
        }
        particlePool.release(particle);
        return false;
    });
}

function spawnEnemiesContinuously() {
    setInterval(() => {
        if (!gameOver) {
            enemies.push(new Enemy(Math.random() * canvas.width, Math.random() * -canvas.height));
        }
    }, ENEMY_SPAWN_INTERVAL);
}

function updateEnemies() {
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();
        enemy.draw();

        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + enemy.size &&
                bullet.x + bullet.size > enemy.x &&
                bullet.y < enemy.y + enemy.size &&
                bullet.y + bullet.size > enemy.y
            ) {
                createExtravagantExplosion(enemy.x + enemy.size / 2, enemy.y + enemy.size / 2);
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
                score++;
                enemySpeedMultiplier += 0.01; // Increase difficulty
            }
        });

        if (
            character.x < enemy.x + enemy.size &&
            character.x + character.size > enemy.x &&
            character.y < enemy.y + enemy.size &&
            character.y + character.size > enemy.y
        ) {
            gameOver = true;
        }
    });
}

function updateBullets() {
    bullets = bullets.filter(bullet => bullet.y > 0);
    bullets.forEach(bullet => {
        bullet.update();
        bullet.draw();
    });
}

function drawCharacter() {
    ctx.font = `${CHARACTER_SIZE * 2}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(CHARACTER_EMOJI, character.x + character.size / 2, character.y + character.size);
}

function moveCharacter() {
    character.x += character.dx;
    character.y += character.dy;
    if (character.x < 0) character.x = 0;
    if (character.y < 0) character.y = 0;
    if (character.x + character.size > canvas.width) character.x = canvas.width - character.size;
    if (character.y + character.size > canvas.height) character.y = canvas.height - character.size;
}

function handleKeys() {
    if (keys['ArrowUp']) character.dy = -character.speed;
    else if (keys['ArrowDown']) character.dy = character.speed;
    else character.dy = 0;

    if (keys['ArrowLeft']) character.dx = -character.speed;
    else if (keys['ArrowRight']) character.dx = character.speed;
    else character.dx = 0;
}

function shootBullet() {
    bullets.push(new Bullet(character.x + character.size / 2 - 2.5, character.y));
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 50);
}

function resetGame() {
    score = 0;
    gameOver = false;
    enemies = [];
    bullets = [];
    particles = [];
    enemySpeedMultiplier = 1;
    spawnEnemiesContinuously();
}

function animate() {
    drawBackground();

    if (gameOver) {
        drawGameOver();
        return;
    }

    handleKeys();
    moveCharacter();
    drawCharacter();
    updateParticles();
    updateBullets();
    updateEnemies();
    drawScore();

    requestAnimationFrame(animate);
}

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') shootBullet();
    if (e.key === 'r' && gameOver) resetGame();
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    starField = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        starField.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.5,
        });
    }
});

spawnEnemiesContinuously();
animate();