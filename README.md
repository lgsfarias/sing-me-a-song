# <p align = "center"> Sing me a song </p>

<p align="center">
   <img src="./info/test.jpg"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-lgsfarias-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/lgsfarias/sing-me-a-song?color=4dae71&style=flat-square" />
</p>

## :clipboard: Descrição

<p>Sing me a song é uma aplicação para recomendação anônima de músicas. Quanto mais as pessoas curtirem uma recomendação, maior a chance dela ser recomendada para outras pessoas.</p>
<p> Este projeto tem como objetivo realizar testes de integração cobrindo todas as rotas da aplicação, realizar testes unitarios com 100% de cobertura na camada de service e executar teste end-to-end utilizando Cypress.</p>

---

## :computer: Tecnologias e Conceitos

- Jest
- Cypress
- Express
- Node.js
- TypeScript

---

## 🏁 Rodando a aplicação

Este projeto foi inicializado com o [Create React App](https://github.com/facebook/create-react-app), então certifique-se que voce tem a ultima versão estável do [Node.js](https://nodejs.org/en/download/) e [npm](https://www.npmjs.com/) rodando localmente.

Primeiro, faça o clone desse repositório na sua maquina:

```bash
git clone https://github.com/lgsfarias/sing-me-a-song
```

Depois, dentro da pasta, rode o seguinte comando para instalar as dependencias.

```bash
cd back-end/
npm install
cd ..
cd front-end/
npm install
```

Finalizado o processo, é só inicializar o servidor

```bash
cd back-end/
npm run dev:test
```

e inicializar o react app

```bash
cd front-end/
npm start
```

## testes de back-end :

- testes de unidade:

```bash
cd back-end/
npm run test:unit
```

- todos os testes:

```bash
cd back-end/
npm run test
```

## testes de front-end :

```bash
cd front-end/
npx cypress open
```
