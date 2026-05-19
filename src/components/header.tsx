import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/libs/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/AuthStore";

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState("Jogos");
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

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
  <header role="banner" className="fixed inset-x-0 top-0 z-40 flex flex-col md:flex-row items-center justify-between px-4 sm:px-10 py-3 bg-white/80 backdrop-blur-sm shadow-sm font-sans w-full box-border">
    
    {/* Logo do App */}
    <Link to="/" className="flex items-center gap-2 flex-none cursor-pointer hover:scale-105 transition-transform duration-500">
      <img src="icon.svg" alt="NeuroKids Logo" className="size-10 md:size-12" />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
        NeuroKids
      </h1>
    </Link>

    {/* Menu e Perfil agrupados de forma responsiva */}
    <div className="flex items-center justify-center md:justify-end w-full md:w-auto max-w-full box-border mt-2 md:mt-0">
      <nav aria-label="Menu Principal" className="w-full md:w-auto max-w-full">
        <ul className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 md:gap-8 m-0 p-0 list-none w-full">
          {menuItems.map((item) => {
            const dropdownItems =
              item.name === "Jogos"
                ? gamesMenu
                : item.name === "Conversação"
                  ? conversationMenu
                  : null;

            if (dropdownItems) {
              const dropdownId = `dropdown-${item.name.toLowerCase()}`;
              const estaAtivo = activeItem === item.name;

              return (
                <li key={item.name} className="relative group">
                  <button
                    type="button"
                    aria-expanded={estaAtivo} 
                    aria-controls={dropdownId}
                    aria-haspopup="true"
                    onClick={() => setActiveItem(estaAtivo ? "" : item.name)}
                    className={cn(
                      "cursor-pointer text-sm md:text-base transition-colors hover:text-gray-900 flex items-center gap-1 focus:outline-none py-1",
                      estaAtivo ? "text-gray-950 font-bold border-b-2 border-gray-950" : "text-gray-600 font-medium"
                    )}
                  >
                    {item.name}
                    <span className="text-[9px] opacity-70" aria-hidden="true">▼</span>
                  </button>

                  {/* CORREÇÃO DO DROPDOWN: 
                      Trocamos w-[420px] por w-[90vw] no mobile, subindo para md:w-[420px] no PC.
                      Trocamos left-1/2 por escoramento inteligente para evitar o estouro lateral */}
                  <div
                    id={dropdownId}
                    className="absolute -left-10 sm:left-1/2 top-full z-50 w-[88vw] sm:w-[380px] md:w-[420px] sm:-translate-x-1/2 pt-3 opacity-0 invisible pointer-events-none transition-all duration-200 transform scale-95 -translate-y-2 
                      group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:scale-100 group-hover:translate-y-0
                      group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:translate-y-0"
                  >
                    <div className="rounded-2xl border border-gray-200 bg-white p-3 md:p-4 shadow-xl">
                      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        {item.name}
                      </div>
                      
                      {/* Grid responsiva dentro do dropdown: 1 coluna no celular, 2 no PC */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        {dropdownItems.map((entry) => (
                          <Link
                            key={entry.name}
                            to={entry.href}
                            onClick={() => setActiveItem("")}
                            className="rounded-lg p-2 transition-colors hover:bg-gray-50 block"
                          >
                            <div className="text-xs md:text-sm font-semibold text-gray-800">
                              {entry.name}
                            </div>
                            <div className="text-[11px] text-gray-500 leading-tight hidden sm:block">
                              {entry.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setActiveItem(item.name)}
                  className={cn(
                    "cursor-pointer text-sm md:text-base transition-colors hover:text-gray-900 py-1",
                    activeItem === item.name
                      ? "text-gray-950 font-bold border-b-2 border-gray-950"
                      : "text-gray-600 font-medium",
                  )}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Área do Perfil */}
      <div 
        role="group" 
        aria-label="Perfil do usuário"
        className="hidden sm:flex items-center gap-2 md:gap-3 flex-none"
      >
        <span className="text-xs md:text-sm font-medium text-gray-700">{user?.name}</span>
        <div className="p-1.5 bg-gray-100 rounded-full text-gray-500" aria-hidden="true">
          <User className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  </header>
);
};

export default Header;
