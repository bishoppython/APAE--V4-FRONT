import React from 'react';

interface HeaderGameProps {
  titulo: string;
  onDesistir: () => void;
  children?: React.ReactNode; // Aqui entrarão os placares/estatísticas
}

export default function HeaderGame({ titulo, onDesistir, children }: HeaderGameProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row justify-between w-full max-w-5xl items-center pb-4 border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-700 mb-2 md:mb-0">
        {titulo}
      </h1>
      
      <div className="flex items-center gap-4">
        {/* Renderiza as estatísticas específicas de cada jogo */}
        <div className="flex items-center gap-4">
          {children}
        </div>

        <button
          onClick={onDesistir}
          className="px-5 py-2 bg-red-100 hover:bg-red-200 rounded-lg cursor-pointer text-sm font-bold text-red-700 transition shadow-sm active:scale-95"
        >
          Desistir
        </button>
      </div>
    </div>
  );
}