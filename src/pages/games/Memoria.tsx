import { useState } from "react";
import confetti from "canvas-confetti";
import { OverlayResultado } from "@/components/OverlayResultado";
import MenuGame from "@/components/MenuGame";
import HeaderGame from "@/components/HeaderGame";
import { PageContainer } from "@/components/ui/page_components";

interface Carta {
    id: number;
    emoji: string;
    virada: boolean;
    encontrada: boolean;
}

const categorias = {
    animais: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐒", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🐺", "🐴", "🦄", "🐝", "🦋", "🐢", "🐍", "🦖", "🦕", "🐙", "🦀", "🐠", "🐟", "🐬", "🐳", "🦈", "🐅", "🐆", "🦓", "🦍", "🐘", "🦛", "🦏", "🐪", "🦒", "🦘", "🐃", "🐄", "🐎", "🐖", "🐏", "🐑", "🐐", "🦌", "🐕", "🐩", "🐈", "🐓", "🦚", "🦜", "🦢", "🦩", "🐇", "🦝", "🦥"],
    cores: ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🟤", "🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "⬛", "⬜", "🟫", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💖", "💝"],
    comidas: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🥕", "🌽", "🥐", "🥯", "🍞", "🧀", "🥞", "🧇", "🥓", "🥩", "🍗", "🌭", "🍔", "🍟", "🍕", "🥪", "🌮", "🌯", "🥗", "🥘", "🍝", "🍜", "🍲", "🍣", "🍱", "🥟", "🍤", "🍙", "🍚", "🍘", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🥜", "🍯", "🥛", "☕", "🍵", "🧃", "🥤", "🧋"]
};

type Categoria = "aleatorio" | "animais" | "cores" | "comidas";

const efeitoAcerto = new URL(
    "../../assets/sounds/efeitos/efeito-acerto.mp3",
    import.meta.url,
).href;
const efeitoErro = new URL(
    "../../assets/sounds/efeitos/efeito-erro.mp3",
    import.meta.url,
).href;
const efeitoVitoria = new URL(
    "../../assets/sounds/efeitos/efeito-vitória.mp3",
    import.meta.url,
).href;

