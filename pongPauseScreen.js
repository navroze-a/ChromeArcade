let startButton = document.getElementById("pongStartButton");
let backButton = document.getElementById("returnButton");

console.log("js opened");

backButton.onclick = function(element) {
    console.log("returning from pong pregame screen to the main menu");
    window.location.href = "index.html";
}

startButton.onclick = function(element) {
    console.log("going from pong pregame screen to pacman game");
    window.location.href = "pong.html";
}
