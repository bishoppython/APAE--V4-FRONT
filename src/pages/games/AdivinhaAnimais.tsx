import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Volume2, Trophy, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { OverlayResultado } from "@/components/OverlayResultado";
import MenuGame from "@/components/MenuGame";
import HeaderGame from "@/components/HeaderGame";
import { PageContainer } from "@/components/ui/page_components";

const animaisData = [
  {
    id: 1,
    nome: "a Baleia",
    imagem: "baleia",
    audioPergunta: "/audio/adivinha/onde-esta-baleia.ogg",
  },
  {
    id: 2,
    nome: "o Cachorro",
    imagem: "cachorro",
    audioPergunta: "/audio/adivinha/onde-esta-cachorro.ogg",
  },
  {
    id: 3,
    nome: "o Cavalo Marinho",
    imagem: "cavalo_marinho",
    audioPergunta: "/audio/adivinha/onde-esta-cavaloMarinho.ogg",
  },
  {
    id: 4,
    nome: "o Cavalo",
    imagem: "cavalo",
    audioPergunta: "/audio/adivinha/onde-esta-cavalo.ogg",
  },
  {
    id: 5,
    nome: "o Coelho",
    imagem: "coelho",
    audioPergunta: "/audio/adivinha/onde-esta-coelho.ogg",
  },
  {
    id: 6,
    nome: "o Elefante",
    imagem: "elefante",
    audioPergunta: "/audio/adivinha/onde-esta-elefante.ogg",
  },
  {
    id: 7,
    nome: "a Estrela",
    imagem: "estrela_do_mar",
    audioPergunta: "/audio/adivinha/onde-esta-estrelaMar.ogg",
  },
  {
    id: 8,
    nome: "a Galinha",
    imagem: "galinha",
    audioPergunta: "/audio/adivinha/onde-esta-galinha.ogg",
  },
  {
    id: 9,
    nome: "o Gato",
    imagem: "gato",
    audioPergunta: "/audio/adivinha/onde-esta-gato.ogg",
  },
  {
    id: 10,
    nome: "a Girafa",
    imagem: "girafa",
    audioPergunta: "/audio/adivinha/onde-esta-girafa.ogg",
  },
  {
    id: 11,
    nome: "o Golfinho",
    imagem: "golfinho",
    audioPergunta: "/audio/adivinha/onde-esta-golfinho.ogg",
  },
  {
    id: 12,
    nome: "o Hamster",
    imagem: "hamster",
    audioPergunta: "/audio/adivinha/onde-esta-hamster.ogg",
  },
  {
    id: 13,
    nome: "o Leão",
    imagem: "leao",
    audioPergunta: "/audio/adivinha/onde-esta-leao.ogg",
  },
  {
    id: 14,
    nome: "o Macaco",
    imagem: "macaco",
    audioPergunta: "/audio/adivinha/onde-esta-macaco.ogg",
  },
  {
    id: 15,
    nome: "a Onça",
    imagem: "onca",
    audioPergunta: "/audio/adivinha/onde-esta-onça.ogg",
  },
  {
    id: 16,
    nome: "a Ovelha",
    imagem: "ovelha",
    audioPergunta: "/audio/adivinha/onde-esta-ovelha.ogg",
  },
  {
    id: 17,
    nome: "o Urso",
    imagem: "urso",
    audioPergunta: "/audio/adivinha/onde-esta-urso.ogg",
  },
  {
    id: 18,
    nome: "o Pato",
    imagem: "pato",
    audioPergunta: "/audio/adivinha/onde-esta-pato.ogg",
  },
  {
    id: 19,
    nome: "o Peixe",
    imagem: "peixe",
    audioPergunta: "/audio/adivinha/onde-esta-peixe.ogg",
  },
  {
    id: 20,
    nome: "o Polvo",
    imagem: "polvo",
    audioPergunta: "/audio/adivinha/onde-esta-polvo.ogg",
  },
  {
    id: 21,
    nome: "o Porco",
    imagem: "porco",
    audioPergunta: "/audio/adivinha/onde-esta-porco.ogg",
  },
  {
    id: 22,
    nome: "o Tigre",
    imagem: "tigre",
    audioPergunta: "/audio/adivinha/onde-esta-tigre.ogg",
  },
  {
    id: 23,
    nome: "o Tubarão",
    imagem: "tubarao",
    audioPergunta: "/audio/adivinha/onde-esta-tubarao.ogg",
  },
  {
    id: 24,
    nome: "a Vaca",
    imagem: "vaca",
    audioPergunta: "/audio/adivinha/onde-esta-vaca.ogg",
  },
  {
    id: 25,
    nome: "o Rinoceronte",
    imagem: "rinoceronte",
    audioPergunta: "/audio/adivinha/onde-esta-rinoceronte.ogg",
  },
  {
    id: 26,
    nome: "a Tartaruga Marinha",
    imagem: "tartaruga_marinha",
    audioPergunta: "/audio/adivinha/onde-esta-tartarugaMarinha.ogg",
  },
  {
    id: 27,
    nome: "a Zebra",
    imagem: "zebra",
    audioPergunta: "/audio/adivinha/onde-esta-zebra.ogg",
  },
  {
    id: 28,
    nome: "o Guaxinim",
    imagem: "guaxinim",
    audioPergunta: "/audio/adivinha/onde-esta-guaxinim.ogg",
  },
];

