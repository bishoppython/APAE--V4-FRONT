import axios from 'axios'

//todo substituir por env.backurl
export const api = axios.create({
    baseURL: "http://localhost:3000"
})