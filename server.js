const http = require("http");
const routesclinica = require("../clinicdentalwebback/routes/ClinicaRoutes")
const routesFuncionario = require("../clinicdentalwebback/routes/FuncionarioRoutes");
const routesdentista = require("../clinicdentalwebback/routes/dentistaroutes");
const routesDespesa = require("../clinicdentalwebback/routes/DespesaRoutes")
const port = 6600;

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.url.startsWith("/funcionario")) {
        routesFuncionario.requestfuncionario(req, res);
    } else if (req.url.startsWith("/clinica")) {
        routesclinica.requestclinica(req, res);
    } else if (req.url.startsWith("/dentista")){
        routesdentista.requestdentista(req, res);
    } else if (req.url.startsWith("/despesa")){
        routesDespesa.requestdespesa(req, res);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Rota não encontrada" }));
    }
});
server.listen(port, () => {
    console.log(`Servidor escutando no porto ${port}`);
});
