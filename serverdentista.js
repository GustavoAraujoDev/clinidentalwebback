const http = require("http");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("clinicdentalweb.db", (err) => {
    if (err) {
        console.error(err);
    } else {
        createTable();
        console.log("Conexão estabelecida com sucesso.");
    }
});

function createTable() {
    db.run(
        `CREATE TABLE IF NOT EXISTS Dentista(
            DentistID INTEGER PRIMARY KEY AUTOINCREMENT,
            Nome TEXT,
            Email TEXT,
            Telefone TEXT,
            CPF TEXT,
            CRO TEXT
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

const getDentistCount = (callback) => {
    db.get("SELECT COUNT(*) as count FROM Dentista", (err, row) => {
        if (err) {
            console.error(err);
            callback(0); // Retorna 0 em caso de erro
        } else {
            callback(row.count || 0);
        }
    });
};

const search = (callback) => {
    db.all("SELECT * FROM Dentista", (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            callback(rows);
        }
    });
};

const insertData = db.prepare(
    `INSERT INTO Dentista (Nome, Email, Telefone, CPF, CRO)
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
    `DELETE FROM Dentista WHERE DentistID == ?`,
    (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Dados excluídos com sucesso.");
        }
    }
);

const modifyData = db.prepare(
    `UPDATE Dentista
      SET Nome = ?,
          Email = ?,
          Telefone = ?,
          CPF = ?,
          CRO = ?
     WHERE DentistID = ?`,
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
        if (req.url === "/totaldentista") {
            res.setHeader("Content-Type", "application/json"); // Define os cabeçalhos de resposta antes de enviar qualquer dado
            // Obter informações de visão geral
            getDentistCount((dentistCount) => {
                res.write(JSON.stringify({ count: dentistCount })); // Envie a resposta com a contagem de dentistas
                res.end();
            });
        }
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
                parsedBody.Telefone,
                parsedBody.CPF,
                parsedBody.CRO
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
            deleteData.run(parsedBody.DentistID);
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
                parsedBody.Telefone,
                parsedBody.CPF,
                parsedBody.CRO,
                parsedBody.DentistID
            );
            console.log("Dados modificados com sucesso.");
        });
    }
});

const port = 6600;
server.listen(port);
console.log(`Servidor escutando no porto ${port}`);
