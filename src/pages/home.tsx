import { PageContainer } from "@/components/ui/page_components";
import { CardHome } from "@/components/ui/cardHome";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselHeader,
  CarouselIcon,
  CarouselTitle,
  CarouselDescription,
} from "@/components/ui/carousel";

import controle from "../assets/images/controle.png";
import livro from "../assets/images/livro.png";

export default function Home() {
  const GAMES_DATA = [
    {
      href: "/onde-esta",
      title: "Onde Está?",
      description:
        "Estimula o reconhecimento visual e auditivo com animais e cores.",
    },
    {
      href: "/cobrir-tracejado",
      title: "Cobrir Tracejado",
      description: "Auxilia no desenvolvimento da coordenação motora fina.",
    },
    {
      href: "/encaixe-formas",
      title: "Encaixe de Formas",
      description: "Trabalha a percepção visual e reconhecimento espacial.",
    },
    {
      href: "/memoria",
      title: "Jogo da Memória",
      description: "Exercita a memória de curto prazo e a concentração.",
    },
    {
      href: "/labirinto",
      title: "Labirinto",
      description: "Desenvolve a coordenação motora e raciocínio lógico.",
    },
    {
      href: "/quebra-cabeca",
      title: "Quebra-Cabeça",
      description: "Estimula a resolução de problemas e o raciocínio lógico.",
    },
    {
      href: "/soletrando",
      title: "Soletrando",
      description:
        "Ajuda a desenvolver a atenção, memória e habilidades de soletração.",
    },
  ];

  const CONVERSATION_DATA = [
    {
      href: "/animais",
      title: "Animais",
      description: "Aprenda e identifique os animais, estimulando o vocabulário.",
    },
    {
      href: "/calculadora",
      title: "Calculadora",
      description: "Aprenda as partes do corpo e pratique a contagem.",
    },
    {
      href: "/cores",
      title: "Cores",
      description: "Reconheça e nomeie as cores de forma interativa.",
    },
    {
      href: "/misturando-cores",
      title: "Misturando Cores",
      description: "Descubra o que acontece ao misturar diferentes cores.",
    },
    {
      href: "/necessidades",
      title: "Necessidades",
      description: "Comunicação de necessidades básicas e sentimentos.",
    },
    {
      href: "/numeros",
      title: "Números",
      description: "Aprenda os números e pratique a contagem.",
    },
  ];

  const getImageUrl = (
    title: string,
    folder: "games" | "conversacao" = "games",
  ) => {
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
    <PageContainer className="w-full overflow-x-hidden">
      <CarouselHeader
        id="jogos"
        className="mt-10 md:mt-16"
      >
        <CarouselIcon src={controle} />
        <CarouselTitle className="bg-linear-to-r from-[#00C4CC] to-[#8B3DFF] text-transparent bg-clip-text">
          Jogos e Desafios
        </CarouselTitle>
        <CarouselDescription>
          Cada jogo foi pensado para estimular diferentes habilidades e
          estimular o aprendizado.
        </CarouselDescription>
      </CarouselHeader>

      <Carousel className="w-full">
        <CarouselContent className="pb-20 px-4 md:px-8">
          {GAMES_DATA.map((game) => (
            <CarouselItem key={game.href}>
              <CardHome
                {...game}
                img={getImageUrl(game.title, "games")}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <CarouselHeader id="conversacao">
        <CarouselIcon src={livro} />
        <CarouselTitle className="bg-linear-to-r from-[#FF2D83] to-[#8B3DFF] bg-clip-text text-transparent">
          Conversação e Escuta
        </CarouselTitle>
        <CarouselDescription>
          Explore atividades que auxiliam no desenvolvimento da comunicação e
          compreensão auditiva.
        </CarouselDescription>
      </CarouselHeader>

      <Carousel className="w-full">
        <CarouselContent className="pb-20 px-4 md:px-8">
          {CONVERSATION_DATA.map((item) => (
            <CarouselItem key={item.href}>
              <CardHome
                {...item}
                img={getImageUrl(item.title, "conversacao")}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </PageContainer>
  );
}
