# vagasPCD

LinkedIn Jobs like API.

## RFs (Requisitos funcionais)

### Candidato

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível alterar informações do perfil de um usuário logado;
- [x] Deve ser possível obter o perfil de um candidato logado;
- [x] Deve ser possível buscar vagas por título, habilidades ou empresa;
- [x] Deve ser possível buscar vagas por localidade;
- [x] Deve ser possível buscar vagas por tipo de deficiência;
- [x] Deve ser possível ver o perfil de uma empresa;
- [x] Deve ser possível se candidatar para uma vaga;
- [x] Deve ser possível listar todas as vagas de um candidato;
<!-- - [ ] Deve ser possível enviar CV para uma vaga para o e-mail cadastrado da empresa; -->

### Empresa

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de uma empresa logada;
- [x] Deve ser possível cadastrar vagas;
- [x] Deve ser possível listar o histórico de vagas de uma empresa;
- [x] Deve ser possível listar todas as vagas abertas de uma empresa;
- [x] Deve ser possível fechar uma vaga;
- [x] Deve ser possível listar todos os candidatos de uma vaga;

### Gov

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível emitir lista com:
  - nome,
  - CNPJ,
  - endereço,
  - telefone de contato,
  - vagas divulgadas por empresa
  - número de CVs enviados para cada empresa e vaga;

## RNs (Regras de negócio)

- [x] O usuário não pode se cadastrar com um e-mail duplicado;
- [x] O usuário não pode se candidatar para uma vaga fechada;
- [x] As vagas só podem ser cadastradas por empresas;
- [x] As vagas só podem ser fechadas por empresas;
- [x] Lista com nome, CNPJ, endereço, telefone de contato, vagas divulgadas por empresa e número de CVs enviados para cada empresa e vaga somente pode ser visualizada por INSS e MTE;
- [ ] Somente empresas podem acessar lista de e-mails da equipe RP das superintendências.

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa ser criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);
- [x] O controle de acessos deve ser organizado com o método RBAC (Role-based access control).
