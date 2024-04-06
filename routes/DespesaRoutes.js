const controller = require("../Controllers/DespesaController")
function requestdespesa(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    controller.search((result) => {
        res.write(JSON.stringify(result));
        res.end();
    });

    if (req.method === "GET") {
        res.setHeader("Content-Type", "application/json");
        if (req.url === "/totaldespesa") {
            // Obter informações de visão geral
            controller.getDespesaTotal((total) => {
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
            controller.insertData.run(
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
            controller.deleteData.run(parsedBody.ExpenseID);
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
            controller.modifyData.run(
                parsedBody.Nome,
                parsedBody.Descricao,
                parsedBody.Data,
                parsedBody.Valor,
                parsedBody.ExpenseID
            );
            console.log("Dados modificados com sucesso.");
        });
    }
}
module.exports = {
    requestdespesa
}