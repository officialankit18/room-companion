import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGE_LIMITS, MESSAGE_STATUS } from "../constants/message.js";
import { CONVERSATION_MESSAGES } from "../constants/messages.js";
import { USER_ROLES } from "../constants/roles.js";
import { Conversation } from "../models/Conversation.model.js";
import { Message } from "../models/Message.model.js";
import { AppError } from "../utils/AppError.js";

export const verifyConversationParticipant = (conversation, userId) => {
  const isTenant = conversation.tenantId.toString() === userId;
  const isOwner = conversation.ownerId.toString() === userId;

  if (!isTenant && !isOwner) {
    throw new AppError(CONVERSATION_MESSAGES.ACCESS_DENIED, HTTP_STATUS.FORBIDDEN);
  }
};

export const getUserConversations = async ({ userId, role }) => {
  const participantFilter =
    role === USER_ROLES.OWNER ? { ownerId: userId } : { tenantId: userId };

  return Conversation.find(participantFilter)
    .sort({ updatedAt: -1 })
    .populate("tenantId", "name email profileImage")
    .populate("ownerId", "name email profileImage")
    .populate("listingId", "title location rent status");
};

export const getConversationDetails = async ({ conversationId, userId }) => {
  const conversation = await Conversation.findById(conversationId)
    .populate("tenantId", "name email profileImage")
    .populate("ownerId", "name email profileImage")
    .populate("listingId", "title location rent status");

  if (!conversation) {
    throw new AppError(CONVERSATION_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  verifyConversationParticipant(conversation, userId);

  return conversation;
};

export const getConversationMessages = async ({ conversationId, userId, query }) => {
  const conversation = await getConversationDetails({ conversationId, userId });
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(
    Number(query.limit) || MESSAGE_LIMITS.DEFAULT_PAGE_SIZE,
    MESSAGE_LIMITS.MAX_PAGE_SIZE
  );
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "name profileImage")
      .populate("receiverId", "name profileImage"),
    Message.countDocuments({ conversationId }),
  ]);

  return {
    conversation,
    messages: messages.reverse(),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const markConversationRead = async ({ conversationId, userId, role }) => {
  const conversation = await getConversationDetails({ conversationId, userId });

  await Message.updateMany(
    {
      conversationId,
      receiverId: userId,
      isRead: false,
    },
    {
      isRead: true,
      status: MESSAGE_STATUS.READ,
      readAt: new Date(),
    }
  );

  if (role === USER_ROLES.OWNER) {
    conversation.ownerUnread = 0;
  } else {
    conversation.tenantUnread = 0;
  }

  await conversation.save();

  return conversation;
};

