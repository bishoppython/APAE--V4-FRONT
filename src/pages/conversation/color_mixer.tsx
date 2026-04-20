import { CardContainer, CardGroupContainer, CardImage, CardTitle } from "@/components/ui/cards";
import { PageContainer, PageTitle } from "@/components/ui/page_components";
import React, { useState } from 'react';

import { useTTS } from "@/libs/text-to-speech";

interface IColor extends React.ComponentProps<'button'> {
    id: string
    title: string
    color: string
}

interface IColorResult {
    title: string
    color: string
}

const colors: IColor[] = [
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

const colorResults: { [key: string]: IColorResult } = {
    'empty': { title: "RESULTADO", color: "bg-stone-300" },
    'blue-red': { title: "ROXO", color: "bg-purple-500" },
    'blue-yellow': { title: "VERDE", color: "bg-green-500" },
    'red-yellow': { title: "LARANJA", color: "bg-orange-500" }
}

function Color({ colors, onSelect }: { colors: IColor, onSelect: (id: string) => void }) {
    const { play } = useTTS({ text: colors.title });

    const handleClick = () => {
        play();
        onSelect(colors.id);
    };

    return (
        <CardContainer onClick={handleClick} value={colors.id}>
            <CardImage
                className={`${colors.color}`}
            />
            <CardTitle>
                {colors.title}
            </CardTitle>
        </CardContainer>
    );
}

function ColorResult({ result }: { result: IColorResult }) {
    const { play } = useTTS({ text: result.title });

    return (
        <CardContainer onClick={play} isDisabled={result.title === "RESULTADO"}>
            <CardImage
                className={`${result.color} w-full h-full`}
            />
            <CardTitle>
                {result.title}
            </CardTitle>
        </CardContainer>
    );
}

export function ColorMixer() {
    const [selectedColors, setSelectedColors] = useState<string[]>([]);

    const handleSelect = (id: string) => {
        setSelectedColors(prev => {
            if (prev.length >= 2) return [id];
            return [...prev, id].sort();
        });
    };

    const resultKey = selectedColors.length === 2 ? selectedColors.join('-') : 'empty';
    const finalResult = colorResults[resultKey] || colorResults['empty'];

    return (
        <PageContainer className="justify-around">
            <PageTitle>MISTURANDO CORES</PageTitle>

            <div className="flex flex-col gap-15 xl:flex-row xl:gap-30">
                <CardGroupContainer className="xl:grid-cols-3">
                    {colors.map((color, index) => (
                        <Color key={index} colors={color} onSelect={handleSelect} />
                    ))}
                </CardGroupContainer>

                <ColorResult result={finalResult} />
            </div>
        </PageContainer>
    )
}