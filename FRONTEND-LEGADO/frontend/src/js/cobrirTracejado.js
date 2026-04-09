const canvas = document.getElementById("canvasTracejado");
const ctx = canvas.getContext("2d");
const audioSucesso = document.getElementById("sucesso");
const btnIniciar = document.getElementById("btn-iniciar");
const menuInicial = document.getElementById("start-overlay");
const jogo = document.getElementById("jogo");
const btnFinalizar = document.getElementById("finalizar");
const btnLimpar = document.getElementById("reset");
const btnSair = document.getElementById("sair");

let desenhando = false;
let nivelAtual = 0;
let tentativas = 3;
const totalNiveis = 10;
let progresso = 0;
let comprimentoTraçado = 0;
let ultimoX = 0;
let ultimoY = 0;

// ====== DESENHOS ======
const desenhos = [
  desenharLetraA,
  desenharLetraB,
  desenharNumero1,
  desenharNumero2,
  desenharCoracao,
  desenharEstrela,
  desenharCirculo,
  desenharQuadrado,
  desenharTriangulo,
  desenharSol,
];

// ====== FUNÇÕES DE DESENHO ======
function desenharLetraA() {
  ctx.beginPath();
  ctx.moveTo(200, 80);
  ctx.lineTo(100, 320);
  ctx.lineTo(300, 320);
  ctx.closePath();
  ctx.moveTo(150, 230);
  ctx.lineTo(250, 230);
  ctx.stroke();
}
function desenharLetraB() {
  ctx.beginPath();
  ctx.moveTo(120, 80);
  ctx.lineTo(120, 320);
  ctx.moveTo(120, 80);
  ctx.quadraticCurveTo(280, 150, 120, 200);
  ctx.quadraticCurveTo(280, 270, 120, 320);
  ctx.stroke();
}
function desenharNumero1() {
  ctx.beginPath();
  ctx.moveTo(200, 80);
  ctx.lineTo(200, 320);
  ctx.stroke();
}
function desenharNumero2() {
  ctx.beginPath();
  ctx.moveTo(150, 150);
  ctx.quadraticCurveTo(250, 80, 250, 180);
  ctx.lineTo(150, 320);
  ctx.lineTo(260, 320);
  ctx.stroke();
}
function desenharCoracao() {
  ctx.beginPath();
  ctx.moveTo(200, 240);
  ctx.bezierCurveTo(150, 180, 100, 100, 200, 100);
  ctx.bezierCurveTo(300, 100, 250, 180, 200, 240);
  ctx.stroke();
}
function desenharEstrela() {
  const pontos = [
    [200, 80],
    [220, 150],
    [300, 150],
    [240, 200],
    [260, 280],
    [200, 230],
    [140, 280],
    [160, 200],
    [100, 150],
    [180, 150],
  ];
  ctx.beginPath();
  pontos.forEach(([x, y], i) =>
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  );
  ctx.closePath();
  ctx.stroke();
}
function desenharCirculo() {
  ctx.beginPath();
  ctx.arc(200, 200, 100, 0, Math.PI * 2);
  ctx.stroke();
}
function desenharQuadrado() {
  ctx.strokeRect(120, 120, 160, 160);
}
function desenharTriangulo() {
  ctx.beginPath();
  ctx.moveTo(200, 80);
  ctx.lineTo(100, 300);
  ctx.lineTo(300, 300);
  ctx.closePath();
  ctx.stroke();
}
function desenharSol() {
  ctx.beginPath();
  ctx.arc(200, 200, 60, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    ctx.moveTo(200 + Math.cos(angle) * 70, 200 + Math.sin(angle) * 70);
    ctx.lineTo(200 + Math.cos(angle) * 100, 200 + Math.sin(angle) * 100);
  }
  ctx.stroke();
}

// ====== DESENHO BASE ======
function desenharBase() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#a8a8a8";
  ctx.setLineDash([10, 10]);
  desenhos[nivelAtual]();
  progresso = 0;
  comprimentoTraçado = 0;
}

// ====== DESENHO LIVRE DO JOGADOR ======
function desenhar(e) {
  if (!desenhando) return;

  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
  const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

  // Só desenha se o movimento foi significativo (evita clique simples)
  const distancia = Math.hypot(x - ultimoX, y - ultimoY);
  if (distancia < 3) return;

  ctx.setLineDash([]);
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#ff6347";
  ctx.lineCap = "round";
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);

  comprimentoTraçado += distancia;
  ultimoX = x;
  ultimoY = y;
}

