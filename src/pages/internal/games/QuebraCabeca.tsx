import { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { useMemo } from 'react';
import { PageContainer } from "@/components/ui/page_components";
import { OverlayResultado } from "@/components/OverlayResultado";
import MenuGame from "@/components/MenuGame";
import InstructionsGame from "@/components/InstructionsGame";
import HeaderGame from "@/components/HeaderGame";

const efeitoAcerto = new URL(
  "../../assets/sounds/efeitos/efeito-acerto.mp3",
  import.meta.url,
).href;
const efeitoVitoria = new URL(
  "../../assets/sounds/efeitos/efeito-vitória.mp3",
  import.meta.url,
).href;

const animaisData = [
  { id: "elefante", nome: "Elefante" },
  { id: "leao", nome: "Leão" },
  { id: "girafa", nome: "Girafa" },
  { id: "cachorro", nome: "Cachorro" },
  { id: "gato", nome: "Gato" },
  { id: "macaco", nome: "Macaco" },
  { id: "golfinho", nome: "Golfinho" },
  { id: "hipopotamo", nome: "Hipopótamo" },
];

const getFullImageUrl = (animal: string) => {
  return new URL(`../../assets/images/quebraCabeca/${animal}Puzzle/imagens/${animal}Puzzle.png`, import.meta.url).href;
};

interface Peca {
  id: string; // e.g. "r0c0"
  posicaoOriginal: number; // 0 to 24
  pathData: string;
  xMin: number;
  yMin: number;
  boxWidth: number;
  boxHeight: number;
  c: number;
  r: number;
}

function gerarPecas(): Peca[] {
  const TILE = 100;
  
  // Create matrices for tabs: +1 is OUT, -1 is IN
  const vTabs = Array(5).fill(0).map(() => Array(4).fill(0).map(() => Math.random() > 0.5 ? 1 : -1));
  const hTabs = Array(4).fill(0).map(() => Array(5).fill(0).map(() => Math.random() > 0.5 ? 1 : -1));

  const drawEdge = (x0: number, y0: number, x1: number, y1: number, tab: number) => {
    if (tab === 0) return `L ${x1} ${y1} `;
    const V = { x: x1 - x0, y: y1 - y0 };
    const N = { x: V.y, y: -V.x }; // Points OUTWARDS
    const pt = (t: number, n: number) => `${(x0 + V.x * t + N.x * n * tab).toFixed(1)},${(y0 + V.y * t + N.y * n * tab).toFixed(1)}`;

    return `L ${pt(0.38, 0)} ` +
           `C ${pt(0.38, 0.15)} ${pt(0.25, 0.15)} ${pt(0.25, 0.25)} ` +
           `C ${pt(0.25, 0.45)} ${pt(0.75, 0.45)} ${pt(0.75, 0.25)} ` +
           `C ${pt(0.75, 0.15)} ${pt(0.62, 0.15)} ${pt(0.62, 0)} ` +
           `L ${pt(1, 0)} `;
  };

  const pecas: Peca[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      // For adjacent pieces, one's OUT is another's IN. 
      // hTabs[r][c] defines bottom edge of (r,c). So top edge of (r+1,c) is -hTabs[r][c].
      const topTab = r === 0 ? 0 : -hTabs[r-1][c];
      const rightTab = c === 4 ? 0 : vTabs[r][c];
      const bottomTab = r === 4 ? 0 : hTabs[r][c];
      const leftTab = c === 0 ? 0 : -vTabs[r][c-1];

      const TL = { x: c*TILE, y: r*TILE };
      const TR = { x: (c+1)*TILE, y: r*TILE };
      const BR = { x: (c+1)*TILE, y: (r+1)*TILE };
      const BL = { x: c*TILE, y: (r+1)*TILE };

      const pathData = `M ${TL.x} ${TL.y} ` +
                       drawEdge(TL.x, TL.y, TR.x, TR.y, topTab) +
                       drawEdge(TR.x, TR.y, BR.x, BR.y, rightTab) +
                       drawEdge(BR.x, BR.y, BL.x, BL.y, bottomTab) +
                       drawEdge(BL.x, BL.y, TL.x, TL.y, leftTab) +
                       `Z`;

      const xMin = c * TILE - (leftTab === 1 ? 45 : 0);
      const yMin = r * TILE - (topTab === 1 ? 45 : 0);
      const boxWidth = TILE + (leftTab === 1 ? 45 : 0) + (rightTab === 1 ? 45 : 0);
      const boxHeight = TILE + (topTab === 1 ? 45 : 0) + (bottomTab === 1 ? 45 : 0);

      pecas.push({
        id: `r${r}c${c}`,
        posicaoOriginal: r * 5 + c,
        pathData,
        xMin, yMin, boxWidth, boxHeight,
        c, r
      });
    }
  }
  return pecas;
}

