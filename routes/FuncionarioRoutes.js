const controller = require("../Controllers/FuncionarioController")
function requestfuncionario (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    controller.search((result) => {
        res.write(JSON.stringify(result));
        res.end();
    });

    if (req.method === "GET") {
        if (req.url === "/totalfuncionario") {
            // Obter informações de visão geral
            controller.getFuncionarioCount((funcionarioCount) => {
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
            controller.insertData.run(
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
            controller.deleteData.run(parsedBody.EmployeeID);
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
                parsedBody.Email,
                parsedBody.Idade,
                parsedBody.CPF,
                parsedBody.Telefone,
                parsedBody.EmployeeID
            );
            console.log("Dados modificados com sucesso.");
        });
    }
}
module.exports = {
    requestfuncionario
}