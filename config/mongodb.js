const Env = use('Env')

module.exports = {
    host: Env.get('MONGO_HOST', ''),
    port: Env.get('MONGO_PORT', ''),
    user: Env.get('MONGO_USER', ''),
    pass: Env.get('MONGO_PASS', ''),
    database: Env.get('MONGO_DATABASE', ''),
    options: {
        // authSource: Env.get('MONGO_AUTH_SOURCE', 'admin')
    },
};