const coresData = [
  {
    id: 101,
    nome: "a cor Amarela",
    imagem: "amarelo",
    audioPergunta: "/audio/adivinha/onde-esta-amarelo.ogg",
  },
  {
    id: 102,
    nome: "a cor Vermelha",
    imagem: "vermelho",
    audioPergunta: "/audio/adivinha/onde-esta-vermelho.ogg",
  },
  {
    id: 103,
    nome: "a cor Azul",
    imagem: "azul",
    audioPergunta: "/audio/adivinha/onde-esta-azul.ogg",
  },
  {
    id: 104,
    nome: "a cor Verde",
    imagem: "verde",
    audioPergunta: "/audio/adivinha/onde-esta-verde.ogg",
  },
  {
    id: 105,
    nome: "a cor Rosa",
    imagem: "rosa",
    audioPergunta: "/audio/adivinha/onde-esta-rosa.ogg",
  },
  {
    id: 106,
    nome: "a cor Branca",
    imagem: "branco",
    audioPergunta: "/audio/adivinha/onde-esta-branco.ogg",
  },
  {
    id: 107,
    nome: "a cor Preta",
    imagem: "preto",
    audioPergunta: "/audio/adivinha/onde-esta-preto.ogg",
  },
];

const getImageUrl = (name: string) => {
  const isCor = [
    "amarelo",
    "vermelho",
    "azul",
    "verde",
    "rosa",
    "branco",
    "preto",
  ].includes(name);
  const folder = isCor ? "soletrando" : "animais";
  return new URL(`../../assets/images/${folder}/${name}.png`, import.meta.url)
    .href;
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

export default function AdivinhaAnimais() {
  const [categoria, setCategoria] = useState<"animais" | "cores">("animais");
  const [animaisRestantes, setAnimaisRestantes] = useState<typeof animaisData>(
    [],
  );
  const [animalAtual, setAnimalAtual] = useState(animaisData[0]);
  const [opcoes, setOpcoes] = useState<typeof animaisData>([]);
  const [mensagem, setMensagem] = useState("");

  const [podeClicar, setPodeClicar] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isShaking, setIsShaking] = useState(false); // Novo estado para tremer

  const [gameState, setGameState] = useState<
    "menu" | "playing" | "won" | "lost" | "gaveUp"
  >("menu");
  const [erros, setErros] = useState(0);
  const MAX_ERROS = 3;

  const tocarAudio = (caminho: string) => {
    const audio = new Audio(caminho);
    audio.play().catch((e) => console.log("Erro ao reproduzir áudio:", e));
  };

  const dadosAtuais = categoria === "animais" ? animaisData : coresData;

  const backToMenu = () => {
    setGameState("menu");
  };

  const handleGiveUp = () => {
    setGameState("gaveUp");
  };

  const iniciarJogo = () => {
    const embaralhado = [...dadosAtuais].sort(() => 0.5 - Math.random());

    setErros(0);
    setMensagem("");
    proximaRodada(embaralhado);
    setGameState("playing");
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const proximaRodada = (restantes: typeof animaisData) => {
    if (restantes.length === 0) {
      setGameState("won");
      tocarAudio(efeitoVitoria);
      confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.6 },
      });
      return;
    }

    setPodeClicar(true);
    const atual = restantes[0];
    setAnimalAtual(atual);
    setAnimaisRestantes(restantes.slice(1));

    tocarAudio(atual.audioPergunta);
    gerarOpcoesAleatorias(atual);
    setMensagem("");
    setIsShaking(false); // Reseta o tremor na nova rodada
  };

  const gerarOpcoesAleatorias = (alvo: (typeof animaisData)[0]) => {
    const outrasOpcoes = dadosAtuais
      .filter((a) => a.id !== alvo.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const misturados = [...outrasOpcoes, alvo].sort(() => 0.5 - Math.random());
    setOpcoes(misturados);
  };

  const verificarResposta = (animalSelecionado: (typeof animaisData)[0]) => {
    if (!podeClicar) return;

    if (animalSelecionado.id === animalAtual.id) {
      setPodeClicar(false);
      setIsShaking(false);
      tocarAudio(efeitoAcerto);
      setMensagem("Muito bem! Você acertou! 🎉");

      setTimeout(() => {
        proximaRodada(animaisRestantes);
      }, 2000);
    } else {
      setPodeClicar(false);
      tocarAudio(efeitoErro);

      const novosErros = erros + 1;
      setErros(novosErros);

      if (novosErros >= MAX_ERROS) {
        setIsShaking(true);
        setMensagem("Fim de Jogo! ❌");
        tocarAudio(efeitoDerrota);
        setTimeout(() => {
          setGameState("lost");
          setIsShaking(false);
          setPodeClicar(true);
        }, 1500);
      } else {
        setMensagem(`Errado! Tente novamente ❌`);
        setIsShaking(true);
        setIsTransitioning(true);

        setTimeout(() => {
          gerarOpcoesAleatorias(animalAtual);
          setIsTransitioning(false);
          setPodeClicar(true);
          tocarAudio(animalAtual.audioPergunta);

          // Remove a classe de tremer depois de um tempinho para poder tremer de novo se errar
          setTimeout(() => setIsShaking(false), 500);
        }, 400);
      }
    }
  };

  const repetirAudio = () => {
    tocarAudio(animalAtual.audioPergunta);
  };

  return (
      <div className="min-h-screen bg-white font-poppins relative pb-24">
        {/* Definindo a animação de shake inline para não precisar mexer no tailwind.config.js */}
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
        {gameState === "menu" && (
          
          <MenuGame
            titulo="Adivinhe os Animais"
            subtitulo="Escolha a categoria, ouça o som e clique na imagem correta!"
            corDestaque="orange"
            onIniciar={iniciarJogo}
            icones={
              <>
                <div className="flex items-center justify-center gap-3 md:gap-6 max-w-full overflow-hidden">
                  <span className="text-3xl md:text-4xl select-none shrink">🦁</span>
                  <span className="text-3xl md:text-4xl select-none shrink">🐘</span>
                  <span className="text-3xl md:text-4xl select-none shrink">🐒</span>
                </div>
              </>
            }
          >
            <div 
              role="radiogroup" 
              aria-label="Escolha uma categoria de jogo"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 w-full"
            >
              {(["animais", "cores"] as const).map((cat) => {
                const estaAtivo = categoria === cat;

                return (
                  <label
                    key={cat}
                    // aria-current avisa qual item está selecionado no momento
                    aria-current={estaAtivo ? "true" : undefined}
                    className={`w-full flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all select-none ${
                      estaAtivo
                        ? "border-orange-500 bg-orange-50 transform scale-105 shadow-md"
                        : "border-gray-200 hover:bg-gray-50 active:scale-95"
                    }`}
                  >
                    <input
                      type="radio"
                      name="categoria-jogo"
                      value={cat}
                      checked={estaAtivo}
                      onChange={() => setCategoria(cat)}
                      className="sr-only"
                      // aria-checked avisa se estiver ativo
                      aria-checked={estaAtivo}
                    />
                    <span
                      className={`font-bold text-lg capitalize pointer-events-none ${
                        estaAtivo ? "text-orange-700" : "text-gray-600"
                      }`}
                    >
                      {cat}
                    </span>
                  </label>
                );
              })}
            </div>

          </MenuGame>
          
        )}

        {gameState === "playing" && (
          <>
            {/* Header */}
            <HeaderGame
             titulo="Adivinhe a Imagem"
             onDesistir={handleGiveUp}
            >
              {/* Children */}
              <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div
                  aria-live="polite" 
                  aria-atomic="true"
                  lang="pt-BR" 
                  className="text-gray-600 font-medium"
                >
                  <span>Erros: </span>
                  <span className="text-red-500 font-bold">
                    {erros} de {MAX_ERROS}
                  </span>
                </div>

                <div 
                  aria-live="polite" 
                  aria-atomic="true" 
                  className="text-gray-600 font-medium sr-only sm:not-sr-only sm:inline-block"
                >
                  <span>Progresso: </span>
                  <span className="text-blue-600 font-bold">
                    {dadosAtuais.length - animaisRestantes.length}
                  </span>
                </div>
              </div>
            </HeaderGame>

            {/* Content */}
            {animalAtual && (
              <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-4 md:p-8 mb-8 mt-2 md:mt-4 relative flex flex-col items-center">
                <div className="text-center mb-6 flex flex-col items-center">
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-700 mb-6">
                    Onde está {animalAtual.nome}?
                  </h2>
                  <button
                    onClick={repetirAudio}
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-full shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  >
                    <Volume2 size={24} /> Ouvir Novamente
                  </button>
                </div>

                <div className="h-10 mb-8">
                  {mensagem && (
                    <p
                      className={`text-2xl md:text-3xl font-bold 
                    ${mensagem.includes("acertou") ? "text-green-500 animate-bounce" : "text-red-500"} 
                    ${isShaking ? "animate-shake" : ""} 
                  `}
                    >
                      {mensagem}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl mx-auto px-2">
                  {opcoes.map((animal) => (
                    <button
                      key={animal.id}
                      onClick={() => verificarResposta(animal)}
                      disabled={!podeClicar}
                      className={`w-full aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-md border-4 border-transparent focus:outline-none bg-gray-200 flex items-center justify-center transition-all duration-300
                      ${podeClicar ? "cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:border-blue-400 active:scale-95" : "cursor-default"}
                      ${isTransitioning ? "opacity-0 scale-90" : "opacity-100 scale-100"}
                    `}
                    >
                      <img
                        src={getImageUrl(animal.imagem)}
                        alt={`Imagem de ${animal.nome}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/400x400?text=Sem+Foto";
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
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
            subtitulo="Não desanime, tente novamente!"
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
            titulo="Parabéns!"
            subtitulo="Você acertou todos os animais!"
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