import React, { useState } from 'react';
import { User } from 'lucide-react'; 

interface HeaderProps {
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userName = "Fulano da Silva" }) => {
  const [activeItem, setActiveItem] = useState("Crianças");
  const menuItems = ["Crianças", "Jogos", "Conversação"];

  return (
    <header className="flex items-center justify-between px-10 py-6 bg-white shadow-sm font-sans">
      
      <div className="flex items-center gap-3 flex-none">
        <div className="w-10 h-10 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          <span className="text-[10px] text-gray-400 font-bold">LOGO</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          NeuroKids
        </h1>
      </div>

      <div className="flex items-center gap-12">
        <nav>
          <ul className="flex items-center gap-8">
            {menuItems.map((name) => (
              <li 
                key={name} 
                onClick={() => setActiveItem(name)}
                className={`cursor-pointer text-base transition-colors hover:text-gray-900 ${
                  activeItem === name 
                    ? "text-gray-950 font-bold border-b-2 border-gray-950" 
                    : "text-gray-600 font-medium"
                }`}
              >
                {name}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">{userName}</span>
          <div className="p-1.5 bg-gray-100 rounded-full text-gray-500">
            <User className="w-5 h-5" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;