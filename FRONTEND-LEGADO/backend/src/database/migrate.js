const db = require("./connection");

function runMigrations() {
  // users
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      sexo TEXT,
      cpf TEXT UNIQUE NOT NULL,
      idade INTEGER,
      diagnostico TEXT,
      senha_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `).run();

  // games (exemplo para seed)
  db.prepare(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `).run();

  console.log("Migrations executadas com sucesso.");
}

if (require.main === module) {
  runMigrations();
}
