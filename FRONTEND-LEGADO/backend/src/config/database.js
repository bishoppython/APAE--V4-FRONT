const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = null;
        this.dbPath = path.join(__dirname, '..', '..', 'apae_v3.db');
        this.isConnected = false;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Erro ao conectar ao banco de dados:', err.message);
                    reject(err);
                } else {
                    console.log('Conectado ao banco de dados SQLite.');
                    this.isConnected = true;
                    this.initDatabase()
                        .then(() => resolve(this.db))
                        .catch(reject);
                }
            });
        });
    }

    initDatabase() {
        return new Promise((resolve, reject) => {
            const createUsersTable = `
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    idade INTEGER NOT NULL,
                    diagnostico TEXT NOT NULL,
                    sexo TEXT NOT NULL CHECK(sexo IN ('M', 'F')),
                    cpf TEXT UNIQUE NOT NULL,
                    senha TEXT NOT NULL,
                    tipo TEXT DEFAULT 'usuario',
                    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;

            this.db.run(createUsersTable, (err) => {
                if (err) {
                    console.error('Erro ao criar tabela de usuários:', err.message);
                    reject(err);
                } else {
                    console.log('Tabela de usuários verificada/criada com sucesso.');
                    resolve();
                }
            });
        });
    }

    getDatabase() {
        if (!this.isConnected || !this.db) {
            throw new Error('Banco de dados não está conectado. Chame connect() primeiro.');
        }
        return this.db;
    }

    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error('Erro ao fechar o banco:', err.message);
                        reject(err);
                    } else {
                        console.log('Conexão com o banco fechada.');
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = new Database();