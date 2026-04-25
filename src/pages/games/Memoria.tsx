import { useState } from "react";
import confetti from "canvas-confetti";

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

export default function Memoria() {
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [gaveUp, setGaveUp] = useState(false);
    const [cartas, setCartas] = useState<Carta[]>([]);
    const [primeiraCarta, setPrimeiraCarta] = useState<number | null>(null);
    const [bloqueado, setBloqueado] = useState(false);
    const [pontos, setPontos] = useState(0);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria>("aleatorio");

    const iniciarJogo = () => {
        setStarted(true);
        setFinished(false);
        setGaveUp(false);
        setPrimeiraCarta(null);
        setPontos(0);

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
        } else {
            setPontos(pts => Math.max(0, pts - 1));
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
                    setFinished(true);
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
        <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-gray-100 font-poppins">
            {!started && (
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4 border-t-8 border-pink-500">
                    <div className="flex justify-center items-center mb-6 space-x-4">
                        <span className="text-4xl">🐶</span>
                        <span className="text-4xl">❓</span>
                        <span className="text-4xl">🍎</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-gray-800">Jogo da Memória</h1>
                    <p className="text-gray-600 mb-8 font-medium">Escolha o tema e encontre todos os pares de cartas!</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {(["aleatorio", "animais", "cores", "comidas"] as const).map(cat => (
                            <label key={cat} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                                categoriaSelecionada === cat ? 'border-pink-500 bg-pink-50 transform scale-105 shadow-md' : 'border-gray-200 hover:bg-gray-50'
                            }`}>
                                <input
                                    name="theme-radio"
                                    type="radio"
                                    className="hidden"
                                    checked={categoriaSelecionada === cat}
                                    onChange={() => setCategoriaSelecionada(cat)}
                                />
                                <span className={`font-bold text-lg capitalize ${categoriaSelecionada === cat ? 'text-pink-700' : 'text-gray-600'}`}>
                                    {cat === "aleatorio" ? "Misturado" : cat}
                                </span>
                            </label>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={iniciarJogo}
                        className="w-full font-bold py-4 px-8 rounded-xl text-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white"
                    >
                        Jogar Agora
                    </button>
                </div>
            )}

            {started && (
                <>
                    {!finished && !gaveUp && (
                        <>
                            <div className="mb-4 flex flex-col md:flex-row justify-between w-full max-w-7xl items-center pb-2 border-b border-gray-200 px-2 md:px-0">
                                <h1 className="text-2xl font-bold text-gray-700 mb-2 md:mb-0">Jogo da Memória</h1>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-600 font-medium">Pontuação: <span className="text-blue-600 font-bold">{pontos}</span></span>
                                    <button onClick={() => { setGaveUp(true); }} className="px-5 py-2 bg-red-100 hover:bg-red-200 rounded-lg cursor-pointer text-sm font-bold text-red-700 transition shadow-sm">
                                        Desistir
                                    </button>
                                </div>
                            </div>
                            
                            <div className="w-full max-w-7xl mt-6 grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-6 md:gap-8 justify-center px-2 md:px-0" style={{ perspective: "1000px" }}>
                                {cartas.map((carta, index) => (
                                    <div
                                        key={carta.id}
                                        onClick={() => handleCardClick(index)}
                                        className="relative w-full aspect-square cursor-pointer"
                                        style={{
                                            transformStyle: 'preserve-3d',
                                            transition: 'transform 0.5s',
                                            transform: (carta.virada || carta.encontrada) ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                        }}
                                    >
                                        {/* Costas da Carta (Logo APAE ou interrogação) */}
                                        <div 
                                            className="absolute inset-0 bg-indigo-500 rounded-xl shadow-lg border-4 border-indigo-300 flex items-center justify-center text-6xl sm:text-7xl md:text-8xl font-bold text-white hover:scale-105 transition-transform"
                                            style={{ backfaceVisibility: 'hidden' }}
                                        >
                                            ?
                                        </div>
                                        
                                        {/* Frente da Carta (Emoji correspondente) */}
                                        <div 
                                            className={`absolute inset-0 rounded-xl shadow-lg border-4 border-indigo-200 flex items-center justify-center text-6xl sm:text-7xl md:text-[6rem] bg-white ${carta.encontrada ? 'opacity-60 saturate-50' : ''}`}
                                            style={{ 
                                                backfaceVisibility: 'hidden',
                                                transform: 'rotateY(180deg)' 
                                            }}
                                        >
                                            {carta.emoji}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {finished && !gaveUp && (
                        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center border-t-8 border-green-500">
                            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-extrabold text-green-600 mb-4">Você Venceu!</h2>
                            <p className="text-xl text-gray-700 mb-2">Parabéns! Você encontrou todos os pares.</p>
                            <p className="text-md text-gray-500 mb-8">Sua pontuação final foi <span className="font-bold text-2xl text-green-600">{pontos}</span> pontos.</p>
                            <button
                                type="button"
                                onClick={() => { setStarted(false); setFinished(false); setGaveUp(false); }}
                                className="w-full bg-green-500 hover:bg-green-600 text-white cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
                            >
                                Jogar Novamente
                            </button>
                        </div>
                    )}

                    {gaveUp && (
                        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center border-t-8 border-red-500">
                            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-extrabold text-red-600 mb-4">Você Desistiu!</h2>
                            <p className="text-xl text-gray-700 mb-2">Jogo encerrado antecipadamente.</p>
                            <p className="text-md text-gray-500 mb-8">Você conseguiu <span className="font-bold text-2xl text-red-600">{pontos}</span> pontos antes de parar.</p>
                            <button
                                type="button"
                                onClick={() => { setStarted(false); setFinished(false); setGaveUp(false); }}
                                className="w-full bg-red-500 hover:bg-red-600 cursor-pointer text-white font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
                            >
                                Voltar para o Menu
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
