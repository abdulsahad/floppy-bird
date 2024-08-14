const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let frames = 0;
let pipes = [];
let gameInterval;
let gameOver = false;
let score = 0;
const bird = {
    x: 50,
    y: 150,
    width: 68,
    height: 48,
    gravity: 0.3,
    lift: -4,
    velocity: 0,
    img: new Image()
};
bird.img.src = 'bird.png';

let gap;
let pipeSpeed;

function startGame(difficulty) {
    document.getElementById('difficulty').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frames = 0;
    score = 0;
    gameOver = false;
    if (difficulty === 'Easy') {
        gap = 260;
        pipeSpeed = 2;
    } else if (difficulty === 'Hard') {
        gap = 195;
        pipeSpeed = 3;
    } else if (difficulty === 'Advanced') {
        gap = 130;
        pipeSpeed = 4;
    }
    countdown();
}

function countdown() {
    let count = 3;
    const countdownInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = '48px Arial';
        ctx.fillText(count, canvas.width / 2 - 20, canvas.height / 2);
        count--;
        if (count < 0) {
            clearInterval(countdownInterval);
            gameInterval = setInterval(updateGame, 1000 / 60);
        }
    }, 1000);
}

function updateGame() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    checkCollision();
    drawScore();
    if (gameOver) {
        clearInterval(gameInterval);
        displayGameOver();
    }
}

function drawBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    ctx.drawImage(bird.img, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    if (frames % 100 === 0) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height - gap));
        pipes.push({ x: canvas.width, y: pipeHeight });
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        ctx.fillStyle = 'green';
        const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + 50, 0);
        gradient.addColorStop(0, 'darkgreen');
        gradient.addColorStop(1, 'lightgreen');
        ctx.fillStyle = gradient;

        ctx.fillRect(pipe.x, 0, 50, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + gap, 50, canvas.height - pipe.y - gap);

        if (pipe.x + 50 < 0) {
            pipes.shift();
            score++;
        }
    });
}

function checkCollision() {
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    pipes.forEach(pipe => {
        if (bird.x < pipe.x + 50 && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + gap)) {
            gameOver = true;
        }
    });
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function displayGameOver() {
    if (!gameOver) {
        return;
    }
    ctx.fillStyle = 'red';
    ctx.font = '48px Arial';
    // ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
    document.getElementById('restart').style.display = 'block';
}

function restartGame() {
    document.getElementById('restart').style.display = 'none';
    document.getElementById('difficulty').style.display = 'block';
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameOver) {
        bird.velocity = bird.lift;
    }
});
