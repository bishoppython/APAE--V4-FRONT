import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/ui/page_container"

function Test() {
    return (
        <PageContainer>
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

            <div className="flex items-center gap-8 ">
                <Button variant='tertiary'>
                    Não
                </Button>

                <Button variant='quaternary'>
                    Sim, deletar permanentemente
                </Button>
            </div>
        </PageContainer>
    )
}

export { Test }