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

const selva_animals: IAnimal[] = [
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

const domestico_animals: IAnimal[] = [
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
        image: "src/assets/images/soletrando/"
    },
    {
        id: 'tubarao',
        title: "Tubarão",
        image: "src/assets/images/soletrando/"
    },
    {
        id: 'estrela_mar',
        title: "Estrela do Mar",
        image: "src/assets/images/soletrando/"
    },
    {
        id: 'polvo',
        title: "Polvo",
        image: "src/assets/images/soletrando/"
    },
    {
        id: 'cavalo_marinho',
        title: "Cavalo Marinho",
        image: "src/assets/images/soletrando/"
    },
    {
        id: 'peixe',
        title: "Peixe",
        image: "src/assets/images/soletrando/"
    }
];

const fazenda_animals: IAnimal[] = [
    {
        id: 'cavalo',
        title: "Cavalo",
        image: "src/assets/images/soletrando/"
    },
    {
        id: 'vaca',
        title: "Vaca",
        image: "src/assets/images/soletrando/"
    },
    {
        id: 'galinha',
        title: "Galinha",
        image: "src/assets/images/soletrando/"
    },
    {
        id: 'porco',
        title: "Porco",
        image: "src/assets/images/soletrando/"
    },
    {
        id: 'ovelha',
        title: "Ovelha",
        image: "src/assets/images/soletrando/"
    },
    {
        id: 'pato',
        title: "Pato",
        image: "src/assets/images/soletrando/"
    }
];


type AnimalCategory = 'empty' | 'selva' | 'domestico' | 'mar' | 'fazenda';

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
    const [activeCategory, setActiveCategory] = useState<AnimalCategory>('selva');

    const getDisplayedAnimals = () => {
        switch (activeCategory) {
            case 'selva':
                return selva_animals;
            case 'domestico':
                return domestico_animals;
            case 'mar':
                return mar_animals;
            case 'fazenda':
                return fazenda_animals;
            default:
                return selva_animals;
        }
    };

    const getGridCols = () => {
        switch (activeCategory) {
            case 'selva':
                return 'xl:grid-cols-3';
            case 'domestico':
                return 'xl:grid-cols-4';
            case 'mar':
                return 'xl:grid-cols-4';
            case 'fazenda':
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
                        activeCategory === 'selva' && "ring-2 ring-white ring-offset-2"
                    )}
                    onClick={() => setActiveCategory('selva')}
                >
                    Selva
                </Button>
                <Button
                    title="Doméstico"
                    variant="primary"
                    className={cn(
                        "w-full text-nowrap px-6 text-zinc-50 transition-all bg-orange-400",
                        activeCategory === 'domestico' && "ring-2 ring-white ring-offset-2"
                    )}
                    onClick={() => setActiveCategory('domestico')}
                >
                    Doméstico
                </Button>
                <Button
                    title="Mar"
                    variant="primary"
                    className={cn(
                        "w-full text-nowrap px-6 text-zinc-50 transition-all bg-blue-600",
                        activeCategory === 'mar' && "ring-2 ring-white ring-offset-2"
                    )}
                    onClick={() => setActiveCategory('mar')}
                >
                    Mar
                </Button>
                <Button
                    title="Fazenda"
                    variant="quaternary"
                    className={cn(
                        "w-full text-nowrap px-6 text-zinc-50 transition-all",
                        activeCategory === 'fazenda' && "ring-2 ring-white ring-offset-2"
                    )}
                    onClick={() => setActiveCategory('fazenda')}
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