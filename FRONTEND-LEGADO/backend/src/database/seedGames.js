// src/seed/seedGames.js
const db = require("./connection");

async function seedGames() {
  const games = [
    {
      id: "1",
      title: "adivinhaAnimais",
      description: "Reconhecimento de animais",
    },
    {
      id: "2",
      title: "cobrirTracejado",
      description: "Coordenação Motora",
    },
    {
      id: "3",
      title: "encaixeFormas",
      description: "Reconhecendo formas",
    },
    {
      id: "4",
      title: "labirinto",
      description: "puzzle",
    },
    {
      id: "5",
      title: "memoria",
      description: "memorizar imagens",
    },
    {
      id: "6",
      title: "soletrando",
      description: "conhecendo palavras"
    },
    {
      id: "7",
      title: "quebraCabeca",
      description: "Puzzle interativo",
    },
    {
      id: "7.1",
      title: "cachorroPuzzle",
      description: "Puzzle interativo",
    },
    {
      id: "7.2",
      title: "elefantePuzzle",
      description: "Puzzle interativo",
    },
    {
      id: "7.3",
      title: "gatoPuzzle",
      description: "Puzzle interativo",
    },
    {
      id: "7.4",
      title: "girafaPuzzle",
      description: "Puzzle interativo",
    },
    {
      id: "7.5",
      title: "golfinhoPuzzle",
      description: "Puzzle interativo",
    },
    {
      id: "7.6",
      title: "hipopotamoPuzzle",
      description: "Puzzle interativo",
    },
    {
      id: "7.7",
      title: "leao",
      description: "Puzzle interativo",
    },
    {
      id: "7.8",
      title: "macacoPuzzle",
      description: "Puzzle interativo",
    },
  ];

if (require.main === module) seed();

  try {
    await db.Game.bulkCreate(games);
    console.log("✔ Jogos cadastrados com sucesso!");
    process.exit(0); // encerra o script após executar
  } catch (err) {
    console.error("❌ Erro ao cadastrar jogos:", err);
    process.exit(1); // encerra com erro
  }
}

function seed() {
  const insert = db.prepare(`INSERT OR IGNORE INTO games (slug, title, description) VALUES (@slug, @title, @description)`);
  const insertMany = db.transaction((arr) => {
    for (const g of arr) insert.run(g);
  });

  insertMany(games);

  console.log("Seed de jogos inserida/atualizada.");
}

seedGames();