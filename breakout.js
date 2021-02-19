const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// each row is 14 bricks long. the level consists of 6 blank rows then 8 rows
// of 4 colors: red, orange, green, and yellow

backButton.onclick = function () {
    backButton.style.color = "green";
    backButton.style.background = "pink";
    window.location.href = "index.html";
};

restartButton.onclick = function () {
    backButton.style.color = "green";
    backButton.style.background = "pink";
    window.location.href = "breakout.html";
};

const level1 = [
    [],
    [],
    [],
    [],
    [],
    [],
    ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
    ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
    ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y']
];

// create a mapping between color short code (R, O, G, Y) and color name
const colorMap = {
    'R': 'red',
    'O': 'orange',
    'G': 'green',
    'Y': 'yellow'
};

// use a 2px gap between each brick
const brickGap = 2;
const brickWidth = 25;
const brickHeight = 12;

// the wall width takes up the remaining space of the canvas width. with 14 bricks
// and 13 2px gaps between them, thats: 400 - (14 * 25 + 2 * 13) = 24px. so each
// wall will be 12px
const wallSize = 12;
let lives = 3;
let score = 0;
const bricks = [];

// create the level by looping over each row and column in the level1 array
// and creating an object with the bricks position (x, y) and color
for (let row = 0; row < level1.length; row++) {
    for (let col = 0; col < level1[row].length; col++) {
        const colorCode = level1[row][col];

        bricks.push({
            x: wallSize + (brickWidth + brickGap) * col,
            y: wallSize + (brickHeight + brickGap) * row,
            color: colorMap[colorCode],
            width: brickWidth,
            height: brickHeight
        });

    }
}

const paddle = {
    // place the paddle horizontally in the middle of the screen
    x: canvas.width / 2 - brickWidth / 2,
    y: 440,
    width: 2 * brickWidth,
    height: brickHeight,

    // paddle x velocity
    dx: 0
};

const ball = {
    x: Math.random() * ((canvas.width - wallSize) - (wallSize)) + (wallSize),
    y: 260,
    width: 5,
    height: 5,

    // how fast the ball should go in either the x or y direction
    speed: 2,

    // ball velocity
    dx: 0,
    dy: 0,

    counter: 0
};



// check for collision between two objects using axis-aligned bounding box (AABB)
// @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

