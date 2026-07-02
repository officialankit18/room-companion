import http from "http";

import app from "./app.js";
import { appConfig } from "./config/app.config.js";
import { connectDatabase } from "./config/database.config.js";
import { initializeSocket } from "./sockets/index.js";

const server = http.createServer(app);
initializeSocket(server);

const startServer = async () => {
  try {
    await connectDatabase();

    server.listen(appConfig.port, () => {
      console.log(`RoomCompanion backend running on port ${appConfig.port}`);
    });
  } catch (error) {
    console.error("Failed to start RoomCompanion backend", error.message);
    process.exit(1);
  }
};

startServer();
