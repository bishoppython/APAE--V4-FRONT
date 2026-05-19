import React from 'react';

// Definimos o que o componente precisa receber para funcionar
interface StatItemProps {
  label: string;
  valor: number | string;
  icon: React.ReactNode;
}
export default function StatItem({ label, valor, icon }: StatItemProps) {
  return (
    <div className="flex items-center gap-4 w-full md:w-auto">
      {/* Círculo do Ícone */}
      <div className="w-14 h-14 md:w-16 md:h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center shrink-0">
        {icon}
      </div>
      
      {/* Textos */}
      <div className="flex flex-col">
        <span className="text-xs md:text-sm text-gray-400 font-medium leading-tight">
          {label}
        </span>
        <span className="text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
          {valor}
        </span>
      </div>
    </div>
  );
}