// game loop
function loop() {

    if (score >= 448) {
        gameWin();
    } else if (lives > 0) {
        requestAnimationFrame(loop);

        context.clearRect(0, 0, canvas.width, canvas.height);

        // move paddle by it's velocity
        paddle.x += paddle.dx;

        // prevent paddle from going through walls
        if (paddle.x < wallSize) {
            paddle.x = wallSize
        } else if (paddle.x + paddle.width > canvas.width - wallSize) {
            paddle.x = canvas.width - wallSize - paddle.width;
        }

        // move ball by it's velocity
        ball.x += ball.dx;
        ball.y += ball.dy;

        // prevent ball from going through walls by changing its velocity
        // left & right walls
        if (ball.x < wallSize) {
            ball.x = wallSize;
            ball.dx *= -1;
        } else if (ball.x + ball.width > canvas.width - wallSize) {
            ball.x = canvas.width - wallSize - ball.width;
            ball.dx *= -1;
        }
        // top wall
        if (ball.y < wallSize) {
            ball.y = wallSize;
            ball.dy *= -1;
        }

        // reset ball if it goes below the screen
        if (ball.y > canvas.height) {
            ball.x = Math.random() * ((canvas.width - wallSize) - (wallSize)) + (wallSize);
            ball.y = 260;
            ball.dx = 0;
            ball.dy = 0;
            lives--;
            ball.speed = 2;
            ball.counter = 0;
        }


        function drawInScoreText(text, x, y) {
            context.fillStyle = "#FFF";
            context.font = "20px arcade_font";
            context.fillText(text, x, y);
        }

        //End game if 3 lives lost


        // check to see if ball collides with paddle. if they do change y velocity
        if (collides(ball, paddle)) {
            ball.dy *= -1;

            // move ball above the paddle otherwise the collision will happen again
            // in the next frame
            ball.y = paddle.y - ball.height;
        }

        // check to see if ball collides with a brick. if it does, remove the brick
        // and change the ball velocity based on the side the brick was hit on
        for (let i = 0; i < bricks.length; i++) {
            const brick = bricks[i];

            if (collides(ball, brick)) {
                // remove brick from the bricks array
                bricks.splice(i, 1);

                ball.counter++;

                if (brick.color == 'yellow') {
                    console.log("I am" + brick.color);
                    score++;
                } else if (brick.color == 'green') {
                    score += 3;
                    console.log("I am" + brick.color);
                } else if (brick.color == 'orange') {
                    score += 5;
                    console.log("I am" + brick.color);
                } else if (brick.color == 'red') {
                    score += 7;
                    console.log("I am" + brick.color);
                } else {
                    console.log("I am pretty. And beaudtu=iful.");
                }


                console.log("FINAL: Hit brick " + brick.color);



                ball.dx /= ball.speed;
                ball.dy /= ball.speed;
                ball.speed += 0.2;
                ball.dx *= ball.speed;
                ball.dy *= ball.speed;


                // ball is above or below the brick, change y velocity
                // account for the balls speed since it will be inside the brick when it
                // collides
                if (ball.y + ball.height - ball.speed <= brick.y ||
                    ball.y >= brick.y + brick.height - ball.speed) {
                    ball.dy *= -1;

                }
                // ball is on either side of the brick, change x velocity
                else {
                    ball.dx *= -1;

                }




                // let collidePoint = (ball.y - (brick.width + brick.height/2));
                // // normalize the value of collidePoint, we need to get numbers between -1 and 1.
                // // -player.height/2 < collide Point < player.height/2
                // collidePoint = collidePoint / (brick.height/2);
                //
                // // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
                // // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
                // // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
                // // Math.PI/4 = 45degrees
                // let angleRad = (Math.PI/4) * collidePoint;
                //
                // // change the X and Y velocity direction
                // let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
                //
                //
                // if (ball.y + ball.height - ball.speed <= brick.y ||
                //     ball.y >= brick.y + brick.height - ball.speed) {
                //     ball.dy = ball.speed * Math.sin(angleRad);
                //
                // }
                // // ball is on either side of the brick, change x velocity
                // else {
                //     ball.dx = direction * ball.speed * Math.cos(angleRad);
                //
                // }
                //
                // // speed up the ball everytime a paddle hits it.
                // ball.speed += 0.1;

                break;
            }
        }


        // draw walls
        context.fillStyle = 'lightgrey';
        context.fillRect(0, 0, canvas.width, wallSize); //top wall
        context.fillRect(0, 0, wallSize, canvas.height);    // left wall
        context.fillRect(canvas.width - wallSize, 0, wallSize, canvas.height);

        // draw ball if it's moving
        if (ball.dx || ball.dy) {
            context.fillRect(ball.x, ball.y, ball.width, ball.height);
        }

        // draw bricks
        bricks.forEach(function (brick) {
            context.fillStyle = brick.color;
            context.fillRect(brick.x, brick.y, brick.width, brick.height);
        });

        // draw paddle
        context.fillStyle = 'cyan';
        context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

        //draw score

        drawInScoreText(score, 0.05 * canvas.width, 0.97 * canvas.height);
        drawInScoreText(lives, 0.91*canvas.width,  0.97 * canvas.height);
    } else {
        gameOver();
    }
}


function drawText(text, x, y) {
    context.fillStyle = "#FFF";
    context.font = "90px arcade_font";
    context.textAlign = "center";
    context.fillText(text, x, y);
}

function drawScoreText(text, x, y) {
    context.fillStyle = "#ff0000";
    context.font = "120px arcade_font";
    context.textAlign = "center";
    context.fillText(text, x, y);
}



// draw text


function gameWin() {

    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw the GameOver Text in the middle
    drawText("You Won!!", 0.5 * canvas.width, 0.5 * canvas.height);
    drawText("Score", 0.5 * canvas.width, 0.75 * canvas.height);
    drawScoreText(score, 0.5 * canvas.width, 0.975 * canvas.height);
    restartButton.style.visibility = "visible";


}

function gameOver() {

    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw the GameOver Text in the middle
    drawText("Game Over", 0.5 * canvas.width, 0.5 * canvas.height);
    drawText("Score", 0.5 * canvas.width, 0.75 * canvas.height);
    drawScoreText(score, 0.5 * canvas.width, 0.975 * canvas.height);
    restartButton.style.visibility = "visible";

    chrome.storage.sync.get(['breakoutHighScore'], function (result) {
        if (score > result.breakoutHighScore) {
            chrome.storage.sync.set({ breakoutHighScore: score }, function () {
                console.log("set breakout high score to" + score);
            });
        }
    });

    // draw the Player score to the right

}

// listen to keyboard events to move the paddle
document.addEventListener('mousedown', function (e) {
   /* // left arrow key
    if (e.which === 37) {
        paddle.dx = -3;
    }
    // right arrow key
    else if (e.which === 39) {
        paddle.dx = 3;
    } */

    // space key
    // if they ball is not moving, we can launch the ball using the space key. ball
    // will move towards the bottom right to start
    if (ball.dx === 0 && ball.dy === 0) {
        ball.dx = ball.speed;
        ball.dy = ball.speed;
    }
});

// listen to keyboard events to stop the paddle if key is released
document.addEventListener('keyup', function (e) {
    if (e.which === 37 || e.which === 39) {
        paddle.dx = 0;
    }
});

// listening to the mouse
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();

    paddle.x = evt.clientX - wallSize - paddle.width/2;
}

// start the game
requestAnimationFrame(loop);