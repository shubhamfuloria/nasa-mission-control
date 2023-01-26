const http = require("http");

const app = require("./app");
const { mongoConnect } = require("./services/mongo");

const PORT = 8000;

const server = http.createServer(app);

const { loadPlanetsData } = require("./models/planets.model");

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  server.listen(PORT, () => console.log("listening on port: ", PORT));
}

startServer();
