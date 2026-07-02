import { COMPATIBILITY_SCORE } from "../constants/compatibility.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { INTEREST_STATUS } from "../constants/interest.js";
import { LISTING_STATUS } from "../constants/listing.js";
import { INTEREST_MESSAGES, LISTING_MESSAGES } from "../constants/messages.js";
import { NOTIFICATION_TYPES } from "../constants/notification.js";
import { Conversation } from "../models/Conversation.model.js";
import { Interest } from "../models/Interest.model.js";
import { Listing } from "../models/Listing.model.js";
import { AppError } from "../utils/AppError.js";
import {
  sendHighCompatibilityInterestEmail,
  sendInterestDecisionEmail,
} from "../emails/email.service.js";
import { getOrCreateCompatibilityScore } from "./compatibility.service.js";
import { createNotification } from "./notification.service.js";

const interestPopulate = [
  { path: "tenantId", select: "name email profileImage" },
  { path: "ownerId", select: "name email profileImage" },
  { path: "listingId", select: "title location rent availableFrom roomType furnishingStatus status" },
];

const sendEmailSafely = async (emailTask) => {
  try {
    await emailTask();
  } catch (error) {
    console.error("Interest email failed", error.message);
  }
};

export const sendInterestRequest = async ({ tenantId, listingId }) => {
  const listing = await Listing.findById(listingId).populate("ownerId", "name email");

  if (!listing || listing.status === LISTING_STATUS.INACTIVE) {
    throw new AppError(LISTING_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (listing.status === LISTING_STATUS.FILLED) {
    throw new AppError(INTEREST_MESSAGES.FILLED_LISTING, HTTP_STATUS.BAD_REQUEST);
  }

  if (listing.ownerId._id.toString() === tenantId) {
    throw new AppError(INTEREST_MESSAGES.OWN_LISTING, HTTP_STATUS.BAD_REQUEST);
  }

  const duplicateInterest = await Interest.findOne({ tenantId, listingId });

  if (duplicateInterest) {
    throw new AppError(INTEREST_MESSAGES.DUPLICATE, HTTP_STATUS.CONFLICT);
  }

  const compatibility = await getOrCreateCompatibilityScore({ tenantId, listingId });

  const interest = await Interest.create({
    tenantId,
    listingId,
    ownerId: listing.ownerId._id,
  });

  const populatedInterest = await Interest.findById(interest._id).populate(interestPopulate);

  await createNotification({
    userId: listing.ownerId._id,
    type: NOTIFICATION_TYPES.INTEREST_RECEIVED,
    title: "New interest request",
    description: `${populatedInterest.tenantId.name} is interested in ${listing.title}.`,
    metadata: {
      interestId: interest._id,
      listingId,
      tenantId,
    },
  });

  if (compatibility.score >= COMPATIBILITY_SCORE.HIGH_MATCH_THRESHOLD) {
    await createNotification({
      userId: listing.ownerId._id,
      type: NOTIFICATION_TYPES.HIGH_MATCH,
      title: "High compatibility match",
      description: `${populatedInterest.tenantId.name} has a ${compatibility.score}% compatibility score for ${listing.title}.`,
      metadata: {
        interestId: interest._id,
        listingId,
        tenantId,
        score: compatibility.score,
      },
    });

    await sendEmailSafely(() =>
      sendHighCompatibilityInterestEmail({
        ownerEmail: listing.ownerId.email,
        ownerName: listing.ownerId.name,
        tenantName: populatedInterest.tenantId.name,
        listingTitle: listing.title,
        score: compatibility.score,
        explanation: compatibility.explanation,
      })
    );
  }

  return {
    interest: populatedInterest,
    compatibility,
  };
};

export const getTenantInterests = async (tenantId) => {
  return Interest.find({ tenantId }).sort({ createdAt: -1 }).populate(interestPopulate);
};

export const getOwnerInterests = async (ownerId) => {
  return Interest.find({ ownerId }).sort({ createdAt: -1 }).populate(interestPopulate);
};

export const acceptInterestRequest = async ({ ownerId, interestId }) => {
  const interest = await Interest.findById(interestId).populate(interestPopulate);

  if (!interest) {
    throw new AppError(INTEREST_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (interest.ownerId._id.toString() !== ownerId) {
    throw new AppError(LISTING_MESSAGES.OWNER_ONLY, HTTP_STATUS.FORBIDDEN);
  }

  if (interest.status !== INTEREST_STATUS.PENDING) {
    throw new AppError(INTEREST_MESSAGES.INVALID_STATUS, HTTP_STATUS.BAD_REQUEST);
  }

  interest.status = INTEREST_STATUS.ACCEPTED;
  await interest.save();

  const conversation = await Conversation.findOneAndUpdate(
    {
      tenantId: interest.tenantId._id,
      ownerId: interest.ownerId._id,
      listingId: interest.listingId._id,
    },
    {
      tenantId: interest.tenantId._id,
      ownerId: interest.ownerId._id,
      listingId: interest.listingId._id,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await sendEmailSafely(() =>
    sendInterestDecisionEmail({
      tenantEmail: interest.tenantId.email,
      tenantName: interest.tenantId.name,
      listingTitle: interest.listingId.title,
      status: INTEREST_STATUS.ACCEPTED,
    })
  );

  await createNotification({
    userId: interest.tenantId._id,
    type: NOTIFICATION_TYPES.INTEREST_ACCEPTED,
    title: "Interest accepted",
    description: `Your request for ${interest.listingId.title} was accepted.`,
    metadata: {
      interestId,
      conversationId: conversation._id,
      listingId: interest.listingId._id,
    },
  });

  return {
    interest,
    conversation,
  };
};

export const declineInterestRequest = async ({ ownerId, interestId }) => {
  const interest = await Interest.findById(interestId).populate(interestPopulate);

  if (!interest) {
    throw new AppError(INTEREST_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (interest.ownerId._id.toString() !== ownerId) {
    throw new AppError(LISTING_MESSAGES.OWNER_ONLY, HTTP_STATUS.FORBIDDEN);
  }

  if (interest.status !== INTEREST_STATUS.PENDING) {
    throw new AppError(INTEREST_MESSAGES.INVALID_STATUS, HTTP_STATUS.BAD_REQUEST);
  }

  interest.status = INTEREST_STATUS.DECLINED;
  await interest.save();

  await sendEmailSafely(() =>
    sendInterestDecisionEmail({
      tenantEmail: interest.tenantId.email,
      tenantName: interest.tenantId.name,
      listingTitle: interest.listingId.title,
      status: INTEREST_STATUS.DECLINED,
    })
  );

  await createNotification({
    userId: interest.tenantId._id,
    type: NOTIFICATION_TYPES.INTEREST_DECLINED,
    title: "Interest declined",
    description: `Your request for ${interest.listingId.title} was declined.`,
    metadata: {
      interestId,
      listingId: interest.listingId._id,
    },
  });

  return interest;
};
