const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

// Create the paddle
const paddleWidth = 10;
const paddleHeight = 100;
const player1 = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5,
    score: 0
};

const player2 = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 5,
    score: 0
};

// Create the ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: 4
};

let isPaused = false; // Variable to track game state

// Draw the rectangle (paddle, ball, etc.)
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Draw the ball
function drawBall(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}

// Draw the text (score)
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "32px Arial";
    context.fillText(text, x, y);
}

// Move the paddles based on input
function movePaddles() {
    player1.y += player1.dy;
    player2.y += player2.dy;

    // Prevent paddles from going out of bounds
    player1.y = Math.max(Math.min(player1.y, canvas.height - player1.height), 0);
    player2.y = Math.max(Math.min(player2.y, canvas.height - player2.height), 0);
}

// Move the ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    let ballPastWidthPlayer1 = ball.x - ball.radius < player1.x + player1.width;
    let ballPastHeightPlayer1 = ball.y > player1.y && ball.y < player1.y + player1.height;

    let ballPastWidthPlayer2 = ball.x + ball.radius > player2.x;
    let ballPastHeightPlayer2 = ball.y > player2.y && ball.y < player2.y + player2.height;

    // Ball collision with paddles
    if (ballPastWidthPlayer1 && ballPastHeightPlayer1 ||
        ballPastWidthPlayer2 && ballPastHeightPlayer2
    ) {
        ball.dx *= -1;
    }

    // Update score and reset ball if it goes out of bounds
    if (ball.x - ball.radius < 0) {
        player2.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        resetBall();
    }
}

// Reset the ball to the center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1); // Randomize the direction
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Reset the game
function resetGame() {
    player1.score = 0;
    player2.score = 0;
    resetBall();
}

// Pause the game
function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pauseBtn').textContent = isPaused ? 'Resume' : 'Pause';
}

// Update game elements
function update() {
    if (!isPaused) {
        movePaddles();
        moveBall();
    }
}

// Render game elements
function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawRect(player1.x, player1.y, player1.width, player1.height, '#fff');
    drawRect(player2.x, player2.y, player2.width, player2.height, '#fff');
    drawBall(ball.x, ball.y, ball.radius, '#fff');

    // Draw scores
    drawText(player1.score, canvas.width / 4, canvas.height / 5, '#fff');
    drawText(player2.score, 3 * canvas.width / 4, canvas.height / 5, '#fff');
}

// Game loop
function gameLoop() {
    update();
    render();

    requestAnimationFrame(gameLoop);
}

gameLoop();

// Event listeners for paddle movement
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'w':
            player1.dy = -player1.speed;
            break;
        case 's':
            player1.dy = player1.speed;
            break;
        case 'ArrowUp':
            player2.dy = -player2.speed;
            break;
        case 'ArrowDown':
            player2.dy = player2.speed;
            break;
    }
});

document.addEventListener('keyup', function (event) {
    switch (event.key) {
        case 'w':
        case 's':
            player1.dy = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            player2.dy = 0;
            break;
    }
});

// Event listeners for control buttons
document.getElementById('pauseBtn').addEventListener('click', togglePause);
document.getElementById('resetBtn').addEventListener('click', resetGame);