let cellElem;
let board;
let restartBtn;
let statusText;
let turn = "X";
let running;
const options = ["", "", "", "", "", "", "", "", ""];
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
        cell.addEventListener("click", clickHandle, {once: true});
    })
    board = document.getElementById("board");
    restartBtn = document.getElementById("restartBtn");
    statusText = document.getElementById("status");
    statusText.innerHTML = "<p>Det är " + turn + " tur</p>";
    running = true
}

function clickHandle () {
    const cellIndex = this.getAttribute("cellIndex");
    place(this, cellIndex);
}

function place(cell, index) {
    options[index] = turn;
    cell.innerHTML = turn;
    swapTurns();
    winControl();
}

function swapTurns () {
    turn = (turn == "X") ? "O" : "X";
    statusText.innerHTML = "<p>Det är "+ turn +" tur</p>";
}

function winControl () {
    let win = false;

    for (let i = 0; i < conditions.length; i++) {
        const winCondition = conditions[i];
        const cell1 = options[winCondition[0]];
        const cell2 = options[winCondition[1]];
        const cell3 = options[winCondition[2]];

        if (cell1 == "" || cell2 == "" || cell3 == "") {
            continue;
        }
        if (cell1 == cell2 && cell2 == cell3) {
            win = true;
            break;
        }
    }
    if (win) {
        statusText.innerHTML = "<p>Vinnaren är " + turn +"</p>";
        running = false
    } else if (!options.includes("")) {
        statusText.innerHTML = "<p>Lika!</p>";
    } else {
        swapTurns();
    }
}

function restart() {
    console.log("restar");
}