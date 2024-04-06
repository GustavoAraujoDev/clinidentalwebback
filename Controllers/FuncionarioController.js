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

module.exports = {
    search, getFuncionarioCount, insertData, deleteData, modifyData
}