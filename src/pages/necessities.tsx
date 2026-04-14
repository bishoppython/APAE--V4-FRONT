import { CardContainer, CardImage, CardTitle } from "@/components/ui/necessity_card";
import { useTTS } from "@/libs/text-to-speech";

interface INecessity {
    title: string
    image: string
}

const necessities: INecessity[] = [
    {
        title: "SIM",
        image: "placeholder.jpg",
    },
    {
        title: "NÃO",
        image: "placeholder.jpg",
    },
    {
        title: "ESTOU CANSADO",
        image: "placeholder.jpg",
    },
    {
        title: "ESTOU COM FOME",
        image: "placeholder.jpg",
    },
    {
        title: "ESTOU COM SEDE",
        image: "placeholder.jpg",
    },
    {
        title: "QUERO IR AO BANHEIRO",
        image: "placeholder.jpg",
    },
    {
        title: "QUERO BRINCAR",
        image: "placeholder.jpg",
    },
    {
        title: "NÃO ME SINTO BEM",
        image: "placeholder.jpg",
    },
    {
        title: "ESTOU COM FRIO",
        image: "placeholder.jpg",
    },
    {
        title: "ESTOU COM CALOR",
        image: "placeholder.jpg",
    },
    {
        title: "ESTOU COM MEDO",
        image: "placeholder.jpg",
    },
    {
        title: "POR FAVOR",
        image: "placeholder.jpg",
    },
]

function NecessityItem({ necessity }: { necessity: INecessity }) {
    const { play } = useTTS({ text: necessity.title });

    return (
        <CardContainer onClick={play}>
            <CardImage
                src={necessity.image}
                alt={necessity.title}
            />
            <CardTitle>
                {necessity.title}
            </CardTitle>
        </CardContainer>
    );
}

export function Necessities() {
    return (
        <div className="flex flex-col items-center justify-center pt-10">
            <div className="grid grid-cols-4 gap-8 w-fit">
                {necessities.map((necessity, index) => (
                    <NecessityItem key={index} necessity={necessity} />
                ))}
            </div>
        </div>
    )
}