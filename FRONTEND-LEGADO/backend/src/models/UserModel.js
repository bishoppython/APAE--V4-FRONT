const db = require("../database/connection");

const User = {
  create: ({ nome, sexo, cpf, idade, diagnostico, senha_hash }) => {
    const stmt = db.prepare(`
      INSERT INTO users (nome, sexo, cpf, idade, diagnostico, senha_hash) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(nome, sexo, cpf, idade || null, diagnostico || null, senha_hash);
    return { id: info.lastInsertRowid, nome, sexo, cpf, idade, diagnostico };
  },

  findByCPF: (cpf) => {
    const stmt = db.prepare(`SELECT * FROM users WHERE cpf = ?`);
    return stmt.get(cpf);
  },

  findById: (id) => {
    const stmt = db.prepare(`SELECT id, nome, sexo, cpf, idade, diagnostico, created_at FROM users WHERE id = ?`);
    return stmt.get(id);
  }
};

module.exports = User;