interface SvgPieceProps {
  peca: Peca;
  animalId: string;
  isBoard?: boolean;
}
const SvgPiece = ({ peca, animalId, isBoard }: SvgPieceProps) => {
  // Otimização: memoriza o estilo para evitar recálculos desnecessários a cada render
  const estiloSvg = useMemo(() => {
    if (isBoard) {
      return {
        position: 'absolute' as const,
        left: `${(peca.xMin - peca.c * 100)}%`, // Simplificado o cálculo matemático anterior
        top: `${(peca.yMin - peca.r * 100)}%`,  // Simplificado o cálculo matemático anterior
        width: `${peca.boxWidth}%`,
        height: `${peca.boxHeight}%`,
        filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.4))",
        zIndex: 10
      };
    }
    return {
      width: '100%',
      height: '100%',
      filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))"
    };
  }, [isBoard, peca]);

  return (
    <svg 
      style={estiloSvg}
      viewBox={`${peca.xMin} ${peca.yMin} ${peca.boxWidth} ${peca.boxHeight}`}
      className="pointer-events-none" 
    >
      <defs>
        <clipPath id={`clip-${peca.id}`}>
          <path d={peca.pathData} />
        </clipPath>
      </defs>
      <image 
        href={getFullImageUrl(animalId)} 
        width="500" 
        height="500" 
        clipPath={`url(#clip-${peca.id})`}
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
  );
};

