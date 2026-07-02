import { HTTP_STATUS } from "../constants/httpStatus.js";
import { ADMIN_MESSAGES } from "../constants/messages.js";
import { USER_ROLES } from "../constants/roles.js";
import { CompatibilityScore } from "../models/CompatibilityScore.model.js";
import { Conversation } from "../models/Conversation.model.js";
import { Interest } from "../models/Interest.model.js";
import { Listing } from "../models/Listing.model.js";
import { Message } from "../models/Message.model.js";
import { Notification } from "../models/Notification.model.js";
import { User } from "../models/User.model.js";
import { AppError } from "../utils/AppError.js";

const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Number(query.limit) || 20, 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildUserFilters = (query) => {
  const filters = {};

  if (query.role) filters.role = query.role;
  if (query.isVerified !== undefined) filters.isVerified = query.isVerified === "true";
  if (query.isActive !== undefined) filters.isActive = query.isActive === "true";
  if (query.search) {
    filters.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  return filters;
};

const buildListingFilters = (query) => {
  const filters = {};

  if (query.status) filters.status = query.status;
  if (query.city) filters["location.city"] = { $regex: query.city, $options: "i" };
  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  return filters;
};

export const getAdminUsers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filters = buildUserFilters(query);

  const [users, total] = await Promise.all([
    User.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filters),
  ]);

  return {
    users,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const updateUserStatus = async ({ adminId, userId, isActive }) => {
  if (adminId === userId && isActive === false) {
    throw new AppError(ADMIN_MESSAGES.CANNOT_DISABLE_SELF, HTTP_STATUS.BAD_REQUEST);
  }

  const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true });

  if (!user) {
    throw new AppError(ADMIN_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return user;
};

export const getAdminListings = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filters = buildListingFilters(query);

  const [listings, total] = await Promise.all([
    Listing.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("ownerId", "name email profileImage"),
    Listing.countDocuments(filters),
  ]);

  return {
    listings,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const updateListingStatusByAdmin = async ({ listingId, status }) => {
  const listing = await Listing.findByIdAndUpdate(
    listingId,
    { status },
    { new: true, runValidators: true }
  );

  if (!listing) {
    throw new AppError(ADMIN_MESSAGES.LISTING_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return listing;
};

export const getPlatformActivity = async () => {
  const [
    totalUsers,
    tenants,
    owners,
    admins,
    activeUsers,
    totalListings,
    totalInterests,
    totalConversations,
    totalMessages,
    totalNotifications,
    totalCompatibilityScores,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: USER_ROLES.TENANT }),
    User.countDocuments({ role: USER_ROLES.OWNER }),
    User.countDocuments({ role: USER_ROLES.ADMIN }),
    User.countDocuments({ isActive: true }),
    Listing.countDocuments(),
    Interest.countDocuments(),
    Conversation.countDocuments(),
    Message.countDocuments(),
    Notification.countDocuments(),
    CompatibilityScore.countDocuments(),
  ]);

  return {
    users: { total: totalUsers, tenants, owners, admins, active: activeUsers },
    listings: { total: totalListings },
    interests: { total: totalInterests },
    conversations: { total: totalConversations },
    messages: { total: totalMessages },
    notifications: { total: totalNotifications },
    compatibilityScores: { total: totalCompatibilityScores },
  };
};

