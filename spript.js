let cellElem;
let restartBtn;
let statusText;
let turn;
const xClass = "X";
const oClass = "O";
let running;
let winningMsg;
let winningMsgText;
let options = ["", "", "", "", "", "", "", "", ""];
/*
[0, 1 ,2]
[3, 4, 5]
[6, 7, 8]
*/
const conditions = [
    [0, 1, 2], 
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
];

window.onload = () => {
    cellElem = document.querySelectorAll(".cell");
    cellElem.forEach(cell => {
        cell.addEventListener("click", clickHandle);
    })
    restartBtn = document.getElementById("restartBtn");
    restartBtn.addEventListener("click", restart);
    winningMsg = document.getElementById("resultScreen");
    winningMsgText = document.getElementById("winnerText");
    statusText = document.getElementById("status");
    turn = xClass;
    statusText.innerHTML = "<p>Det är " + turn + " tur</p>";
    running = true;
}

function clickHandle () {
    const cellIndex = this.getAttribute("cellIndex");
    
    if (!running || options[cellIndex] != "") {
        return;
    }
    place(this, cellIndex);
    winControl();
}

function place(cell, index) {
    options[index] = turn;
    cell.innerHTML = turn;
}

function winControl () {
    let win = false;
    let winner;
    
    win = checkWin();
    
    if (win) {
        winner = turn;
        statusText.innerHTML = "<p>Vinnaren är " + turn +"</p>";
        running = false;
        displayMessage(winner);
    } else if (!options.includes("")) {
        displayMessage(winner);
        statusText.innerHTML = "<p>Lika!</p>";
    } else {
        swapTurns();
    }
}

function checkWin() {
    for (let i = 0; i < conditions.length; i++) {
        const winCondition = conditions[i];
        const cell1 = options[winCondition[0]];
        const cell2 = options[winCondition[1]];
        const cell3 = options[winCondition[2]];
        
        if (cell1 == "" || cell2 == "" || cell3 == "") {
            continue;
        } else if (cell1 == cell2 && cell2 == cell3) {
            return win = true;
        }
    }
}

function displayMessage(winner) {
    if (winner == xClass || winner == oClass) {
        winningMsgText.innerText = winner + " vinner!!";
    } else {
        winningMsgText.innerText = "Lika!";
    }
    winningMsg.classList.add("display");
}

function swapTurns () {
    turn = (turn == xClass) ? oClass : xClass;
    statusText.innerHTML = "<p>Det är "+ turn +" tur</p>";
}

function restart() {
    options = ["", "", "", "", "", "", "", "", ""];
    turn = xClass;
    statusText.innerHTML = "<p>Det är " + turn + " tur</p>";
    cellElem.forEach(cell => cell.innerHTML = "");
    winningMsg.classList.remove("display")
    running = true;
}