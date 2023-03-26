import { hash } from 'bcryptjs'

export async function getNewCandidate() {
  return {
    id: '123',
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    phone: null,
    password_hash: await hash('123456', 6),
    resume: 'https://linkedin.com/in/milena-rosa',
    created_at: new Date(),
  }
}