export default function Memoria() {
    const [cartas, setCartas] = useState<Carta[]>([]);
    const [primeiraCarta, setPrimeiraCarta] = useState<number | null>(null);
    const [bloqueado, setBloqueado] = useState(false);
    const [pontos, setPontos] = useState(0);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria>("aleatorio");
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'won' | 'gaveUp'>('menu');

        const tocarAudio = (caminho: string) => {
                const audio = new Audio(caminho);
                audio.play().catch(e => console.log("Erro ao reproduzir áudio:", e));
        };

    const backToMenu = () => {
    setGameState('menu');
  };

  const handleGiveUp = () => {
    setGameState('gaveUp');
  };

    const iniciarJogo = () => {
        setPrimeiraCarta(null);
        setPontos(0);
        setGameState('playing');

        let pool: string[] = [];
        if (categoriaSelecionada === "aleatorio") {
            pool = [...categorias.animais, ...categorias.cores, ...categorias.comidas];
        } else {
            pool = [...categorias[categoriaSelecionada]];
        }

        // Embaralha o pool selecionado e pega 12 pares únicos
        const emojisSorteados = pool.sort(() => Math.random() - 0.5).slice(0, 12);

        const baralho = [...emojisSorteados, ...emojisSorteados]
            .sort(() => Math.random() - 0.5)
            .map((emoji, idx) => ({
                id: idx,
                emoji: emoji,
                virada: true, // Começa virada para cima
                encontrada: false
            }));
        
        setCartas(baralho);
        setBloqueado(true);

        // Aguarda 4 segundos antes de esconder as cartas
        setTimeout(() => {
            setCartas(prev => prev.map(c => ({ ...c, virada: false })));
            setBloqueado(false);
        }, 4000);
    };

    const handleCardClick = (index: number) => {
        if (bloqueado || cartas[index].virada || cartas[index].encontrada) return;

        setCartas(prev => prev.map((c, i) => i === index ? { ...c, virada: true } : c));

        if (primeiraCarta === null) {
            setPrimeiraCarta(index);
        } else {
            setBloqueado(true);
            setTimeout(() => checarCartas(primeiraCarta, index), 600);
        }
    };

    const checarCartas = (primeira: number, segunda: number) => {
        const isMatch = cartas[primeira].emoji === cartas[segunda].emoji;

        if (isMatch) {
            setPontos(pts => pts + 10);
            tocarAudio(efeitoAcerto);
        } else {
            setPontos(pts => Math.max(0, pts - 1));
            tocarAudio(efeitoErro);
        }

        setCartas(prev => {
            let newCartas = [...prev];
            if (isMatch) {
                newCartas[primeira] = { ...prev[primeira], encontrada: true };
                newCartas[segunda] = { ...prev[segunda], encontrada: true };
            } else {
                newCartas[primeira] = { ...prev[primeira], virada: false };
                newCartas[segunda] = { ...prev[segunda], virada: false };
            }
            return newCartas;
        });

        setTimeout(() => {
            setCartas(currentCartas => {
                if (currentCartas.length > 0 && currentCartas.every(c => c.encontrada)) {
                    setGameState('won');
                    tocarAudio(efeitoVitoria);
                    confetti({
                        particleCount: 300,
                        spread: 120,
                        origin: { y: 0.6 }
                    });
                }
                return currentCartas;
            });
            setPrimeiraCarta(null);
            setBloqueado(false);
        }, 0);
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
                <div className="w-full max-w-full flex justify-center items-center overflow-x-hidden box-border px-1">
                <MenuGame
                titulo="Jogo da Memória"
                subtitulo="Escolha o tema e encontre todos os pares de cartas!"
                onIniciar={iniciarJogo} 
                corDestaque="pink"
                icones={
                <>
                    <span className="text-3xl md:text-4xl select-none shrink">🐶</span>
                    <span className="text-3xl md:text-4xl select-none shrink">❓</span>
                    <span className="text-3xl md:text-4xl select-none shrink">🍎</span>
                </>
                }
            >
                <div 
                 role="radiogroup" 
                 aria-label="Escolha uma categoria de jogo"
                 className="grid grid-cols-2 gap-4 w-full max-w-full box-border px-1"
                    >
                    {(["aleatorio", "animais", "cores", "comidas"] as const).map(cat => {
                        const estaAtivo = categoriaSelecionada === cat;

                        return (
                        <label 
                            key={cat} 
                            className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all select-none focus-within:ring-2 focus-within:ring-black-400 focus-within:ring-offset-1 ${
                            estaAtivo 
                                ? 'border-pink-500 bg-pink-50 font-bold shadow-sm' 
                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                            }`}
                        >
                            <input
                            type="radio"
                            name="categoria-jogo"
                            value={cat}
                            checked={estaAtivo}
                            onChange={() => setCategoriaSelecionada(cat)}
                            className="sr-only"
                            />
                            <span className="text-base md:text-lg capitalize pointer-events-none">
                            {cat === "aleatorio" ? "Misturado" : cat}
                            </span>
                        </label>
                        );
                    })}
                    </div>
                </MenuGame>
              </div>          
            )}

                
                    {gameState === 'playing' && (
                        <>
                            {/* Header */}
                            <HeaderGame
                            titulo="Jogo da Memória" 
                            onDesistir={handleGiveUp}
                            >
                            {/* Children */}
                            <div
                                aria-live="polite" 
                                aria-atomic="true" 
                                className="text-gray-600 font-medium"
                                >
                                <span>Pontuação:{" "}</span>
                                <span className="text-red-500 font-bold">
                                    {pontos}
                                </span>
                            </div>
                            </HeaderGame>
                            
                            <div 
                                role="grid" 
                                aria-label="Tabuleiro do Jogo da Memória"
                                className="w-full max-w-7xl mt-6 grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-6 md:gap-8 justify-center px-2 md:px-0" 
                                style={{ perspective: "1000px" }}
                            >
                            {cartas.map((carta, index) => {
                                const estaRevelada = carta.virada || carta.encontrada;
                                const numeroCarta = index + 1;

                                return (
                                <button
                                    key={carta.id}
                                    onClick={() => handleCardClick(index)}
                                    disabled={carta.encontrada}
                                    role="gridcell"
                                    aria-label={`Carta ${numeroCarta}: ${carta.encontrada ? `Encontrada, par de ${carta.emoji}` : estaRevelada ? `Revelada, ${carta.emoji}` : 'Virada para baixo'}`}
                                    aria-live="polite"
                                    className="relative w-full aspect-square cursor-pointer bg-transparent border-0 p-0 outline-none rounded-xl focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 transition-shadow"
                                    style={{
                                    transformStyle: 'preserve-3d',
                                    transition: 'transform 0.5s',
                                    transform: estaRevelada ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                    }}
                                >
                                    <div 
                                    className="absolute inset-0 bg-indigo-500 rounded-xl shadow-lg border-4 border-indigo-300 flex items-center justify-center text-6xl sm:text-7xl md:text-8xl font-bold text-white transition-transform"
                                    style={{ backfaceVisibility: 'hidden' }}
                                    aria-hidden="true"
                                    >
                                    ?
                                    </div>
                                    
                                    <div 
                                    className={`absolute inset-0 rounded-xl shadow-lg border-4 border-indigo-200 flex items-center justify-center text-6xl sm:text-7xl md:text-[6rem] bg-white ${carta.encontrada ? 'opacity-60 saturate-50' : ''}`}
                                    style={{ 
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)' 
                                    }}
                                    aria-hidden={!estaRevelada}
                                    >
                                    {carta.emoji}
                                    </div>
                                </button>
                                );
                            })}
                            </div>
                        </>
                    )}

                    {gameState === 'won' && (
                        <OverlayResultado
                            tipo="vitoria"
                            titulo="Você Venceu!"
                            subtitulo="Parabéns! Você encontrou todos os pares."
                            onReiniciar={backToMenu}
                            icon={
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                    )}

                    {gameState === 'gaveUp' && (
                        <OverlayResultado
                            tipo="desistencia"
                            titulo="Você desistiu!"
                            subtitulo={
                        <>
                            <p className="text-xl text-gray-700 mb-2">Jogo encerrado antecipadamente.</p>
                            <p className="text-md text-gray-500 mb-8">Você conseguiu <span className="font-bold text-2xl text-red-600">{pontos}</span> pontos antes de parar.</p>
                        </>}
                            onReiniciar={backToMenu}
                            icon={
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                             </svg>
                            }
                        />
                    )}
        </PageContainer>
        </div>
    )}
