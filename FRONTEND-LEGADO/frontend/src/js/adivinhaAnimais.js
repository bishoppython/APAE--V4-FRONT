const allItems = [
  {
    palavra: "a Baleia",
    imagem: "../images/animais/baleia.jpg",
    audioId: "../audio/adivinha/onde-esta-baleia.ogg",
    acertado: false,
  },
  {
    palavra: "o Cavalo Marinho",
    imagem: "../images/animais/cavalo marinho.jpg",
    audioId: "../audio/adivinha/onde-esta-cavaloMarinho.ogg",
    acertado: false,
  },
  {
    palavra: "o Cavalo",
    imagem: "../images/animais/cavalo.jpg",
    audioId: "../audio/adivinha/onde-esta-cavalo.ogg",
    acertado: false,
  },
  {
    palavra: "o Coelho",
    imagem: "../images/animais/coelho.jpg",
    audioId: "../audio/adivinha/onde-esta-coelho.ogg",
    acertado: false,
  },
  {
    palavra: "o Elefante",
    imagem: "../images/animais/elefante.jpg",
    audioId: "../audio/adivinha/onde-esta-elefante.ogg",
    acertado: false,
  },
  {
    palavra: "a Estrela do Mar",
    imagem: "../images/animais/estrela.jpg",
    audioId: "../audio/adivinha/onde-esta-estrelaMar.ogg",
    acertado: false,
  },
  {
    palavra: "a Galinha",
    imagem: "../images/animais/galinha.jpg",
    audioId: "../audio/adivinha/onde-esta-galinha.ogg",
    acertado: false,
  },
  {
    palavra: "a Girafa",
    imagem: "../images/animais/girafa.jpg",
    audioId: "../audio/adivinha/onde-esta-girafa.ogg",
    acertado: false,
  },
  {
    palavra: "o Gato",
    imagem: "../images/animais/gato.jpg",
    audioId: "../audio/adivinha/onde-esta-gato.ogg",
    acertado: false,
  },
  {
    palavra: "o Cachorro",
    imagem: "../images/animais/cachorro.jpg",
    audioId: "../audio/adivinha/onde-esta-cachorro.ogg",
    acertado: false,
  },
  {
    palavra: "o Golfinho",
    imagem: "../images/animais/golfinho.jpg",
    audioId: "../audio/adivinha/onde-esta-golfinho.ogg",
    acertado: false,
  },
  {
    palavra: "o Hamster",
    imagem: "../images/animais/hamster.jpg",
    audioId: "../audio/adivinha/onde-esta-hamster.ogg",
    acertado: false,
  },
  {
    palavra: "o Leão",
    imagem: "../images/animais/leão.jpg",
    audioId: "../audio/adivinha/onde-esta-leao.ogg",
    acertado: false,
  },
  {
    palavra: "o Macaco",
    imagem: "../images/animais/macaco.jpg",
    audioId: "../audio/adivinha/onde-esta-macaco.ogg",
    acertado: false,
  },
  {
    palavra: "a Onça",
    imagem: "../images/animais/onça.jpg",
    audioId: "../audio/adivinha/onde-esta-onça.ogg",
    acertado: false,
  },
  {
    palavra: "a Ovelha",
    imagem: "../images/animais/ovelha.jpg",
    audioId: "../audio/adivinha/onde-esta-ovelha.ogg",
    acertado: false,
  },
  {
    palavra: "o Pato",
    imagem: "../images/animais/pato.jpg",
    audioId: "../audio/adivinha/onde-esta-pato.ogg",
    acertado: false,
  },
  {
    palavra: "o Peixe",
    imagem: "../images/animais/peixe.jpg",
    audioId: "../audio/adivinha/onde-esta-peixe.ogg",
    acertado: false,
  },
  {
    palavra: "o Polvo",
    imagem: "../images/animais/polvo.jpg",
    audioId: "../audio/adivinha/onde-esta-polvo.ogg",
    acertado: false,
  },
  {
    palavra: "o Porco",
    imagem: "../images/animais/porco.jpg",
    audioId: "../audio/adivinha/onde-esta-porco.ogg",
    acertado: false,
  },
  {
    palavra: "o Tigre",
    imagem: "../images/animais/tigre.jpg",
    audioId: "../audio/adivinha/onde-esta-tigre.ogg",
    acertado: false,
  },
  {
    palavra: "o Tubarão",
    imagem: "../images/animais/tubarão.jpg",
    audioId: "../audio/adivinha/onde-esta-tubarao.ogg",
    acertado: false,
  },
  {
    palavra: "a Vaca",
    imagem: "../images/animais/vaca.jpg",
    audioId: "../audio/adivinha/onde-esta-vaca.ogg",
    acertado: false,
  },
];

