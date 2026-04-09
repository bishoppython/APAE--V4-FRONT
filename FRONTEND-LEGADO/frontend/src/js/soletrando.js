let palavras = [
  {
    palavra: "amarelo",
    imagem: "../images/soletrando/amarelo.jpeg",
    audioId: "../audio/soletrando/amarelo.mp3",
  },
  {
    palavra: "vermelho",
    imagem: "../images/soletrando/vermelho.jpeg",
    audioId: "../audio/soletrando/vermelho.mp3",
  },
  {
    palavra: "azul",
    imagem: "../images/soletrando/azul.jpeg",
    audioId: "../audio/soletrando/azul.mp3",
  },
  {
    palavra: "casa",
    imagem: "../images/soletrando/casa.jpeg",
    audioId: "../audio/soletrando/casa.mp3",
  },
  {
    palavra: "carro",
    imagem: "../images/soletrando/carro.jpeg",
    audioId: "../audio/soletrando/carro.mp3",
  },
  {
    palavra: "bola",
    imagem: "../images/soletrando/bola.jpeg",
    audioId: "../audio/soletrando/bola.mp3",
  },
  {
    palavra: "mamãe",
    imagem: "../images/soletrando/mamãe.jpeg",
    audioId: "../audio/soletrando/mamãe.mp3",
  },
  {
    palavra: "papai",
    imagem: "../images/soletrando/papai.jpeg",
    audioId: "../audio/soletrando/papai.mp3",
  },
  {
    palavra: "gato",
    imagem: "../images/soletrando/gato.jpeg",
    audioId: "../audio/soletrando/gato.mp3",
  },
  {
    palavra: "cachorro",
    imagem: "../images/soletrando/cachorro.jpeg",
    audioId: "../audio/soletrando/cachorro.mp3",
  },
  {
    palavra: "peixe",
    imagem: "../images/soletrando/peixe.jpeg",
    audioId: "../audio/soletrando/peixe.mp3",
  },
  // Adicionar os outros aqui (palavras, imagens e áudios)
];

const todasPalavras = palavras.slice(); // cópia para reiniciar o jogo completo quando necessário

let indiceAtual = 0;
let tentativa = "";
let tentativas = 0;
const maxTentativas = 3;
let palavrasErradas = [];
let retryingFailed = false;

const container = document.createElement("div");
container.classList.add("soletrando-container");

const botoesContainer = document.createElement("div");
botoesContainer.classList.add("soletrando-letras");

const tentativaTexto = document.createElement("p");
tentativaTexto.classList.add("feedback");

const tentativasInfo = document.createElement("p");
tentativasInfo.classList.add("tentativas-info");
tentativasInfo.style.fontWeight = "600";
tentativasInfo.style.marginTop = "0.5rem";

// --- BOTÃO FINALIZAR (NOVO) ---
const botaoFinalizar = document.createElement("button");
botaoFinalizar.id = "btn-finalizar";
botaoFinalizar.classList.add("btn-jogos");
botaoFinalizar.textContent = "Finalizar";
botaoFinalizar.onclick = () => window.location.reload();
// deixa oculto até o jogo iniciar
botaoFinalizar.style.display = "none";

// Wrapper para alinhar lado a lado
const tentativasWrapper = document.createElement("div");
tentativasWrapper.style.display = "flex";
tentativasWrapper.style.alignItems = "center";
tentativasWrapper.style.gap = "12px";
tentativasWrapper.style.marginTop = "0.8rem";

tentativasWrapper.append(tentativasInfo, botaoFinalizar);

// coloca tudo no container
document.body.querySelector(".main").after(container);
container.append(botoesContainer, tentativasWrapper, tentativaTexto);

// usa apenas a imagem que já existe no HTML
const imagem = document.querySelector(".card-img");

//converte letras acentuadas para simples
function normalizarLetra(letra) {
  const mapa = {
    á: "a",
    à: "a",
    ã: "a",
    â: "a",
    é: "e",
    ê: "e",
    í: "i",
    ó: "o",
    ô: "o",
    õ: "o",
    ú: "u",
    ç: "c",
  };
  return mapa[letra] || letra;
}

function embaralharArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function iniciarRodada() {
  botoesContainer.innerHTML = "";
  tentativa = "";
  tentativaTexto.textContent = "";
  tentativaTexto.className = "feedback";

  // Remove botão de reinício se houver
  const botaoExistente = document.getElementById("botao-reiniciar");
  if (botaoExistente) botaoExistente.remove();

  // Se acabou a lista atual
  if (indiceAtual >= palavras.length) {
    if (!retryingFailed && palavrasErradas.length > 0) {
      // Volta para as palavras erradas
      palavras = palavrasErradas.slice();
      palavrasErradas = [];
      retryingFailed = true;
      indiceAtual = 0;
      tentativas = 0;
      tentativasInfo.textContent = ""; // garantir vazio na transição para revisão
      // Mensagem curta antes de reiniciar com as erradas
      tentativaTexto.textContent = "Vamos revisar as palavras erradas...";
      setTimeout(iniciarRodada, 1200);
      return;
    }

    // Se já revisou as erradas (ou não havia erradas), finaliza
    tentativaTexto.textContent =
      "🎉 Parabéns! Você completou todas as palavras!";
    tentativaTexto.classList.add("correto");
    tentativasInfo.textContent = ""; // Oculta o texto de tentativas no final

    // Som de vitória
    const somVitoria = new Audio("../audio/efeito-vitória.mp3");
    somVitoria.play();

    // Confete
    if (typeof confetti === "function") {
      confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.6 },
      });
    }

    // Esconde imagem final
    imagem.style.display = "none";
    const cardImagem = document.querySelector(".main-cards-soletrando");
    if (cardImagem) cardImagem.style.display = "none";

    // Cria botão de reinício
    const botaoReiniciar = document.createElement("button");
    botaoReiniciar.id = "botao-reiniciar";
    botaoReiniciar.textContent = "Jogar Novamente";
    botaoReiniciar.onclick = reiniciarJogo;

    // Estiliza botão diretamente no JS
    botaoReiniciar.style.position = "fixed";
    botaoReiniciar.style.top = "50%";
    botaoReiniciar.style.left = "50%";
    botaoReiniciar.style.transform = "translate(-50%, -50%)";
    botaoReiniciar.style.zIndex = "1000";
    botaoReiniciar.style.padding = "1rem 2rem";
    botaoReiniciar.style.fontSize = "1.5rem";
    botaoReiniciar.style.backgroundColor = "#5e9e63";
    botaoReiniciar.style.color = "#fff";
    botaoReiniciar.style.border = "none";
    botaoReiniciar.style.borderRadius = "12px";
    botaoReiniciar.style.cursor = "pointer";
    botaoReiniciar.style.boxShadow = "#73b369 0px 4px 30px;";

    document.body.appendChild(botaoReiniciar);
    return;
  }

  const palavraAtual = palavras[indiceAtual];
  tentativas = 0; // zera tentativas ao iniciar palavra

  tentativasInfo.textContent = `Tentativas restantes: ${maxTentativas - tentativas}`;
  
  const audio = new Audio(palavraAtual.audioId); // TOCA O ÁUDIO DA PALAVRA
  audio.play().catch((error) => {
    console.warn("Falha ao reproduzir o áudio:", error);
  });

  const cardImagem = document.querySelector(".card-img");
  cardImagem.src = palavraAtual.imagem; // Define o caminho da imagem
  cardImagem.alt = `Imagem da palavra ${palavraAtual.palavra}`; // Texto alternativo

  // PERMITE REPRODUZIR O ÁUDIO AO CLICAR NA IMAGEM
  cardImagem.onclick = () => {
    const audioRepetir = new Audio(palavraAtual.audioId);
    audioRepetir.play();
  };

  const letras = embaralharArray(palavraAtual.palavra.split(""));

  letras.forEach((letra, index) => {
    const btn = document.createElement("button");
    btn.textContent = letra.toUpperCase();
    btn.classList.add("letra-btn");
    btn.dataset.index = index;
    btn.dataset.used = "false";

    btn.onclick = () => {
      if (
        btn.dataset.used === "false" &&
        !tentativaTexto.textContent.includes("✅")
      ) {
        tentativa += letra;
        tentativaTexto.textContent = tentativa.toUpperCase();

        // Normaliza a letra para som (ex: 'ã' -> 'a')
        const letraNormalizada = normalizarLetra(letra.toLowerCase());

        // TOCA O SOM DA LETRA NORMALIZADA
        const somLetra = new Audio(`../audio/letras/${letraNormalizada}.mp3`);
        somLetra.play().catch((error) => {
          console.warn(
            `Erro ao tocar som da letra '${letraNormalizada}':`,
            error
          );
        });

        btn.dataset.used = "true";
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.transform = "scale(0.95)";

        if (tentativa.length === palavraAtual.palavra.length) {
          if (tentativa === palavraAtual.palavra) {
            // TOCA SOM DE ACERTO
            const somAcerto = new Audio("../audio/efeito_acerto.mp3");
            somAcerto.play();

            // se estava em lista de erradas, remove
            const idxErr = palavrasErradas.indexOf(palavraAtual);
            if (idxErr !== -1) palavrasErradas.splice(idxErr, 1);

            tentativaTexto.textContent = "✅ Correto! Próxima palavra...";
            tentativaTexto.classList.add("correto");
            indiceAtual++;
            setTimeout(iniciarRodada, 1500);
          } else {
            // ERRO: aumenta contador de tentativas e decide próxima ação
            tentativas++;
            if (tentativas >= maxTentativas) {
              // marca palavra como errada (se ainda não estiver) e pula
              if (!palavrasErradas.includes(palavraAtual)) {
                palavrasErradas.push(palavraAtual);
              }

              // TOCA SOM DE ERRO
              const somErro = new Audio("../audio/efeito-erro.mp3");
              somErro.play();

              tentativaTexto.textContent = `❌ Errou ${tentativas} vezes. Pulando para a próxima...`;
              tentativaTexto.classList.add("errado");

              tentativasInfo.textContent = `Tentativas restantes: 0`;

              setTimeout(() => {
                indiceAtual++;
                iniciarRodada();
              }, 1200);
            } else {
              // ainda tem tentativas
              // TOCA SOM DE ERRO
              const somErro = new Audio("../audio/efeito-erro.mp3");
              somErro.play();

              tentativaTexto.textContent = `❌ Tente novamente! Restam ${maxTentativas - tentativas} tentativa(s).`;
              tentativaTexto.classList.add("errado");

              tentativasInfo.textContent = `Tentativas restantes: ${maxTentativas - tentativas}`;
            
              setTimeout(() => {
                document.querySelectorAll(".letra-btn").forEach((b) => {
                  b.disabled = false;
                  b.style.opacity = "1";
                  b.style.transform = "scale(1)";
                  b.dataset.used = "false";
                });
                tentativa = "";
                tentativaTexto.textContent = "";
                tentativaTexto.className = "feedback";

                // TOCA O ÁUDIO DA PALAVRA NOVAMENTE APÓS O ERRO
                const audioRepetir = new Audio(palavraAtual.audioId);
                audioRepetir.play();
              }, 1200);
            }
          }
        }
      }
    };
    botoesContainer.appendChild(btn);
  });
}

