import { verify } from "jsonwebtoken";
import axios from "axios";

import { Server } from "socket.io";
import { createServer } from "http";
import redisClient from "./redis";

const masterHost = process.env.MASTER_HOST;
const jwtSecret = process.env.JWT_SECRET;
const masterKey = process.env.MASTER_KEY;

if (!masterKey) {
  throw new Error("Missing MASTER_KEY environment variable");
}

if (!jwtSecret) {
  throw new Error("Missing JWT_SECRET environment variable");
}

if (!masterHost) {
  throw new Error("Missing MASTER_HOST environment variable");
}

export default (httpServer: ReturnType<typeof createServer>) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    console.log("a user connected");

    const authorization = socket.handshake.auth.token as unknown as string;

    if (!authorization) {
      return socket.disconnect(true);
    }

    const userId = verify(authorization, jwtSecret) as unknown as string;
    socket.join(userId);

    //   save socket to redis with userId as key and socketID in array
    const socketIds = await redisClient.get(userId);
    if (socketIds) {
      const socketIdsArray = socketIds.split(",");
      socketIdsArray.push(socket.id);
      redisClient.set(userId, socketIdsArray.join(","));
    } else {
      redisClient.set(userId, JSON.stringify([socket.id]));
      // send online status to master
      axios.post(`${masterHost}/api/users/${userId}/online`, {
        online: true,
      });
    }
    socket.on("disconnect", async () => {
      console.log("user disconnected");

      // remove socket from redis
      const socketIds = (await redisClient.get(userId)) as unknown as string;
      if (socketIds) {
        const socketIdsArray = socketIds.split(",");
        const index = socketIdsArray.indexOf(socket.id);
        socketIdsArray.splice(index, 1);
        redisClient.set(userId, socketIdsArray.join(","));
        if (socketIdsArray.length === 0) {
          redisClient.del(userId);
          // send offline status to master
          axios.post(`${masterHost}/api/users/${userId}/online`, {
            online: false,
          });
        }
      }
    });
  });

  return io;
};
