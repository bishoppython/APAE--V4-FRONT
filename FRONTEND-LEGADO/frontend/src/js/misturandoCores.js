// Variáveis de controle dos botões
let clicouBotaoA = false;
let clicouBotaoB = false;
let clicouBotaoC = false;

// Funções de clique dos botões
function A() {
  clicouBotaoA = true;
  document.getElementById("azul").play();
  checkDoubleClick();
}

function B() {
  clicouBotaoB = true;
  document.getElementById("amarelo").play();
  checkDoubleClick();
}

function C() {
  clicouBotaoC = true;
  document.getElementById("vermelho").play();
  checkDoubleClick();
}

// Verifica combinações para exibir o resultado
function checkDoubleClick() {
  const resultado = document.getElementById("resultado");
  const textoResultado = resultado.querySelector("p");

  if (clicouBotaoA && clicouBotaoB) {
    setTimeout(() => {
      resultado.style.display = "block";
      resultado.style.backgroundColor = "green";
      textoResultado.innerText = "Verde";
      document.getElementById("verde").play();
    }, 1300);
    resetClicks();
    return;
  }

  if (clicouBotaoA && clicouBotaoC) {
    setTimeout(() => {
      resultado.style.display = "block";
      resultado.style.backgroundColor = "purple";
      textoResultado.innerText = "Roxo";
      document.getElementById("roxo").play();
    }, 1300);
    resetClicks();
    return;
  }

  if (clicouBotaoC && clicouBotaoB) {
    setTimeout(() => {
      resultado.style.display = "block";
      resultado.style.backgroundColor = "orange";
      textoResultado.innerText = "Laranja";
      document.getElementById("laranja").play();
    }, 1300);
    resetClicks();
    return;
  }
}

// Função para resetar os botões e limpar o estado
function resetClicks() {
  clicouBotaoA = false;
  clicouBotaoB = false;
  clicouBotaoC = false;
}

// Função de reset total (botão reset)
function reset() {
  resetClicks();

  const resultado = document.getElementById("resultado");
  const textoResultado = resultado.querySelector("p");

  resultado.style.backgroundColor = "#f8f8ff";
  textoResultado.innerText = "Resultado";
  resultado.style.display = "block";
}
