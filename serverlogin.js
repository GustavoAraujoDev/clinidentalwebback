const http = require('http');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const SUCCESS_REDIRECT_URL = '/home';

const PORT = 3480;

const db = new sqlite3.Database("clinicdentalweb.db", (err) => {
    if (err) {
        console.error(err);
    } else {
        createTable();
        console.log("Conexão estabelecida com sucesso.");
    }
});

// Create users table if not exists
function createTable() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT
        )
    `);
}

const server = http.createServer((req, res) => {
    // Configurar cabeçalhos CORS para todas as respostas
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST') {
        let data = '';

        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', async () => {
            const { url } = req;

            if (url === '/register') {
                const { username, password } = JSON.parse(data);

                // Verificar se o nome de usuário já existe no banco de dados
                db.get('SELECT * FROM users WHERE username = ?', [username], (err, existingUser) => {
                    if (err) {
                        console.error('Erro ao verificar nome de usuário:', err.message);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Failed to register user' }));
                        return;
                    }

                    if (existingUser) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Username already exists' }));
                        return;
                    }

                    // Se não houver usuário existente com o mesmo nome de usuário, insira o novo usuário no banco de dados
                    bcrypt.hash(password, 10, (err, hashedPassword) => {
                        if (err) {
                            console.error('Erro ao gerar hash de senha:', err.message);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Failed to register user' }));
                            return;
                        }

                        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
                            if (err) {
                                console.error('Erro ao registrar usuário:', err.message);
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Failed to register user' }));
                                return;
                            }
                            console.log('Usuário registrado com sucesso:', username);
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'User registered successfully' }));
                        });
                    });
                });
            } else if (url === '/login') {
                const { username, password } = JSON.parse(data);

                // Consulta o banco de dados para verificar se o usuário existe
                db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
                    if (err || !user) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid username or password' }));
                        return;
                    }

                    // Compara a senha fornecida com a senha armazenada no banco de dados
                    const passwordMatch = await bcrypt.compare(password, user.password);

                    if (!passwordMatch) {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid username or password' }));
                        return;
                    }

                    // Se as credenciais estiverem corretas, envie uma resposta de sucesso
                    res.end(JSON.stringify({ message: 'Login successful' }));
                    res.end(); 
                });
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
