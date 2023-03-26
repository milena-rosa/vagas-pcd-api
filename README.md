# vagasPCD

LinkedIn Jobs like API.

## RFs (Requisitos funcionais)

### Candidato

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível alterar informações do perfil de um usuário logado;
- [x] Deve ser possível obter o perfil de um candidato logado;
- [ ] Deve ser possível buscar vagas por título, habilidades ou empresa;
- [ ] Deve ser possível buscar vagas por localidade;
- [ ] Deve ser possível buscar vagas por tipo de deficiência;
- [ ] Deve ser possível ver o perfil de uma empresa;
- [ ] Deve ser possível se candidatar para uma vaga;
- [ ] Deve ser possível listar todas as vagas de um candidato;
- [ ] Deve ser possível enviar CV para uma vaga para o e-mail cadastrado da empresa;

### Empresa

- [x] Deve ser possível se cadastrar;
- [ ] Deve ser possível se autenticar;
- [ ] Deve ser possível obter o perfil de uma empresa logada;
- [ ] Deve ser possível cadastrar vagas;
- [ ] Deve ser possível listar todas as vagas de uma empresa;
- [ ] Deve ser possível listar todos os candidatos de uma vaga;
- [ ] Deve ser possível fechar uma vaga;

### Gov

- [ ] Deve ser possível se cadastrar;
- [ ] Deve ser possível se autenticar;
- [ ] Deve ser possível emitir lista com nome, CNPJ, endereço, telefone de contato, vagas divulgadas por empresa e número de CVs enviados para cada empresa e vaga;

## RNs (Regras de negócio)

- [x] O usuário não pode se cadastrar com um e-mail duplicado;
- [ ] O usuário não pode se candidatar para uma vaga fechada;
- [ ] As vagas só podem ser cadastradas por empresas;
- [ ] As vagas só podem ser fechadas por empresas;
- [ ] Lista com nome, CNPJ, endereço, telefone de contato, vagas divulgadas por empresa e número de CVs enviados para cada empresa e vaga somente pode ser visualizada por INSS e MTE;
- [ ] Somente empresas podem acessar lista de e-mails da equipe RP das superintendências.

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa ser criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [ ] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);
- [ ] O controle de acessos deve ser organizado com o método RBAC (Role-based access control).
