import { HTTP_STATUS } from "../constants/httpStatus.js";
import { CONVERSATION_MESSAGES } from "../constants/messages.js";
import {
  getConversationDetails,
  getConversationMessages,
  getUserConversations,
  markConversationRead,
} from "../services/conversation.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const fetchConversations = asyncHandler(async (req, res) => {
  const conversations = await getUserConversations({
    userId: req.user.id,
    role: req.user.role,
  });

  return sendSuccess(res, HTTP_STATUS.OK, CONVERSATION_MESSAGES.FETCHED, {
    conversations,
  });
});

export const fetchConversationDetails = asyncHandler(async (req, res) => {
  const conversation = await getConversationDetails({
    conversationId: req.params.id,
    userId: req.user.id,
  });

  return sendSuccess(res, HTTP_STATUS.OK, CONVERSATION_MESSAGES.DETAILS_FETCHED, {
    conversation,
  });
});

export const fetchConversationMessages = asyncHandler(async (req, res) => {
  const data = await getConversationMessages({
    conversationId: req.params.id,
    userId: req.user.id,
    query: req.query,
  });

  return sendSuccess(res, HTTP_STATUS.OK, CONVERSATION_MESSAGES.MESSAGES_FETCHED, data);
});

export const readConversation = asyncHandler(async (req, res) => {
  const conversation = await markConversationRead({
    conversationId: req.params.id,
    userId: req.user.id,
    role: req.user.role,
  });

  return sendSuccess(res, HTTP_STATUS.OK, CONVERSATION_MESSAGES.MARKED_READ, {
    conversation,
  });
});

