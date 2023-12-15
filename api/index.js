const jsonServer = require("json-server");
const server = jsonServer.create();
const fs = require("fs");
const path = require("path");

const filePath = path.join("/var/task", "db.json"); // Use /tmp for write operations in Vercel

// Middleware to parse JSON bodies in POST requests
server.use(jsonServer.bodyParser);

// Use this line instead to enable write operations
const router = jsonServer.router(filePath);

const middlewares = jsonServer.defaults();

server.use(middlewares);

// Custom route to handle POST requests and save data to db.json
server.post("/api/data", (req, res) => {
  // Assuming that req.body contains the data you want to save
  router.db.data.push(req.body);
  fs.writeFileSync(filePath, JSON.stringify(router.db, null, 2));
  res.status(200).json({ message: "Data saved successfully" });
});

server.use(router);

// The following code is necessary to make it work on Vercel
module.exports = (req, res) => {
  // Allow CORS (Cross-Origin Resource Sharing)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  server(req, res);
};
