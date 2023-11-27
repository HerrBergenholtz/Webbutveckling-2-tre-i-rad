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
    document.addEventListener("keydown", konami);
    turn = xClass; //Det är x som börjar.
    running = true; //Spelet körs.
    mode = "normal";
    statusText.innerHTML = "<p>Det är " + turn + " tur</p>";
}

function normalMode() { //När man väljer normal mode så startas spelet om och mode = norman.
    restart();
    mode = "normal";
    statusText.innerHTML = "<p>Det är " + turn + " tur</p>";
}

function vsComputer() { //När man väljer vscomputer mode så startas spelet om och mode = computer.
    restart();
    mode = "computer";
    statusText.innerHTML = "<p>Du kör mot datorn, lycka till!</p>";
}

function clickHandle() { //Hanterar klick av användaren.
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
}

function winControl() { //Kontrollerar vinst.
    let win = false;
    let winner;
    win = checkWin(); //Kollar först om någon har vunnit.

    if (win) { //Ifall någon har vunnit
        winner = turn; //Deklarerar vinnaren till den symbol som vann.
        statusText.innerHTML = "<p>Vinnaren är " + turn + "</p>"; //Skriver ut vinnaren i status texten.
        running = false; //Spelet är över.
        displayMessage(winner); //Visar ett meddelande över hela skärmen med den som vinner.
    } else if (!options.includes("")) { //Om det inte finns en vinnare men options inte innehåller några tomma utrymmen så kommer displayMessage() köras fast då kommer den skriva ut att det blev lika 
        displayMessage();
        statusText.innerHTML = "<p>Lika!</p>";
        running = false;
    } else { //Om ingen har vunnit och det inte är lika så fortsätter spelet och det blir den andra symbolens tur 
        swapTurns();
    }
}

function checkWin() {
    for (let i = 0; i < conditions.length; i++) { //En for-loop som kommer loopa igeonom alla vilkor och kolla om alla korresponderande platser i options är fyllda med samma symbol.
        const winCondition = conditions[i]; //WinCondition deklareras som conditions i positionen av i, alltså så kommer varje loop kolla genom en condition.
        const cell1 = options[winCondition[0]];
        const cell2 = options[winCondition[1]];
        const cell3 = options[winCondition[2]]; //Deklarerar de 3 talen i varje condition array till korresponderande position i options genom att välja options i positionen av den condition array som loopen är på. ("[0, 1, 2]" är de tre talen i varje condition array)

        if (cell1 === "" || cell2 === "" || cell3 === "") { //Ifall någon av cellerna är tomma så kan ingen ha vunnit och då går programmet vidare.
            continue;
        } else if (cell1 === cell2 && cell2 === cell3) { //Om alla tre celler i en condition är samma symbol i options, alltså de är samma tecken så skickas win = true tillbaka till winControl.
            return win = true;
        }
    }
}

function swapTurns() {
    if (mode == "normal") { //Om det är normalt läge så byts turn från xClass till Oclass och tvärtom
        if (turn == xClass) {
            turn = oClass;
        } else {
            turn = xClass;
        }
        statusText.innerHTML = "<p>Det är " + turn + " tur</p>";
    } else { //Om det är datorläge så sker exakt samma sak fast när det blir turn blir oclass så körs computerPlace().
        if (turn == xClass) {
            turn = oClass;
            computerPlace();
        } else {
            turn = xClass;
        }
    }
}

function displayMessage(winner) { //Visar vinst meddelande.
    if (winner == xClass || winner == oClass) { //Ifall x eller o vinner så kommer vinst meddelandet att säga "x/o vinner"
        winningMsgText.innerText = winner + " vinner!!";
    } else { //Annars, alltså om det är lika, så kommer meddelande att säga "lika"
        winningMsgText.innerText = "Lika!";
    }
    winningMsg.classList.add("display"); //Lägger till en klass till den div som håller overlayen med meddelandet och restart knappen som gör att en CSS deklaration gäller för den, den deklarationen kommer överskrida nuvarande display som är none och ersätta det med flex (flex anvnds för att lätt och simpelt centrera innehållet.)
}

function computerPlace() { //Här placerar datorn ut sitt O.
    let available = [];
    let randomAvailable;

    available = availableSpots(options);

    randomAvailable = available[randomNum(available)];
    options[randomAvailable] = oClass;
    cellElem[randomAvailable].innerHTML = oClass;
    winControl();
}

function availableSpots(options) {
    let spots = [];

    for (let i = 0; i < options.length; i++) {
        if (options[i] === "") {
            spots.push(i);
        } else {
            continue;
        }
    }
    return spots;
}

function randomNum(num) {
    return Math.floor(Math.random() * num.length);
}

function restart() { //Startar om spelet.
    options = ["", "", "", "", "", "", "", "", ""]; //Tömmer options så att alla positioner är tomma.
    turn = xClass; //Det blir x tur igen.
    if (mode == "normal") {
        statusText.innerHTML = "<p>Det är " + turn + " tur</p>";
    } else {
        statusText.innerHTML = "<p>Du kör mot datorn, lycka till!</p>";
    }
    cellElem.forEach(cell => cell.innerHTML = ""); //Tömmer alla cell element på tecken
    winningMsg.classList.remove("display"); //Tar bort display klassen från overlayen så att den återigen får en display av none.
    running = true; //Spelet har börjat igen.
}

//Detta är en hemlig del, låtsas som att du inte har sett något,,, allvarligt dock så la jag till den legendariska konami koden som ett litet easter egg för skojs skull.
let pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']; //De knappar som man behöver trycka, i den ordningen
let current = 0; //Current är hur långt användaren har kommit i ordningen, alltså vilken plats i pattern arrayen de är på beroende på vilka knappar de tryckt på vilket börjar på 0.

konami = (event) => { //Den function som kontrollerar hur långt användaren har kommit
    if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) { //If-satsen kontrollerar att de tangenter som trycks är i ordningen eller om de är på fel plats i ordningen, i så fall återställs räkningen.
        current = 0;
        return;
    }

    current++; //För varje knapptryck som stämmer med pattern ökas current med ett.

    if (pattern.length === current) { //Om längden på pattern är lika med current, alltså att man har skrivit in konami koden, så återställs current och man blir belönad genom att direkt vinna spelet.
        current = 0;
        restart();
        cellElem.forEach(cell => {
            cell.innerHTML = xClass;
            options = xClass;
        })
        winControl();
    }
};