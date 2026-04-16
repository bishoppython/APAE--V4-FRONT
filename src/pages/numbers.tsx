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
        image: 'placeholder.jpg',
    },
    {
        title: 'DOIS',
        image: 'placeholder.jpg',

    },
    {
        title: 'TRÊS',
        image: 'placeholder.jpg',
    },
    {
        title: 'QUATRO',
        image: 'placeholder.jpg',
    },
    {
        title: 'CINCO',
        image: 'placeholder.jpg',
    },
    {
        title: 'SEIS',
        image: 'placeholder.jpg',
    },
    {
        title: 'SETE',
        image: 'placeholder.jpg',
    },
    {
        title: 'OITO',
        image: 'placeholder.jpg',
    },
    {
        title: 'NOVE',
        image: 'placeholder.jpg',
    },
    {
        title: 'ZERO',
        image: 'placeholder.jpg'
    }
]

function NumberItem({ numbers }: { numbers: INumbers }) {
    const { play } = useTTS({ text: numbers.title });

    return (
        <CardContainer onClick={play}>
            <CardImage
                src={numbers.image}
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
           <CardGroupContainer className= 'xl:grid-cols-5'>
                {numbers.map((numbers, index) => (
                    <NumberItem key={index} numbers={numbers} />
                ))}
            </CardGroupContainer>
        </PageContainer>
    )
}