import axios from 'axios'

export const cnpjApi = axios.create({
  baseURL: 'https://minhareceita.org/',
})

export interface CompanyApiData {
  razao_social: string
  cep: string
  uf: string
  municipio: string
  logradouro: string
  numero: string
  complemento: string
  ddd_telefone_1: string
}
