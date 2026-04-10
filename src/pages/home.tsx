import { Input } from "@/components/ui/input"

function Home() {
    return (
        <div>
            <h1 className=" w-max m-10 flex flex-col gap-4">
                {
                    <Input
                        id="name"
                        type="text"
                        placeholder="Insira seu Nome completo"
                    />
                }                {
                    <Input
                        id="email"
                        type="email"
                        placeholder="Insira seu Email aqui"
                    />
                }                {
                    <Input
                        id="password"
                        type="password"
                        placeholder="Insira sua Senha aqui"
                    />
                }                {
                    <Input
                        id="password-confirm"
                        type="password"
                        placeholder="Insira sua Senha novamente aqui"
                    />
                }
            </h1>
        </div>
    )
}

export default Home