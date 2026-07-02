import { query } from "express-validator";

import { MESSAGE_LIMITS } from "../constants/message.js";

export const messagePaginationValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: MESSAGE_LIMITS.MAX_PAGE_SIZE }),
];

