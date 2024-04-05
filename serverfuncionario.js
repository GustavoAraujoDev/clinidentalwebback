const http = require("http");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("clinicdentalweb.db", (err) => {
    if (err) {
        console.error(err);
    } else {
        createtable();
        console.log("Conexão estabelecida com sucesso.")
    }
});

function createtable() {
    db.run(
        `CREATE TABLE IF NOT EXISTS Funcionario(
            EmployeeID INTEGER PRIMARY KEY AUTOINCREMENT,
            Nome TEXT,
            Email TEXT,
            Idade INTEGER,
            CPF TEXT,
            Telefone TEXT
        )`,
        (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Tabela criada com sucesso.");
            }
        }
    );
}

const getFuncionarioCount = (callback) => {
    db.get("SELECT COUNT(*) as count FROM Funcionario", (err, row) => {
        if (err) {
            console.error(err);
            callback(0); // Retorna 0 em caso de erro
        } else {
            callback(row.count || 0);
        }
    });
};

const search = (callback) => {
    db.all("SELECT * FROM Funcionario", (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            callback(rows);
        }
    });
};

const insertData = db.prepare(
    `INSERT INTO Funcionario (Nome, Email, Idade, CPF, Telefone)
    VALUES (?, ?, ?, ?, ?)`,
    (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Dados inseridos com sucesso.");
        }
    }
);

const deleteData = db.prepare(
    `DELETE FROM Funcionario WHERE EmployeeID == ?`,
    (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Dados excluídos com sucesso.");
        }
    }
);

const modifyData = db.prepare(
    `UPDATE Funcionario
      SET Nome = ?,
          Email = ?,
          Idade = ?,
          CPF = ?,
          Telefone = ?
     WHERE EmployeeID = ?`,
    (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Dados modificados com sucesso.");
        }
    }
);

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    search((result) => {
        res.write(JSON.stringify(result));
        res.end();
    });

    if (req.method === "GET") {
        if (req.url === "/totalfuncionario") {
            // Obter informações de visão geral
            getFuncionarioCount((funcionarioCount) => {
                res.write(JSON.stringify({ funcionarioCount }));
                res.end();
            });
        }
        // Adicione aqui a lógica para outras informações de visão geral, como número de clínicas e valor total de despesas
    }


    if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            insertData.run(
                parsedBody.Nome,
                parsedBody.Email,
                parsedBody.Idade,
                parsedBody.CPF,
                parsedBody.Telefone
            );
            console.log("Dados criados com sucesso.");
        });
    } else if (req.method === "DELETE") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            deleteData.run(parsedBody.EmployeeID);
            console.log("Dados excluídos com sucesso.");
        });
    } else if (req.method === "PUT") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            modifyData.run(
                parsedBody.Nome,
                parsedBody.Email,
                parsedBody.Idade,
                parsedBody.CPF,
                parsedBody.Telefone,
                parsedBody.EmployeeID
            );
            console.log("Dados modificados com sucesso.");
        });
    }
});

const port = 5500;
server.listen(port);
console.log(`Servidor escutando no porto ${port}`);
