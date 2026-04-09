const UserService = require('../services/UserService');

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    // Cadastrar usuário 
    async cadastrar(req, res) {
        try {
            const usuario = await this.userService.registerUser(req.body);
            res.status(201).json({
                message: 'Usuário cadastrado com sucesso!',
                usuario
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Fazer login 
    async login(req, res) {
        try {
            const { cpf, senha } = req.body;
            const usuario = await this.userService.authenticateUser(cpf, senha);

            // Criar sessão simples
            req.session.usuario = usuario;

            res.json({
                message: 'Login realizado com sucesso!',
                usuario
            });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    // Verificar se está logado
    verificarAuth(req, res) {
        if (req.session.usuario) {
            res.json({
                logado: true,
                usuario: req.session.usuario
            });
        } else {
            res.json({ logado: false });
        }
    }

    // Listar usuários
    async listarUsuarios(req, res) {
        try {
            const usuarios = await this.userService.getAllUsers();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
}

module.exports = UserController;