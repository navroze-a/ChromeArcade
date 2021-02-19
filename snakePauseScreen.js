let startButton = document.getElementById("snakeStartButton");
let backButton = document.getElementById("returnButton");

console.log("js opened");

backButton.onclick = function(element) {
    console.log("returning from snake pregame screen to the main menu");
    window.location.href = "index.html";
}

startButton.onclick = function(element) {
    console.log("going from snake pregame screen to pacman game");
    window.location.href = "snake.html";
}
