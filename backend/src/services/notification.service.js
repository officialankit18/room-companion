import { HTTP_STATUS } from "../constants/httpStatus.js";
import { NOTIFICATION_MESSAGES } from "../constants/messages.js";
import { Notification } from "../models/Notification.model.js";
import { AppError } from "../utils/AppError.js";

export const createNotification = async ({ userId, type, title, description, metadata = {} }) => {
  return Notification.create({
    userId,
    type,
    title,
    description,
    metadata,
  });
};

export const getUserNotifications = async (userId) => {
  return Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
};

export const markNotificationRead = async ({ userId, notificationId }) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new AppError(NOTIFICATION_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return notification;
};

export const markAllNotificationsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

