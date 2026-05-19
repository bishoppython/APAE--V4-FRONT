import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import MenuGame from "@/components/MenuGame";
import { OverlayResultado } from "@/components/OverlayResultado";
import HeaderGame from "@/components/HeaderGame";
import { PageContainer } from "@/components/ui/page_components";


interface Palavra {
    palavra: string;
    imagem: string;
}

const palavrasOriginais: Palavra[] = [
    { palavra: "amarelo", imagem: "amarelo" },
    { palavra: "vermelho", imagem: "vermelho" },
    { palavra: "azul", imagem: "azul" },
    { palavra: "verde", imagem: "verde" },
    { palavra: "rosa", imagem: "rosa" },
    { palavra: "branco", imagem: "branco" },
    { palavra: "preto", imagem: "preto" },
    { palavra: "casa", imagem: "casa" },
    { palavra: "carro", imagem: "carro" },
    { palavra: "bola", imagem: "bola" },
    { palavra: "mamãe", imagem: "mamãe" },
    { palavra: "papai", imagem: "papai" },
    { palavra: "gato", imagem: "gato" },
    { palavra: "cachorro", imagem: "cachorro" },
    { palavra: "peixe", imagem: "peixe" },
    { palavra: "pato", imagem: "pato" },
    { palavra: "macaco", imagem: "macaco" },
    { palavra: "elefante", imagem: "elefante" },
    { palavra: "girafa", imagem: "girafa" },
    { palavra: "leão", imagem: "leao" },
    { palavra: "tigre", imagem: "tigre" },
    { palavra: "urso", imagem: "urso" },
    { palavra: "onça", imagem: "onca" },
    { palavra: "rinoceronte", imagem: "rinoceronte" },
    { palavra: "zebra", imagem: "zebra" },
    { palavra: "hamster", imagem: "hamster" },
    { palavra: "coelho", imagem: "coelho" },
    { palavra: "golfinho", imagem: "golfinho" },
    { palavra: "baleia", imagem: "baleia" },
    { palavra: "tubarão", imagem: "tubarao" },
    { palavra: "estrela-do-mar", imagem: "estrela_do_mar" },
    { palavra: "polvo", imagem: "polvo" },
    { palavra: "cavalo-marinho", imagem: "cavalo_marinho" },
    { palavra: "tartaruga-marinha", imagem: "tartaruga_marinha" },
    { palavra: "cavalo", imagem: "cavalo" },
    { palavra: "vaca", imagem: "vaca" },
    { palavra: "galinha", imagem: "galinha" },
    { palavra: "porco", imagem: "porco" },
    { palavra: "ovelha", imagem: "ovelha" },
    { palavra: "sol", imagem: "sol" },
    { palavra: "lua", imagem: "lua" },
    { palavra: "flor", imagem: "flor" },
    { palavra: "montanha-russa", imagem: "montanha-russa" },
    { palavra: "carrossel", imagem: "carrossel" },
    { palavra: "roda-gigante", imagem: "roda-gigante" },
    { palavra: "guaxinim", imagem: "guaxinim" },
];

function normalizarLetra(letra: string) {
    const mapa: Record<string, string> = {
        á: "a", à: "a", ã: "a", â: "a",
        é: "e", ê: "e",
        í: "i",
        ó: "o", ô: "o", õ: "o",
        ú: "u",
        ç: "c",
    };
    return mapa[letra] || letra;
}

function embaralharArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const maxTentativas = 3;

const getImageUrl = (name: string) => {
    const isAnimal = [
        "gato", "cachorro", "peixe", "pato", "macaco", "elefante", "girafa", "leao", "tigre", "urso",
        "onca", "rinoceronte", "zebra", "hamster", "coelho", "golfinho", "baleia", "tubarao",
        "estrela_do_mar", "polvo", "cavalo_marinho", "tartaruga_marinha", "cavalo", "vaca",
        "galinha", "porco", "ovelha", "guaxinim"
    ].includes(name);
    const folder = isAnimal ? "animais" : "soletrando";
    return new URL(`../../assets/images/${folder}/${name}.png`, import.meta.url).href;
};

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

