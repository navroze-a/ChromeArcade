let missleCommandButton = document.getElementById("missleCommanderButton");
let scoreButton = document.getElementById("scoreButton");

let pacmanButton = document.getElementById("pacmanButton");
let pongButton = document.getElementById("pongButton");
let breakoutButton = document.getElementById("breakoutButton");
let snakeButton = document.getElementById("snakeButton");


pacmanButton.onclick = function(element) {
    console.log("pacman game button clicked");
    window.location.href = "pacmanPauseScreen.html";
}

pongButton.onclick = function(element) {
    console.log("pong game button clicked");
    window.location.href = "pongPauseScreen.html";
}

breakoutButton.onclick = function(element) {
    console.log("breakout game button clicked");
    window.location.href = "breakoutPauseScreen.html";
}

snakeButton.onclick = function(element) {
    console.log("snake game button clicked");
    window.location.href = "snakePauseScreen.html";
}

scoreButton.onmouseover = function (element) {


    console.log("showing scores");

    chrome.storage.sync.get(['pacmanHighScore'], function (result) {
        console.log('Pacman score currently is ' + result.pacmanHighScore + 'and is being displayed');
        document.getElementById("pacmanButton").innerHTML = result.pacmanHighScore;
    });

    chrome.storage.sync.get(['pongHighScore'], function (result) {
        console.log('Pong score currently is ' + result.pongHighScore + 'and is being displayed');
        document.getElementById("pongButton").innerHTML = result.pongHighScore;
    });

    chrome.storage.sync.get(['breakoutHighScore'], function (result) {
        console.log('Breakout score currently is ' + result.breakoutHighScore + 'and is being displayed');
        document.getElementById("breakoutButton").innerHTML = result.breakoutHighScore;
    });

    chrome.storage.sync.get(['snakeHighScore'], function (result) {
        console.log('snake score currently is ' + result.snakeHighScore + 'and is being displayed');
        document.getElementById("snakeButton").innerHTML = result.snakeHighScore;
    });
};

scoreButton.onmouseout = function (element) {
    console.log("back to main screen");

    pacmanButton.innerHTML = "PACMAN";
    pongButton.innerHTML = "PONG";
    breakoutButton.innerHTML = "BREAKOUT";
    snakeButton.innerHTML = "SNAKE";
};

// icon comes from https://www.vecteezy.com/vector-art/120089-arcade-button-vector