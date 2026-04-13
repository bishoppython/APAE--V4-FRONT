import { Button } from "@/components/ui/button"

function Home() {
    return (
        <div className="m-10 flex flex-col gap-10 items-center">
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