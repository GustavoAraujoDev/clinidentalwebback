const controller = require("../Controllers/dentistacontroller");

function requestdentista(req, res) {
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

controller.search((result) => {
    res.write(JSON.stringify(result));
    res.end();
});

if (req.method === "GET") {
    if (req.url === "/totaldentista") {
        res.setHeader("Content-Type", "application/json"); // Define os cabeçalhos de resposta antes de enviar qualquer dado
        // Obter informações de visão geral
        controller.g((dentistCount) => {
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
        controller.insertData.run(
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
        controller.deleteData.run(parsedBody.DentistID);
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
            parsedBody.Telefone,
            parsedBody.CPF,
            parsedBody.CRO,
            parsedBody.DentistID
        );
        console.log("Dados modificados com sucesso.");
    });
}
}
 
module.exports = {
    requestdentista
}