import React from 'react';

interface HeaderGameProps {
  titulo: React.ReactNode;
  onDesistir: () => void;
  children?: React.ReactNode; // Estatísticas ou pontuação
}

export default function HeaderGame({ titulo, onDesistir, children }: HeaderGameProps) {
  return (
    <header aria-labelledby="header-game-title" className="mb-6 flex flex-col md:flex-row justify-between w-full max-w-5xl items-center pb-4 border-b border-gray-200 gap-4">
      <h1 id="header-game-title" className="text-2xl font-bold text-gray-700 mb-2 md:mb-0">
        {titulo}
      </h1>
      
      <div 
        role="group" 
        aria-label={`Controles e estatísticas do jogo ${titulo}`} 
        className="flex items-center gap-4"
      >
        <div 
          aria-live="polite" 
          className="flex items-center gap-4"
        >
          {children}
        </div>

        <button
          type="button" // Evita comportamentos inesperados de submit de formulários
          onClick={onDesistir}
          aria-label={`Desistir do jogo ${titulo}`}
          className="px-5 py-2 bg-red-100 hover:bg-red-200 rounded-lg cursor-pointer text-sm font-bold text-red-700 transition shadow-sm active:scale-95"
        >
          Desistir
        </button>
      </div>
    </header>
  );
}