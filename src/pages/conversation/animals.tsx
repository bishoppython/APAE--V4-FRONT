import { Button, ButtonGroup } from "@/components/ui/button";
import {
    CardContainer,
    CardGroupContainer,
    CardImage,
    CardTitle
} from "@/components/ui/cards";
import { PageContainer, PageTitle } from "@/components/ui/page_components";
import { useTTS } from "@/libs/text-to-speech";
import { cn } from "@/libs/utils";
import { useState } from "react";

interface IAnimal extends React.ComponentProps<'button'> {
    id: string;
    title: string;
    image: string;
}

const jungle_animals: IAnimal[] = [
    {
        id: 'leao',
        title: "Leão",
        image: "leao.png"
    },
    {
        id: 'macaco',
        title: "Macaco",
        image: "macaco.png"
    },
    {
        id: 'elefante',
        title: "Elefante",
        image: "elefante.png"
    },
    {
        id: 'tigre',
        title: "Tigre",
        image: "tigre.png"
    },
    {
        id: 'girafa',
        title: "Girafa",
        image: "girafa.png"
    },
    {
        id: 'onca',
        title: "Onça",
        image: "onca.png"
    },
    {
        id: 'rinoceronte',
        title: "Rinoceronte",
        image: "rinoceronte.png"
    },
    {
        id: 'zebra',
        title: "Zebra",
        image: "zebra.png"
    }
];

const domestic_animals: IAnimal[] = [
    {
        id: 'cachorro',
        title: "Cachorro",
        image: "cachorro.png"
    },
    {
        id: 'gato',
        title: "Gato",
        image: "gato.png"
    },
    {
        id: 'hamster',
        title: "Hamster",
        image: "hamster.png"
    },
    {
        id: 'coelho',
        title: "Coelho",
        image: "coelho.png"
    }
];

const mar_animals: IAnimal[] = [
    {
        id: 'golfinho',
        title: "Golfinho",
        image: "golfinho.png"
    },
    {
        id: 'baleia',
        title: "Baleia",
        image: "baleia.png"
    },
    {
        id: 'tubarao',
        title: "Tubarão",
        image: "tubarao.png"
    },
    {
        id: 'estrela_mar',
        title: "Estrela do Mar",
        image: "estrela_do_mar.png"
    },
    {
        id: 'polvo',
        title: "Polvo",
        image: "polvo.png"
    },
    {
        id: 'cavalo_marinho',
        title: "Cavalo Marinho",
        image: "cavalo_marinho.png"
    },
    {
        id: 'peixe',
        title: "Peixe",
        image: "peixe.png"
    },
    {
        id: 'tartaruga_marinha',
        title: "Tartaruga Marinha",
        image: "tartaruga_marinha.png"
    }
];

const fazenda_animals: IAnimal[] = [
    {
        id: 'cavalo',
        title: "Cavalo",
        image: "cavalo.png"
    },
    {
        id: 'vaca',
        title: "Vaca",
        image: "vaca.png"
    },
    {
        id: 'galinha',
        title: "Galinha",
        image: "galinha.png"
    },
    {
        id: 'porco',
        title: "Porco",
        image: "porco.png"
    },
    {
        id: 'ovelha',
        title: "Ovelha",
        image: "ovelha.png"
    },
    {
        id: 'pato',
        title: "Pato",
        image: "pato.png"
    }
];


type AnimalCategory = 'empty' | 'jungle' | 'domestic' | 'ocean' | 'farm';

function AnimalCards({ animal }: { animal: IAnimal }) {
    const { play } = useTTS({ text: animal.title });

    const imageUrl = new URL(`../../assets/images/animais/${animal.image}`, import.meta.url).href;

    return (
        <CardContainer onClick={play} value={animal.id}>
            <CardImage
                src={imageUrl}
                alt={animal.title}
                style={{ width: '100%', height: '176px', objectFit: 'cover' }} // inline no ...input
            />
            <CardTitle>
                {animal.title}
            </CardTitle>
        </CardContainer>
    );
}

export function Animals() {
    const [activeCategory, setActiveCategory] = useState<AnimalCategory>('jungle');

    const getDisplayedAnimals = () => {
        switch (activeCategory) {
            case 'jungle':
                return jungle_animals;
            case 'domestic':
                return domestic_animals;
            case 'ocean':
                return mar_animals;
            case 'farm':
                return fazenda_animals;
            default:
                return jungle_animals;
        }
    };

    const getGridCols = () => {
        switch (activeCategory) {
            case 'jungle':
                return 'xl:grid-cols-4';
            case 'domestic':
                return 'xl:grid-cols-4';
            case 'ocean':
                return 'xl:grid-cols-4';
            case 'farm':
                return 'xl:grid-cols-3';
            default:
                return 'xl:grid-cols-3';
        }
    };

    return (
        <PageContainer className='flex-1 justify-start transition-all duration-1000'>
            <PageTitle>ANIMAIS</PageTitle>

            <ButtonGroup className="sm:flex-row">
                <Button
                    title="Selva"
                    variant="tertiary"
                    className={cn(
                        "w-full text-nowrap px-6 text-zinc-50 transition-all",
                        activeCategory === 'jungle' && "ring-2 ring-white ring-offset-2"
                    )}
                    onClick={() => setActiveCategory('jungle')}
                >
                    Selva
                </Button>
                <Button
                    title="Doméstico"
                    variant="primary"
                    className={cn(
                        "w-full text-nowrap px-6 text-zinc-50 transition-all bg-orange-400",
                        activeCategory === 'domestic' && "ring-2 ring-white ring-offset-2"
                    )}
                    onClick={() => setActiveCategory('domestic')}
                >
                    Doméstico
                </Button>
                <Button
                    title="Mar"
                    variant="primary"
                    className={cn(
                        "w-full text-nowrap px-6 text-zinc-50 transition-all bg-blue-600",
                        activeCategory === 'ocean' && "ring-2 ring-white ring-offset-2"
                    )}
                    onClick={() => setActiveCategory('ocean')}
                >
                    Mar
                </Button>
                <Button
                    title="Fazenda"
                    variant="quaternary"
                    className={cn(
                        "w-full text-nowrap px-6 text-zinc-50 transition-all",
                        activeCategory === 'farm' && "ring-2 ring-white ring-offset-2"
                    )}
                    onClick={() => setActiveCategory('farm')}
                >
                    Fazenda
                </Button>
            </ButtonGroup>

            <CardGroupContainer className={cn(
                "transition-all duration-500",
                getGridCols()
            )}>
                {activeCategory !== 'empty' && getDisplayedAnimals().map((animal) => (
                    <AnimalCards key={animal.id} animal={animal} />
                ))}
            </CardGroupContainer>
        </PageContainer>
    );
}