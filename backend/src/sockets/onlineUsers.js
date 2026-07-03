const onlineUsers = new Map();

export const addOnlineUser = (userId, socketId) => {
  const normalizedUserId = userId.toString();
  const socketIds = onlineUsers.get(normalizedUserId) || new Set();
  socketIds.add(socketId);
  onlineUsers.set(normalizedUserId, socketIds);

  return socketIds.size === 1;
};

export const removeOnlineUser = (userId, socketId) => {
  const normalizedUserId = userId.toString();
  const socketIds = onlineUsers.get(normalizedUserId);

  if (!socketIds) return false;

  socketIds.delete(socketId);
  if (socketIds.size === 0) {
    onlineUsers.delete(normalizedUserId);
    return true;
  }

  return false;
};

export const isUserOnline = (userId) => onlineUsers.has(userId.toString());

export const getUserSocketId = (userId) => {
  const socketIds = onlineUsers.get(userId.toString());
  return socketIds?.values().next().value;
};