// Estado do jogo
let currentItem = null;
let score = 0;
let items = allItems.map(item => ({ ...item })); // clone para manipular
let lastWrongItem = null;

const audioCorrect = document.getElementById("audio-acerto");
const audioWrong = document.getElementById("audio-erro");
const audioFinish = document.getElementById("audio-vitoria");

const messageEl = document.getElementById("game-message");
const itemsContainer = document.getElementById("items-container");

// Função para tocar áudio do item atual
function playItemAudio(item) {
  if (!item) return;
  const questionAudio = new Audio(item.audioId);
  questionAudio.play();
}

// Pega próximo item a adivinhar
function getNextItem() {
  if (lastWrongItem && !lastWrongItem.acertado) return lastWrongItem;
  const availableItems = items.filter(i => !i.acertado);
  if (availableItems.length === 0) return null;
  return availableItems[Math.floor(Math.random() * availableItems.length)];
}

// Verifica fim de jogo
function checkGameEnd() {
  return items.every(i => i.acertado);
}

// Exibe o fim do jogo
function endGame() {
  audioFinish.pause();
  audioFinish.currentTime = 0;
  audioFinish.play();

  // Chama o confetti ao finalizar o jogo
  if (typeof confetti === "function") {
    confetti({
      particleCount: 300,
      spread: 120,
      origin: { y: 0.6 }
    });
  }
  
  messageEl.textContent = "Parabéns!! Todos os animais foram encontrados!";
  messageEl.classList.remove("errado");
  messageEl.classList.add("correto"); 
  itemsContainer.innerHTML = "";

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Jogar Novamente";
  restartBtn.classList.add("adivinha-btn");
  restartBtn.onclick = () => {
    items = allItems.map(item => ({ ...item, acertado: false }));
    score = 0;
    lastWrongItem = null;
    messageEl.classList.remove("correto"); 
    updateGame();
  };

  itemsContainer.appendChild(restartBtn);
}

// Atualiza o jogo (pergunta e opções)
function updateGame() {
  if (checkGameEnd()) {
    endGame();
    return;
  }

  currentItem = getNextItem();
  if (!currentItem) return;

  messageEl.textContent = `Onde está ${currentItem.palavra}?`;
  itemsContainer.innerHTML = "";

  // Escolhe 6 itens aleatórios, garante que currentItem esteja
  let shuffledItems = [...items]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  if (!shuffledItems.includes(currentItem)) {
    const randomIndex = Math.floor(Math.random() * shuffledItems.length);
    shuffledItems[randomIndex] = currentItem;
  }

  playItemAudio(currentItem);

  // Cria cards
  shuffledItems.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.tabIndex = 0; // acessível via teclado

    const img = document.createElement("img");
    img.src = item.imagem;
    img.alt = item.palavra;

    card.appendChild(img);
    itemsContainer.appendChild(card);

    card.onclick = () => handleChoice(item);
    card.onkeypress = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleChoice(item);
      }
    };
  });
}

function handleChoice(item) {
  if (item === currentItem) {
    item.acertado = true;
    score++;
    audioCorrect.pause();
    audioCorrect.currentTime = 0;
    audioCorrect.play();
    messageEl.textContent = "Correto!";
    messageEl.classList.remove("errado");
    messageEl.classList.add("correto");
    lastWrongItem = null;
    setTimeout(() => {
      messageEl.classList.remove("correto");
      updateGame();
    }, 800);
  } else {
    audioWrong.pause();
    audioWrong.currentTime = 0;
    audioWrong.play();
    messageEl.textContent = "Errado! Tente novamente";
    messageEl.classList.remove("correto");
    messageEl.classList.add("errado");
    lastWrongItem = currentItem;
    setTimeout(() => {
      messageEl.classList.remove("errado");
      updateGame();
    }, 800);
  }
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