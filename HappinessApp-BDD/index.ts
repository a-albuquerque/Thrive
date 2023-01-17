import axios from "axios";

export const BASE_URL = process.env.BASE_URL ?? "http://legacy.bellwoods.muddy.ca:8978/api"

console.log(`Running with BASE URL: ${BASE_URL}`)
axios.defaults.withCredentials = true

export const getEndpoint = (path: string) => {
    const url = `${BASE_URL}${path}`
    console.log(url)
    return url
}