// Função para reiniciar o jogo
function reiniciarJogo() {
  indiceAtual = 0;
  tentativa = "";
  tentativas = 0;
  palavrasErradas = [];
  retryingFailed = false;
  const botao = document.getElementById("botao-reiniciar");
  if (botao) botao.remove();

  const cardImagem = document.querySelector(".main-cards-soletrando");
  if (cardImagem) cardImagem.style.display = "block";
  imagem.style.display = "block";

  palavras = todasPalavras.slice(); // repõe todas as palavras originais
  palavras.sort(() => 0.5 - Math.random());

  // mostra o botão de finalizar ao reiniciar/jogar novamente
  botaoFinalizar.style.display = "inline-flex";

  iniciarRodada();
}

// BOTÃO INICIAR DO SOLETRANDO

const btnIniciarSoletrando = document.getElementById("btn-iniciar");
const overlaySoletrando = document.getElementById("start-overlay");

let jogoBloqueado = true; // impede cliques antes do iniciar

if (btnIniciarSoletrando) {
  btnIniciarSoletrando.addEventListener("click", () => {
    jogoBloqueado = false;

    // remove overlay
    overlaySoletrando.style.display = "none";

    // MOSTRA O CARD AGORA
    const cardImagem = document.querySelector(".main-cards-soletrando");
    if (cardImagem) cardImagem.style.display = "block";
    
    const imagemPrincipal = document.querySelector(".card-img");
    if (imagemPrincipal) imagemPrincipal.style.display = "block";

    // mostra o botão de finalizar quando o jogo começar
    botaoFinalizar.style.display = "inline-flex";

    // embaralha palavras e inicia
    palavras.sort(() => 0.5 - Math.random());
    iniciarRodada();
  });
}

// bloqueia botões até iniciar
document.addEventListener("click", (e) => {
  if (jogoBloqueado && e.target.classList.contains("letra-btn")) {
    e.preventDefault();
    e.stopPropagation();
  }
});