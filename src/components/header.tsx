import React, { useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/libs/utils';
import { Link } from 'react-router-dom';

interface HeaderProps {
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userName = "Fulano da Silva" }) => {
  const [activeItem, setActiveItem] = useState("Crianças");
  const menuItems = [
    { name: "Crianças", href: "/criancas" },
    { name: "Jogos", href: "/jogos" },
    { name: "Conversação", href: "/conversacao" }
  ];

  return (
    <header className="flex flex-col md:flex-row items-center gap-3 md:gap-0 justify-between px-4 sm:px-10 py-2 bg-white shadow-sm font-sans">

      <div className="flex items-center gap-2 flex-none">
        <img src="icon.svg" alt="Logo" className="size-12" />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          NeuroKids
        </h1>
      </div>


      <div className="flex items-center gap-6 md:gap-12">
        <nav>
          <ul className="flex items-center gap-4 md:gap-8">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                onClick={() => setActiveItem(item.name)}
                className={cn(
                  `cursor-pointer text-base transition-colors hover:text-gray-900`,
                  activeItem === item.name
                    ? "text-gray-950 font-bold border-b-2 border-gray-950"
                    : "text-gray-600 font-medium"
                )}
              >
                {item.name}
              </Link>
            ))}
          </ul>
        </nav>

        <div className="hidden sm:flex items-center gap-3">
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