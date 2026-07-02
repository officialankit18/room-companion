import { Router } from "express";

import {
  fetchNotifications,
  readAllNotifications,
  readNotification,
} from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { mongoIdParamValidator } from "../validators/common.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", fetchNotifications);
router.patch("/read-all", readAllNotifications);
router.patch("/:id/read", mongoIdParamValidator("id"), validateRequest, readNotification);

export default router;

