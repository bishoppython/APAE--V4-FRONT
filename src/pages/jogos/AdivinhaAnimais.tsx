import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Volume2, Trophy, RotateCcw } from "lucide-react";

const animaisData = [
  { id: 1, nome: "a Baleia", imagem: "/images/animais/baleia.jpg", audioPergunta: "/audio/adivinha/onde-esta-baleia.ogg" },
  { id: 2, nome: "o Cachorro", imagem: "/images/animais/cachorro.jpg", audioPergunta: "/audio/adivinha/onde-esta-cachorro.ogg" },
  { id: 3, nome: "o Cavalo Marinho", imagem: "/images/animais/cavalo marinho.jpg", audioPergunta: "/audio/adivinha/onde-esta-cavaloMarinho.ogg" },
  { id: 4, nome: "o Cavalo", imagem: "/images/animais/cavalo.jpg", audioPergunta: "/audio/adivinha/onde-esta-cavalo.ogg" },
  { id: 5, nome: "o Coelho", imagem: "/images/animais/coelho.jpg", audioPergunta: "/audio/adivinha/onde-esta-coelho.ogg" },
  { id: 6, nome: "o Elefante", imagem: "/images/animais/elefante.jpg", audioPergunta: "/audio/adivinha/onde-esta-elefante.ogg" },
  { id: 7, nome: "a Estrela", imagem: "/images/animais/estrela.jpg", audioPergunta: "/audio/adivinha/onde-esta-estrelaMar.ogg" },
  { id: 8, nome: "a Galinha", imagem: "/images/animais/galinha.jpg", audioPergunta: "/audio/adivinha/onde-esta-galinha.ogg" },
  { id: 9, nome: "o Gato", imagem: "/images/animais/gato.jpg", audioPergunta: "/audio/adivinha/onde-esta-gato.ogg" },
  { id: 10, nome: "a Girafa", imagem: "/images/animais/girafa.jpg", audioPergunta: "/audio/adivinha/onde-esta-girafa.ogg" },
  { id: 11, nome: "o Golfinho", imagem: "/images/animais/golfinho.jpg", audioPergunta: "/audio/adivinha/onde-esta-golfinho.ogg" },
  { id: 12, nome: "o Hamster", imagem: "/images/animais/hamster.jpg", audioPergunta: "/audio/adivinha/onde-esta-hamster.ogg" },
  { id: 13, nome: "o Leão", imagem: "/images/animais/leão.jpg", audioPergunta: "/audio/adivinha/onde-esta-leao.ogg" },
  { id: 14, nome: "o Macaco", imagem: "/images/animais/macaco.jpg", audioPergunta: "/audio/adivinha/onde-esta-macaco.ogg" },
  { id: 15, nome: "a Onça", imagem: "/images/animais/onça.jpg", audioPergunta: "/audio/adivinha/onde-esta-onça.ogg" },
  { id: 16, nome: "a Ovelha", imagem: "/images/animais/ovelha.jpg", audioPergunta: "/audio/adivinha/onde-esta-ovelha.ogg" },
  { id: 17, nome: "o Papagaio", imagem: "/images/animais/papagaio.jpg", audioPergunta: "/audio/animais/papagaio.mp3" },
  { id: 18, nome: "o Pato", imagem: "/images/animais/pato.jpg", audioPergunta: "/audio/adivinha/onde-esta-pato.ogg" },
  { id: 19, nome: "o Peixe", imagem: "/images/animais/peixe.jpg", audioPergunta: "/audio/adivinha/onde-esta-peixe.ogg" },
  { id: 20, nome: "o Polvo", imagem: "/images/animais/polvo.jpg", audioPergunta: "/audio/adivinha/onde-esta-polvo.ogg" },
  { id: 21, nome: "o Porco", imagem: "/images/animais/porco.jpg", audioPergunta: "/audio/adivinha/onde-esta-porco.ogg" },
  { id: 22, nome: "o Tigre", imagem: "/images/animais/tigre.jpg", audioPergunta: "/audio/adivinha/onde-esta-tigre.ogg" },
  { id: 23, nome: "o Tubarão", imagem: "/images/animais/tubarão.jpg", audioPergunta: "/audio/adivinha/onde-esta-tubarao.ogg" },
  { id: 24, nome: "a Vaca", imagem: "/images/animais/vaca.jpg", audioPergunta: "/audio/adivinha/onde-esta-vaca.ogg" }
];

