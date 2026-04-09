const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "troque_ja";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const authController = {
  register: (req, res) => {
    try {
      const { nome, sexo, cpf, idade, diagnostico, senha } = req.body;

      if (!nome || !cpf || !senha) {
        return res.status(400).json({ message: "nome, cpf e senha são obrigatórios" });
      }

      const existing = User.findByCPF(cpf);
      if (existing) {
        return res.status(409).json({ message: "CPF já cadastrado" });
      }

      const salt = bcrypt.genSaltSync(10);
      const senha_hash = bcrypt.hashSync(senha, salt);

      const created = User.create({ nome, sexo, cpf, idade, diagnostico, senha_hash });

      return res.status(201).json({ message: "Cadastrado com sucesso", user: { id: created.id, nome: created.nome, cpf } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  },

  login: (req, res) => {
    try {
      const { cpf, senha } = req.body;
      if (!cpf || !senha) return res.status(400).json({ message: "cpf e senha são obrigatórios" });

      const user = User.findByCPF(cpf);
      if (!user) return res.status(401).json({ message: "CPF ou senha incorretos" });

      const valid = bcrypt.compareSync(senha, user.senha_hash);
      if (!valid) return res.status(401).json({ message: "CPF ou senha incorretos" });

      const token = jwt.sign({ sub: user.id, nome: user.nome, cpf: user.cpf }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      return res.json({ token, nome: user.nome });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  }
};

module.exports = authController;
