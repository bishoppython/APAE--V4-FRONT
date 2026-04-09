const express = require('express');
const userRoutes = require('./userRoutes');

const router = express.Router();

// Rotas de usuários
router.use('/', userRoutes);

// Rota 404 para rotas de API não encontradas
router.use('*', (req, res) => {
    res.status(404).json({ error: 'Rota da API não encontrada' });
});

module.exports = router;