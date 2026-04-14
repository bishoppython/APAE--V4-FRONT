import { NumbersContainer, NumbersImage, NumbersTitle} from "@/components/ui/numbers_card";
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

function NumberItem({ numbers }: { numbers: INumbers}) {
    const { play } = useTTS({ text: numbers.title});

    return (
        <NumbersContainer onClick={play}>
            <NumbersImage
                src={numbers.image}
                alt={numbers.title}
            />
            <NumbersTitle>
                {numbers.title}
            </NumbersTitle>
        </NumbersContainer>
    );
}

export function Numbers() {
    return (
        <div className="flex flex-col items-center justify-center pt-10">
            <div className="grid grid-cols-5 gap-8 w-fit">
                {numbers.map((numbers, index) => (
                    <NumberItem key={index} numbers={numbers} />
                ))}
            </div>
        </div>
    )
}