export default function Soletrando() {
    
    const [pontos, setPontos] = useState(0);
    const [palavras, setPalavras] = useState<Palavra[]>([]);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [tentativas, setTentativas] = useState(0);
    const [palavrasErradas, setPalavrasErradas] = useState<Palavra[]>([]);
    const [retryingFailed, setRetryingFailed] = useState(false);
    const [tentativa, setTentativa] = useState("");
    const [letras, setLetras] = useState<{ letra: string, id: number }[]>([]);
    const [letrasUsadas, setLetrasUsadas] = useState<number[]>([]);
    const [feedback, setFeedback] = useState({ texto: "", tipo: "" });
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'won' | 'gaveUp'>('menu');
    const palavraAtual = palavras[indiceAtual];

    // Reproduzir Áudios da Aplicação
    const playAudio = (src: string) => {
        const audio = new Audio(src);
        audio.play().catch(e => console.warn("Falha ao reproduzir:", e));
    };

    const backToMenu = () => {
    setGameState('menu');
  };

  const handleGiveUp = () => {
    setGameState('gaveUp');
  };

    const iniciarJogo = () => {
        setPontos(0);
        setRetryingFailed(false);
        setPalavras(embaralharArray(palavrasOriginais));
        setPalavrasErradas([]);
        setIndiceAtual(0);
        setTentativas(0);
        setTentativa("");
        setLetrasUsadas([]);
        setGameState('playing');
        setFeedback({ texto: "", tipo: "" });
    };

    useEffect(() => {
        if (gameState === 'playing' && palavraAtual) {
            const letrasShuffled = embaralharArray(palavraAtual.palavra.replace(/-/g, "").split("").map((letra, index) => ({
                letra,
                id: index
            })));
            setLetras(letrasShuffled);
            setTentativas(0);
            setTentativa("");
            setLetrasUsadas([]);
            setFeedback({ texto: "", tipo: "" });
            playAudio(`/audio/soletrando/${palavraAtual.palavra}.mp3`);
        }
    }, [palavraAtual, gameState]);

    const handleLetterClick = (letraObj: { letra: string, id: number }, indexInArray: number) => {
        if (letrasUsadas.includes(indexInArray) || feedback.tipo === 'correto') return;

        const novaTentativa = tentativa + letraObj.letra;
        setTentativa(novaTentativa);
        setLetrasUsadas([...letrasUsadas, indexInArray]);

        const letraNorm = normalizarLetra(letraObj.letra.toLowerCase());
        playAudio(`/audio/letras/${letraNorm}.mp3`);

        setFeedback({ texto: "", tipo: "" });

        const palavraAlvo = palavraAtual.palavra.replace(/-/g, "");

        if (novaTentativa.length === palavraAlvo.length) {
            if (novaTentativa.toLowerCase() === palavraAlvo.toLowerCase()) {
                playAudio(efeitoAcerto);
                setPontos(prev => prev + 10);
                setFeedback({ texto: "✅ Correto! Próxima palavra...", tipo: "correto" });
                setPalavrasErradas(prev => prev.filter(p => p.palavra !== palavraAtual.palavra));

                setTimeout(() => avancar(), 1500);
            } else {
                const novasTentativas = tentativas + 1;
                setTentativas(novasTentativas);
                playAudio(efeitoErro);

                if (novasTentativas >= maxTentativas) {
                    playAudio(efeitoDerrota);
                    setFeedback({ texto: `❌ Fim de Jogo! A palavra era ${palavraAtual.palavra.toUpperCase()}`, tipo: "errado" });

                    // Finaliza o jogo após 2 segundos para dar tempo de ler e mostrar os pontos
                    setTimeout(() => {
                        setGameState('won');
                    }, 2000);
                } else {
                    setFeedback({ texto: `❌ Tente novamente! Restam ${maxTentativas - novasTentativas} tentativa(s).`, tipo: "errado" });
                    setTimeout(() => {
                        setTentativa("");
                        setLetrasUsadas([]);
                        setFeedback({ texto: "", tipo: "" });
                        playAudio(`/audio/soletrando/${palavraAtual.palavra}.mp3`);
                    }, 1200);
                }
            }
        }
    };

    const avancar = () => {
        setIndiceAtual(prevIndice => {
            const nextIndice = prevIndice + 1;

            if (nextIndice < palavras.length) {
                return nextIndice;
            } else {
                // Fim da lista atual
                setTimeout(() => {
                    handleEndOfList();
                }, 0);
                return prevIndice; // Mantém enquanto transiciona
            }
        });
    };

    const handleEndOfList = () => {
        setPalavrasErradas(prevErradas => {
            if (!retryingFailed && prevErradas.length > 0) {
                setPalavras(embaralharArray(prevErradas));
                setRetryingFailed(true);
                setIndiceAtual(0);
                setFeedback({ texto: "Vamos revisar as palavras erradas...", tipo: "" });
                return []; // limpa para a revisão
            } else {
                setGameState('won');
                setFeedback({ texto: "🎉 Parabéns! Você completou todas as palavras!", tipo: "correto" });
                playAudio(efeitoVitoria);
                confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
                return prevErradas;
            }
        });
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
                        titulo="Soletrando"
                        subtitulo="Escreva o nome correto de cada imagem que aparecer!"
                        onIniciar={iniciarJogo}
                        corDestaque="indigo"
                        icones={
                            <>
                            <span className="text-4xl font-extrabold text-red-500">A</span>
                            <span className="text-4xl font-extrabold text-blue-500">B</span>
                            <span className="text-4xl font-extrabold text-yellow-500">C</span>
                            </>
                        }  
                        /> 
                    )
                }

                {gameState === 'playing' && (
                <>
                    {/* Header */}
                    <HeaderGame
                        titulo="Soletrando" 
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

                    {/* Imagem */}
                    {palavraAtual && (
                        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-4 mb-8 mt-2 md:mt-4 relative">
                            <button
                                onClick={() => playAudio(`/audio/soletrando/${palavraAtual.palavra}.mp3`)}
                                aria-label="Ouvir som da palavra novamente"
                                className="w-full bg-transparent border-0 p-0 m-0 outline-none rounded-xl focus:ring-4 focus:ring-orange-500 focus:ring-offset-2 transition-shadow block overflow-hidden"
                            >
                            <img
                                className="w-full h-80 sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-xl transition-all"
                                src={getImageUrl(palavraAtual.imagem)}
                                alt={`Palavra: ${palavraAtual.palavra}`}
                                onClick={() => playAudio(`/audio/soletrando/${palavraAtual.palavra}.mp3`)}
                            />
                            </button>
                        </div>
                    )}



                    {palavraAtual && (
                        <div 
                            role="group"
                            aria-label="Palavra sendo montada"
                            className="flex flex-wrap gap-2 sm:gap-4 justify-center mt-12 sm:mt-16 mb-14 w-full px-4 max-w-full box-border"
                        >
                            {(() => {
                                let idxAlfabetico = 0;
                                const tamanhoPalavra = palavraAtual.palavra.replace(/-/g, "").length;

                                return palavraAtual.palavra.split("").map((letraOriginal, index) => {
                                    if (letraOriginal === "-") {
                                        return <div key={`break-${index}`} className="basis-full h-0" aria-hidden="true"></div>;
                                    }

                                    const letraDigitada = tentativa[idxAlfabetico];
                                    const posicaoAtual = idxAlfabetico + 1;
                                    idxAlfabetico++;

                                    return (
                                        <div
                                            key={index}
                                            role="img"
                                            lang="pt-BR"
                                            aria-label={`Espaço ${posicaoAtual} de ${tamanhoPalavra}: ${letraDigitada ? `Letra preenchida, ${letraDigitada}` : 'Vazio'}`}
                                            className={`w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 bg-white border-b-8 shadow-md flex items-center justify-center text-3xl sm:text-5xl font-black uppercase rounded-t-xl transition-all duration-300 ${letraDigitada ? 'border-green-500 text-green-600' : 'border-gray-300 text-gray-800'}`}
                                        >
                                            <span aria-hidden="true">
                                                {letraDigitada || ""}
                                            </span>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    )}

                    {palavraAtual && (
                        <div 
                            role="group"
                            aria-label="Teclado virtual de letras"
                            className="flex flex-wrap justify-center gap-3 mb-6 w-full max-w-full box-border px-1"
                        >
                            {letras.map((letraObj, index) => {
                                const usado = letrasUsadas.includes(index);
                                const letraMaiuscula = letraObj.letra.toUpperCase();

                                return (
                                    <button
                                        key={index}
                                        disabled={usado}
                                        onClick={() => handleLetterClick(letraObj, index)}
                                        lang="pt-BR"
                                        aria-label={`Letra ${letraMaiuscula}${usado ? ', já utilizada' : ''}`}
                                        className={`w-14 h-14 md:w-16 md:h-16 text-2xl font-bold rounded-lg border-2 shadow-sm transition-all flex items-center justify-center outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2
                                        ${usado
                                            ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
                                            : "bg-green-500 border-green-600 text-white hover:bg-green-400 hover:shadow-md cursor-pointer"
                                        }`}
                                    >
                                        <span aria-hidden="true">
                                            {letraMaiuscula}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Status de tentativas (só aparece se estiver jogando) */}
                    {palavraAtual && (
                        <div
                            role="status"
                            aria-live="polite"
                            aria-atomic="true"
                            lang="pt-BR"
                            className="mt-2"
                        >
                            <p className="font-semibold text-gray-700 text-lg mb-4">
                                Tentativas restantes: {maxTentativas - tentativas}
                            </p>
                        </div>
                    )}

                    {/* Feedback (correto, errado, e palavra digitada) */}
                    <div 
                        className="h-16 flex items-center justify-center"
                        role="status"
                        aria-live="assertive"
                        aria-atomic="true"
                    >
                        {feedback.texto && (
                            <p 
                                lang="pt-BR"
                                className={`text-2xl font-bold transition-all ${
                                    feedback.tipo === 'correto' 
                                        ? 'text-green-500 animate-bounce' 
                                        : feedback.tipo === 'errado' 
                                            ? 'text-red-500 animate-pulse' 
                                            : 'text-gray-800'
                                }`}
                            >
                                {feedback.texto}
                            </p>
                        )}
                    </div>
                    </>
                )}


                {/* Botão de Tentar Novamente na Tela Final */}
                {gameState === 'gaveUp' && (
                    <OverlayResultado
                        tipo="vitoria"
                        titulo="Fim de Jogo!"
                        subtitulo={
                            <>
                                <p>Parabéns! Você alcançou <span className="font-bold text-2xl text-green-600">{pontos}</span> pontos.</p>
                                <p className="text-md text-gray-500 mb-8">Vamos tentar uma nova rodada e bater esse recorde?</p>
                            </>
                        }
                        onReiniciar={backToMenu} 
                        icon={
                            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                        }
                        />
                    )}
                </PageContainer>    
        </div>
    )
}
