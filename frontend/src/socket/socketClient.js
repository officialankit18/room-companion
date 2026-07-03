import { io } from "socket.io-client";

import { tokenStorage } from "../auth/tokenStorage";
import { env } from "../config/env";

export const createSocketClient = () => {
  return io(env.socketUrl, {
    autoConnect: false,
    auth: {
      token: tokenStorage.getToken(),
    },
  });
};

