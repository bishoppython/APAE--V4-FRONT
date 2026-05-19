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
        image: "src/assets/images/necessidades/sim.png",
    },
    {
        title: "NÃO",
        image: "src/assets/images/necessidades/nao.png",
    },
    {
        title: "ESTOU CANSADO",
        image: "src/assets/images/necessidades/cansado.png",
    },
    {
        title: "ESTOU COM FOME",
        image: "src/assets/images/necessidades/fome.png",
    },
    {
        title: "ESTOU COM SEDE",
        image: "src/assets/images/necessidades/sede.png",
    },
    {
        title: "QUERO IR AO BANHEIRO",
        image: "src/assets/images/necessidades/banheiro.png",
    },
    {
        title: "QUERO BRINCAR",
        image: "src/assets/images/necessidades/brincar.png",
    },
    {
        title: "NÃO ME SINTO BEM",
        image: "src/assets/images/necessidades/nao_me_sinto_bem.png",
    },
    {
        title: "ESTOU COM FRIO",
        image: "src/assets/images/necessidades/frio.png",
    },
    {
        title: "ESTOU COM CALOR",
        image: "src/assets/images/necessidades/calor.png",
    },
    {
        title: "ESTOU COM MEDO",
        image: "src/assets/images/necessidades/medo.png",
    },
    {
        title: "POR FAVOR",
        image: "src/assets/images/necessidades/por_favor.png",
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