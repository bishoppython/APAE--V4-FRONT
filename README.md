# APAE - Frontend Versão 4

Este é o repositório do projeto frontend para a APAE (Versão 4), desenvolvido com **React**, **TypeScript** e **Vite**.

## 🚀 Como Iniciar

Siga os passos abaixo para preparar seu ambiente e rodar o projeto localmente:

### 1. Clonar o Repositório
Abra o terminal e execute:
```bash
git clone https://github.com/nadson/APAE--V4-FRONT.git
```

### 2. Instalar Dependências
Entre na pasta do projeto e instale os pacotes necessários:
```bash
cd APAE--V4-FRONT
npm install
```

### 3. Rodar o Projeto
Inicie o servidor de desenvolvimento:
```bash
npm run start:dev
```
O projeto estará disponível em `http://localhost:4000`.

---

## 📂 Estrutura do Projeto

Para facilitar a organização, aqui está um resumo das pastas principais:

- `src/`: Onde fica todo o código fonte (o que nós escrevemos).
  - `components/`: Componentes reutilizáveis (botões, inputs, cards).
  - `assets/`: Imagens, ícones e arquivos estáticos.
  - `App.tsx`: O componente principal que rascunha a aplicação.
  - `main.tsx`: Arquivo de entrada que inicializa o React.
- `public/`: Arquivos que são servidos diretamente (como o ícone do site).
- `package.json`: Lista de ferramentas e bibliotecas que o projeto usa.

---

## 🎨 Tailwind CSS

Utilizamos o **Tailwind CSS** para estilização. Ele nos permite criar interfaces modernas diretamente no HTML usando classes utilitárias.

### Exemplo de Uso:
Para criar um botão azul com bordas arredondadas e efeito de hover:
```tsx
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Clique Aqui
</button>
```

---

## 🛠️ Ferramentas Importantes

- **React Router**: Gerencia a navegação entre diferentes páginas do site.
- **Autoprefixer**: Uma ferramenta "invisível" que garante que o nosso CSS funcione em todos os navegadores (Chrome, Safari, Firefox, etc), adicionando prefixos automáticos quando necessário.

---

## 🤝 Regras de Contribuição

Para manter o projeto organizado e seguro, siga estas diretrizes:

### 🌿 Uso de Branches
**Nunca envie código diretamente para a branch `main`.** A `main` deve conter apenas código que já foi testado e aprovado.

1.  Sempre crie uma nova branch para a tarefa que você vai fazer:
    ```bash
    git checkout -b nome-da-sua-tarefa
    ```
2.  Trabalhe na sua branch, faça os commits e depois envie para o repositório:
    ```bash
    git push origin nome-da-sua-tarefa
    ```
3.  Abra um *Pull Request* para que alguém possa revisar o código antes de ele entrar na `main`.

### 💡 Observações para a Equipe
- Se você encontrar algum erro, não hesite em perguntar!
- Mantenha as mensagens de commit claras e curtas (ex: `feat: adiciona botão de login`).
- Antes de começar uma nova tarefa, garanta que você está com a versão mais recente da `main` (`git pull origin main`).
