import { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import confetti from "canvas-confetti";

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

const SvgPiece = ({ peca, animalId, isBoard }: { peca: Peca; animalId: string, isBoard?: boolean }) => {
  return (
    <svg 
      style={isBoard ? {
        position: 'absolute',
        left: `${( (peca.xMin - peca.c*100) / 100 ) * 100}%`,
        top: `${( (peca.yMin - peca.r*100) / 100 ) * 100}%`,
        width: `${(peca.boxWidth / 100) * 100}%`,
        height: `${(peca.boxHeight / 100) * 100}%`,
        filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.4))",
        zIndex: 10
      } : {
        width: '100%',
        height: '100%',
        filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))"
      }}
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
  const [started, setStarted] = useState(false);
  
  const [tabuleiro, setTabuleiro] = useState<(Peca | null)[]>(Array(25).fill(null));
  const [pecasDisponiveis, setPecasDisponiveis] = useState<Peca[]>([]);
  const [pecaSelecionada, setPecaSelecionada] = useState<Peca | null>(null);
  
  const [tentativas, setTentativas] = useState(0);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [desistiu, setDesistiu] = useState(false);

  const tocarAudio = (caminho: string) => {
    const audio = new Audio(caminho);
    audio.play().catch(e => console.log("Erro ao reproduzir áudio:", e));
  };

  const iniciarJogo = (animalId: string) => {
    setAnimalSelecionado(animalId);
    setStarted(true);
    setJogoFinalizado(false);
    setDesistiu(false);
    setTentativas(0);
    setTabuleiro(Array(25).fill(null));
    setPecaSelecionada(null);

    const pecasGeradas = gerarPecas();
    setPecasDisponiveis(pecasGeradas.sort(() => Math.random() - 0.5));
  };

  const verificarVitoria = (novoTabuleiro: (Peca | null)[]) => {
    if (novoTabuleiro.includes(null)) return false;
    for (let i = 0; i < 25; i++) {
      if (novoTabuleiro[i]?.posicaoOriginal !== i) return false;
    }
    return true;
  };

  const handlePecaClick = (peca: Peca) => {
    if (jogoFinalizado) return;
    if (pecaSelecionada?.id === peca.id) {
      setPecaSelecionada(null);
    } else {
      setPecaSelecionada(peca);
    }
  };

  const handleTabuleiroClick = (index: number) => {
    if (jogoFinalizado) return;

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

      setTabuleiro(novoTabuleiro);
      setPecasDisponiveis(novasDisponiveis);
      setPecaSelecionada(null);

      if (verificarVitoria(novoTabuleiro)) {
        setJogoFinalizado(true);
        tocarAudio("/audio/efeito-vitória.mp3");
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
      } else {
        tocarAudio("/audio/efeito_acerto.mp3");
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
    if (jogoFinalizado) return;

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

      setTabuleiro(novoTabuleiro);
      setPecaSelecionada(null);

      if (verificarVitoria(novoTabuleiro)) {
        setJogoFinalizado(true);
        tocarAudio("/audio/efeito-vitória.mp3");
        confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
      } else {
        tocarAudio("/audio/efeito_acerto.mp3");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-blue-50 font-poppins relative pb-24">
      {!started && (
        <div className="flex flex-col items-center justify-center p-6 min-h-screen">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-4xl w-full border-t-8 border-blue-500 animate-pop-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Quebra Cabeça</h1>
            <p className="text-gray-600 mb-8 font-medium text-lg">Escolha uma imagem para montar!</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {animaisData.map(animal => (
                <button
                  key={animal.id}
                  onClick={() => iniciarJogo(animal.id)}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-100 rounded-xl hover:bg-blue-100 hover:scale-105 transition-all shadow-sm border-2 border-transparent hover:border-blue-400 cursor-pointer"
                >
                  <img 
                    src={getFullImageUrl(animal.id)} 
                    alt={animal.nome} 
                    className="w-full aspect-square object-cover rounded-lg shadow-sm"
                  />
                  <span className="font-bold text-gray-700">{animal.nome}</span>
                </button>
              ))}
            </div>
            
            <Link to="/" className="mt-8 inline-block px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition cursor-pointer">
              Voltar ao Menu
            </Link>
          </div>
        </div>
      )}

      {started && !jogoFinalizado && !desistiu && animalSelecionado && (
        <main className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center pt-4 md:pt-8 pb-8">
          <div className="mb-4 flex flex-col md:flex-row justify-between w-full items-center pb-2 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-700 mb-2 md:mb-0">
              Montando: {animaisData.find(a => a.id === animalSelecionado)?.nome}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Movimentos: <span className="text-blue-600 font-bold">{tentativas}</span></span>
              <button onClick={() => setDesistiu(true)} className="px-5 py-2 bg-red-100 hover:bg-red-200 rounded-lg cursor-pointer text-sm font-bold text-red-700 transition shadow-sm">
                Desistir
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 w-full mt-4 items-start justify-center">
            
            {/* Tabuleiro */}
            <div className="flex flex-col items-center">
              <div 
                className="grid grid-cols-5 bg-slate-800 rounded-xl shadow-xl relative isolate"
                style={{ width: "min(90vw, 400px)", height: "min(90vw, 400px)", border: "4px solid #334155" }}
              >
                {/* Background visual grid to guide the user */}
                <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none z-0 opacity-40">
                  {Array(25).fill(0).map((_, i) => (
                    <div key={`bg-${i}`} className="border border-slate-600"></div>
                  ))}
                </div>

                {tabuleiro.map((peca, index) => (
                  <div 
                    key={`slot-${index}`}
                    onClick={() => handleTabuleiroClick(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropBoard(e, index)}
                    className={`relative w-full h-full cursor-pointer transition-colors z-10
                      ${pecaSelecionada && !peca ? 'bg-white/10' : 'hover:bg-slate-600/50'}
                    `}
                  >
                    {!peca && <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40"><span className="text-slate-400 text-lg md:text-xl font-bold">{index + 1}</span></div>}
                    {peca && (
                      <div 
                        draggable
                        onDragStart={(e) => handleDragStartBoard(e, peca, index)}
                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                      >
                        <SvgPiece peca={peca} animalId={animalSelecionado} isBoard={true} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-gray-500 mt-4 text-sm font-medium">Toque em uma peça abaixo e depois em um espaço, ou arraste-a!</p>
            </div>

            {/* Peças Disponíveis */}
            <div className="flex-1 w-full bg-slate-800 p-4 rounded-2xl shadow-inner border-4 border-slate-700 flex flex-col">
              <h3 className="font-bold text-slate-200 mb-3 text-center">Peças ({pecasDisponiveis.length})</h3>
              <div className="flex flex-wrap gap-4 justify-center max-h-[400px] overflow-y-auto p-4 content-start">
                {pecasDisponiveis.map(peca => (
                  <div
                    key={peca.id}
                    onClick={() => handlePecaClick(peca)}
                    draggable
                    onDragStart={(e) => handleDragStartPool(e, peca)}
                    className={`cursor-grab active:cursor-grabbing transition-transform hover:scale-110 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center
                      ${pecaSelecionada?.id === peca.id ? 'ring-4 ring-yellow-400 scale-110 rounded-lg bg-white/10' : ''}
                    `}
                  >
                    <SvgPiece peca={peca} animalId={animalSelecionado} isBoard={false} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      )}

      {(jogoFinalizado || desistiu) && animalSelecionado && (
        <div className="flex flex-col items-center justify-center p-6 min-h-[80vh]">
          {jogoFinalizado && (
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center border-t-8 border-green-500 animate-pop-in">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Trophy size={40} className="text-green-500" />
              </div>
              <h2 className="text-4xl font-extrabold text-green-600 mb-4">Parabéns!</h2>
              <p className="text-xl text-gray-700 mb-4">Você montou o {animaisData.find(a => a.id === animalSelecionado)?.nome} com sucesso!</p>
              <img src={getFullImageUrl(animalSelecionado)} alt="Completo" className="w-48 h-48 mx-auto rounded-xl shadow-md mb-8" />
              <button
                onClick={() => setStarted(false)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-xl shadow-md text-lg transition-transform hover:scale-105 active:scale-95"
              >
                Jogar Outro
              </button>
            </div>
          )}

          {desistiu && (
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center border-t-8 border-red-500 animate-pop-in">
              <h2 className="text-4xl font-extrabold text-red-600 mb-4">Ah não!</h2>
              <p className="text-xl text-gray-700 mb-8">Você desistiu de montar o quebra cabeça.</p>
              <button
                onClick={() => setStarted(false)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-xl shadow-md text-lg mb-3 transition-transform hover:scale-105 active:scale-95"
              >
                Tentar Outro
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
