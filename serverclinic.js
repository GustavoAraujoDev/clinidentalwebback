const http = require("http");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("clinicdentalweb.db", (err) => {
    if (err) {
        console.error(err);
    } else {
        createtable();
        console.log("Conexão estabelecida com sucesso.");
    }
});

function createtable() {
    db.run(
        `CREATE TABLE IF NOT EXISTS Clinica(
            ClinicID INTEGER PRIMARY KEY AUTOINCREMENT,
            Nome TEXT,
            Endereco TEXT,
            Email TEXT,
            CNPJ TEXT
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

const getClinicCount = (callback) => {
    db.get("SELECT COUNT(*) as count FROM Clinica", (err, row) => {
        if (err) {
            console.error(err);
            callback(0); // Retorna 0 em caso de erro
        } else {
            callback(row.count || 0);
        }
    });
};

const search = (callback) => {
    db.all("SELECT * FROM Clinica", (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            callback(rows);
        }
    });
};

const insertData = db.prepare(
    `INSERT INTO Clinica (Nome, Endereco, Email, CNPJ)
    VALUES (?, ?, ?, ?)`,
    (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Dados inseridos com sucesso.");
        }
    }
);

const deleteData = db.prepare(
    `DELETE FROM Clinica WHERE ClinicID = ?`,
    (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Dados excluídos com sucesso.");
        }
    }
);

const modifyData = db.prepare(
    `UPDATE Clinica
      SET Nome = ?,
          Endereco = ?,
          Email = ?,
          CNPJ = ?
     WHERE ClinicID = ?`,
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
        if (req.url === "/totalclinica") {
            // Obter informações de visão geral
            getClinicCount((clinicCount) => {
                res.write(JSON.stringify({ clinicCount }));
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
                parsedBody.Endereco,
                parsedBody.Email,
                parsedBody.CNPJ
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
            deleteData.run(parsedBody.ClinicID);
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
                parsedBody.Endereco,
                parsedBody.Email,
                parsedBody.CNPJ,
                parsedBody.ClinicID
            );
            console.log("Dados modificados com sucesso.");
        });
    }
});

const port = 7700;
server.listen(port);
console.log(`Servidor escutando no porto ${port}`);
