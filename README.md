# Projeto Alex

## Menu

- [Requisitos para rodar o projeto](#requisitos-para-rodar-o-projeto)
- [Ferramentas](#ferramentas)
- [Criando um banco de dados](#criando-um-banco-de-dados)
- [Clonando o repositório](#clonando-o-repositório)
- [Configurando as keys](#configurando-as-keys)
- [Fluxo de Pull request](#fluxo-de-merge-request)
- [Tecnologias](#tecnologias)
- [Links úteis](#links-úteis)

## Requisitos para rodar o projeto

- Node.js na versão 16 ou 18 (Você pode usar o [NVM](https://github.com/nvm-sh/nvm) para gerenciar a versão do Node.js em sua máquina)
- Editor de código da sua preferência - VSCode, Vim etc.

## Ferramentas

- [Docker Desktop](https://docs.docker.com/desktop/) Ou [Docker Engine](https://docs.docker.com/engine/install/) - Instale a opção mais adequada para a sua máquina.

- [PostgreSQL](https://www.postgresql.org/) - Na pasta do projeto strapi-alex, após iniciar o Docker, execute 'docker compose up'. O Docker fará o download da imagem do Postgres (caso necessário) e subirá o container do banco de dados.

- Interface gráfica para banco de dados - [DBeaver](https://dbeaver.io/) ou outro de sua preferência.

  Obs: Não precisa instalar o StackBlitz, nem pgAdmin4.

![Untitled](https://github.com/maikaodev/stopwatch/assets/82960620/8c998f5d-45b1-495d-bcaa-bdf2b3464b4c)

## Criando um banco de dados

- Crie a conexão com o banco de dados no DBeaver.

  Caso precise use essa reunião como auxílio: [Configurando o banco de dados](https://youtu.be/EFMM7Nun81Q?t=1449) <br>

## Clonando o repositório

Via HTTPS

```bash
## Clone o projeto
git clone https://github.com/subvtech/app-alex.git

## Instale o Yarn via Npm
Windows: npm install --global yarn
MacOS/Linux: sudo npm install --global yarn

## Verifique se foi instalado
yarn --version

## Instale as dependências
yarn ou yarn install

## Execute a aplicação
yarn dev

## Servidor rodando - http://localhost:3000/
```

## Configurando as keys

### Tiptap -> `TIPTAP_APP_ID` e `TIPTAP_KEY`

Adicione as seguintes variáveis de ambiente:

```env
TIPTAP_APP_ID=sua_chave
TIPTAP_KEY=sua_chave
```

## Fluxo de Pull request

### Cenário: Desenvolvimento da task

### Task criada
Passo 1
  - Clone a branch 'develop'
  - Crie sua branch a partir da 'develop'
  - Lembre-se sempre que antes de criar sua branch a 'develop' deve ser atualizada ( git pull )

### Task finalizada
Passo 2
  - Suba sua branch para o repositório remoto
  - Crie um 'Pull Request' apontado para 'test'

### Pull Request aprovado
Passo 3
  - O seu branch será mergeado na 'test' e as atualizações serão disponibilizadas no ambiente de [teste](https://hmg.projetoalex.cc/)

### Cenário: PR 'mergeado' no ambiente de teste

### Componente/função foi TESTADO
Passo 1
  - Aguarde decisão para subir para develop
  - Após análise, se for aprovado, o merge apontado para 'develop' será feito

### Componente/função foi REPROVADO
Passo 2
  - Faça a correção/melhoria na sua branch originalmente, e volte para o <strong> Passo 2 (Cenário: Desenvolvimento da task) </strong>

## Tecnologias

- [Typescript](https://www.typescriptlang.org/)
- [TipTap](https://tiptap.dev/)
- [Nuxt.js](https://nuxt.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Vuetify](https://vuetifyjs.com/en/)
- [Sass](https://sass-lang.com/)

## Links úteis

### Web:

[Plataforma](https://app.projetoalex.cc/login)

[Landing page](https://projetoalex.cc)

[Ambiente de teste](https://hmg.projetoalex.cc/)

### Protótipo:

[Landing page](https://www.figma.com/file/h4R6uVqSLqUIK0hUE5HW41/ALEX---Style-Guide?type=design&node-id=0-1&mode=design&t=5vlQMej8oYkDZrQP-0)

[Plataforma](https://www.figma.com/file/E3PKAjADQAMaDQin8XiaHR/ALEX---Interfaces?type=design&node-id=0-1&mode=design&t=f0MiSZ8TSaDwnBUv-0)

<strong>Em protótipos, use o email do projeto.<strong>
