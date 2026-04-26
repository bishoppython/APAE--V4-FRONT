import { z } from "zod";
import { Button } from "../ui/button";
import { FormContainer, FormField, FormItem, FormLabel, FormMessage, FormMessageReserved, Input } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSession } from "@/services/sessions";
import { useNavigate } from "react-router-dom";

const login_schema = z.object({
    email: z.email("E-mail inválido").min(1).max(255),
    password: z.string().min(6, "Mínimo 6 caracteres")
})

function LoginForm() {
    const navigate = useNavigate()

    const { control, handleSubmit } = useForm<z.infer<typeof login_schema>>({
        resolver: zodResolver(login_schema),
        defaultValues: {
            "email": "",
            "password": ""
        }
    })

    //todo: adicionar tanstack-query
    async function onSubmit(data: z.infer<typeof login_schema>) {
        await CreateSession(data)
        if (confirm("cadastrado com sucesso")) {
            navigate('/')
        }
    }

    return (
        <section>
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <Input {...field} placeholder="Insira seu Email aqui"
                                type="email"
                            />
                            <FormMessageReserved />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <Input {...field} placeholder="Insira sua Senha aqui"
                                type="password"
                            />
                            <FormMessageReserved />
                        </FormItem>
                    )}
                />

                <div className="w-full flex justify-end text-lg">Esqueceu a senha?
                    <a href="" className="text-primary font-bold ml-1">Recuperar senha</a>
                </div>

                <Button variant="primary" type="submit" className="mt-2">Login</Button>
            </FormContainer>
        </section>
    )
}

export { LoginForm }