import { CardContainer, CardGroupContainer, CardImage, CardTitle } from "@/components/ui/cards";
import { PageContainer } from "@/components/ui/page_container";
import { useTTS } from "@/libs/text-to-speech";

interface INumbers {
    title: string
    image: string
}

const numbers: INumbers[] = [
    {
        title: "UM",
        image: 'Um.png',
    },
    {
        title: 'DOIS',
        image: 'Dois.png',

    },
    {
        title: 'TRÊS',
        image: 'Tres.png',
    },
    {
        title: 'QUATRO',
        image: 'Quatro.png',
    },
    {
        title: 'CINCO',
        image: 'Cinco.png',
    },
    {
        title: 'SEIS',
        image: 'Seis.png',
    },
    {
        title: 'SETE',
        image: 'Sete.png',
    },
    {
        title: 'OITO',
        image: 'Oito.png',
    },
    {
        title: 'NOVE',
        image: 'Nove.png',
    },
    {
        title: 'ZERO',
        image: 'Zero.png'
    }
]

function NumberItem({ numbers }: { numbers: INumbers }) {
    const { play } = useTTS({ text: numbers.title });

    return (
        <CardContainer onClick={play}>
            <CardImage
                src={`/src/assets/images/numeros/${numbers.image}`}
                alt={numbers.title}
            />
            <CardTitle>
                {numbers.title}
            </CardTitle>
        </CardContainer>
    );
}

export function Numbers() {
    return (
        <PageContainer>
            <CardGroupContainer className='xl:grid-cols-5'>
                {numbers.map((numbers, index) => (
                    <NumberItem key={index} numbers={numbers} />
                ))}
            </CardGroupContainer>
        </PageContainer>
    )
}