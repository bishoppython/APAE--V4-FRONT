const container = document.querySelector(".tabuleiro");
const botoaReiniciar = document.getElementById("btn-reiniciar");
const btnIniciar = document.getElementById("btn-iniciar");
const startOverlay = document.getElementById("start-overlay");
let cartas;
let primeiraCarta = "";
let segundaCarta = "";
let bloqueado = true; // o jogo começa travado até clicar em iniciar

botoaReiniciar.addEventListener("click", () => location.reload());

let items = [
  { nome: "gato", imagem: "../images/animais/gato.jpg" },
  { nome: "cachorro", imagem: "../images/animais/cachorro.jpg" },
  { nome: "coelho", imagem: "../images/animais/coelho.jpg" },
  { nome: "elefante", imagem: "../images/animais/elefante.jpg" },
  { nome: "girafa", imagem: "../images/animais/girafa.jpg" },
  { nome: "leão", imagem: "../images/animais/leão.jpg" },
  { nome: "tigre", imagem: "../images/animais/tigre.jpg" },
  { nome: "baleia", imagem: "../images/animais/baleia.jpg" },
  { nome: "peixe", imagem: "../images/animais/peixe.jpg" },
  { nome: "hamster", imagem: "../images/animais/hamster.jpg" },
  { nome: "cavalo", imagem: "../images/animais/cavalo.jpg" },
  { nome: "cavalo marinho", imagem: "../images/animais/cavalo marinho.jpg" },
  { nome: "galinha", imagem: "../images/animais/galinha.jpg" },
  { nome: "vaca", imagem: "../images/animais/vaca.jpg" },
  { nome: "porco", imagem: "../images/animais/porco.jpg" },
  { nome: "pato", imagem: "../images/animais/pato.jpg" },
  { nome: "ovelha", imagem: "../images/animais/ovelha.jpg" },
  { nome: "macaco", imagem: "../images/animais/macaco.jpg" },
  { nome: "onça", imagem: "../images/animais/onça.jpg" },
  { nome: "golfinho", imagem: "../images/animais/golfinho.jpg" },
  { nome: "tubarão", imagem: "../images/animais/tubarão.jpg" },
  { nome: "estrela", imagem: "../images/animais/estrela.jpg" },
  { nome: "polvo", imagem: "../images/animais/polvo.jpg" },
  { nome: "papagaio", imagem: "../images/animais/papagaio.jpg" }
];

function tocarSom(nomeAnimal) {
  const audio = new Audio(encodeURI(`../../src/audio/animais/${nomeAnimal}.mp3`));
  audio.play();
}

function tocarSomSucesso() {
  const audio = new Audio("../../src/audio/efeito_acerto.mp3");
  audio.play();
}

function sortearItensParaRodada(qtdPares = 12) {
  const itensEmbaralhados = [...items].sort(() => Math.random() - 0.5);
  return itensEmbaralhados.slice(0, qtdPares);
}

function criarCartas() {
  container.innerHTML = "";
  let itensRodada = sortearItensParaRodada(12);
  let itemsDuplicados = [...itensRodada, ...itensRodada];
  let animais = itemsDuplicados.sort(() => Math.random() - 0.5);

  animais.map((animal) => {
    container.innerHTML += `
      <div class="carta" data-carta="${animal.nome}">
        <div class="atras">?</div>
        <div class="frente">
          <img src="${animal.imagem}" width="160" height="160" />
        </div>
      </div>
    `;
  });
}
criarCartas();

function virarCarta() {
  cartas = document.querySelectorAll(".carta");
  cartas.forEach((carta) => {
    carta.addEventListener("click", () => {
      if (bloqueado) return; // impede jogadas enquanto bloqueado
      if (carta === primeiraCarta) return;

      if (primeiraCarta === "") {
        carta.classList.add("carta-virada");
        primeiraCarta = carta;
        tocarSom(primeiraCarta.getAttribute("data-carta"));
      } else if (segundaCarta === "") {
        carta.classList.add("carta-virada");
        segundaCarta = carta;
        tocarSom(segundaCarta.getAttribute("data-carta"));
        checarCartas();
      }
    });
  });
}
virarCarta();

function checarCartas() {
  const primeiroAnimal = primeiraCarta.getAttribute("data-carta");
  const segundoAnimal = segundaCarta.getAttribute("data-carta");

  if (primeiroAnimal === segundoAnimal && primeiraCarta !== segundaCarta) {
    tocarSomSucesso();
    primeiraCarta.dataset.encontrada = "true";
    segundaCarta.dataset.encontrada = "true";
    primeiraCarta = "";
    segundaCarta = "";

    function tocarSomSucessoFinal() {
      const audio = new Audio("../../src/audio/efeito-vitória.mp3");
      audio.play();
    }

    setTimeout(() => {
      const cartasViradas = document.querySelectorAll('.carta-virada');
      if (cartasViradas.length === 24) {
        confetti({
          particleCount: 300,
          spread: 120,
          origin: { y: 0.6 }
        });
        tocarSomSucessoFinal();
        document.querySelector('.tabuleiro').style.display = 'none';
        document.getElementById('mensagem-parabens').style.display = 'block';
      }
    }, 400);

  } else {
    setTimeout(() => {
      primeiraCarta.classList.remove("carta-virada");
      segundaCarta.classList.remove("carta-virada");
      primeiraCarta = "";
      segundaCarta = "";
    }, 600);
  }
}

// Função auxiliar para abrir o tabuleiro (exibe a grid)
function mostrarTabuleiro() {
  const tabuleiro = document.querySelector(".tabuleiro");
  if (tabuleiro) tabuleiro.classList.add("visible");
}

// Lógica do botão Iniciar: revela o tabuleiro, vira todas as cartas por 5s e depois desvira as não encontradas
if (btnIniciar) {
  btnIniciar.addEventListener("click", async () => {
    // evita múltiplos cliques
    btnIniciar.disabled = true;
    btnIniciar.innerText = "Aguarde...";

    // mostra o tabuleiro (mesmo que vazio por enquanto)
    mostrarTabuleiro();

    // remove overlay visualmente (depois de mostrar tabuleiro para evitar salto)
    if (startOverlay) startOverlay.style.display = "none";

    // garante que as cartas foram criadas e selecionadas
    cartas = document.querySelectorAll(".carta");
    if (!cartas || cartas.length === 0) {
      // ainda não tem cartas — força recriar e recolher
      criarCartas();
      cartas = document.querySelectorAll(".carta");
      virarCarta(); // reaplica listeners
    }

    // bloqueia interação durante pré-visualização
    bloqueado = true;

    // vira todas as cartas visíveis
    cartas.forEach((c) => c.classList.add("carta-virada"));

    // espera 5s
    await new Promise((r) => setTimeout(r, 4000));

    // desvira apenas cartas não marcadas como encontradas
    cartas.forEach((c) => {
      if (c.dataset.encontrada !== "true") {
        c.classList.remove("carta-virada");
      }
    });

    // libera jogo
    bloqueado = false;
    primeiraCarta = "";
    segundaCarta = "";
    btnIniciar.style.display = "none";
  });
}
