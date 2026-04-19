import { CardContainer, CardGroupContainer, CardImage, CardTitle } from "@/components/ui/cards";
import { PageContainer, PageTitle } from "@/components/ui/page_components";
import { useTTS } from "@/libs/text-to-speech";

interface INecessity {
    title: string
    image: string
}

const necessities: INecessity[] = [
    {
        title: "SIM",
        image: "sim.png",
    },
    {
        title: "NÃO",
        image: "nao.png",
    },
    {
        title: "ESTOU CANSADO",
        image: "cansado.png",
    },
    {
        title: "ESTOU COM FOME",
        image: "fome.png",
    },
    {
        title: "ESTOU COM SEDE",
        image: "sede.png",
    },
    {
        title: "QUERO IR AO BANHEIRO",
        image: "banheiro.png",
    },
    {
        title: "QUERO BRINCAR",
        image: "brincar.png",
    },
    {
        title: "NÃO ME SINTO BEM",
        image: "nao_me_sinto_bem.png",
    },
    {
        title: "ESTOU COM FRIO",
        image: "frio.png",
    },
    {
        title: "ESTOU COM CALOR",
        image: "calor.png",
    },
    {
        title: "ESTOU COM MEDO",
        image: "medo.png",
    },
    {
        title: "POR FAVOR",
        image: "por_favor.png",
    },
]

function NecessityItem({ necessity }: { necessity: INecessity }) {
    const { play } = useTTS({ text: necessity.title });

    return (
        <CardContainer onClick={play}>
            <CardImage
                src={`/src/assets/images/necessidades/${necessity.image}`}
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
        <PageContainer>
            <PageTitle>NECESSIDADES</PageTitle>

            <CardGroupContainer>
                {necessities.map((necessity, index) => (
                    <NecessityItem key={index} necessity={necessity} />
                ))}
            </CardGroupContainer>
        </PageContainer>
    )
}