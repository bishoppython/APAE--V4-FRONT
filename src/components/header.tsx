import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/libs/utils";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userName = "Fulano da Silva" }) => {
  const [activeItem, setActiveItem] = useState("Crianças");
  const location = useLocation();
  const menuItems = [
    { name: "Crianças", href: "/criancas" },
    { name: "Jogos", href: "/#jogos" },
    { name: "Conversação", href: "/#conversacao" },
  ];
  const gamesMenu = [
    {
      name: "Onde Está?",
      href: "/onde-esta",
      description:
        "Estimula o reconhecimento visual e auditivo com animais e cores.",
    },
    {
      name: "Cobrir Tracejado",
      href: "/cobrir-tracejado",
      description: "Auxilia no desenvolvimento da coordenação motora fina.",
    },
    {
      name: "Encaixe de Formas",
      href: "/encaixe-formas",
      description: "Trabalha a percepção visual e reconhecimento espacial.",
    },
    {
      name: "Jogo da Memória",
      href: "/memoria",
      description: "Exercita a memória de curto prazo e a concentração.",
    },
    {
      name: "Labirinto",
      href: "/labirinto",
      description: "Desenvolve a coordenação motora e raciocínio lógico.",
    },
    {
      name: "Quebra-Cabeça",
      href: "/quebra-cabeca",
      description: "Estimula a resolução de problemas e o raciocínio lógico.",
    },
    {
      name: "Soletrando",
      href: "/soletrando",
      description:
        "Ajuda a desenvolver a atenção, memória e habilidades de soletração.",
    },
  ];
  const conversationMenu = [
    {
      name: "Animais",
      href: "/animais",
      description:
        "Aprenda e identifique os animais, estimulando o vocabulário.",
    },
    {
      name: "Calculadora",
      href: "/calculadora",
      description: "Aprenda as partes do corpo e pratique a contagem.",
    },
    {
      name: "Cores",
      href: "/cores",
      description: "Reconheça e nomeie as cores de forma interativa.",
    },
    {
      name: "Misturando Cores",
      href: "/misturando-cores",
      description: "Descubra o que acontece ao misturar diferentes cores.",
    },
    {
      name: "Necessidades",
      href: "/necessidades",
      description: "Comunicação de necessidades básicas e sentimentos.",
    },
    {
      name: "Números",
      href: "/numeros",
      description: "Aprenda os números e pratique a contagem.",
    },
  ];

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) {
      return;
    }

    const targetId = decodeURIComponent(location.hash.slice(1));
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.pathname, location.hash]);

  return (
    <header className="fixed mb-20 inset-x-0 top-0 z-40 flex flex-col md:flex-row items-center gap-3 md:gap-0 justify-between px-4 sm:px-10 py-2 bg-white/80 backdrop-blur-sm shadow-sm font-sans">
      <Link to="/" className="flex items-center gap-2 flex-none cursor-pointer hover:scale-105 transition-transform duration-500">
        <img src="icon.svg" alt="Logo" className="size-12" />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          NeuroKids
        </h1>
      </Link>

      <div className="flex items-center gap-6 md:gap-12">
        <nav>
          <ul className="flex items-center gap-4 md:gap-8">
            {menuItems.map((item) => {
              const dropdownItems =
                item.name === "Jogos"
                  ? gamesMenu
                  : item.name === "Conversação"
                    ? conversationMenu
                    : null;

              if (dropdownItems) {
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      to={item.href}
                      onClick={() => setActiveItem(item.name)}
                      className={cn(
                        "cursor-pointer text-base transition-colors hover:text-gray-900",
                        activeItem === item.name
                          ? "text-gray-950 font-bold border-b-2 border-gray-950"
                          : "text-gray-600 font-medium",
                      )}
                    >
                      {item.name}
                    </Link>

                    <div className="absolute left-1/2 top-full z-50 w-[420px] -translate-x-1/2 pt-3 opacity-0 invisible pointer-events-none transition-all duration-200 transform scale-95 -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:scale-100 group-hover:translate-y-0">
                      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                          {item.name}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {dropdownItems.map((entry) => (
                            <Link
                              key={entry.name}
                              to={entry.href}
                              onClick={() => setActiveItem(item.name)}
                              className="rounded-lg p-2 transition-colors hover:bg-gray-50"
                            >
                              <div className="text-sm font-semibold text-gray-800">
                                {entry.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {entry.description}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setActiveItem(item.name)}
                  className={cn(
                    "cursor-pointer text-base transition-colors hover:text-gray-900",
                    activeItem === item.name
                      ? "text-gray-950 font-bold border-b-2 border-gray-950"
                      : "text-gray-600 font-medium",
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
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
