import { getConversationDetails } from "../services/conversation.service.js";
import {
  createMessage,
  markMessageDelivered,
  markMessagesRead,
} from "../services/message.service.js";
import {
  addOnlineUser,
  getUserSocketId,
  isUserOnline,
  removeOnlineUser,
} from "./onlineUsers.js";

const userRoom = (userId) => `user_${userId}`;
const conversationRoom = (conversationId) => `conversation_${conversationId}`;

const emitSocketError = (socket, message) => {
  socket.emit("socketError", { message });
};

export const registerChatSocketHandlers = (io, socket) => {
  const userId = socket.user.id;

  const becameOnline = addOnlineUser(userId, socket.id);
  socket.join(userRoom(userId));
  if (becameOnline) {
    io.emit("userOnline", { userId });
  }

  socket.on("checkOnlineStatus", ({ userId: requestedUserId }, acknowledge) => {
    acknowledge?.({ userId: requestedUserId, isOnline: isUserOnline(requestedUserId) });
  });

  socket.on("joinConversation", async ({ conversationId }) => {
    try {
      await getConversationDetails({ conversationId, userId });
      socket.join(conversationRoom(conversationId));
    } catch (error) {
      emitSocketError(socket, error.message);
    }
  });

  socket.on("leaveConversation", ({ conversationId }) => {
    socket.leave(conversationRoom(conversationId));
  });

  socket.on("typing", async ({ conversationId }) => {
    try {
      await getConversationDetails({ conversationId, userId });
      socket.to(conversationRoom(conversationId)).emit("typing", {
        conversationId,
        userId,
      });
    } catch (error) {
      emitSocketError(socket, error.message);
    }
  });

  socket.on("stopTyping", ({ conversationId }) => {
    socket.to(conversationRoom(conversationId)).emit("stopTyping", {
      conversationId,
      userId,
    });
  });

  socket.on("sendMessage", async ({ conversationId, message }, acknowledge) => {
    try {
      const conversation = await getConversationDetails({ conversationId, userId });
      const receiverId =
        conversation.tenantId._id.toString() === userId
          ? conversation.ownerId._id.toString()
          : conversation.tenantId._id.toString();
      const receiverOnline = isUserOnline(receiverId);
      const savedMessage = await createMessage({
        conversationId,
        senderId: userId,
        message,
        receiverOnline,
      });

      socket.emit("newMessage", savedMessage);
      io.to(userRoom(receiverId)).emit("newMessage", savedMessage);
      io.to(userRoom(receiverId)).emit("notification", {
        type: "NEW_MESSAGE",
        conversationId,
        messageId: savedMessage._id,
      });
      acknowledge?.({ success: true, messageId: savedMessage._id });
    } catch (error) {
      emitSocketError(socket, error.message);
      acknowledge?.({ success: false, message: error.message });
    }
  });

  socket.on("messageDelivered", async ({ messageId }) => {
    try {
      const updatedMessage = await markMessageDelivered({ messageId, receiverId: userId });
      if (updatedMessage) {
        const senderSocketId = getUserSocketId(updatedMessage.senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("messageDelivered", updatedMessage);
        }
      }
    } catch (error) {
      emitSocketError(socket, error.message);
    }
  });

  socket.on("messageRead", async ({ conversationId }) => {
    try {
      const conversation = await markMessagesRead({
        conversationId,
        userId,
        role: socket.user.role,
      });
      const senderId =
        conversation.tenantId.toString() === userId
          ? conversation.ownerId.toString()
          : conversation.tenantId.toString();
      io.to(userRoom(senderId)).emit("messageRead", {
        conversationId,
        userId,
        conversation,
      });
    } catch (error) {
      emitSocketError(socket, error.message);
    }
  });

  socket.on("disconnect", () => {
    const becameOffline = removeOnlineUser(userId, socket.id);
    if (becameOffline) {
      io.emit("userOffline", { userId });
    }
  });
};
