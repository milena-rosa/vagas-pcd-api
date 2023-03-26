import { hash } from 'bcryptjs'

export async function getNewCompany() {
  return {
    id: '123',
    cnpj: '23.243.199/0001-84',
    email: 'janedoe@example.com',
    password: '123456',
    password_hash: await hash('123456', 6),
  }
}
