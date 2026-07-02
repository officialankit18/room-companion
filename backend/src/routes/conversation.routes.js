import { Router } from "express";

import {
  fetchConversationDetails,
  fetchConversationMessages,
  fetchConversations,
  readConversation,
} from "../controllers/conversation.controller.js";
import { USER_ROLES } from "../constants/roles.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorize.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { mongoIdParamValidator } from "../validators/common.validator.js";
import { messagePaginationValidator } from "../validators/conversation.validator.js";

const router = Router();

router.use(authenticate, authorizeRoles(USER_ROLES.TENANT, USER_ROLES.OWNER));

router.get("/", fetchConversations);
router.get("/:id", mongoIdParamValidator("id"), validateRequest, fetchConversationDetails);
router.get(
  "/:id/messages",
  mongoIdParamValidator("id"),
  messagePaginationValidator,
  validateRequest,
  fetchConversationMessages
);
router.patch("/:id/read", mongoIdParamValidator("id"), validateRequest, readConversation);

export default router;