// ====== EVENTOS ======
canvas.addEventListener("mousedown", (e) => {
  desenhando = true;
  const rect = canvas.getBoundingClientRect();
  ultimoX = e.clientX - rect.left;
  ultimoY = e.clientY - rect.top;
  ctx.beginPath();
  ctx.moveTo(ultimoX, ultimoY);
});
canvas.addEventListener("mouseup", () => {
  desenhando = false;
  ctx.beginPath();
});
canvas.addEventListener("mousemove", desenhar);

canvas.addEventListener("touchstart", (e) => {
  desenhando = true;
  const rect = canvas.getBoundingClientRect();
  ultimoX = e.touches[0].clientX - rect.left;
  ultimoY = e.touches[0].clientY - rect.top;
  ctx.beginPath();
  ctx.moveTo(ultimoX, ultimoY);
  e.preventDefault();
});
canvas.addEventListener("touchend", () => {
  desenhando = false;
  ctx.beginPath();
});
canvas.addEventListener("touchmove", (e) => {
  desenhar(e);
  e.preventDefault();
});

// ====== BOTÕES ======
btnIniciar.addEventListener("click", () => {
  menuInicial.style.display = "none";
  jogo.style.display = "block";
  nivelAtual = 0;
  tentativas = 3;
  desenharBase();
});

btnLimpar.addEventListener("click", desenharBase);

btnFinalizar.addEventListener("click", () => {
  // Se o jogador desenhou o suficiente (ajustável)
  const meta = 1000; // meta base
  const porcentagem = (comprimentoTraçado / meta) * 100;

  if (porcentagem >= 75) {
    audioSucesso.play();
    alert("🎉 Parabéns! Você completou o desenho!");
    proximoNivel();
  } else {
    tentativas--;
    if (tentativas > 0) {
      alert(
        `Ainda não completou! (${porcentagem.toFixed(
          1
        )}%) — Você tem mais ${tentativas} tentativa(s).`
      );
      desenharBase();
    } else {
      alert("Tentativas esgotadas! Indo para o próximo...");
      proximoNivel();
    }
  }
  comprimentoTraçado = 0;
});

btnSair.addEventListener("click", () => {
  window.location.href = "../../jogos.html";
});

function proximoNivel() {
  nivelAtual++;
  if (nivelAtual < totalNiveis) {
    tentativas = 3;
    desenharBase();
  } else {
    alert("🏁 Você terminou todos! Voltando ao início!");
    nivelAtual = 0;
    desenharBase();
  }
}


const tentativasInfo = document.getElementById("tentativas");

// Atualiza o texto de tentativas na tela
function atualizarTentativas() {
  tentativasInfo.textContent = `Você tem ${tentativas} tentativa${tentativas > 1 ? 's' : ''}`;
}

// Quando o jogo iniciar
btnIniciar.addEventListener("click", () => {
  menuInicial.style.display = "none";
  jogo.style.display = "block";
  nivelAtual = 0;
  tentativas = 3;
  desenharBase();
  atualizarTentativas();
});

btnLimpar.addEventListener("click", desenharBase);

btnFinalizar.addEventListener("click", () => {
  const meta = 1000; // meta base
  const porcentagem = (comprimentoTraçado / meta) * 100;

  if (porcentagem >= 75) {
    audioSucesso.play();
    alert("🎉 Parabéns! Você completou o desenho!");
    proximoNivel();
  } else {
    tentativas--;
    if (tentativas > 0) {
      atualizarTentativas(); // Atualiza o texto
      desenharBase();
    } else {
      tentativas = 0;
      atualizarTentativas();
      alert("Tentativas esgotadas! Indo para o próximo...");
      proximoNivel();
    }
  }
  comprimentoTraçado = 0;
});

btnSair.addEventListener("click", () => {
  window.location.href = "../../jogos.html";
});

function proximoNivel() {
  nivelAtual++;
  if (nivelAtual < totalNiveis) {
    tentativas = 3;
    desenharBase();
    atualizarTentativas();
  } else {
    alert("🏁 Você terminou todos! Voltando ao início!");
    nivelAtual = 0;
    desenharBase();
    atualizarTentativas();
  }
}
