const controller = require("../Controllers/ClinicaController")

function requestclinica(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    controller.search((result) => {
        res.write(JSON.stringify(result));
        res.end();
    });

    if (req.method === "GET") {
        if (req.url === "/totalclinica") {
            // Obter informações de visão geral
            controller.getClinicCount((clinicCount) => {
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
            controller.insertData.run(
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
            controller.deleteData.run(parsedBody.ClinicID);
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
                parsedBody.Endereco,
                parsedBody.Email,
                parsedBody.CNPJ,
                parsedBody.ClinicID
            );
            console.log("Dados modificados com sucesso.");
        });
    }
}

module.exports = {
    requestclinica
}