import { HTTP_STATUS } from "../constants/httpStatus.js";
import { NOTIFICATION_MESSAGES } from "../constants/messages.js";
import {
  getUserNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notification.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const fetchNotifications = asyncHandler(async (req, res) => {
  const notifications = await getUserNotifications(req.user.id);

  return sendSuccess(res, HTTP_STATUS.OK, NOTIFICATION_MESSAGES.FETCHED, {
    notifications,
  });
});

export const readNotification = asyncHandler(async (req, res) => {
  const notification = await markNotificationRead({
    userId: req.user.id,
    notificationId: req.params.id,
  });

  return sendSuccess(res, HTTP_STATUS.OK, NOTIFICATION_MESSAGES.MARKED_READ, {
    notification,
  });
});

export const readAllNotifications = asyncHandler(async (req, res) => {
  await markAllNotificationsRead(req.user.id);

  return sendSuccess(res, HTTP_STATUS.OK, NOTIFICATION_MESSAGES.ALL_MARKED_READ);
});

