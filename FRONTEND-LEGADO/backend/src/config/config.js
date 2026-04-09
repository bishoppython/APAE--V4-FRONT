// Configurações simples da aplicação
const config = {
    // Servidor
    server: {
        port: process.env.PORT || 3001
    },

    // Sessões simples
    session: {
        secret: 'apae-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        }
    }
};

module.exports = config;