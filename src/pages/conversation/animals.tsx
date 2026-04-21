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
        image: "src/assets/images/soletrando/leão.png"
    },
    {
        id: 'macaco',
        title: "Macaco",
        image: "src/assets/images/soletrando/macaco.png"
    },
    {
        id: 'elefante',
        title: "Elefante",
        image: "src/assets/images/soletrando/elefante.png"
    },
    {
        id: 'tigre',
        title: "Tigre",
        image: "src/assets/images/soletrando/tigre.png"
    },
    {
        id: 'girafa',
        title: "Girafa",
        image: "src/assets/images/soletrando/girafa.png"
    },
    {
        id: 'onca',
        title: "Onça",
        image: "src/assets/images/soletrando/onca.png"
    }
];

const domestic_animals: IAnimal[] = [
    {
        id: 'cachorro',
        title: "Cachorro",
        image: "src/assets/images/soletrando/cachorro.png"
    },
    {
        id: 'gato',
        title: "Gato",
        image: "src/assets/images/soletrando/gato.png"
    },
    {
        id: 'hamster',
        title: "Hamster",
        image: "src/assets/images/soletrando/hamster.png"
    },
    {
        id: 'coelho',
        title: "Coelho",
        image: "src/assets/images/soletrando/coelho.png"
    }
];

const mar_animals: IAnimal[] = [
    {
        id: 'golfinho',
        title: "Golfinho",
        image: "src/assets/images/soletrando/golfinho.png"
    },
    {
        id: 'baleia',
        title: "Baleia",
        image: "src/assets/images/soletrando/baleia.png"
    },
    {
        id: 'tubarao',
        title: "Tubarão",
        image: "src/assets/images/soletrando/tubarao.png"
    },
    {
        id: 'estrela_mar',
        title: "Estrela do Mar",
        image: "src/assets/images/soletrando/estrela_do_mar.png"
    },
    {
        id: 'polvo',
        title: "Polvo",
        image: "src/assets/images/soletrando/polvo.png"
    },
    {
        id: 'cavalo_marinho',
        title: "Cavalo Marinho",
        image: "src/assets/images/soletrando/cavalo_marinho.png"
    },
    {
        id: 'peixe',
        title: "Peixe",
        image: "src/assets/images/soletrando/peixe.png"
    }
];

const fazenda_animals: IAnimal[] = [
    {
        id: 'cavalo',
        title: "Cavalo",
        image: "src/assets/images/soletrando/cavalo.png"
    },
    {
        id: 'vaca',
        title: "Vaca",
        image: "src/assets/images/soletrando/vaca.png"
    },
    {
        id: 'galinha',
        title: "Galinha",
        image: "src/assets/images/soletrando/galinha.png"
    },
    {
        id: 'porco',
        title: "Porco",
        image: "src/assets/images/soletrando/porco.png"
    },
    {
        id: 'ovelha',
        title: "Ovelha",
        image: "src/assets/images/soletrando/ovelha.png"
    },
    {
        id: 'pato',
        title: "Pato",
        image: "src/assets/images/soletrando/pato.png"
    }
];


type AnimalCategory = 'empty' | 'jungle' | 'domestic' | 'ocean' | 'farm';

function AnimalCards({ animal }: { animal: IAnimal }) {
    const { play } = useTTS({ text: animal.title });

    return (
        <CardContainer onClick={play} value={animal.id}>
            <CardImage
                src={animal.image}
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
                return 'xl:grid-cols-3';
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
        <PageContainer className='transition-all duration-1000'>
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
                    isSelected={activeCategory === 'jungle'}
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
                    isSelected={activeCategory === 'domestic'}
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
                    isSelected={activeCategory === 'ocean'}
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
                    isSelected={activeCategory === 'farm'}
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