const jsonServer = require("json-server");
const server = jsonServer.create();
const fs = require("@cyclic.sh/s3fs")("cyclic-clumsy-gray-bunny-eu-north-1");
const path = require("path");
const filePath = path.join(process.cwd(), "db.json"); // Use __dirname to get the current directory
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);

server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser); // Add this line to parse POST request body

server.post("/api/data", (req, res) => {
  // Assuming the POST request contains data in the body
  const newData = req.body;

  // Update your db object with the new data
  // For example, let's assume you have an array named 'items' in your db.json
  db.items.push(newData);

  // Save the updated data back to the db.json file
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2));

  // Respond with the new data
  res.json(newData);
});

// Other routes and configurations...
const router = jsonServer.router(filePath);
server.use(router);

const port = 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
