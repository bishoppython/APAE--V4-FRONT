import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Volume2, Trophy, RotateCcw } from "lucide-react";

const animaisData = [
  { id: 1, nome: "a Baleia", imagem: "baleia", audioPergunta: "/audio/adivinha/onde-esta-baleia.ogg" },
  { id: 2, nome: "o Cachorro", imagem: "cachorro", audioPergunta: "/audio/adivinha/onde-esta-cachorro.ogg" },
  { id: 3, nome: "o Cavalo Marinho", imagem: "cavalo_marinho", audioPergunta: "/audio/adivinha/onde-esta-cavaloMarinho.ogg" },
  { id: 4, nome: "o Cavalo", imagem: "cavalo", audioPergunta: "/audio/adivinha/onde-esta-cavalo.ogg" },
  { id: 5, nome: "o Coelho", imagem: "coelho", audioPergunta: "/audio/adivinha/onde-esta-coelho.ogg" },
  { id: 6, nome: "o Elefante", imagem: "elefante", audioPergunta: "/audio/adivinha/onde-esta-elefante.ogg" },
  { id: 7, nome: "a Estrela", imagem: "estrela_do_mar", audioPergunta: "/audio/adivinha/onde-esta-estrelaMar.ogg" },
  { id: 8, nome: "a Galinha", imagem: "galinha", audioPergunta: "/audio/adivinha/onde-esta-galinha.ogg" },
  { id: 9, nome: "o Gato", imagem: "gato", audioPergunta: "/audio/adivinha/onde-esta-gato.ogg" },
  { id: 10, nome: "a Girafa", imagem: "girafa", audioPergunta: "/audio/adivinha/onde-esta-girafa.ogg" },
  { id: 11, nome: "o Golfinho", imagem: "golfinho", audioPergunta: "/audio/adivinha/onde-esta-golfinho.ogg" },
  { id: 12, nome: "o Hamster", imagem: "hamster", audioPergunta: "/audio/adivinha/onde-esta-hamster.ogg" },
  { id: 13, nome: "o Leão", imagem: "leao", audioPergunta: "/audio/adivinha/onde-esta-leao.ogg" },
  { id: 14, nome: "o Macaco", imagem: "macaco", audioPergunta: "/audio/adivinha/onde-esta-macaco.ogg" },
  { id: 15, nome: "a Onça", imagem: "onca", audioPergunta: "/audio/adivinha/onde-esta-onça.ogg" },
  { id: 16, nome: "a Ovelha", imagem: "ovelha", audioPergunta: "/audio/adivinha/onde-esta-ovelha.ogg" },
  { id: 17, nome: "o Urso", imagem: "urso", audioPergunta: "/audio/adivinha/onde-esta-urso.ogg" },
  { id: 18, nome: "o Pato", imagem: "pato", audioPergunta: "/audio/adivinha/onde-esta-pato.ogg" },
  { id: 19, nome: "o Peixe", imagem: "peixe", audioPergunta: "/audio/adivinha/onde-esta-peixe.ogg" },
  { id: 20, nome: "o Polvo", imagem: "polvo", audioPergunta: "/audio/adivinha/onde-esta-polvo.ogg" },
  { id: 21, nome: "o Porco", imagem: "porco", audioPergunta: "/audio/adivinha/onde-esta-porco.ogg" },
  { id: 22, nome: "o Tigre", imagem: "tigre", audioPergunta: "/audio/adivinha/onde-esta-tigre.ogg" },
  { id: 23, nome: "o Tubarão", imagem: "tubarao", audioPergunta: "/audio/adivinha/onde-esta-tubarao.ogg" },
  { id: 24, nome: "a Vaca", imagem: "vaca", audioPergunta: "/audio/adivinha/onde-esta-vaca.ogg" },
  { id: 25, nome: "o Rinoceronte", imagem: "rinoceronte", audioPergunta: "/audio/adivinha/onde-esta-rinoceronte.ogg" },
  { id: 26, nome: "a Tartaruga Marinha", imagem: "tartaruga_marinha", audioPergunta: "/audio/adivinha/onde-esta-tartarugaMarinha.ogg" },
  { id: 27, nome: "a Zebra", imagem: "zebra", audioPergunta: "/audio/adivinha/onde-esta-zebra.ogg" },
  { id: 28, nome: "o Guaxinim", imagem: "guaxinim", audioPergunta: "/audio/adivinha/onde-esta-guaxinim.ogg" },
];

