import { useState, useEffect, useRef, type JSX } from "react";
import { Link } from "react-router-dom";
import { Trophy, Info } from "lucide-react";
import confetti from "canvas-confetti";

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
  const [started, setStarted] = useState(false);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [formasNoPainel, setFormasNoPainel] = useState<Forma[]>([]);
  const [encaixadas, setEncaixadas] = useState<string[]>([]);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [erros, setErros] = useState(0);
  const [jogoPerdido, setJogoPerdido] = useState(false);
  const [desistiu, setDesistiu] = useState(false);
  const [erroShapeId, setErroShapeId] = useState<string | null>(null);
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

  const iniciarJogo = () => {
    setJogoFinalizado(false);
    setJogoPerdido(false);
    setDesistiu(false);
    setEncaixadas([]);
    setErros(0);
    setErroShapeId(null);
    // Embaralha as formas que ficarão no painel inferior para arrastar
    setFormasNoPainel([...formasData].sort(() => 0.5 - Math.random()));
    setStarted(true);
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
        tocarAudio("/audio/efeito_acerto.mp3");

        // Verifica vitória
        if (novasEncaixadas.length === formasData.length) {
          setTimeout(() => {
            setJogoFinalizado(true);
            tocarAudio("/audio/efeito-vitória.mp3");
            confetti({
              particleCount: 300,
              spread: 120,
              origin: { y: 0.6 },
            });
          }, 500);
        }
      } else {
        // Errou, volta pro lugar
        tocarAudio("/audio/efeito-erro.mp3");
        setErroShapeId(dragState.id);
        setTimeout(() => setErroShapeId(null), 500);

        const novosErros = erros + 1;
        setErros(novosErros);

        if (novosErros >= MAX_ERROS) {
          setTimeout(() => {
            setJogoPerdido(true);
          }, 500);
        }
      }
    }

    setDragState(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins relative pb-24 overflow-x-hidden">
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

      {!started && (
        <div className="flex flex-col items-center justify-center p-6 min-h-screen">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full mx-4 border-t-8 border-purple-500">
            <div className="flex justify-center mb-6 space-x-2">
              {formasData[0].renderSVG({ className: "w-12 h-12 text-red-500" })}
              {formasData[1].renderSVG({ className: "w-12 h-12 text-blue-500" })}
              {formasData[2].renderSVG({ className: "w-12 h-12 text-yellow-500" })}
            </div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Encaixe as Formas</h1>
            <p className="text-gray-600 mb-8 font-medium">Arraste as formas para seus lugares corretos!</p>
            <button
              onClick={iniciarJogo}
              className="bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg cursor-pointer transition transform hover:scale-105 active:scale-95 w-full flex items-center justify-center gap-2"
            >
              Jogar Agora
            </button>
          </div>
        </div>
      )}

      {started && !jogoFinalizado && !jogoPerdido && !desistiu && (
        <main className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center pt-4 md:pt-8 pb-24">
              {/* Header */}
              <div className="mb-6 flex flex-col md:flex-row justify-between w-full max-w-4xl items-center pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-700 mb-2 md:mb-0">Arraste as Formas</h1>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 font-medium">
                    Erros: <span className="text-red-500 font-bold">{erros} / {MAX_ERROS}</span>
                  </span>
                  <span className="text-gray-600 font-medium hidden sm:inline">
                    Progresso: <span className="text-blue-600 font-bold">{encaixadas.length} / {formasData.length}</span>
                  </span>
                  <button
                    onClick={() => setDesistiu(true)}
                    className="px-5 py-2 bg-red-100 hover:bg-red-200 rounded-lg cursor-pointer text-sm font-bold text-red-700 transition shadow-sm"
                  >
                    Desistir
                  </button>
                </div>
              </div>

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
              <div className="mt-8 mb-6 instrucao bg-amber-50 border border-amber-200 text-amber-900 px-6 py-4 rounded-xl max-w-4xl w-full text-center shadow-sm">
                <p className="font-medium text-lg flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Toque, segure e arraste as formas coloridas para encaixá-las em seus lugares no mural.
                </p>
              </div>
        </main>
      )}

      {(jogoPerdido || desistiu || jogoFinalizado) && (
        <div className="flex flex-col items-center justify-center p-6 min-h-[80vh]">
          {jogoPerdido && (
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center border-t-8 border-red-500 animate-pop-in">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-red-500 text-5xl font-bold">X</span>
              </div>
              <h2 className="text-4xl font-extrabold text-red-600 mb-4">Fim de Jogo!</h2>
              <p className="text-xl text-gray-700 mb-8">
                Você atingiu o limite de <span className="font-bold text-red-600 text-2xl">{MAX_ERROS}</span> erros.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={iniciarJogo}
                  className="w-full bg-green-500 hover:bg-green-600 text-white cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
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

          {desistiu && (
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center border-t-8 border-orange-500 animate-pop-in">
              <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Info size={40} className="text-orange-500" />
              </div>
              <h2 className="text-4xl font-extrabold text-orange-600 mb-4">Você Desistiu!</h2>
              <p className="text-xl text-gray-700 mb-2">
                Que pena! Você chegou a encaixar <span className="font-bold text-2xl text-orange-600">{encaixadas.length}</span> formas.
              </p>
              <p className="text-md text-gray-500 mb-8">
                Ainda faltavam {formasData.length - encaixadas.length} formas para completar o mural.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={iniciarJogo}
                  className="w-full bg-green-500 hover:bg-green-600 text-white cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
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
                Parabéns! Você completou o mural com sucesso.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={iniciarJogo}
                  className="w-full bg-green-500 hover:bg-green-600 text-white cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
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