export default function QuebraCabeca() {
  const [animalSelecionado, setAnimalSelecionado] = useState<string | null>(null);
  const [gameState, setGameState] = useState<
    "menu" | "playing" | "won" | "lost" | "gaveUp"
  >("menu");
  
  const [tabuleiro, setTabuleiro] = useState<(Peca | null)[]>(Array(25).fill(null));
  const [pecasDisponiveis, setPecasDisponiveis] = useState<Peca[]>([]);
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);
  
  const [tentativas, setTentativas] = useState(0);

  const tocarAudio = (caminho: string) => {
    const audio = new Audio(caminho);
    audio.play().catch(e => console.log("Erro ao reproduzir áudio:", e));
  };

  const iniciarJogo = (animalId: string) => {
    setAnimalSelecionado(animalId);
    setGameState('playing');
    setTentativas(0);
    setTabuleiro(Array(25).fill(null));
    setPecaSelecionada(null);

    const pecasGeradas = gerarPecas();
    setPecasDisponiveis(pecasGeradas.sort(() => Math.random() - 0.5));
  };

  const backToMenu = () => {
    setGameState("menu");
  };

  const handleGiveUp = () => {
    setGameState("gaveUp");
  };

  const backToHome = () => {
    
  };

  const verificarVitoria = (novoTabuleiro: (Peca | null)[]) => {
    if (novoTabuleiro.includes(null)) return false;
    for (let i = 0; i < 25; i++) {
      if (novoTabuleiro[i]?.posicaoOriginal !== i) return false;
    }
    return true;
  };

  const handlePecaClick = (peca: Peca) => {
    if (gameState === 'won') return;
    if (pecaSelecionada?.id === peca.id) {
      setPecaSelecionada(null);
    } else {
      setPecaSelecionada(peca);
    }
  };

  const handleTabuleiroClick = (index: number) => {
    if (gameState === 'won') return;

    if (pecaSelecionada) {
      setTentativas(t => t + 1);
      const novoTabuleiro = [...tabuleiro];
      const pecaNoTabuleiro = novoTabuleiro[index];

      novoTabuleiro[index] = pecaSelecionada;
      let novasDisponiveis = pecasDisponiveis.filter(p => p.id !== pecaSelecionada.id);

      if (pecaNoTabuleiro) {
        novasDisponiveis.push(pecaNoTabuleiro);
      }

      const indexAntigo = tabuleiro.findIndex(p => p?.id === pecaSelecionada.id);
      if (indexAntigo !== -1) {
        novoTabuleiro[indexAntigo] = null;
      }

      const colocouCerto = pecaSelecionada.posicaoOriginal === index;

      setTabuleiro(novoTabuleiro);
      setPecasDisponiveis(novasDisponiveis);
      setPecaSelecionada(null);

      if (verificarVitoria(novoTabuleiro)) {
        setGameState('won');
        tocarAudio("/audio/efeito-vitória.mp3");
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
      } else if (colocouCerto) {
        tocarAudio(efeitoAcerto);
      }
    } else {
      const peca = tabuleiro[index];
      if (peca) {
        const novoTabuleiro = [...tabuleiro];
        novoTabuleiro[index] = null;
        setTabuleiro(novoTabuleiro);
        setPecasDisponiveis([...pecasDisponiveis, peca]);
      }
    }
  };

  const handleDragStartPool = (e: React.DragEvent, peca: Peca) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ type: 'pool', peca }));
  };

  const handleDragStartBoard = (e: React.DragEvent, peca: Peca, index: number) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ type: 'board', peca, index }));
  };

  const handleDropBoard = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (gameState === 'won') return;

    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (!data || !data.peca) return;

      setTentativas(t => t + 1);
      const novoTabuleiro = [...tabuleiro];
      const pecaDestino = novoTabuleiro[index];

      if (data.type === 'pool') {
        novoTabuleiro[index] = data.peca;
        let novasDisponiveis = pecasDisponiveis.filter(p => p.id !== data.peca.id);
        if (pecaDestino) novasDisponiveis.push(pecaDestino);
        setPecasDisponiveis(novasDisponiveis);
      } else if (data.type === 'board') {
        novoTabuleiro[index] = data.peca;
        novoTabuleiro[data.index] = pecaDestino;
      }

      const colocouCerto = data.peca.posicaoOriginal === index;

      setTabuleiro(novoTabuleiro);
      setPecaSelecionada(null);

      if (verificarVitoria(novoTabuleiro)) {
        setGameState('won');
        tocarAudio("/audio/efeito-vitória.mp3");
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
      } else if (colocouCerto) {
        tocarAudio(efeitoAcerto);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white font-poppins relative pb-24">

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
          titulo="Quebra Cabeça"
          subtitulo="Escolha uma imagem para montar"
          corDestaque="orange"
          onIniciar={backToHome}
          textoBotao="Voltar ao Menu"
          icones={
            <>
              <div className="flex items-center justify-center gap-3 md:gap-6 max-w-full overflow-hidden">
                <span className="text-3xl md:text-4xl select-none shrink"></span>
                <span className="text-3xl md:text-4xl select-none shrink"></span>
                <span className="text-3xl md:text-4xl select-none shrink"></span>
              </div>
            </>
          }
        >
          <div 
            role="group" 
            aria-label="Selecione um animal para iniciar o jogo"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-full box-border px-1"
          >
            {animaisData.map(animal => (
              <button
                key={animal.id}
                onClick={() => iniciarJogo(animal.id)}
                lang="pt-BR"
                aria-label={`Montar um ${animal.nome}`}
                className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded-xl border-2 border-transparent hover:bg-blue-100 hover:border-blue-400 cursor-pointer outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm"
              >
                <img 
                  src={getFullImageUrl(animal.id)} 
                  alt="" 
                  aria-hidden="true"
                  className="w-full aspect-square object-cover rounded-lg shadow-sm"
                />
                <span className="font-bold text-gray-700 pointer-events-none" aria-hidden="true">
                  {animal.nome}
                </span>
              </button>
            ))}
          </div>
        </MenuGame>
      )}

      {gameState === 'playing' && (
        <>
          <HeaderGame
            titulo={
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center w-full max-w-full">
                <span className="font-medium text-base sm:text-lg">
                  Montando:
                </span>
                <span className="text-blue-500 capitalize truncate font-bold sm:text-lg">
                  {animaisData.find(a => a.id === animalSelecionado)?.nome || "Animal"}
                </span>
              </div>
            }
            onDesistir={handleGiveUp}
          >
            {/* Children */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">
                Movimentos: <span className="text-blue-600 font-bold">{tentativas}</span>
              </span>
            </div>
          </HeaderGame>

          <div className="flex flex-col md:flex-row gap-8 w-full mt-4 items-start justify-center">
  
        {/* Tabuleiro */}
        <div className="flex flex-col items-center">
          <div 
            role="grid"
            aria-label="Tabuleiro do quebra-cabeça, grade de 5 por 5"
            className="grid grid-cols-5 bg-slate-800 rounded-xl shadow-xl relative isolate"
            style={{ width: "min(90vw, 400px)", height: "min(90vw, 400px)", border: "4px solid #334155" }}
          >
            {/* Background visual grid to guide the user */}
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none z-0 opacity-40" aria-hidden="true">
              {Array(25).fill(0).map((_, i) => (
                <div key={`bg-${i}`} className="border border-slate-600"></div>
              ))}
            </div>

            {tabuleiro.map((peca, index) => {
              const linha = Math.floor(index / 5) + 1;
              const coluna = (index % 5) + 1;
              const slotVazio = !peca;

              return (
                <button
                  key={`slot-${index}`}
                  role="gridcell"
                  lang="pt-BR"
                  aria-label={`Espaço ${index + 1}, Linha ${linha} Coluna ${coluna}. ${slotVazio ? (pecaSelecionada ? 'Toque para encaixar a peça selecionada' : 'Vazio') : `Contém a peça número ${peca}`}`}
                  onClick={() => handleTabuleiroClick(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropBoard(e, index)}
                  className={`relative w-full h-full cursor-pointer transition-colors z-10 border-0 p-0 m-0 bg-transparent outline-none focus:ring-4 focus:ring-blue-500 focus:ring-inset
                    ${pecaSelecionada && slotVazio ? 'bg-white/10' : 'hover:bg-slate-600/50'}
                  `}
                >
                  {slotVazio && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40" aria-hidden="true">
                      <span className="text-slate-400 text-lg md:text-xl font-bold">{index + 1}</span>
                    </div>
                  )}
                  
                  {!slotVazio && (
                    <div 
                      draggable
                      onDragStart={(e) => handleDragStartBoard(e, peca, index)}
                      className="absolute inset-0 cursor-grab active:cursor-grabbing"
                      aria-hidden="true"
                    >
                      {animalSelecionado && (
                        <SvgPiece peca={peca} animalId={animalSelecionado} isBoard={true} />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

              {/* Instruções */}
              <InstructionsGame>
                Toque em uma peça abaixo e depois em um espaço, ou arraste-a!
              </InstructionsGame>

            </div>

            {/* Peças Disponíveis */}
            <div 
              role="group"
              aria-label="Banco de peças disponíveis para encaixar"
              className="flex-1 w-full bg-slate-800 p-4 rounded-2xl shadow-inner border-4 border-slate-700 flex flex-col"
            >
              <h3 className="font-bold text-slate-200 mb-3 text-center" aria-hidden="true">
                Peças ({pecasDisponiveis.length})
              </h3>
              <div 
                role="list"
                aria-label={`${pecasDisponiveis.length} peças não utilizadas`}
                className="flex flex-wrap gap-4 justify-center max-h-[400px] overflow-y-auto p-4 content-start"
              >
                {pecasDisponiveis.map(peca => {
                  const estaSelecionada = pecaSelecionada?.id === peca.id;

                  return (
                    <div
                      key={peca.id}
                      draggable
                      onDragStart={(e) => handleDragStartPool(e, peca)}
                      className={`relative cursor-grab active:cursor-grabbing transition-transform hover:scale-105 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-lg
                        ${estaSelecionada ? 'ring-4 ring-yellow-400 scale-105 bg-white/10' : ''}
                      `}
                    >
                      {/* Botão para acessibilidade via teclado/clique */}
                      <button
                        role="listitem"
                        lang="pt-BR"
                        aria-label={`Peça número ${peca.id}${estaSelecionada ? ', atualmente selecionada' : ''}`}
                        onClick={() => handlePecaClick(peca)} 
                        className="absolute inset-0 w-full h-full border-0 p-0 m-0 bg-transparent outline-none rounded-lg focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2 z-10"
                      />
                      
                      <div className="w-full h-full pointer-events-none z-0" aria-hidden="true">
                        {animalSelecionado && (
                          <SvgPiece peca={peca} animalId={animalSelecionado} isBoard={false} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </>
      )}

      {animalSelecionado && (
        <div className="flex flex-col items-center justify-center p-6 min-h-[80vh]">
          {gameState === 'won' && (
            <OverlayResultado
              tipo="vitoria"
              titulo="Você Venceu!"
              subtitulo={
                <>
                  <p className="text-xl text-gray-700 mb-4">Você montou o {animaisData.find(a => a.id === animalSelecionado)?.nome} com sucesso!</p>
                  <img src={getFullImageUrl(animalSelecionado)} alt="Completo" className="w-48 h-48 mx-auto rounded-xl shadow-md mb-8" />
                </>
              }
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

          {gameState === "gaveUp" && (
            <OverlayResultado
              tipo="desistencia"
              titulo="Ah não!"
              subtitulo={
                <>
                  <p className="text-xl text-gray-700 mb-2">
                    Você desistiu de montar o quebra cabeça.
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
        </div>
      )}
  </PageContainer>
  </div>
  );
}