export default function AdivinhaAnimais() {
  const [animaisRestantes, setAnimaisRestantes] = useState<typeof animaisData>([]);
  const [animalAtual, setAnimalAtual] = useState(animaisData[0]);
  const [opcoes, setOpcoes] = useState<typeof animaisData>([]);
  const [mensagem, setMensagem] = useState("");
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [podeClicar, setPodeClicar] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isShaking, setIsShaking] = useState(false); // Novo estado para tremer

  const tocarAudio = (caminho: string) => {
    const audio = new Audio(caminho);
    audio.play().catch(e => console.log("Erro ao reproduzir áudio:", e));
  };

  const iniciarJogo = () => {
    const embaralhado = [...animaisData].sort(() => 0.5 - Math.random());
    setJogoFinalizado(false);
    setMensagem("");
    proximaRodada(embaralhado);
  };

  useEffect(() => {
    iniciarJogo();
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
    const outrasOpcoes = animaisData
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
      // Mudei o texto aqui como solicitado
      setMensagem("Errado! Tente novamente ❌"); 
      
      // Ativa a animação de tremer e o fade out
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
  };

  const repetirAudio = () => {
    tocarAudio(animalAtual.audioPergunta);
  };

  if (jogoFinalizado) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-3xl border-8 border-yellow-400 animate-in zoom-in duration-500">
          <Trophy size={100} className="text-yellow-400 mb-6 animate-bounce" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow-sm">
            Parabéns!!
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-10 font-bold">
            Todos os animais foram encontrados!
          </p>
          
          <div className="flex gap-4 flex-col sm:flex-row">
            <button 
              onClick={iniciarJogo}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-4 px-8 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <RotateCcw size={28} /> Jogar Novamente
            </button>
            <Link 
              to="/jogos"
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl py-4 px-8 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={28} /> Voltar aos Jogos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-4 md:p-8">
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

      <header className="w-full max-w-[95vw] flex justify-between items-center mb-8">
        <Link to="/jogos" className="flex items-center text-blue-600 hover:text-blue-800 bg-white p-3 rounded-full shadow-md transition-transform hover:scale-105">
          <ArrowLeft size={24} />
          <span className="ml-2 font-bold hidden sm:block">Jogos</span>
        </Link>
        <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 text-center tracking-wide drop-shadow-sm">
          Adivinha os Animais
        </h1>
        <div className="w-auto min-w-12 text-center font-bold text-blue-500 bg-white p-3 px-4 rounded-full shadow-md">
          {24 - animaisRestantes.length} / 24
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-start mt-4">
        
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

        <div className="flex flex-row w-full max-w-[95vw] justify-center gap-2 sm:gap-4 md:gap-6 px-2">
          {opcoes.map((animal) => (
            <button
              key={animal.id}
              onClick={() => verificarResposta(animal)}
              disabled={!podeClicar}
              className={`flex-1 aspect-square max-w-[200px] rounded-xl md:rounded-2xl overflow-hidden shadow-md border-4 border-transparent focus:outline-none bg-gray-200 flex items-center justify-center transition-all duration-300
                ${podeClicar ? 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:border-blue-400 active:scale-95' : 'cursor-default'}
                ${isTransitioning ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}
              `}
            >
              <img 
                src={animal.imagem} 
                alt={`Imagem de ${animal.nome}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Sem+Foto';
                }}
              />
            </button>
          ))}
        </div>

      </main>
    </div>
  );
}