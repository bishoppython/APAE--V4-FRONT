var rows = 5;
var columns = 5;

var currTile;
var otherTile;

var turns = 0;

window.onload = function() {
    //initialize the 5x5 board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            //<img>
            let tile = document.createElement("img");
            // path is relative to the HTML file (src/jogos/quebraCabeca.html)
            tile.src = "../../images/quebraCabeca/branco.png";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on image to drag
            tile.addEventListener("dragover", dragOver);   //drag an image
            tile.addEventListener("dragenter", dragEnter); //dragging an image into another one
            tile.addEventListener("dragleave", dragLeave); //dragging an image away from another one
            tile.addEventListener("drop", dragDrop);       //drop an image onto another one
            tile.addEventListener("dragend", dragEnd);      //after you completed dragDrop

            document.getElementById("quadro-jogo").append(tile);
        }
    }

    // determine which puzzle to load based on the current HTML filename
    // e.g. elefantePuzzle.html -> puzzleName = 'elefantePuzzle', prefix = 'elefante'
    let path = window.location.pathname;
    let page = path.substring(path.lastIndexOf('/') + 1);
    let puzzleName = page.replace('.html', '');
    let prefix = puzzleName.replace(/Puzzle$/i, '');

    //pieces
    let pieces = [];
    for (let i=1; i <= rows*columns; i++) {
        // pad numbers to two digits: 01, 02, ..., 10, ..., 25
        let num = i.toString().padStart(2, '0');
        pieces.push(num); //put "01" to "25" into the array (puzzle images names)
    }
    pieces.reverse();
    for (let i =0; i < pieces.length; i++) {
        let j = Math.floor(Math.random() * pieces.length);

        //swap
        let tmp = pieces[i];
        pieces[i] = pieces[j];
        pieces[j] = tmp;
    }

    for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
        // path is relative to the HTML file (src/jogos/quebraCabeca.html)
        // use the detected puzzle folder/prefix so the correct image set is loaded
        tile.src = "../../images/quebraCabeca/" + puzzleName + "/imagens/" + prefix + "_" + pieces[i] + ".jpg";

        //DRAG FUNCTIONALITY
        tile.addEventListener("dragstart", dragStart); //click on image to drag
        tile.addEventListener("dragover", dragOver);   //drag an image
        tile.addEventListener("dragenter", dragEnter); //dragging an image into another one
        tile.addEventListener("dragleave", dragLeave); //dragging an image away from another one
        tile.addEventListener("drop", dragDrop);       //drop an image onto another one
        tile.addEventListener("dragend", dragEnd);      //after you completed dragDrop

        document.getElementById("pecas").append(tile);
    }
}

//DRAG TILES
function dragStart() {
    currTile = this; //this refers to image that was clicked on for dragging
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; //this refers to image that is being dropped on
}

function dragEnd() {
    // check for the 'branco' (blank) tile filename
    if (currTile.src.includes("branco")) {
        return;
    }
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;

    turns += 1;
    // update attempts counter (HTML uses id="tentativas")
    document.getElementById("tentativas").innerText = turns;
}

// === BOTÃO DE INICIAR O GAME ===
const startButton = document.getElementById("btn-iniciar");

if (startButton) {
  startButton.addEventListener("click", () => {
    jogoIniciado = true;

    // Remove a tela inicial
    const overlay = document.getElementById("start-overlay");
    if (overlay) overlay.style.display = "none";

    updateGame();
  });
}

// === BOTÃO DE FINALIZAR (REINICIA A PÁGINA) ===
const btnFinalizar = document.getElementById("btn-finalizar");

if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
        location.reload(); // reinicia a página
    });
}