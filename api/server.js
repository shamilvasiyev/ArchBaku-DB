// See https://github.com/typicode/json-server#module
const jsonServer = require("json-server");

const server = jsonServer.create();

// Uncomment to allow write operations
const fs = require("fs");
const path = require("path");
const filePath = path.join("db.json");

// Middleware to parse JSON bodies in POST requests
server.use(jsonServer.bodyParser);

// Remove these lines
// const data = fs.readFileSync(filePath, "utf-8");
// const db = JSON.parse(data);
// const router = jsonServer.router(db);

// Use this line instead to enable write operations
const router = jsonServer.router(filePath);

const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/blog/:resource/:id/show": "/:resource/:id",
  })
);

// Custom route to handle POST requests and save data to db.json
server.post("/api/data", (req, res) => {
  // Assuming that req.body contains the data you want to save
  router.db.data.push(req.body);
  fs.writeFileSync(filePath, JSON.stringify(router.db, null, 2));
  res.status(200).json({ message: "Data saved successfully" });
});

server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;
