import { api } from "@/libs/api"

type CreateSessionInput = {
    email: string,
    password: string
}

//todo: tipar o retorno do CreateSession
export async function CreateSession(input: CreateSessionInput): Promise<any> {
    const { data } = await api.post('/auth/login', { ...input })

    console.log(data)
    return data
}