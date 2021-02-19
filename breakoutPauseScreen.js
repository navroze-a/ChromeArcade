let startButton = document.getElementById("breakoutStartButton");
let backButton = document.getElementById("returnButton");

console.log("js opened");

backButton.onclick = function(element) {
    console.log("returning from breakout pregame screen to the main menu");
    window.location.href = "index.html";
}

startButton.onclick = function(element) {
    console.log("going from breakout pregame screen to pacman game");
    window.location.href = "breakout.html";
}