const coresData = [
  { id: 101, nome: "a cor Amarela", imagem: "amarelo", audioPergunta: "/audio/adivinha/onde-esta-amarelo.ogg" },
  { id: 102, nome: "a cor Vermelha", imagem: "vermelho", audioPergunta: "/audio/adivinha/onde-esta-vermelho.ogg" },
  { id: 103, nome: "a cor Azul", imagem: "azul", audioPergunta: "/audio/adivinha/onde-esta-azul.ogg" },
  { id: 104, nome: "a cor Verde", imagem: "verde", audioPergunta: "/audio/adivinha/onde-esta-verde.ogg" },
  { id: 105, nome: "a cor Rosa", imagem: "rosa", audioPergunta: "/audio/adivinha/onde-esta-rosa.ogg" },
  { id: 106, nome: "a cor Branca", imagem: "branco", audioPergunta: "/audio/adivinha/onde-esta-branco.ogg" },
  { id: 107, nome: "a cor Preta", imagem: "preto", audioPergunta: "/audio/adivinha/onde-esta-preto.ogg" },
];

const getImageUrl = (name: string) => {
  const isCor = ["amarelo", "vermelho", "azul", "verde", "rosa", "branco", "preto"].includes(name);
  const folder = isCor ? "soletrando" : "animais";
  return new URL(`../../assets/images/${folder}/${name}.png`, import.meta.url).href;
};

