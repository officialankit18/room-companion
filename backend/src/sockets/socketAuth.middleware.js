import jwt from "jsonwebtoken";

import { User } from "../models/User.model.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token || !process.env.JWT_SECRET) {
      return next(new Error("Authentication failed"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive || !user.isVerified) {
      return next(new Error("Authentication failed"));
    }

    socket.user = {
      id: user._id.toString(),
      role: user.role,
    };

    return next();
  } catch (error) {
    return next(new Error("Authentication failed"));
  }
};

