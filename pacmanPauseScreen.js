let startButton = document.getElementById("pacStartButton");
let backButton = document.getElementById("returnButton");

console.log("js opened");

backButton.onclick = function(element) {
    console.log("returning from pacman pregame screen to the main menu");
    window.location.href = "index.html";
}

startButton.onclick = function(element) {
    console.log("going from pacman pregame screen to pacman game");
    window.location.href = "pacman.html";
}
