import { useState, useEffect, useRef, type JSX } from "react";
import confetti from "canvas-confetti";
import { OverlayResultado } from "@/components/OverlayResultado";
import HeaderGame from "@/components/HeaderGame";
import InstructionsGame from "@/components/InstructionsGame";
import { PageContainer } from "@/components/ui/page_components";
import MenuGame from "@/components/MenuGame";

// Importa efeitos sonoros
const efeitoAcerto = new URL("../../assets/sounds/efeitos/efeito-acerto.mp3", import.meta.url).href;
const efeitoErro = new URL("../../assets/sounds/efeitos/efeito-erro.mp3", import.meta.url).href;
const efeitoVitoria = new URL("../../assets/sounds/efeitos/efeito-vitória.mp3", import.meta.url).href;

interface Forma {
  id: string;
  nome: string;
  cor: string;
  renderSVG: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

const formasData: Forma[] = [
  {
    id: "circulo",
    nome: "Círculo",
    cor: "text-red-500",
    renderSVG: (props) => (
      <svg viewBox="0 0 100 100" {...props}>
        <circle cx="50" cy="50" r="45" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "quadrado",
    nome: "Quadrado",
    cor: "text-blue-500",
    renderSVG: (props) => (
      <svg viewBox="0 0 100 100" {...props}>
        <rect x="10" y="10" width="80" height="80" rx="8" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "triangulo",
    nome: "Triângulo",
    cor: "text-yellow-500",
    renderSVG: (props) => (
      <svg viewBox="0 0 100 100" {...props}>
        <path d="M50 10 L90 85 L10 85 Z" fill="currentColor" strokeLinejoin="round" strokeWidth="4" stroke="currentColor" />
      </svg>
    ),
  },
  {
    id: "estrela",
    nome: "Estrela",
    cor: "text-orange-500",
    renderSVG: (props) => (
      <svg viewBox="0 0 100 100" {...props}>
        <polygon points="50,5 61,35 95,35 68,54 78,85 50,65 22,85 32,54 5,35 39,35" fill="currentColor" strokeLinejoin="round" strokeWidth="3" stroke="currentColor" />
      </svg>
    ),
  },
  {
    id: "coracao",
    nome: "Coração",
    cor: "text-pink-500",
    renderSVG: (props) => (
      <svg viewBox="0 0 100 100" {...props}>
        <path d="M 50 85 C 50 85 10 55 10 30 C 10 15 25 5 40 15 C 50 25 50 25 50 25 C 50 25 50 25 60 15 C 75 5 90 15 90 30 C 90 55 50 85 50 85 Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "losango",
    nome: "Losango",
    cor: "text-purple-500",
    renderSVG: (props) => (
      <svg viewBox="0 0 100 100" {...props}>
        <polygon points="50,5 90,50 50,95 10,50" fill="currentColor" strokeLinejoin="round" strokeWidth="4" stroke="currentColor" />
      </svg>
    ),
  },
  {
    id: "pentagono",
    nome: "Pentágono",
    cor: "text-teal-500",
    renderSVG: (props) => (
      <svg viewBox="0 0 100 100" {...props}>
        <polygon points="50,5 95,38 78,95 22,95 5,38" fill="currentColor" strokeLinejoin="round" strokeWidth="4" stroke="currentColor" />
      </svg>
    ),
  },
  {
    id: "hexagono",
    nome: "Hexágono",
    cor: "text-indigo-500",
    renderSVG: (props) => (
      <svg viewBox="0 0 100 100" {...props}>
        <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" fill="currentColor" strokeLinejoin="round" strokeWidth="4" stroke="currentColor" />
      </svg>
    ),
  },
];

interface DragState {
  id: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export default function EncaixeFormas() {
  const [formasNoPainel, setFormasNoPainel] = useState<Forma[]>([]);
  const [encaixadas, setEncaixadas] = useState<string[]>([]);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [erroShapeId, setErroShapeId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'won' | 'lost' | 'gaveUp'>('menu');
  const [erros, setErros] = useState(0);
  const MAX_ERROS = 3;
  
  // Referências para verificar colisão no drop
  const dropZonesRef = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    // Previne comportamento de arrastar padrão do HTML para evitar bugs com imagens/svgs
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener('dragstart', preventDefault);
    return () => document.removeEventListener('dragstart', preventDefault);
  }, []);

  const tocarAudio = (caminho: string) => {
    const audio = new Audio(caminho);
    audio.play().catch((e) => console.log("Erro ao reproduzir áudio:", e));
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  const handleGiveUp = () => {
    setGameState('gaveUp');
  };

  const iniciarJogo = () => {
    setEncaixadas([]);
    setErros(0);
    setErroShapeId(null);
    // Embaralha as formas que ficarão no painel inferior para arrastar
    setFormasNoPainel([...formasData].sort(() => 0.5 - Math.random()));
    setGameState('playing');
  };

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    if (encaixadas.includes(id)) return;
    
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    setDragState({
      id,
      startX: e.clientX,
      startY: e.clientY,
      currentX: 0,
      currentY: 0
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState) return;
    
    setDragState(prev => prev ? {
      ...prev,
      currentX: e.clientX - prev.startX,
      currentY: e.clientY - prev.startY
    } : null);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragState) return;

    const target = e.currentTarget as HTMLElement;
    target.releasePointerCapture(e.pointerId);

    // Verifica se soltou em cima da zona correspondente
    const dropZone = dropZonesRef.current[dragState.id];
    if (dropZone) {
      const dropRect = dropZone.getBoundingClientRect();
      const elementRect = target.getBoundingClientRect();
      
      // Calcula o centro do elemento arrastado
      const elemCenterX = elementRect.left + elementRect.width / 2;
      const elemCenterY = elementRect.top + elementRect.height / 2;

      // Verifica se o centro do elemento está dentro da área do drop zone
      if (
        elemCenterX >= dropRect.left &&
        elemCenterX <= dropRect.right &&
        elemCenterY >= dropRect.top &&
        elemCenterY <= dropRect.bottom
      ) {
        // Acertou!
        const novasEncaixadas = [...encaixadas, dragState.id];
        setEncaixadas(novasEncaixadas);
        tocarAudio(efeitoAcerto);

        // Verifica vitória
        if (novasEncaixadas.length === formasData.length) {
          setTimeout(() => {
            setGameState('won');
            tocarAudio(efeitoVitoria);
            confetti({
              particleCount: 300,
              spread: 120,
              origin: { y: 0.6 },
            });
          }, 500);
        }
      } else {
        // Errou, volta pro lugar
        tocarAudio(efeitoErro);
        setErroShapeId(dragState.id);
        setTimeout(() => setErroShapeId(null), 500);

        const novosErros = erros + 1;
        setErros(novosErros);

        if (novosErros >= MAX_ERROS) {
          setTimeout(() => {
            setGameState('lost');
            tocarAudio(efeitoErro);
          }, 500);
        }
      }
    }

    setDragState(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins relative pb-24">
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
          titulo="Encaixe as Formas"
          subtitulo="Arraste as formas para seus lugares corretos!"
          onIniciar={iniciarJogo}
          corDestaque="indigo"
          icones={
              <>
              <div className="flex justify-center mb-6 space-x-2">
                {formasData[0].renderSVG({ className: "text-3xl md:text-5xl select-none shrink w-12 h-12 text-red-500" })}
                {formasData[1].renderSVG({ className: "text-3xl md:text-5xl select-none shrink w-12 h-12 text-blue-500" })}
                {formasData[2].renderSVG({ className: "text-3xl md:text-5xl select-none shrink w-12 h-12 text-yellow-500" })}
              </div>
              </>
          }  
          />
      )}
      
      {gameState === 'playing' && (
            <>
              {/* Header */}
              <HeaderGame
                titulo="Arraste as Formas" 
                onDesistir={handleGiveUp}
              >
                {/* Children */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div 
                    aria-live="polite" 
                    aria-atomic="true" 
                    className="text-gray-600 font-medium"
                  >
                    <span>Erros: </span>
                    <span className="text-red-500 font-bold">{erros} de {MAX_ERROS}</span>
                  </div>

                  <div 
                    aria-live="polite" 
                    aria-atomic="true" 
                    className="text-gray-600 font-medium sr-only sm:not-sr-only sm:inline-block"
                  >
                    <span>Progresso: </span>
                    <span className="text-blue-600 font-bold">{encaixadas.length} de {formasData.length}</span>
                  </div>
                </div>
              </HeaderGame>

              {/* Board (Área dos encaixes/sombras) */}
              <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
                <h2 className="text-center text-xl font-bold text-gray-500 mb-6">Mural de Encaixe</h2>
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-4 md:gap-8 justify-items-center">
                  {formasData.map((forma) => {
                    const isEncaixada = encaixadas.includes(forma.id);
                    return (
                      <div 
                        key={`shadow-${forma.id}`}
                        ref={(el) => { dropZonesRef.current[forma.id] = el; }}
                        className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 flex items-center justify-center rounded-2xl bg-gray-50 border-4 border-dashed border-gray-300"
                      >
                        {/* A sombra sempre fica visível de fundo (com opacidade menor) */}
                        {forma.renderSVG({ className: "w-4/5 h-4/5 text-gray-200" })}
                        
                        {/* Se encaixou, renderiza a forma colorida aqui! */}
                        {isEncaixada && (
                          <div className="absolute inset-0 flex items-center justify-center animate-pop-in">
                            {forma.renderSVG({ className: `w-4/5 h-4/5 ${forma.cor} drop-shadow-md` })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tray (Área das formas para arrastar) */}
              <div className="w-full max-w-4xl bg-green-100 rounded-3xl shadow-inner p-6 md:p-8">
                <h2 className="text-center text-lg font-bold text-green-600 mb-4">Suas Formas</h2>
                <div className="grid grid-cols-4 gap-4 md:gap-8 justify-items-center">
                  {formasNoPainel.map((forma) => {
                    const isEncaixada = encaixadas.includes(forma.id);
                    const isDragging = dragState?.id === forma.id;
                    
                    // Se estiver encaixada, deixa um espaço vazio para não quebrar o layout
                    if (isEncaixada) {
                      return <div key={`empty-${forma.id}`} className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36"></div>;
                    }

                    return (
                      <div
                        key={`drag-${forma.id}`}
                        onPointerDown={(e) => handlePointerDown(e, forma.id)}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        className={`w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 flex items-center justify-center rounded-2xl bg-white shadow-lg border-2 border-transparent hover:border-green-300 touch-none select-none
                          ${isDragging ? 'z-50 cursor-grabbing shadow-2xl opacity-90' : 'cursor-grab hover:-translate-y-1 hover:shadow-xl'}
                          ${erroShapeId === forma.id ? 'animate-shake border-red-500 bg-red-50' : ''}
                        `}
                        style={{
                          transform: isDragging ? `translate(${dragState.currentX}px, ${dragState.currentY}px) scale(1.1)` : 'translate(0px, 0px) scale(1)',
                          transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)'
                        }}
                      >
                        <div className="w-3/4 h-3/4 pointer-events-none">
                          {forma.renderSVG({ className: `w-full h-full ${forma.cor}` })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instruções (Estilo Labirinto) */}
              <InstructionsGame>
                Toque, segure e arraste as formas coloridas para encaixá-las em seus lugares no mural.
              </InstructionsGame>
            </>
          )}

        {gameState === "lost" && (
          <OverlayResultado
            tipo="derrota"
            titulo="Fim de Jogo!"
            subtitulo={
              <>
                Você atingiu o limite de{" "}
                <span className="font-bold text-red-600 text-2xl">
                  {MAX_ERROS}
                </span>{" "}
                erros.
              </>
            }
            onReiniciar={backToMenu}
            icon={
              <span className="mx-auto w-20 h-20 text-5xl font-bold text-red-600 bg-red-100 rounded-full flex items-center justify-center mb-6">
                X
              </span>
            }
          />
        )}

        {gameState === "gaveUp" && (
          <OverlayResultado
            tipo="desistencia"
            titulo="Você desistiu!"
            subtitulo={
              <>
                Que pena! Você chegou a encaixar{" "}
                <span className="font-bold text-2xl text-orange-600">
                  {encaixadas.length}
                </span>{" "}
                formas.
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

          {gameState === "won" && (
          <OverlayResultado
            tipo="vitoria"
            titulo="Você Venceu!"
            subtitulo="Parabéns! Você completou o mural com sucesso."
            onReiniciar={backToMenu}
            icon={
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              </div>
            }
          />
        )}
      </PageContainer>
    </div>
  );
}
