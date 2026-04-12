import { Button } from "@/components/ui/button"
import { NecessityCardContainer, NecessityCardImage, NecessityCardTitle } from "@/components/ui/necessity_card"

function Home() {
    return (
        <div className="m-10 flex flex-col gap-10 items-center">
            <NecessityCardContainer>
                <NecessityCardImage
                    src="sede.png"
                    alt="Imagem de teste"
                />
                <NecessityCardTitle>
                    ESTOU COM SEDE
                </NecessityCardTitle>
            </NecessityCardContainer>

            <Button variant="primary">
                Teste
            </Button>

            <Button variant="secundary">
                Teste
            </Button>

            <Button variant="primary" isDisabled >
                Enviar
            </Button>

            <Button variant="secundary" isDisabled >
                Teste
            </Button>
        </div>
    )
}

export default Home