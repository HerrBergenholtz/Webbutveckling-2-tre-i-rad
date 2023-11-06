let cellElem;
let restartBtn;
let statusText;
let turn;
const xClass = "X";
const oClass = "O";
let running;
let winningMsg;
let winningMsgText;
let normalButton;
let vsComputerButton;
let mode;
let options = ["", "", "", "", "", "", "", "", ""]; //En array som innehåller alla utrymmen där användaren kan placera x och o, när användaren placerar ut x eller o så kommer det att synas på spelplanen men teckent kommer även att sättas in i options arrayen, detta för att kontrollera vinst.
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
]; //Conditions är en array av arrayer, varje array inuti arrayen är ett vilkor för att vinna, numrena representerar positioner i options arrayen, för en condition måste varje av de tre positionerna i option arrayen vara samma tecken för att det ska räknas som en vinst. 

window.onload = () => {
    cellElem = document.querySelectorAll(".cell"); //Väljer alla element med klassen "cell"
    cellElem.forEach(cell => {
        cell.addEventListener("click", clickHandle); //Lägger till en onclick på varje cell element.
    })
    restartBtn = document.getElementById("restartBtn");
    restartBtn.addEventListener("click", restart);
    winningMsg = document.getElementById("resultScreen");
    winningMsgText = document.getElementById("winnerText");
    statusText = document.getElementById("status");
    normalButton = document.getElementById("normalButton");
    normalButton.addEventListener("click", normalMode);
    vsComputerButton = document.getElementById("vsComputerButton")
    vsComputerButton.addEventListener("click", vsComputer);
    turn = xClass; //Det är x som börjar.
    running = true; //Spelet körs.
    mode = "normal";
    statusText.innerHTML = "<p>Det är " + turn + " tur</p>";
    console.log(mode);
}

function normalMode() {
    restart();
    mode = "normal";
}

function vsComputer() {
    restart();
    mode = "computer";
}

function clickHandle() {
    console.log(mode);
    const cellIndex = this.getAttribute("data-cellIndex"); //Deklarerar cellIndex som värdet på attributet data-cellIndex hos det element som klickades, alltså så kommer det bli ett nummer mellan 0-9.

    if (!running || options[cellIndex] != "") { //Kontrollerar att spelet körs så att man inte kan placera när det inte körs och kontrollerar så att options i den positionen som korresponderar till rutan som klickades är tom så att användaren inte placerar flera x eller o på samma ruta.
        return;
    }
    place(this, cellIndex); //place tar this, alltså det element som klickades och cellIndex, som parametrar.
    winControl(); //Kontrollerar vinst efter användaren har placerat.
}

function place(cell, index) {
    options[index] = turn; //Placerar ett x eller o i options arrayen på den position som korresponderar till den rutan som klickades.
    cell.innerHTML = turn; //Skriver ut x eller o i elementet så att användaren ser det i rutnätet.
    console.log("player placed");
}

function winControl() {
    let win = false;
    let winner;
    console.log("wincheck()");

    win = checkWin(); //Kollar först om någon har vunnit.

    if (win) { //Ifall någon har vunnit
        console.log(win);
        winner = turn; //Deklarerar vinnaren till den symbol som vann.
        statusText.innerHTML = "<p>Vinnaren är " + turn + "</p>"; //Skriver ut vinnaren i status texten.
        running = false; //Spelet är över
        displayMessage(winner); //Visar ett meddelande över hela skärmen med den som vinner.
    } else if (!options.includes("")) { //Om det inte finns en vinnare men options inte innehåller några tomma utrymmen så kommer displayMessage() köras fast då kommer den skriva ut att det blev lika 
        console.log("draw");
        displayMessage();
        statusText.innerHTML = "<p>Lika!</p>";
        running = false;
    } else if (mode == "computer") {
        console.log("computerPlace()")
        computerPlace(); 
    } else if (mode == "normal") { //Om ingen har vunnit och det inte är lika så fortsätter spelet och det blir den andra symbolens tur 
        console.log("swapTurns()");
        swapTurns();
    }
    
}

function checkWin() {
    console.log("checkWin()")
    for (let i = 0; i < conditions.length; i++) { //En for-loop som kommer loopa igeonom alla vilkor och kolla om alla korresponderande platser i options är fyllda med samma symbol.
        const winCondition = conditions[i]; //WinCondition deklareras som conditions i positionen av i, alltså så kommer varje loop kolla genom en condition.
        const cell1 = options[winCondition[0]];
        const cell2 = options[winCondition[1]];
        const cell3 = options[winCondition[2]]; //Deklarerar de 3 talen i varje condition array till korresponderande position i options genom att välja options i positionen av den condition array som loopen är på. ("[0, 1, 2]" är de tre talen i varje condition array)

        if (cell1 == "" || cell2 == "" || cell3 == "") { //Ifall någon av cellerna är tomma så kan ingen ha vunnit och då går programmet vidare.
            continue;
        } else if (cell1 == cell2 && cell2 == cell3) { //Om alla celler är lika, alltså de är samma tecken så skickas win = true tillbaka till winControl
            return win = true;
        }
    }
}

function displayMessage(winner) {
    if (winner == xClass || winner == oClass) { //Ifall x eller o vinner så kommer vinst meddelandet att säga "x/o vinner"
        winningMsgText.innerText = winner + " vinner!!";
    } else { //Annars, alltså om det är lika, så kommer meddelande att säga "lika"
        winningMsgText.innerText = "Lika!";
    }
    winningMsg.classList.add("display"); //Lägger till en klass till den div som håller overlayen med meddelandet och restart knappen som gör att en CSS deklaration gäller för den, den deklarationen kommer överskrida nuvarande display som är none och ersätta det med flex (flex anvnds för att lätt och simpelt centrera innehållet.)
}

function swapTurns() {
    if (turn == xClass) { //Om det var x tur så blir det o och om det inte var x tur, alltså o tur så blir det x.
        turn = oClass;
    } else {
        turn = xClass;
    }
    statusText.innerHTML = "<p>Det är " + turn + " tur</p>";
}

function computerPlace() {
    let available = []
    for (let i = 0; i <8; i++) {
        if(options[i] == '') {
            available.push(i);
        }
    }

    console.log(available);
    let computerMove = random(available);
    options[computerMove] = oClass;
    cellElem[computerMove].innerHTML = oClass;
    console.log(computerMove);


    /*let computerPlaced;

    do {
        computerPlaced = Math.floor(Math.random() * 10);
    } while (options[computerPlaced] !== "" ) {
        computerPlaced = Math.floor(Math.random() * 10);
    }
    console.log(computerPlaced);
    options[computerPlaced] = "O";
    cellElem[computerPlaced].innerHTML = "O";
    console.log(options);*/
}

function random(available) {
    console.log("random");
    return Math.floor(Math.random() * available.length);
}

function restart() { //Startar om spelet.
    options = ["", "", "", "", "", "", "", "", ""]; //Tömmer options så att alla positioner är tomma.
    turn = xClass; //Det blir x tur igen.
    statusText.innerHTML = "<p>Det är " + turn + " tur</p>";
    cellElem.forEach(cell => cell.innerHTML = ""); //Tömmer alla cell element på tecken
    winningMsg.classList.remove("display"); //Tar bort display klassen från overlayen så att den återigen får en display av none.
    running = true; //Spelet har börjat igen.
}