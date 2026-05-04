import { z } from "zod";
import { Button } from "../ui/button";
import { FormContainer, FormField, FormFieldGroup, FormItem, FormLabel, FormMessageReserved, Input, Select } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const childRegistrationSchema = z.object({
    childName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(255),
    guardianEmail: z.email("E-mail inválido").min(1).max(255),
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

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

function ChildRegistrationForm() {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const { control, handleSubmit, reset } = useForm<z.infer<typeof childRegistrationSchema>>({
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

        setOpen(false)
        reset()

        if (confirm("Cadastrado com sucesso")) {
            navigate('/')
        }
    }

    // TODO: adicionar transtornos
    const categories = [
        { label: 'TDAH', value: 'work' },
        { label: 'HIPERATIVIDADE', value: 'work' },
        { label: 'AUTISMO NÍVEL DE SUPORTE 01', value: 'lv1-autism' },
        { label: 'AUTISMO NÍVEL DE SUPORTE 02', value: 'lv2-autism' },
        { label: 'AUTISMO NÍVEL DE SUPORTE 03', value: 'lv3-autism' },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button variant="primary" type="button">Cadastrar Criança</Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="sm:max-w-3xl px-10 min-w-300 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Cadastro da criança</DialogTitle>
                </DialogHeader>

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
                                <FormItem className="flex flex-col">
                                    <FormLabel>Transtorno de Desenvolvimento</FormLabel>
                                    <Select
                                        options={categories}
                                        placeholder="Selecione o tipo de transtorno"
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="xl:w-fit z-50"
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

                    <Button variant="primary" type="submit">
                        Resgistrar criança
                    </Button>
                </FormContainer>
            </DialogContent>
        </Dialog>
    )
}

export { ChildRegistrationForm }