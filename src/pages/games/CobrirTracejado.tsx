import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";
import { Trophy, RotateCcw } from "lucide-react";

// Funções de desenho
function desenharLetraA(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(200, 80);
  ctx.lineTo(100, 320);
  ctx.lineTo(300, 320);
  ctx.closePath();
  ctx.moveTo(150, 230);
  ctx.lineTo(250, 230);
  ctx.stroke();
}

function desenharLetraB(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(120, 80);
  ctx.lineTo(120, 320);
  ctx.moveTo(120, 80);
  ctx.quadraticCurveTo(280, 150, 120, 200);
  ctx.quadraticCurveTo(280, 270, 120, 320);
  ctx.stroke();
}

function desenharNumero1(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(200, 80);
  ctx.lineTo(200, 320);
  ctx.stroke();
}

function desenharNumero2(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(150, 150);
  ctx.quadraticCurveTo(250, 80, 250, 180);
  ctx.lineTo(150, 320);
  ctx.lineTo(260, 320);
  ctx.stroke();
}

function desenharCoracao(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(200, 240);
  ctx.bezierCurveTo(150, 180, 100, 100, 200, 100);
  ctx.bezierCurveTo(300, 100, 250, 180, 200, 240);
  ctx.stroke();
}

function desenharEstrela(ctx: CanvasRenderingContext2D) {
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
  pontos.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
  ctx.stroke();
}

function desenharCirculo(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.arc(200, 200, 100, 0, Math.PI * 2);
  ctx.stroke();
}

function desenharQuadrado(ctx: CanvasRenderingContext2D) {
  ctx.strokeRect(120, 120, 160, 160);
}

function desenharTriangulo(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(200, 80);
  ctx.lineTo(100, 300);
  ctx.lineTo(300, 300);
  ctx.closePath();
  ctx.stroke();
}

