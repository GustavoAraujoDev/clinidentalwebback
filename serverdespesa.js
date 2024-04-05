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
        `CREATE TABLE IF NOT EXISTS Despesa(
            ExpenseID INTEGER PRIMARY KEY AUTOINCREMENT,
            Nome TEXT,
            Descricao TEXT,
            Data TEXT,
            Valor FLOAT
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

const getDespesaTotal = (callback) => {
    db.get("SELECT SUM(Valor) AS total FROM Despesa", (err, row) => {
        if (err) {
            console.error(err);
            callback(0); // Retorna 0 em caso de erro
        } else {
            const total = row.total !== null && row.total !== undefined ? row.total : 0;
            callback(total);
            console.log(total);
        }
    });
};




const search = (callback) => {
    db.all("SELECT * FROM Despesa", (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            callback(rows);
        }
    });
};

const insertData = db.prepare(
    `INSERT INTO Despesa (Nome, Descricao, Data, Valor)
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
    `DELETE FROM Despesa WHERE ExpenseID = ?`,
    (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Dados excluídos com sucesso.");
        }
    }
);

const modifyData = db.prepare(
    `UPDATE Despesa
      SET Nome = ?,
          Descricao = ?,
          Data = ?,
          Valor = ?
     WHERE ExpenseID = ?`,
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
        res.setHeader("Content-Type", "application/json");
        if (req.url === "/totaldespesa") {
            // Obter informações de visão geral
            getDespesaTotal((total) => {
                res.write(JSON.stringify({ total }));
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
                parsedBody.Descricao,
                parsedBody.Data,
                parsedBody.Valor
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
            deleteData.run(parsedBody.ExpenseID);
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
                parsedBody.Descricao,
                parsedBody.Data,
                parsedBody.Valor,
                parsedBody.ExpenseID
            );
            console.log("Dados modificados com sucesso.");
        });
    }
});

const port = 8800;
server.listen(port);
console.log(`Servidor escutando no porto ${port}`);
