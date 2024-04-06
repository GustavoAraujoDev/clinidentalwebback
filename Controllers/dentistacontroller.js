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

module.exports = {
    search, getDentistCount, insertData, deleteData, modifyData
}