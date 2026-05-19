import React from 'react';

interface MenuGameProps {
  titulo: string;
  subtitulo: string;
  onIniciar: () => void;
  podeIniciar?: boolean; // Para o caso de estar carregando recursos
  textoBotao?: string;
  corDestaque?: string; 
  icones?: React.ReactNode; // Emojis ou imagens do topo
  children?: React.ReactNode; 
}

export default function MenuGame({
  titulo,
  subtitulo,
  onIniciar,
  podeIniciar = true,
  textoBotao = "Jogar Agora",
  corDestaque = "green",
  icones,
  children
}: MenuGameProps) {
  
  // Mapeamento simples de cores para Tailwind
  const cores = {
    green: "border-green-500 bg-green-500 hover:bg-green-600",
    orange: "border-orange-500 bg-orange-500 hover:bg-orange-600",
    blue: "border-blue-500 bg-blue-500 hover:bg-blue-600",
    pink: "border-pink-500 bg-pink-500 hover:bg-pink-600",
    indigo: "border-indigo-500 bg-indigo-500 hover:bg-indigo-600",
  };

  const corBorder = cores[corDestaque as keyof typeof cores].split(' ')[0];
  const corBtn = cores[corDestaque as keyof typeof cores].split(' ').slice(1).join(' ');

  return (
    <section 
      role="region"
      aria-labelledby="game-menu-title"
      className={`bg-white p-6 md:p-8 rounded-2xl  text-center w-full max-w-sm mx-auto border-t-8 ${corBorder} animate-pop-in`}
    >
      
      {/* Área dos Ícones/Imagens */}
      {icones && (
        <div aria-hidden="true" className="flex justify-center items-center mb-6 gap-4">
          {icones}
        </div>
      )}

      <h1 id="game-menu-title" className="text-3xl font-bold mb-4 text-gray-800">{titulo}</h1>
      <p className="text-gray-600 mb-8 font-medium">{subtitulo}</p>
      
      {/* Aqui entram as opções (se o jogo não tiver, deixar em branco ou fechar direto a tag) */}
      {children && (
        <div className="mb-8">
          {children}
        </div>
      )}
      
      <button 
        type="button" 
        onClick={onIniciar}
        disabled={!podeIniciar}
        aria-label={podeIniciar ? `Iniciar jogo ${titulo}` : "Aguarde, carregando o jogo"}
        className={`w-full font-bold py-4 px-8 rounded-xl text-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg flex items-center justify-center gap-2 
          ${podeIniciar ? `${corBtn} text-white` : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        <span aria-live="polite">
          {podeIniciar ? textoBotao : 'Carregando...'}
        </span>
      </button>
    </section>
  );
}