function desenharSol(ctx: CanvasRenderingContext2D) {
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

const totalNiveis = desenhos.length;

// Comprimento aproximado em pixels de cada desenho para a meta
const METAS_BASE = [
  820,  // Letra A
  750,  // Letra B
  240,  // Número 1
  460,  // Número 2
  550,  // Coração
  780,  // Estrela
  628,  // Círculo
  640,  // Quadrado
  680,  // Triângulo
  740,  // Sol
];

const efeitoAcerto = new URL(
  "../../assets/sounds/efeitos/efeito-acerto.mp3",
  import.meta.url,
).href;
const efeitoErro = new URL(
  "../../assets/sounds/efeitos/efeito-erro.mp3",
  import.meta.url,
).href;
const efeitoDerrota = new URL(
  "../../assets/sounds/efeitos/efeito-derrota.mp3",
  import.meta.url,
).href;
const efeitoVitoria = new URL(
  "../../assets/sounds/efeitos/efeito-vitória.mp3",
  import.meta.url,
).href;

export default function CobrirTracejado() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [started, setStarted] = useState(false);
  const [nivelAtual, setNivelAtual] = useState(0);
  const [tentativas, setTentativas] = useState(3);
  const [mensagem, setMensagem] = useState("");
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [desistiu, setDesistiu] = useState(false);

  // Controle de desenho
  const [desenhando, setDesenhando] = useState(false);
  const comprimentoTracadoRef = useRef(0);
  const ultimoPontoRef = useRef({ x: 0, y: 0 });
  const hitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pixelsMetaRef = useRef<number>(0);

  const tocarAudio = (caminho: string) => {
    const audio = new Audio(caminho);
    audio.play().catch(e => console.log("Erro ao reproduzir áudio:", e));
  };

  const iniciarJogo = () => {
    setStarted(true);
    setJogoFinalizado(false);
    setDesistiu(false);
    setNivelAtual(0);
    setTentativas(3);
    setMensagem("");
    setTimeout(desenharBase, 100); // Aguarda o canvas renderizar
  };

  const desenharBase = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#a8a8a8";
    ctx.setLineDash([10, 10]);

    // Desenha o tracejado alvo
    if (desenhos[nivelAtual]) {
      desenhos[nivelAtual](ctx);
    }

    // Prepara o hitCanvas para calcular a área exata a ser coberta
    if (!hitCanvasRef.current) {
      const hitCanvas = document.createElement("canvas");
      hitCanvas.width = canvas.width;
      hitCanvas.height = canvas.height;
      hitCanvasRef.current = hitCanvas;
    }
    
    const hitCtx = hitCanvasRef.current.getContext("2d", { willReadFrequently: true });
    if (hitCtx) {
      hitCtx.clearRect(0, 0, hitCanvasRef.current.width, hitCanvasRef.current.height);
      hitCtx.globalCompositeOperation = "source-over";
      hitCtx.lineWidth = 30; // Área de tolerância generosa
      hitCtx.lineCap = "round";
      hitCtx.lineJoin = "round";
      hitCtx.strokeStyle = "black";
      
      if (desenhos[nivelAtual]) {
        desenhos[nivelAtual](hitCtx);
      }

      // Contar pixels iniciais que compõem a área alvo
      const imageData = hitCtx.getImageData(0, 0, hitCanvasRef.current.width, hitCanvasRef.current.height);
      let count = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] > 0) count++;
      }
      pixelsMetaRef.current = count;
    }

    comprimentoTracadoRef.current = 0;
  };

  useEffect(() => {
    if (started && !jogoFinalizado && !desistiu) {
      desenharBase();
    }
  }, [nivelAtual, started, jogoFinalizado, desistiu]);

  const obterCoordenadas = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const iniciarTraco = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setDesenhando(true);
    const { x, y } = obterCoordenadas(e, canvas);
    ultimoPontoRef.current = { x, y };

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const desenhar = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!desenhando || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = obterCoordenadas(e, canvas);
    const { x: ultimoX, y: ultimoY } = ultimoPontoRef.current;

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

    // Apaga a área correspondente no hitCanvas para marcar como "coberto"
    if (hitCanvasRef.current) {
      const hitCtx = hitCanvasRef.current.getContext("2d");
      if (hitCtx) {
        hitCtx.globalCompositeOperation = "destination-out";
        hitCtx.lineWidth = 30; // Mesma largura da tolerância
        hitCtx.lineCap = "round";
        hitCtx.beginPath();
        hitCtx.moveTo(ultimoX, ultimoY);
        hitCtx.lineTo(x, y);
        hitCtx.stroke();
      }
    }

    comprimentoTracadoRef.current += distancia;
    ultimoPontoRef.current = { x, y };
  };

  const pararTraco = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!desenhando || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) ctx.beginPath();
    setDesenhando(false);
  };

  const proximoNivel = () => {
    if (nivelAtual + 1 < totalNiveis) {
      setNivelAtual(nivelAtual + 1);
      setTentativas(3);
      setMensagem("");
    } else {
      setJogoFinalizado(true);
      tocarAudio(efeitoVitoria);
      confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
    }
  };

  const finalizarDesenho = () => {
    let porcentagem = 0;
    if (hitCanvasRef.current && pixelsMetaRef.current > 0) {
      const hitCtx = hitCanvasRef.current.getContext("2d");
      if (hitCtx) {
        const imageData = hitCtx.getImageData(0, 0, hitCanvasRef.current.width, hitCanvasRef.current.height);
        let pixelsRestantes = 0;
        for (let i = 3; i < imageData.data.length; i += 4) {
          if (imageData.data[i] > 0) pixelsRestantes++;
        }
        
        const cobertos = pixelsMetaRef.current - pixelsRestantes;
        porcentagem = (cobertos / pixelsMetaRef.current) * 100;
      }
    } else {
      // Fallback
      const metaAtual = METAS_BASE[nivelAtual];
      porcentagem = (comprimentoTracadoRef.current / metaAtual) * 100;
    }

    if (porcentagem >= 75) {
      tocarAudio(efeitoAcerto);
      setMensagem("🎉 Parabéns! Você completou o desenho!");
      setTimeout(() => {
        proximoNivel();
      }, 2000);
    } else {
      const novasTentativas = tentativas - 1;
      tocarAudio(efeitoErro);
      if (novasTentativas > 0) {
        setTentativas(novasTentativas);
        setMensagem(`Ainda não completou! Você cobriu ${porcentagem.toFixed(1)}%. Tente novamente.`);
        setTimeout(() => {
          desenharBase();
          setMensagem("");
        }, 3000);
      } else {
        setTentativas(0);
        setMensagem("Tentativas esgotadas! Indo para o próximo...");
        setTimeout(() => {
          proximoNivel();
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins relative pb-24">
      {!started && (
        <div className="flex flex-col items-center justify-center p-6 min-h-screen">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4 border-t-8 border-orange-500 animate-pop-in">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Cobrindo Formas</h1>
            <p className="text-gray-600 mb-8 font-medium">Cubra os tracejados na tela para praticar sua coordenação motora!</p>
            <button
              onClick={iniciarJogo}
              className="w-full font-bold py-4 px-8 rounded-xl text-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
            >
              Jogar Agora
            </button>
          </div>
        </div>
      )}

      {started && !jogoFinalizado && !desistiu && (
        <main className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center pt-4 md:pt-8 pb-24">
          {/* Header */}
          <div className="mb-4 flex flex-col md:flex-row justify-between w-full max-w-2xl items-center pb-2 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-700 mb-2 md:mb-0">Cubra o Tracejado</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">
                Tentativas: <span className="text-blue-600 font-bold mr-4">{tentativas} / 3</span>
                Progresso: <span className="text-blue-600 font-bold">{nivelAtual + 1} / {totalNiveis}</span>
              </span>
              <button
                onClick={() => {
                  tocarAudio(efeitoDerrota);
                  setDesistiu(true);
                }}
                className="px-5 py-2 bg-red-100 hover:bg-red-200 rounded-lg cursor-pointer text-sm font-bold text-red-700 transition shadow-sm"
              >
                Desistir
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-4 md:p-8 mb-8 mt-2 md:mt-4 relative flex flex-col items-center">
            <div className="h-10 mb-4 text-center">
              {mensagem && (
                <p className={`text-xl font-bold ${mensagem.includes('Parabéns') ? 'text-green-500 animate-bounce' : 'text-orange-500'}`}>
                  {mensagem}
                </p>
              )}
            </div>

            <div className="border-4 border-gray-300 rounded-2xl overflow-hidden bg-white mb-6 relative" style={{ touchAction: 'none' }}>
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="cursor-crosshair w-full max-w-[400px] h-auto aspect-square"
                onMouseDown={iniciarTraco}
                onMouseMove={desenhar}
                onMouseUp={pararTraco}
                onMouseLeave={pararTraco}
                onTouchStart={iniciarTraco}
                onTouchMove={desenhar}
                onTouchEnd={pararTraco}
                onTouchCancel={pararTraco}
              />
            </div>

            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={desenharBase}
                className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 flex-1 max-w-[180px]"
              >
                <RotateCcw size={20} />
                Limpar
              </button>
              <button
                onClick={finalizarDesenho}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 flex-1 max-w-[180px]"
              >
                Finalizar
              </button>
            </div>
          </div>
        </main>
      )}

      {(desistiu || jogoFinalizado) && (
        <div className="flex flex-col items-center justify-center p-6 min-h-[80vh]">
          {desistiu && (
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center border-t-8 border-orange-500 animate-pop-in">
              <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-orange-500 text-5xl font-bold">!</span>
              </div>
              <h2 className="text-4xl font-extrabold text-orange-600 mb-4">Você Desistiu!</h2>
              <p className="text-xl text-gray-700 mb-2">
                Você completou <span className="font-bold text-2xl text-orange-600">{nivelAtual}</span> formas.
              </p>
              <div className="flex flex-col gap-3 w-full mt-8">
                <button
                  onClick={iniciarJogo}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
                >
                  Jogar Novamente
                </button>
                <Link
                  to="/"
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg block"
                >
                  Voltar para o Menu
                </Link>
              </div>
            </div>
          )}

          {jogoFinalizado && (
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center border-t-8 border-green-500 animate-pop-in">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Trophy size={40} className="text-green-500" />
              </div>
              <h2 className="text-4xl font-extrabold text-green-600 mb-4">Você Venceu!</h2>
              <p className="text-xl text-gray-700 mb-8">
                Parabéns! Você cobriu todas as formas com sucesso!
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={iniciarJogo}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
                >
                  Jogar Novamente
                </button>
                <Link
                  to="/"
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg block"
                >
                  Voltar para o Menu
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
