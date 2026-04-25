import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";

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
        "galinha", "porco", "ovelha"
    ].includes(name);
    const folder = isAnimal ? "animais" : "soletrando";
    return new URL(`../../assets/images/${folder}/${name}.png`, import.meta.url).href;
};

export default function Soletrando() {
    const [started, setStarted] = useState(false);
    const [pontos, setPontos] = useState(0);
    const [finished, setFinished] = useState(false);
    const [palavras, setPalavras] = useState<Palavra[]>([]);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [tentativas, setTentativas] = useState(0);
    const [palavrasErradas, setPalavrasErradas] = useState<Palavra[]>([]);
    const [retryingFailed, setRetryingFailed] = useState(false);
    const [tentativa, setTentativa] = useState("");
    const [letras, setLetras] = useState<{ letra: string, id: number }[]>([]);
    const [letrasUsadas, setLetrasUsadas] = useState<number[]>([]);
    const [feedback, setFeedback] = useState({ texto: "", tipo: "" });

    const palavraAtual = palavras[indiceAtual];

    // Reproduzir Áudios da Aplicação
    const playAudio = (src: string) => {
        const audio = new Audio(src);
        audio.play().catch(e => console.warn("Falha ao reproduzir:", e));
    };

    const iniciarJogo = () => {
        setPontos(0);
        setStarted(true);
        setFinished(false);
        setRetryingFailed(false);
        setPalavras(embaralharArray(palavrasOriginais));
        setPalavrasErradas([]);
        setIndiceAtual(0);
        setTentativas(0);
        setTentativa("");
        setLetrasUsadas([]);
        setFeedback({ texto: "", tipo: "" });
    };

    useEffect(() => {
        if (started && !finished && palavraAtual) {
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
    }, [palavraAtual, started, finished]);

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
                playAudio("/audio/efeito_acerto.mp3");
                setPontos(prev => prev + 10);
                setFeedback({ texto: "✅ Correto! Próxima palavra...", tipo: "correto" });
                setPalavrasErradas(prev => prev.filter(p => p.palavra !== palavraAtual.palavra));

                setTimeout(() => avancar(), 1500);
            } else {
                const novasTentativas = tentativas + 1;
                setTentativas(novasTentativas);
                playAudio("/audio/efeito-erro.mp3");

                if (novasTentativas >= maxTentativas) {
                    setFeedback({ texto: `❌ Fim de Jogo! A palavra era ${palavraAtual.palavra.toUpperCase()}`, tipo: "errado" });

                    // Finaliza o jogo após 2 segundos para dar tempo de ler e mostrar os pontos
                    setTimeout(() => {
                        setFinished(true);
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
                setFinished(true);
                setFeedback({ texto: "🎉 Parabéns! Você completou todas as palavras!", tipo: "correto" });
                playAudio("/audio/efeito-vitória.mp3");
                confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
                return prevErradas;
            }
        });
    };


    return (
        <div className="min-h-screen bg-gray-50 font-poppins relative pb-24">
            {!started && (
                <div className="flex flex-col items-center justify-center p-6 min-h-screen">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full mx-4 border-t-8 border-indigo-500 animate-pop-in">
                        <div className="flex justify-center mb-6 space-x-2">
                            <span className="text-4xl font-extrabold text-red-500" style={{ animationDelay: '0ms' }}>A</span>
                            <span className="text-4xl font-extrabold text-blue-500" style={{ animationDelay: '100ms' }}>B</span>
                            <span className="text-4xl font-extrabold text-yellow-500" style={{ animationDelay: '200ms' }}>C</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-6 text-gray-800">Soletrando</h1>
                        <p className="text-gray-600 mb-8 font-medium">Escreva o nome correto de cada imagem que aparecer!</p>
                        <button
                            onClick={iniciarJogo}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg cursor-pointer transition transform hover:scale-105 active:scale-95 w-full flex items-center justify-center gap-2"
                        >
                            Jogar Agora
                        </button>
                    </div>
                </div>
            )}

            {started && (
                <>
                    <main className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center pt-4 md:pt-8">
                        {/* Barra Superior do Jogo (Pontos e Saída) */}
                        {!finished && (
                            <div className="mb-4 flex flex-col md:flex-row justify-between w-full max-w-4xl items-center pb-2 border-b border-gray-200">
                                <h1 className="text-2xl font-bold text-gray-700 mb-2 md:mb-0">Soletrando</h1>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-600 font-medium">
                                        Pontuação: <span className="text-blue-600 font-bold">{pontos}</span>
                                    </span>
                                    <button
                                        onClick={() => setFinished(true)}
                                        className="px-5 py-2 bg-red-100 hover:bg-red-200 rounded-lg cursor-pointer text-sm font-bold text-red-700 transition shadow-sm"
                                    >
                                        Desistir
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Imagem */}
                        {!finished && palavraAtual && (
                            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-4 mb-8 mt-2 md:mt-4 relative">
                                <img
                                    className="w-full h-80 sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-xl transition-all"
                                    src={getImageUrl(palavraAtual.imagem)}
                                    alt={`Palavra: ${palavraAtual.palavra}`}
                                    onClick={() => playAudio(`/audio/soletrando/${palavraAtual.palavra}.mp3`)}
                                />
                            </div>
                        )}



                        {/* Quadros para formar a palavra */}
                        {!finished && palavraAtual && (
                            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mt-12 sm:mt-16 mb-14 w-full px-4">
                                {(() => {
                                    let idxAlfabetico = 0;
                                    return palavraAtual.palavra.split("").map((letraOriginal, index) => {
                                        if (letraOriginal === "-") {
                                            return <div key={`break-${index}`} className="basis-full h-0"></div>;
                                        }

                                        const letraDigitada = tentativa[idxAlfabetico];
                                        idxAlfabetico++;

                                        return (
                                            <div
                                                key={index}
                                                className={`w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 bg-white border-b-8 shadow-md flex items-center justify-center text-3xl sm:text-5xl font-black uppercase rounded-t-xl transition-all duration-300 ${letraDigitada ? 'border-green-500 scale-110 -translate-y-2 text-green-600' : 'border-gray-300 text-gray-800'}`}
                                            >
                                                {letraDigitada || ""}
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        )}

                        {/* Letras para selecionar */}
                        {!finished && palavraAtual && (
                            <div className="flex flex-wrap justify-center gap-3 mb-6">
                                {letras.map((letraObj, index) => {
                                    const usado = letrasUsadas.includes(index);
                                    return (
                                        <button
                                            key={index}
                                            disabled={usado}
                                            onClick={() => handleLetterClick(letraObj, index)}
                                            className={`w-14 h-14 md:w-16 md:h-16 text-2xl font-bold rounded-lg border-2 shadow-sm transition-all flex items-center justify-center
                                        ${usado
                                                    ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed scale-95 opacity-50"
                                                    : "bg-green-500 border-green-600 text-white hover:bg-green-400 hover:-translate-y-1 hover:shadow-md active:scale-95 cursor-pointer"
                                                }`}
                                        >
                                            {letraObj.letra.toUpperCase()}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Status de tentativas (só aparece se estiver jogando) */}
                        {!finished && palavraAtual && (
                            <p className="font-semibold text-gray-700 text-lg mb-4">
                                Tentativas restantes: {maxTentativas - tentativas}
                            </p>
                        )}

                        {/* Feedback (correto, errado, e palavra digitada) */}
                        <div className="h-16 flex items-center justify-center">
                            <p className={`text-2xl font-bold transition-all ${feedback.tipo === 'correto' ? 'text-green-500 animate-bounce' :
                                feedback.tipo === 'errado' ? 'text-red-500 animate-pulse' :
                                    'text-gray-800'
                                }`}>
                                {feedback.texto}
                            </p>
                        </div>

                        {/* Botão de Tentar Novamente na Tela Final */}
                        {finished && (
                            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[70vh]">
                                <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center border-t-8 border-green-500">
                                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-4xl font-extrabold text-green-600 mb-4">Fim de Jogo!</h2>
                                    <p className="text-xl text-gray-700 mb-2">Parabéns! Você alcançou <span className="font-bold text-2xl text-green-600">{pontos}</span> pontos.</p>
                                    <p className="text-md text-gray-500 mb-8">Vamos tentar uma nova rodada e bater esse recorde?</p>
                                    <button
                                        type="button"
                                        onClick={iniciarJogo}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
                                    >
                                        Jogar Novamente
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </>
            )}
        </div>
    );
}
