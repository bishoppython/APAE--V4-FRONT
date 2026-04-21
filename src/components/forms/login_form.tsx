import { z } from "zod";
import { Button } from "../ui/button";
import { FormContainer, FormField, FormItem, FormLabel, FormMessageReserved, Input } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const login_schema = z.object({
    email: z.email("E-mail inválido").min(1).max(255),
    password: z.string().min(6, "Mínimo 6 caracteres")
})

function LoginForm() {
    const { control, handleSubmit } = useForm<z.infer<typeof login_schema>>({
        resolver: zodResolver(login_schema),
        defaultValues: {
            "email": "",
            "password": ""
        }
    })

    function onSubmit(data: z.infer<typeof login_schema>) {
        console.log(data)
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

                <Button variant="primary" type="submit" className="mt-2">Login</Button>
            </FormContainer>
        </section>
    )
}

export { LoginForm }