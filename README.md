# Projeto Alex

## Menu

- [O que eu preciso ter para rodar o projeto?](#o-que-eu-preciso-ter-para-rodar-o-projeto?)
- [Ferramentas](#ferramentas)
- [Como rodar o projeto na minha máquina?](#como-rodar-o-projeto-na-minha-máquina?)
- [Tecnologias](#tecnologias)

## O que eu preciso ter para rodar o projeto?

- Node.js na versão 16 (Você pode usar o [NVM](https://github.com/nvm-sh/nvm) para gerenciar a versão do Node.js em sua máquina)
- Editor de código da sua preferência - VSCode, Vim etc.

## Ferramentas:

- [PostgreSQL](https://www.postgresql.org/)(versão 10.23\*) instalado em sua máquina.

  Obs.: Não precisa instalar o StackBlitz, nem pgAdmin4.

![Untitled](https://github.com/maikaodev/stopwatch/assets/82960620/8c998f5d-45b1-495d-bcaa-bdf2b3464b4c)

- Interface gráfica para banco de dados - [DBeaver](https://dbeaver.io/) ou outro de sua preferência.

## Como rodar o projeto na minha máquina?

Via HTTPS

```bash
## Clone o projeto
git clone http://gitlab.profbrenojac.com.br/projeto-alex/alex.git

## Acesse a pasta do projeto
cd alex/src/renderer2

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

## Tecnologias

- [Typescript](https://www.typescriptlang.org/)
- [Editor.js](https://editorjs.io/)
- [Nuxt.js](https://nuxt.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Vuetify](https://vuetifyjs.com/en/)
- [Sass](https://sass-lang.com/)
