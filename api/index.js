// api/json-server.js
const jsonServer = require("json-server");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Enable POST, PUT, and DELETE requests
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (
    req.method === "POST" ||
    req.method === "PUT" ||
    req.method === "DELETE"
  ) {
    // Update the database file after handling the request
    router.db.setState(db.getState());
  }
  next();
});

server.use("/api", router);

module.exports = server;
