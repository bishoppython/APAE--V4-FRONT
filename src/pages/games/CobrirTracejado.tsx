import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";
import { Trophy, RotateCcw } from "lucide-react";
import { PageContainer } from "@/components/ui/page_components";
import MenuGame from "@/components/MenuGame";
import HeaderGame from "@/components/HeaderGame";
import { OverlayResultado } from "@/components/OverlayResultado";

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

  const [nivelAtual, setNivelAtual] = useState(0);
  const [tentativas, setTentativas] = useState(3);
  const [mensagem, setMensagem] = useState("");
  const [gameState, setGameState] = useState<
    "menu" | "playing" | "won" | "lost" | "gaveUp"
  >("menu");
  
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
    setGameState('playing');
    setNivelAtual(0);
    setTentativas(3);
    setMensagem("");
    setTimeout(desenharBase, 100); // Aguarda o canvas renderizar
  };

  const backToMenu = () => {
    setGameState("menu");
  };

  const handleGiveUp = () => {
    setGameState("gaveUp");
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
    if (gameState === 'playing') {
      desenharBase();
    }
  }, [nivelAtual, gameState]);

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
      setGameState('won');
      tocarAudio("/audio/efeito-vitória.mp3");
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
  <div className="min-h-screen bg-white font-poppins relative pb-24" aria-live="polite">

    <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          }
          @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-pop-in {
            animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
        `}
      </style>
      
  <PageContainer className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center pt-4 md:pt-8 pb-8">
    
      
      {gameState === 'menu' && (
          <MenuGame
            titulo="Cobrindo Formas"
            subtitulo="Cubra os tracejados na tela para praticar sua coordenação motora!"
            onIniciar={iniciarJogo}
            corDestaque="orange"
            icones={
              <>
                <div className="flex items-center justify-center gap-3 md:gap-6 max-w-full overflow-hidden">
                  <span className="text-3xl md:text-4xl select-none shrink">✏️</span>
                  <span className="text-3xl md:text-4xl select-none shrink">〰️</span>
                  <span className="text-3xl md:text-4xl select-none shrink">🖌️</span>
                </div>
              </>
            }
          />
      )}

      {gameState === 'playing' && (
        <section aria-label="Área de jogo ativa" className="w-full flex flex-col items-center">
          
          {/* Header */}
          <div className="mb-4 flex flex-col md:flex-row justify-between w-full max-w-2xl items-center pb-2 border-b border-gray-200">
            <HeaderGame
              titulo="Cubra o Tracejado"
              onDesistir={handleGiveUp}
            >
              {/* Aria-live anuncia dinamicamente o progresso e erros */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-gray-600 font-medium">
              
              <div 
                aria-live="polite" 
                aria-atomic="true"
                className="mr-4"
              >
                <span>Tentativas: </span>
                <span className="text-blue-600 font-bold">{tentativas} de 3</span>
              </div>

              
              <div 
                aria-live="polite" 
                aria-atomic="true"
              >
                <span>Progresso: </span>
                <span className="text-blue-600 font-bold">{nivelAtual + 1} de {totalNiveis}</span>
              </div>
              </div>
            </HeaderGame>
          </div>

          {/* Content */}
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-4 md:p-8 mb-8 mt-2 md:mt-4 relative flex flex-col items-center">
            
            <div className="h-10 mb-4 text-center" role="status" aria-live="assertive">
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
                role="img"
                aria-label={`Quadro de desenho interativo. Nível ${nivelAtual + 1}. Use o mouse para cobrir o traçado da forma.`}
                tabIndex={0}
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
                type="button"
                onClick={desenharBase}
                aria-label="Limpar desenho atual e recomeçar esta forma"
                className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 flex-1 max-w-[180px]"
              >
                <RotateCcw size={20} aria-hidden="true" />
                Limpar
              </button>
              
              <button
                type="button"
                onClick={finalizarDesenho}
                aria-label="Finalizar e avaliar precisão do traçado"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 flex-1 max-w-[180px]"
              >
                Finalizar
              </button>
            </div>
          </div>
        </section>
      )}

      
        {gameState === "gaveUp" && (
          <OverlayResultado
            tipo="desistencia"
            titulo="Você desistiu!"
            subtitulo={
              <>
                <p className="text-xl text-gray-700 mb-2">
                  Você completou <span className="font-bold text-2xl text-orange-600">{nivelAtual}</span> formas.
                </p>
              </>
            }
            onReiniciar={backToMenu}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
          />
        )}

        {gameState === 'won' && (
          <OverlayResultado
            tipo="vitoria"
            titulo="Você Venceu!"
            subtitulo={
              <>
                <p className="text-xl text-gray-700 mb-2">
                  Parabéns! Você cobriu todas as formas com sucesso!
                </p>
              </>
            }
            onReiniciar={backToMenu}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/xl"
                className="h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        )}
      
    
  </PageContainer>
  </div>
);
}
