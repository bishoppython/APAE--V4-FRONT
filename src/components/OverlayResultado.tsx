import React from 'react';
import { Link } from 'react-router-dom';

interface OverlayProps {
  tipo: 'vitoria' | 'derrota' | 'desistencia';
  titulo: string;
  subtitulo: React.ReactNode;
  onReiniciar: () => void;
  icon?: React.ReactNode;
}

export const OverlayResultado = ({ tipo, titulo, subtitulo, onReiniciar, icon }: OverlayProps) => {
  const cores = {
    vitoria: 'border-green-500',
    derrota: 'border-red-500',
    desistencia: 'border-orange-500',
  };

  const coresTexto = {
  vitoria: 'text-green-500',
  derrota: 'text-red-500',
  desistencia: 'text-yellow-500', 
};

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[80vh] w-full">
      <div className={`bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center border-t-8 ${cores[tipo]} animate-pop-in`}>
        <div className={"mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6"}>
          {icon}
        </div>
        <h2 className={`text-4xl font-extrabold mb-4 ${coresTexto[tipo]}`}>
          {titulo}
        </h2>
        <div className="text-xl text-gray-700 mb-8">
          {subtitulo}
        </div>
        <div className="flex flex-col gap-3 w-full mt-8">
          <button onClick={onReiniciar} className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer font-bold py-4 rounded-xl text-lg transition-transform hover:scale-105">
            Jogar Novamente
          </button>
          <Link to="/" className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg block">
            Voltar para o Menu
          </Link>
        </div>
      </div>
    </div>
  );
};