import app from "./app"
import { redisClient } from "./config/redis";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
async function startServer() {
  console.log("Connecting Redis...");
    await redisClient.connect();
    console.log("Redis connected");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
  });
}

console.log(PORT);

startServer();