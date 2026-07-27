# Projeto Alex

## Menu

- [Requisitos para rodar o projeto](#requisitos-para-rodar-o-projeto)
- [Ferramentas](#ferramentas)
- [Criando um banco de dados](#criando-um-banco-de-dados)
- [Clonando o repositório](#clonando-o-repositório)
- [ENV](#env)
- [Fluxo de merge request](#fluxo-de-merge-request)
- [Tecnologias](#tecnologias)
- [Links úteis](#links-úteis)

## Requisitos para rodar o projeto

- Node.js na versão 16 (Você pode usar o [NVM](https://github.com/nvm-sh/nvm) para gerenciar a versão do Node.js em sua máquina)
- Editor de código da sua preferência - VSCode, Vim etc.

## Ferramentas

- [PostgreSQL](https://www.postgresql.org/)(versão 10.23\*) instalado em sua máquina.

  Obs.: Não precisa instalar o StackBlitz, nem pgAdmin4.

![Untitled](https://github.com/maikaodev/stopwatch/assets/82960620/8c998f5d-45b1-495d-bcaa-bdf2b3464b4c)

- Interface gráfica para banco de dados - [DBeaver](https://dbeaver.io/) ou outro de sua preferência.

## Criando um banco de dados

- Após a instalação do PostegreSQL e DBeaver crie um banco de dados:

  Link da reunião: [Configurando o banco de dados](https://youtu.be/EFMM7Nun81Q?t=1449)

## Clonando o repositório

Via HTTPS

```bash
## Clone o projeto
git clone https://github.com/subvtech/app-alex.git

## Instale as dependências
yarn ou yarn install

## Execute a aplicação
yarn dev

## Servidor rodando - http://localhost:3000/
```

## .env

```bash
STRAPI_URL=https://api-test.projetoalex.cc/
```

## Fluxo de merge request


### Cenário: Desenvolvimento da task

### Task criada
Passo 1
  - Crie sua branch a partir da 'develop'
  - No Taiga mova sua task para 'Em andamento'
  - Lembre-se sempre que antes de criar sua branch a 'develop' deve ser atualizada ( git pull )

### Task finalizada
Passo 2
  - Crie um 'Merge request' apontado para 'develop'
  - No Taiga mova sua task para 'Team review'
  - No Discord acesse o canal 'Merge request' envie o link e marque com @desenvolvimento
  - Sua task precisa ter no mínimo duas aprovações para que siga para o próximo passo

### Merge Request aprovado
Passo 3
  - Crie um merge request para branch 'test'
  - Faça o merge request para a branch 'test'
  - No Taiga mova sua task para 'Pronto para teste'
  - Notifique que foi feito o merge request da sua branch para que seja testado


### Cenário: PR 'mergeado' no ambiente de teste

### Todos devem

  - Testar as modificações feitas no ambiente de teste e caso identifique algum bug comente no MR apontado para 'develop'. Caso necessite o link do ambiente de teste está em links úteis
  - No Taiga dentro da task comente o que você testou - Responsividade, comportamento etc
  - Caso identifique algum bug não reportado anteriormente em 'issue' ou não relacionado a task já criada, crie uma 'issue' e adicione prints, texto, o que for necessário para ficar claro referente ao erro ocorrido

### Componente/função foi TESTADO
Passo 5
  - Aguarde decisão para subir para develop
  - Após análise, se for aprovado, o merge request apontado para 'develop' será feito

### Componente/função foi REPROVADO
Passo 6
  - Faça a correção/melhoria na sua branch originalmente, e volte para o Passo 3

## Tecnologias

- [Typescript](https://www.typescriptlang.org/)
- [Editor.js](https://editorjs.io/)
- [Nuxt.js](https://nuxt.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Vuetify](https://vuetifyjs.com/en/)
- [Sass](https://sass-lang.com/)

## Links úteis

### Web:

[Plataforma](https://app2-test.projetoalex.cc/login)

[Landing page](https://projetoalex.cc/)

[Ambiente de teste](https://app2-test.projetoalex.cc)

### Protótipo:

[Landing page](https://www.figma.com/file/h4R6uVqSLqUIK0hUE5HW41/ALEX---Style-Guide?type=design&node-id=0-1&mode=design&t=5vlQMej8oYkDZrQP-0)

[Plataforma](https://www.figma.com/file/E3PKAjADQAMaDQin8XiaHR/ALEX---Interfaces?type=design&node-id=0-1&mode=design&t=f0MiSZ8TSaDwnBUv-0)
