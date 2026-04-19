import { Button } from "@/components/ui/button";
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

interface IColor extends React.ComponentProps<'button'> {
    id: string
    title: string
    color: string
}

const primary_colors: IColor[] = [
    {
        id: 'yellow',
        title: "AMARELO",
        color: "bg-yellow-300"
    },
    {
        id: 'red',
        title: "VERMELHO",
        color: "bg-red-500"
    },
    {
        id: 'blue',
        title: "AZUL",
        color: "bg-blue-500"
    },
]

const secundary_colors: IColor[] = [
    {
        id: 'green',
        title: "VERDE",
        color: "bg-green-500"
    },
    {
        id: 'purple',
        title: "ROXO",
        color: "bg-purple-500"
    },
    {
        id: 'orange',
        title: "LARANJA",
        color: "bg-orange-500"
    },
]

const terciary_colors: IColor[] = [
    {
        id: 'pink',
        title: 'ROSA',
        color: 'bg-pink-400'
    },
    {
        id: 'lilac',
        title: 'LILÁS',
        color: 'bg-fuchsia-300'
    },
    {
        id: 'light_blue',
        title: 'AZUL CLARO',
        color: 'bg-sky-400'
    },
    {
        id: 'lavender',
        title: 'LAVANDA',
        color: 'bg-violet-300'
    },
    {
        id: 'turquoise',
        title: 'TURQUESA',
        color: 'bg-cyan-400'
    },
    {
        id: 'red_orange',
        title: 'VERMELHO ALARANJADO',
        color: 'bg-orange-600'
    },
    {
        id: 'green_yellow',
        title: 'AMARELO ESVERDEADO',
        color: 'bg-lime-400'
    },
    {
        id: 'purple_blue',
        title: 'AZUL ARROXEADO',
        color: 'bg-indigo-600'
    },
    {
        id: 'pink_orange',
        title: 'LARANJA ROSADO',
        color: 'bg-orange-300'
    },
    {
        id: 'amber_orange',
        title: 'AMARELO ALARANJADO',
        color: 'bg-amber-500'
    }
];

type ColorCategory = 'empty' | 'primary' | 'secondary' | 'tertiary';

function ColorCards({ colors }: { colors: IColor }) {
    const { play } = useTTS({ text: colors.title });

    return (
        <CardContainer onClick={play} value={colors.id}>
            <CardImage
                className={`${colors.color} w-full h-full`}
            />
            <CardTitle>
                {colors.title}
            </CardTitle>
        </CardContainer>
    );
}

export function Colors() {
    const [activeCategory, setActiveCategory] = useState<ColorCategory>('empty');

    const getDisplayedColors = () => {
        switch (activeCategory) {
            case 'primary':
                return primary_colors;
            case 'secondary':
                return secundary_colors;
            case 'tertiary':
                return terciary_colors;
            default:
                return primary_colors;
        }
    };

    return (
        <PageContainer className='transition-all duration-1000'>
            <PageTitle>CORES</PageTitle>

            <div className="flex justify-evenly items-center gap-8 mb-8">
                <Button
                    title="Cores Primárias"
                    variant="primary"
                    className="w-full text-nowrap px-6 text-zinc-50"
                    onClick={() => setActiveCategory('primary')}
                >
                    Cores Primárias
                </Button>
                <Button
                    title="Cores Secundárias"
                    variant="tertiary"
                    className="w-full text-nowrap px-6 text-zinc-50"
                    onClick={() => setActiveCategory('secondary')}
                >
                    Cores Secundárias
                </Button>
                <Button
                    title="Cores Terciárias"
                    variant="quaternary"
                    className="w-full text-nowrap px-6 text-zinc-50"
                    onClick={() => setActiveCategory('tertiary')}
                >
                    Cores Terciárias
                </Button>
            </div>

            <CardGroupContainer className={cn(
                activeCategory === 'primary' && 'xl:grid-cols-3',
                activeCategory === 'secondary' && 'xl:grid-cols-3',
                activeCategory === 'tertiary' && 'xl:grid-cols-5',
            )}>
                {activeCategory !== 'empty' && getDisplayedColors().map((color) => (
                    <ColorCards key={color.id} colors={color} />
                ))}

            </CardGroupContainer>
        </PageContainer>
    )
}