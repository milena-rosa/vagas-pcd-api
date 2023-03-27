import axios from 'axios'

export const cnpjApi = axios.create({
  baseURL: 'https://minhareceita.org/',
})
