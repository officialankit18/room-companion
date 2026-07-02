const onlineUsers = new Map();

export const addOnlineUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
};

export const removeOnlineUser = (userId, socketId) => {
  if (onlineUsers.get(userId) === socketId) {
    onlineUsers.delete(userId);
  }
};

export const isUserOnline = (userId) => onlineUsers.has(userId.toString());

export const getUserSocketId = (userId) => onlineUsers.get(userId.toString());

