import { NecessityCardContainer, NecessityCardImage, NecessityCardTitle } from "@/components/ui/necessity_card";

const necessities = [
    {
        title: "SIM",
        image: "sede.png",
    },
    {
        title: "NÃO",
        image: "sede.png",
    },
    {
        title: "ESTOU CANSADO",
        image: "sede.png",
    },
    {
        title: "ESTOU COM FOME",
        image: "sede.png",
    },
    {
        title: "ESTOU COM SEDE",
        image: "sede.png",
    },
    {
        title: "QUERO IR AO BANHEIRO",
        image: "sede.png",
    },
    {
        title: "QUERO BRINCAR",
        image: "sede.png",
    },
    {
        title: "NÃO ME SINTO BEM",
        image: "sede.png",
    },
    {
        title: "ESTOU COM FRIO",
        image: "sede.png",
    },
    {
        title: "ESTOU COM CALOR",
        image: "sede.png",
    },
    {
        title: "ESTOU COM MEDO",
        image: "sede.png",
    },
    {
        title: "POR FAVOR",
        image: "sede.png",
    },
]

export function Necessities() {
    return (
        <div className="flex flex-col items-center justify-center pt-10">
            <div className="grid grid-cols-4 gap-8 w-fit">
                {necessities.map((necessity, index) => (
                    <NecessityCardContainer key={index}>
                        <NecessityCardImage
                            src={necessity.image}
                            alt={necessity.title}
                        />
                        <NecessityCardTitle>
                            {necessity.title}
                        </NecessityCardTitle>
                    </NecessityCardContainer>
                ))}
            </div>
        </div>
    )
}
