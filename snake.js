let backButton = document.getElementById("backButton");
let restartButton = document.getElementById("restartButton");

backButton.onclick = function () {
    backButton.style.color = "green";
    backButton.style.background = "pink";
    window.location.href = "index.html";
};

restartButton.onclick = function () {
    backButton.style.color = "green";
    backButton.style.background = "pink";
    window.location.href = "snake.html";
};

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;

var snake = {
    x: 160,
    y: 160,

    // snake velocity. moves one grid length every frame in either the x or y direction
    dx: grid,
    dy: 0,

    // keep track of all grids the snake body occupies
    cells: [],

    // length of the snake. grows when eating an apple
    maxCells: 4,
    alive: true
};
var apple = {
    x: 320,
    y: 320
};

// get random whole numbers in a specific range
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
    if (snake.alive) {
        requestAnimationFrame(loop);

        // slow game loop to 15 fps instead of 60 (60/15 = 4)
        if (++count < 4) {
            return;
        }

        count = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);

        // move snake by it's velocity
        snake.x += snake.dx;
        snake.y += snake.dy;

        // wrap snake position horizontally on edge of screen
        if (snake.x < 0) {
            // snake.x = canvas.width - grid;
            snake.alive = false;
        }
        else if (snake.x >= canvas.width) {
            // snake.x = 0;
            snake.alive = false;
        }

        // wrap snake position vertically on edge of screen
        if (snake.y < 0) {
            // snake.y = canvas.height - grid;
            snake.alive = false;
        }
        else if (snake.y >= canvas.height) {
            // snake.y = 0;
            snake.alive = false;
        }

        // keep track of where snake has been. front of the array is always the head
        snake.cells.unshift({ x: snake.x, y: snake.y });

        // remove cells as we move away from them
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }

        // draw apple
        context.fillStyle = 'red';
        context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

        // draw snake one cell at a time
        context.fillStyle = 'green';
        snake.cells.forEach(function (cell, index) {

            // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
            context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

            // snake ate apple
            if (cell.x === apple.x && cell.y === apple.y) {
                snake.maxCells++;

                // canvas is 400x400 which is 25x25 grids
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }

            // check collision with all cells after this one (modified bubble sort)
            for (var i = index + 1; i < snake.cells.length; i++) {

                // snake occupies same space as a body part. reset game
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    snake.alive = false;
                    if (alive) {
                        snake.x = 160;
                        snake.y = 160;
                        snake.cells = [];
                        snake.maxCells = 4;
                        snake.dx = grid;
                        snake.dy = 0;
                        apple.x = getRandomInt(0, 25) * grid;
                        apple.y = getRandomInt(0, 25) * grid;
                    }




                }
            }
        });
    } else {    // if dead (snake occupies same space as a body part or a wall)
        console.log("snake died dumbass");
        gameOver(snake.maxCells);
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

function gameOver(score) {

    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // draw the GameOver Text in the middle
    drawText("Game Over", 0.5 * canvas.width, 0.5 * canvas.height);
    drawText("Score", 0.5 * canvas.width, 0.75 * canvas.height);
    drawScoreText(score, 0.5 * canvas.width, 0.975 * canvas.height);
    restartButton.style.visibility = "visible";

    chrome.storage.sync.get(['snakeHighScore'], function (result) {
        if (score > result.snakeHighScore) {
            chrome.storage.sync.set({ snakeHighScore: score }, function () {
                console.log("set snake high score to" + score);
            });
        }
    });

    // draw the Player score to the right

}

// listen to keyboard events to move the snake
document.addEventListener('keydown', function (e) {
    // prevent snake from backtracking on itself by checking that it's
    // not already moving on the same axis (pressing left while moving
    // left won't do anything, and pressing right while moving left
    // shouldn't let you collide with your own body)

    // left arrow key
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    // up arrow key
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // right arrow key
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // down arrow key
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

// start the game
requestAnimationFrame(loop);