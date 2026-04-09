// Middleware de autenticação simples
const authMiddleware = (req, res, next) => {
    if (req.session.usuario) {
        next();
    } else {
        res.status(401).json({ error: 'Acesso não autorizado. Faça login.' });
    }
};

module.exports = {
    authMiddleware
};