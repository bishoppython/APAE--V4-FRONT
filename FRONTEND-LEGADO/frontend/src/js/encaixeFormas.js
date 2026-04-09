// encaixeFormas.js (corrigido)
var rows = 3;
var columns = 4;

var currTile = null; // peça atual arrastada
var turns = 0;

// Ajuste o IMG_BASE relativo ao arquivo HTML onde o script é carregado.
// Pelo seu HTML, imagens costumam ficar em "../images/...", então use:
const IMG_BASE = "../images/encaixeFormas"; // ajuste se suas imagens estiverem em outro lugar
const TOTAL_PECAS = rows * columns; // 12

// Helpers
function createSlotWrapper(slotId) {
    const wrapper = document.createElement("div");
    wrapper.className = "slot-wrapper";
    wrapper.dataset.slotId = slotId;
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.lineHeight = "0";

    // Eventos de drop no slot (alvo)
    wrapper.addEventListener("dragover", (e) => e.preventDefault());
    wrapper.addEventListener("drop", handleDropOnSlot);

    return wrapper;
}

function setupEncaixeImg(img, slotId) {
    img.draggable = false;
    // contornoGeometrica1.jpg ... contornoGeometrica12.jpg
    img.src = `${IMG_BASE}/contornoGeometrica/${slotId}.jpg`;
    img.dataset.slotId = slotId;
    img.classList.add("contorno-img");
    img.addEventListener("error", () => {
        console.error("Imagem de contorno não encontrada:", img.src);
    });
}

function setupFormaImg(img, pieceId) {
    img.draggable = true;
    img.src = `${IMG_BASE}/formasGeometrica/${pieceId}.jpg`;
    img.dataset.pieceId = pieceId;
    img.classList.add("forma-img");
    img.addEventListener("error", () => {
        console.error("Imagem da forma não encontrada:", img.src);
    });

    img.addEventListener("dragstart", function () {
        currTile = this; // peça arrastada
        // small visual cue opcional:
        this.classList.add("dragging");
    });

    img.addEventListener("dragend", function () {
        // limpa peça arrastada após terminar
        currTile = null;
        this.classList.remove("dragging");
    });
}

function isMatch(pieceId, slotId) {
    return String(pieceId) === String(slotId);
}

function handleDropOnSlot(e) {
    e.preventDefault();
    const slotWrapper = this;
    const slotId = slotWrapper.dataset.slotId;
    const tentativas = document.getElementById("tentativas");

    if (!currTile) return;

    // Slot já preenchido?
    if (slotWrapper.classList.contains("filled")) {
        turns += 1;
        if (tentativas) tentativas.innerText = turns;
        return;
    }

    const pieceId = currTile.dataset.pieceId;

    if (isMatch(pieceId, slotId)) {
        placePieceOverSlot(currTile, slotWrapper);
    } else {
        // Drop errado: conta tentativa e não move a peça
        turns += 1;
        if (tentativas) tentativas.innerText = turns;
    }
}

function placePieceOverSlot(pieceImg, slotWrapper) {
    slotWrapper.classList.add("filled");

    // Desabilita e esconde a peça original (mantém espaço)
    pieceImg.draggable = false;
    pieceImg.style.visibility = "hidden";
    pieceImg.style.pointerEvents = "none";

    // Cria clone para mostrar sobre o contorno
    const clone = pieceImg.cloneNode(false);
    clone.style.visibility = "visible";
    clone.style.position = "absolute";
    clone.style.inset = "0";
    clone.style.width = "100%";
    clone.style.height = "100%";
    clone.style.objectFit = "contain";
    clone.style.zIndex = "2";
    clone.style.pointerEvents = "none";
    clone.draggable = false;
    clone.classList.add("placed-clone");

    slotWrapper.appendChild(clone);
}

function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

window.onload = function() {
    const encaixe = document.getElementById("encaixe");
    encaixe.innerHTML = "";
    for (let idx = 1; idx <= TOTAL_PECAS; idx++) {
        const wrapper = createSlotWrapper(idx);

        const contornoImg = document.createElement("img");
        setupEncaixeImg(contornoImg, idx);

        wrapper.appendChild(contornoImg);
        encaixe.appendChild(wrapper);
    }

    // Embaralhar peças (aqui embaralha todas)
    const ids = [];
    for (let i = 1; i <= TOTAL_PECAS; i++) ids.push(i);
    shuffleInPlace(ids);

    const formas = document.getElementById("formas");
    formas.innerHTML = "";
    for (const id of ids) {
        const img = document.createElement("img");
        setupFormaImg(img, id);
        formas.appendChild(img);
    }

    // zera contagem
    const tentativas = document.getElementById("tentativas");
    if (tentativas) tentativas.innerText = "0";
    turns = 0;
};

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