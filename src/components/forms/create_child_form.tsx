import { z } from "zod";
import { Button } from "../ui/button";
import { FormContainer, FormField, FormFieldGroup, FormItem, FormLabel, FormMessageReserved, Input, Select } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const childRegistrationSchema = z.object({
    childName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(255),
    guardianEmail: z.string().email("E-mail inválido").min(1).max(255),
    guardianPhone: z.string()
        .min(10, "Telefone inválido")
        .max(15, "Telefone inválido")
        .regex(/^[\d\s()-]+$/, "Telefone deve conter apenas números"),
    childCpf: z.string()
        .length(11, "CPF deve ter 11 dígitos")
        .regex(/^\d+$/, "CPF deve conter apenas números"),
    developmentDisorder: z.string().min(1, "Selecione uma opção"),
    birthDate: z.string().min(1, "Data de nascimento é obrigatória")
})

function ChildRegistrationForm() {
    const navigate = useNavigate()

    const { control, handleSubmit } = useForm<z.infer<typeof childRegistrationSchema>>({
        resolver: zodResolver(childRegistrationSchema),
        defaultValues: {
            childName: "",
            guardianEmail: "",
            guardianPhone: "",
            childCpf: "",
            developmentDisorder: "",
            birthDate: ""
        }
    })

    async function onSubmit(data: z.infer<typeof childRegistrationSchema>) {
        // TODO: implementar chamada à API
        console.log(data)
        if (confirm("Cadastrado com sucesso")) {
            navigate('/')
        }
    }

    // TODO: adicionar transtornos
    const categories = [
        { label: 'Work', value: 'work' },
        { label: 'Personal', value: 'personal' },
        { label: 'Urgent', value: 'urgent' },
    ];

    return (
        <section>
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <FormFieldGroup>
                    <FormField
                        control={control}
                        name="childName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome da criança</FormLabel>
                                <Input
                                    {...field}
                                    placeholder="Insira o nome da criança"
                                    type="text"
                                />
                                <FormMessageReserved />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="guardianEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail do responsável</FormLabel>
                                <Input
                                    {...field}
                                    placeholder="Insira o e-mail do responsável"
                                    type="email"
                                />
                                <FormMessageReserved />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="guardianPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número do responsável</FormLabel>
                                <Input
                                    {...field}
                                    placeholder="(00) 00000-0000"
                                    type="tel"
                                />
                                <FormMessageReserved />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="childCpf"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CPF da criança</FormLabel>
                                <Input
                                    {...field}
                                    placeholder="00000000000"
                                    type="text"
                                    maxLength={11}
                                />
                                <FormMessageReserved />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="developmentDisorder"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Transtorno</FormLabel>
                                <Select
                                    options={categories}
                                    placeholder="Selecione o tipo de transtorno"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="xl:w-fit"
                                />
                                <FormMessageReserved />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="birthDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data de nascimento da criança</FormLabel>
                                <Input
                                    {...field}
                                    type="date"
                                    className="xl:w-fit"
                                />
                                <FormMessageReserved />
                            </FormItem>
                        )}
                    />
                </FormFieldGroup>
                <Button variant="primary" type="submit" className="mt-2">
                    Cadastrar
                </Button>
            </FormContainer>
        </section>
    )
}

export { ChildRegistrationForm }