export default function AdivinhaAnimais() {
  const [categoria, setCategoria] = useState<"animais" | "cores">("animais");
  const [animaisRestantes, setAnimaisRestantes] = useState<typeof animaisData>([]);
  const [animalAtual, setAnimalAtual] = useState(animaisData[0]);
  const [opcoes, setOpcoes] = useState<typeof animaisData>([]);
  const [mensagem, setMensagem] = useState("");
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [podeClicar, setPodeClicar] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isShaking, setIsShaking] = useState(false); // Novo estado para tremer
  const [started, setStarted] = useState(false);
  
  const [erros, setErros] = useState(0);
  const [jogoPerdido, setJogoPerdido] = useState(false);
  const [desistiu, setDesistiu] = useState(false);
  const MAX_ERROS = 3;

  const tocarAudio = (caminho: string) => {
    const audio = new Audio(caminho);
    audio.play().catch(e => console.log("Erro ao reproduzir áudio:", e));
  };

  const dadosAtuais = categoria === "animais" ? animaisData : coresData;

  const iniciarJogo = () => {
    const embaralhado = [...dadosAtuais].sort(() => 0.5 - Math.random());
    setJogoFinalizado(false);
    setJogoPerdido(false);
    setDesistiu(false);
    setErros(0);
    setMensagem("");
    proximaRodada(embaralhado);
    setStarted(true);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const proximaRodada = (restantes: typeof animaisData) => {
    if (restantes.length === 0) {
      setJogoFinalizado(true);
      tocarAudio("/audio/efeito-vitória.mp3");
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

  const gerarOpcoesAleatorias = (alvo: typeof animaisData[0]) => {
    const outrasOpcoes = dadosAtuais
      .filter((a) => a.id !== alvo.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const misturados = [...outrasOpcoes, alvo].sort(() => 0.5 - Math.random());
    setOpcoes(misturados);
  };

  const verificarResposta = (animalSelecionado: typeof animaisData[0]) => {
    if (!podeClicar) return;

    if (animalSelecionado.id === animalAtual.id) {
      setPodeClicar(false);
      setIsShaking(false);
      tocarAudio("/audio/efeito_acerto.mp3");
      setMensagem("Muito bem! Você acertou! 🎉");

      setTimeout(() => {
        proximaRodada(animaisRestantes);
      }, 2000);
    } else {
      setPodeClicar(false);
      tocarAudio("/audio/efeito-erro.mp3");
      
      const novosErros = erros + 1;
      setErros(novosErros);

      if (novosErros >= MAX_ERROS) {
        setIsShaking(true);
        setMensagem("Fim de Jogo! ❌");
        setTimeout(() => {
          setJogoPerdido(true);
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
    <div className="min-h-screen bg-gray-50 font-poppins relative pb-24">
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
        `}
      </style>

      {!started && (
        <div className="flex flex-col items-center justify-center p-6 min-h-screen">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full mx-4 border-t-8 border-orange-500 animate-pop-in">
            <div className="flex justify-center items-center mb-6 space-x-4">
              <span className="text-5xl">🦁</span>
              <span className="text-5xl">🐘</span>
              <span className="text-5xl">🐒</span>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Adivinhe os Animais</h1>
            <p className="text-gray-600 mb-8 font-medium">Escolha a categoria, ouça o som e clique na imagem correta!</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
                {(["animais", "cores"] as const).map(cat => (
                    <label key={cat} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        categoria === cat ? 'border-orange-500 bg-orange-50 transform scale-105 shadow-md' : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                        <input
                            name="theme-radio"
                            type="radio"
                            className="hidden"
                            checked={categoria === cat}
                            onChange={() => setCategoria(cat)}
                        />
                        <span className={`font-bold text-lg capitalize ${categoria === cat ? 'text-orange-700' : 'text-gray-600'}`}>
                            {cat}
                        </span>
                    </label>
                ))}
            </div>

            <button
              onClick={iniciarJogo}
              className="w-full font-bold py-4 px-8 rounded-xl text-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
            >
              Jogar Agora
            </button>
          </div>
        </div>
      )}

      {started && !jogoFinalizado && !jogoPerdido && !desistiu && (
        <main className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center pt-4 md:pt-8 pb-24">
          {/* Header */}
          <div className="mb-4 flex flex-col md:flex-row justify-between w-full max-w-6xl items-center pb-2 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-700 mb-2 md:mb-0">Adivinhe a Imagem</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">
                Erros: <span className="text-red-500 font-bold mr-4">{erros} / {MAX_ERROS}</span>
                Progresso: <span className="text-blue-600 font-bold">{dadosAtuais.length - animaisRestantes.length} / {dadosAtuais.length}</span>
              </span>
              <button
                onClick={() => setDesistiu(true)}
                className="px-5 py-2 bg-red-100 hover:bg-red-200 rounded-lg cursor-pointer text-sm font-bold text-red-700 transition shadow-sm"
              >
                Desistir
              </button>
            </div>
          </div>

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
                  <p className={`text-2xl md:text-3xl font-bold 
                    ${mensagem.includes('acertou') ? 'text-green-500 animate-bounce' : 'text-red-500'} 
                    ${isShaking ? 'animate-shake' : ''} 
                  `}>
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
                      ${podeClicar ? 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:border-blue-400 active:scale-95' : 'cursor-default'}
                      ${isTransitioning ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}
                    `}
                  >
                    <img
                      src={getImageUrl(animal.imagem)}
                      alt={`Imagem de ${animal.nome}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Sem+Foto';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

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
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
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
                <span className="text-orange-500 text-5xl font-bold">!</span>
              </div>
              <h2 className="text-4xl font-extrabold text-orange-600 mb-4">Você Desistiu!</h2>
              <p className="text-xl text-gray-700 mb-2">
                Você acertou <span className="font-bold text-2xl text-orange-600">{dadosAtuais.length - animaisRestantes.length}</span> imagens.
              </p>
              <div className="flex flex-col gap-3 w-full mt-8">
                <button
                  onClick={iniciarJogo}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
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
                Parabéns! Você encontrou todas as imagens com sucesso!
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={iniciarJogo}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
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