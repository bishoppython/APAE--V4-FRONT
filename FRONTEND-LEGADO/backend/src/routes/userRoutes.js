const express = require('express');
const UserController = require('../controllers/UserController');
const { authMiddleware } = require('../middleware');

const router = express.Router();
const userController = new UserController();

// Rotas simples
router.post('/cadastro', (req, res) => userController.cadastrar(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.get('/verificar-auth', (req, res) => userController.verificarAuth(req, res));

// Rotas com autenticação
router.get('/usuarios', authMiddleware, (req, res) => userController.listarUsuarios(req, res));

module.exports = router;