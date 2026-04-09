const UserModel = require('../models/UserModel');

class UserService {
    constructor() {
        this.userModel = new UserModel();
    }

    // Validar dados de cadastro
    validateUserData(userData) {
        const { nome, idade, diagnostico, sexo, cpf, senha } = userData;
        
        // Validações básicas obrigatórias
        if (!nome || !idade || !diagnostico || !sexo || !cpf || !senha) {
            throw new Error('Todos os campos são obrigatórios.');
        }

        // Validação simples de sexo
        if (sexo !== 'M' && sexo !== 'F') {
            throw new Error('Sexo deve ser M ou F.');
        }

        // Validação simples de CPF (apenas 11 dígitos)
        if (cpf.length !== 11) {
            throw new Error('CPF deve ter 11 dígitos.');
        }

        // Validação simples de senha
        if (senha.length < 6) {
            throw new Error('Senha deve ter pelo menos 6 caracteres.');
        }
    }

    // Registrar usuário
    async registerUser(userData) {
        this.validateUserData(userData);
        return await this.userModel.create(userData);
    }

    // Autenticar usuário
    async authenticateUser(cpf, senha) {
        if (!cpf || !senha) {
            throw new Error('CPF e senha são obrigatórios.');
        }

        const user = await this.userModel.findByCpf(cpf);
        if (!user) {
            throw new Error('CPF ou senha incorretos.');
        }

        const isPasswordValid = await this.userModel.verifyPassword(senha, user.senha);
        if (!isPasswordValid) {
            throw new Error('CPF ou senha incorretos.');
        }

        // Retornar dados do usuário sem a senha
        const { senha: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    // Obter todos os usuários
    async getAllUsers() {
        return await this.userModel.findAll();
    }
}

module.exports = UserService;