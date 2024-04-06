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

module.exports = {
    search, getDespesaTotal, insertData, deleteData, modifyData
}