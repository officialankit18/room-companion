import { MESSAGE_LIMITS, MESSAGE_STATUS } from "../constants/message.js";
import { CONVERSATION_MESSAGES } from "../constants/messages.js";
import { USER_ROLES } from "../constants/roles.js";
import { Conversation } from "../models/Conversation.model.js";
import { Message } from "../models/Message.model.js";
import { AppError } from "../utils/AppError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { sendOfflineMessageEmail } from "../emails/email.service.js";
import { getConversationDetails } from "./conversation.service.js";

const getReceiverId = (conversation, senderId) => {
  const isTenant = conversation.tenantId._id.toString() === senderId;
  return isTenant ? conversation.ownerId._id : conversation.tenantId._id;
};

const incrementUnread = (conversation, receiverId) => {
  if (conversation.tenantId._id.toString() === receiverId.toString()) {
    conversation.tenantUnread += 1;
    return;
  }

  conversation.ownerUnread += 1;
};

const shouldSendOfflineEmail = (conversation, receiverId) => {
  if (conversation.tenantId._id.toString() === receiverId.toString()) {
    return conversation.tenantUnread === 0;
  }

  return conversation.ownerUnread === 0;
};

export const createMessage = async ({ conversationId, senderId, message, receiverOnline }) => {
  const trimmedMessage = message?.toString().trim();

  if (!trimmedMessage || trimmedMessage.length > MESSAGE_LIMITS.MAX_LENGTH) {
    throw new AppError(CONVERSATION_MESSAGES.INVALID_MESSAGE, HTTP_STATUS.BAD_REQUEST);
  }

  const conversation = await getConversationDetails({ conversationId, userId: senderId });
  const receiverId = getReceiverId(conversation, senderId);
  const sendOfflineEmail = !receiverOnline && shouldSendOfflineEmail(conversation, receiverId);

  const createdMessage = await Message.create({
    conversationId,
    senderId,
    receiverId,
    message: trimmedMessage,
    status: receiverOnline ? MESSAGE_STATUS.DELIVERED : MESSAGE_STATUS.SENT,
  });

  incrementUnread(conversation, receiverId);
  await conversation.save();

  const populatedMessage = await Message.findById(createdMessage._id)
    .populate("senderId", "name email profileImage")
    .populate("receiverId", "name email profileImage");

  if (sendOfflineEmail) {
    sendOfflineMessageEmail({
      receiverEmail: populatedMessage.receiverId.email,
      receiverName: populatedMessage.receiverId.name,
      senderName: populatedMessage.senderId.name,
      listingTitle: conversation.listingId.title,
    }).catch((error) => console.error("Offline message email failed", error.message));
  }

  return populatedMessage;
};

export const markMessageDelivered = async ({ messageId, receiverId }) => {
  return Message.findOneAndUpdate(
    {
      _id: messageId,
      receiverId,
      status: MESSAGE_STATUS.SENT,
    },
    {
      status: MESSAGE_STATUS.DELIVERED,
    },
    { new: true }
  );
};

export const markMessagesRead = async ({ conversationId, userId, role }) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new AppError(CONVERSATION_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const isParticipant =
    conversation.tenantId.toString() === userId || conversation.ownerId.toString() === userId;

  if (!isParticipant) {
    throw new AppError(CONVERSATION_MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);
  }

  await Message.updateMany(
    { conversationId, receiverId: userId, isRead: false },
    { isRead: true, status: MESSAGE_STATUS.READ, readAt: new Date() }
  );

  if (role === USER_ROLES.OWNER) {
    conversation.ownerUnread = 0;
  } else {
    conversation.tenantUnread = 0;
  }

  await conversation.save();
  return conversation;
};

