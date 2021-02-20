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
document.body.style.transform = "translateY(20px)";
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
function drawInScoreText(text, x, y) {
    context.fillStyle = "#FFF";
    context.font = "150px arcade_font";
    context.textAlign = "center";
    context.fillText(text, x, y);
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

        drawInScoreText(snake.maxCells, 0.5 * canvas.width, 0.5 * canvas.height);

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
                    if (snake.alive) {
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
        console.log("snake died");
        setTimeout(() => {  gameOver(snake.maxCells); }, 150);
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
    canvas.style.border= "none";

    chrome.storage.sync.get(['snakeHighScore'], function (result) {
        if (score > result.snakeHighScore) {
            chrome.storage.sync.set({ snakeHighScore: score }, function () {
                console.log("set snake high score to" + score);
            });
        }
    });

    // draw the Player score to the right

}

// // listen to keyboard events to move the snake
// document.addEventListener('keydown', function (e) {
//     // prevent snake from backtracking on itself by checking that it's
//     // not already moving on the same axis (pressing left while moving
//     // left won't do anything, and pressing right while moving left
//     // shouldn't let you collide with your own body)
//
//     // left arrow key
//     if (e.which === 37 && snake.dx === 0) {
//         snake.dx = -grid;
//         snake.dy = 0;
//     }
//     // up arrow key
//     else if (e.which === 38 && snake.dy === 0) {
//         snake.dy = -grid;
//         snake.dx = 0;
//     }
//     // right arrow key
//     else if (e.which === 39 && snake.dx === 0) {
//         snake.dx = grid;
//         snake.dy = 0;
//     }
//     // down arrow key
//     else if (e.which === 40 && snake.dy === 0) {
//         snake.dy = grid;
//         snake.dx = 0;
//     }
// });

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
        window.location.href = "snake.html";
    } else if (e.keyCode === KEY.ARROW_LEFT && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.keyCode === KEY.ARROW_UP && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.keyCode === KEY.ARROW_RIGHT && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.keyCode === KEY.ARROW_DOWN && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
    return true;
}

// start the game
requestAnimationFrame(loop);