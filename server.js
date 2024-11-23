import express from "express";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);

app.use(express.static("./"));
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
