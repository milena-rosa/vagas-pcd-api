# vagasPCD

LinkedIn Jobs like API.

## Como rodar

1. Para rodar a api localmente, é necessário ter instalado:

- Node.js. Sugestão de instalação: [Node Version Manager](https://github.com/nvm-sh/nvm#installing-and-updating);
- Docker. A instalação pode ser feita conforme explicado em [Get Docker](https://docs.docker.com/get-docker/).

2. Rodar o container com o banco de dados PostgreSQL.

```bash
docker compose up -d
```

3. Criar as tabelas no banco de dados.

```bash
npx prisma migrate dev
```

4. Rodar a aplicação.

```bash
npm run start:dev
```

5. A documentação com a descrição dos _endpoints_ pode ser acessada em `http://localhost:3333/docs`
