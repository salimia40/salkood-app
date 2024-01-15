import express from "express";
import { createServer } from "http";
import socket from "./socket";

const app = express();
const port = 4000;
const masterKey = process.env.MASTER_KEY;

if (!masterKey) {
  throw new Error("Missing MASTER_KEY environment variable");
}

app.use(express.json());

app.use((req, res, next) => {
  const masterKey = process.env.MASTER_KEY;
  const requestMasterKey = req.headers["master-key"];

  if (masterKey && requestMasterKey && masterKey === requestMasterKey) {
    next();
  } else {
    res.sendStatus(401);
  }
});

const httpServer = createServer(app);
const io = socket(httpServer);

app.post("/api/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  const message = req.body;
  // send message to userId channel
  io.to(userId).emit("message", message);
  res.sendStatus(200);
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
