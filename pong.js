let backButton = document.getElementById("backButton");
let restartButton = document.getElementById("restartButton");

// select canvas element
const canvas = document.getElementById("pong");

// getctx of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

// load sounds
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

backButton.onclick = function () {
    backButton.style.color = "green";
    backButton.style.background = "pink";
    window.location.href = "index.html";
};

restartButton.onclick = function () {
    backButton.style.color = "green";
    backButton.style.background = "pink";
    window.location.href = "pong.html";
};

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "WHITE"
}

// User Paddle
const user = {
    x: 0, // left side of canvas
    y: (canvas.height - 100) / 2, // -100 the height of paddle
    width: 10,
    height: 100,
    score: 0,
    color: "WHITE"
}

// COM Paddle
const com = {
    x: canvas.width - 10, // - width of paddle
    y: (canvas.height - 100) / 2, // -100 the height of paddle
    width: 10,
    height: 100,
    score: 0,
    color: "WHITE"
}

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// listening to the mouse

canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height / 2;
}

/* Human readable keyCode index */
var KEY = { 'BACKSPACE': 8, 'TAB': 9, 'NUM_PAD_CLEAR': 12, 'ENTER': 13, 'SHIFT': 16, 'CTRL': 17, 'ALT': 18, 'PAUSE': 19, 'CAPS_LOCK': 20, 'ESCAPE': 27, 'SPACEBAR': 32, 'PAGE_UP': 33, 'PAGE_DOWN': 34, 'END': 35, 'HOME': 36, 'ARROW_LEFT': 37, 'ARROW_UP': 38, 'ARROW_RIGHT': 39, 'ARROW_DOWN': 40, 'PRINT_SCREEN': 44, 'INSERT': 45, 'DELETE': 46, 'SEMICOLON': 59, 'WINDOWS_LEFT': 91, 'WINDOWS_RIGHT': 92, 'SELECT': 93, 'NUM_PAD_ASTERISK': 106, 'NUM_PAD_PLUS_SIGN': 107, 'NUM_PAD_HYPHEN-MINUS': 109, 'NUM_PAD_FULL_STOP': 110, 'NUM_PAD_SOLIDUS': 111, 'NUM_LOCK': 144, 'SCROLL_LOCK': 145, 'SEMICOLON': 186, 'EQUALS_SIGN': 187, 'COMMA': 188, 'HYPHEN-MINUS': 189, 'FULL_STOP': 190, 'SOLIDUS': 191, 'GRAVE_ACCENT': 192, 'LEFT_SQUARE_BRACKET': 219, 'REVERSE_SOLIDUS': 220, 'RIGHT_SQUARE_BRACKET': 221, 'APOSTROPHE': 222 };

(function () {
    /* 0 - 9 */
    for (var i = 48; i <= 57; i++) {
        KEY['' + (i - 48)] = i;
    }
    /* A - Z */
    for (i = 65; i <= 90; i++) {
        KEY['' + String.fromCharCode(i)] = i;
    }
    /* NUM_PAD_0 - NUM_PAD_9 */
    for (i = 96; i <= 105; i++) {
        KEY['NUM_PAD_' + (i - 96)] = i;
    }
    /* F1 - F12 */
    for (i = 112; i <= 123; i++) {
        KEY['F' + (i - 112 + 1)] = i;
    }
})();

document.addEventListener("keydown", keyDown, true);

function keyDown(e) {

    if (e.keyCode === KEY.BACKSPACE) {
        window.location.href = "index.html";
    } else if (e.keyCode === KEY.R) {
        window.location.href = "pong.html";
    }
    return true;
}

// when COM or USER scores, we reset the ball
function resetBall() {
    ball.x = canvas.width * 0.25;
    ball.y = canvas.height / 2;
    // ball.velocityX = -ball.velocityX;
    ball.velocityY = 0;
    ball.speed = 7;
}


// draw text
function drawText(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "120px arcade_font";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

function drawScoreText(text, x, y) {
    ctx.fillStyle = "#ff0000";
    ctx.font = "150px arcade_font";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}


// collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left <= b.right && p.top <= b.bottom && p.right >= b.left && p.bottom >= b.top;
}

// update function, the function that does all calculations
function update() {
    console.log(ball.speed);
    // change the score of players, if the ball goes to the left "ball.x<0" computer win, else if "ball.x > canvas.width" the user win
    if (ball.x - ball.radius < 0) {
        com.score++;
        // comScore.play();
        // comScore.pause();
        //resetBall();
        console.log("com got point");
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        //userScore.play();
        resetBall();
        console.log("player got point");
    }

    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // computer plays for itself, and we must be able to beat it
    // simple AI
    com.y += ((ball.y - (com.y + com.height / 2))) * 0.1;

    // when the ball collides with bottom and top walls we inverse the y velocity.
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;

        if (ball.y < canvas.height / 2) {   // top
            ball.y = 1 + ball.radius;
        } else {    // bottom
            ball.y = canvas.height - ball.radius;
        }
        // wall.play();
    }

    // we check if the paddle hit the user or the com paddle
    let player = (ball.x + ball.radius < canvas.width / 2) ? user : com;

    // if the ball hits a paddle
    if (collision(ball, player)) {
        console.log("collides");
        // play sound
        // hit.play();
        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height / 2)); // y coord of collision (based on middle of ball)
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height / 2);
        //ball.y = paddle.y - ball.height;

        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI / 4) * collidePoint;

        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;   // chooses if it goes left or right depending on which side of screen ball is on
        console.log(direction);
        // direction == -1: abt to hit com
        // direction == 1: abt to hit player
        // Ensure the ball is now outside
        if (direction == -1) {    // hitting com
            ball.x = player.x - ball.radius;
        } else {
            ball.x = player.x + player.width + ball.radius;
        }

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);



        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.4;
    }

}

// render function, the function that does al the drawing
function render() {

    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    // draw the user score to the left
    drawText(user.score, canvas.width / 4, canvas.height / 5);

    // draw the COM score to the right
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);



    // draw the user's paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);

    // draw the COM's paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function gameOver() {

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the GameOver Text in the middle
    drawText("Game Over", 0.5 * canvas.width, 0.5 * canvas.height);
    drawText("Score", 0.5 * canvas.width, 0.75 * canvas.height);
    drawScoreText(user.score, 0.5 * canvas.width, 0.99 * canvas.height);
    restartButton.style.visibility = "visible";

    chrome.storage.sync.get(['pongHighScore'], function (result) {
        if (user.score > result.pongHighScore) {
            chrome.storage.sync.set({ pongHighScore: user.score }, function () {
                console.log("set pong high score to" + user.score);
            });
        }
    });

    // draw the Player score to the right

}

function game() {
    if (com.score < 1) {
        update();
        render();
    } else {
        gameOver();
    }
}
// number of frames per second
let framePerSecond = 50;

//call the game function 50 times every 1 Sec
let loop = setInterval(game, 1000 / framePerSecond);




function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}