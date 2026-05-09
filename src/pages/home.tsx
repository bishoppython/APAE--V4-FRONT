import { PageContainer, PageTitle } from "@/components/ui/page_components";
import { CardHome } from "@/components/ui/cardHome";
import { motion, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import controle from "../assets/images/controle.png";
import livro from "../assets/images/livro.png";

function DraggableCarousel({ children }: { children: React.ReactNode }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current && innerRef.current) {
        setWidth(
          innerRef.current.scrollWidth - carouselRef.current.offsetWidth,
        );
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [children]);

  const handleScroll = (direction: 1 | -1) => {
    const currentX = x.get();
    // Avança cerca de 1 cartão por clique (tamanho do card + gap)
    const offset = 440;
    const newX =
      direction === 1
        ? Math.max(currentX - offset, -width)
        : Math.min(currentX + offset, 0);

    animate(x, newX, { type: "spring", stiffness: 300, damping: 30 });
  };

  return (
    <div className="relative w-full py-4">
      <button
        onClick={() => handleScroll(-1)}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-[#00C4CC] shadow-lg rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-opacity disabled:opacity-0 cursor-pointer border border-gray-200"
      >
        <ChevronLeft size={40} />
      </button>

      <motion.div
        ref={carouselRef}
        className="cursor-grab active:cursor-grabbing overflow-hidden w-full"
      >
        <motion.div
          ref={innerRef}
          drag="x"
          style={{ x }}
          dragConstraints={{ right: 0, left: -width }}
          dragElastic={0.1}
          onDragStart={() => {
            isDragging.current = true;
          }}
          onDragEnd={() => {
            setTimeout(() => {
              isDragging.current = false;
            }, 100);
          }}
          onClickCapture={(e) => {
            if (isDragging.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className="flex gap-6 w-max pb-6 pt-2 px-4 md:px-8"
        >
          {children}
        </motion.div>
      </motion.div>

      <button
        onClick={() => handleScroll(1)}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-[#00C4CC] shadow-lg rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-opacity disabled:opacity-0 cursor-pointer border border-gray-200"
      >
        <ChevronRight size={40} />
      </button>
    </div>
  );
}

export default function Home() {
  const getImageUrl = (
    title: string,
    folder: "games" | "conversacao" = "games",
  ) => {
    // Normaliza o título: "Onde Está?" -> "onde-esta", "Jogo da Memória" -> "jogo-da-memoria"
    const name = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/\s+/g, "-") // Espaços por hífen
      .replace(/[^a-z0-9\-]/g, ""); // Remove pontuação como '?'

    return new URL(`../assets/images/${folder}/${name}.png`, import.meta.url)
      .href;
  };

  return (
    <PageContainer>
      <div
        id="jogos"
        className="w-full flex items-center justify-center flex-col gap-6 mt-16 md:mt-24"
      >
        <img className="h-[120px] object-contain" src={controle} alt="" />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#00C4CC] to-[#8B3DFF] text-transparent bg-clip-text mt-8 pb-2">
          Jogos e Desafios
        </h1>
        <p className="text-center text-xl font-semibold text-black font-normal leading-10 max-w-[600px] ">
          Cada jogo foi pensado para estimular diferentes habilidades e
          estimular o aprendizado.
        </p>
      </div>

      <DraggableCarousel>
        <CardHome
          href="/onde-esta"
          img={getImageUrl("Onde Está?", "games")}
          title="Onde Está?"
          description="Estimula o reconhecimento visual e auditivo com animais e cores."
        />
        <CardHome
          href="/cobrir-tracejado"
          img={getImageUrl("Cobrir Tracejado", "games")}
          title="Cobrir Tracejado"
          description="Auxilia no desenvolvimento da coordenação motora fina."
        />
        <CardHome
          href="/encaixe-formas"
          img={getImageUrl("Encaixe de Formas", "games")}
          title="Encaixe de Formas"
          description="Trabalha a percepção visual e reconhecimento espacial."
        />
        <CardHome
          href="/memoria"
          img={getImageUrl("Jogo da Memória", "games")}
          title="Jogo da Memória"
          description="Exercita a memória de curto prazo e a concentração."
        />
        <CardHome
          href="/labirinto"
          img={getImageUrl("Labirinto", "games")}
          title="Labirinto"
          description="Desenvolve a coordenação motora e raciocínio lógico."
        />
        <CardHome
          href="/quebra-cabeca"
          img={getImageUrl("Quebra-Cabeça", "games")}
          title="Quebra-Cabeça"
          description="Estimula a resolução de problemas e o raciocínio lógico."
        />
        <CardHome
          href="/soletrando"
          img={getImageUrl("Soletrando", "games")}
          title="Soletrando"
          description="Ajuda a desenvolver a atenção, memória e habilidades de soletração."
        />
      </DraggableCarousel>

      <div
        id="conversacao"
        className="w-full flex items-center justify-center flex-col gap-6 mt-16 md:mt-24"
      >
        <img className="h-[120px] object-contain" src={livro} alt="" />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#FF2D83] to-[#8B3DFF] text-transparent bg-clip-text mt-8 pb-2">
          {" "}
          Conversação e Escuta
        </h1>
        <p className="text-center text-xl font-semibold text-black font-normal leading-10 max-w-[600px] ">
          Explore atividades que auxiliam no desenvolvimento da comunicação e
          compreensão auditiva.
        </p>
      </div>

      <DraggableCarousel>
        <CardHome
          href="/animais"
          img={getImageUrl("Animais", "conversacao")}
          title="Animais"
          description="Aprenda e identifique os animais, estimulando o vocabulário."
        />
        <CardHome
          href="/calculadora"
          img={getImageUrl("Calculadora", "conversacao")}
          title="Calculadora"
          description="Aprenda as partes do corpo e pratique a contagem."
        />
        <CardHome
          href="/cores"
          img={getImageUrl("Cores", "conversacao")}
          title="Cores"
          description="Reconheça e nomeie as cores de forma interativa."
        />
        <CardHome
          href="/misturando-cores"
          img={getImageUrl("Misturando Cores", "conversacao")}
          title="Misturando Cores"
          description="Descubra o que acontece ao misturar diferentes cores."
        />
        <CardHome
          href="/necessidades"
          img={getImageUrl("Necessidades", "conversacao")}
          title="Necessidades"
          description="Comunicação de necessidades básicas e sentimentos."
        />
        <CardHome
          href="/numeros"
          img={getImageUrl("Números", "conversacao")}
          title="Números"
          description="Aprenda os números e pratique a contagem."
        />
      </DraggableCarousel>
    </PageContainer>
  );
}
