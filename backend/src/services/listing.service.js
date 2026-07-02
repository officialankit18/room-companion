import { LISTING_PAGINATION, LISTING_STATUS } from "../constants/listing.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { LISTING_MESSAGES } from "../constants/messages.js";
import { Listing } from "../models/Listing.model.js";
import { AppError } from "../utils/AppError.js";
import { uploadMultipleImages } from "./cloudinary.service.js";

const buildListingFilters = (query) => {
  const filters = { status: LISTING_STATUS.ACTIVE };

  if (query.city) {
    filters["location.city"] = { $regex: query.city, $options: "i" };
  }

  if (query.locality) {
    filters["location.locality"] = { $regex: query.locality, $options: "i" };
  }

  if (query.roomType) {
    filters.roomType = query.roomType;
  }

  if (query.furnishingStatus) {
    filters.furnishingStatus = query.furnishingStatus;
  }

  if (query.minRent || query.maxRent) {
    filters.rent = {};
    if (query.minRent) filters.rent.$gte = Number(query.minRent);
    if (query.maxRent) filters.rent.$lte = Number(query.maxRent);
  }

  if (query.availableFrom) {
    filters.availableFrom = { $lte: new Date(query.availableFrom) };
  }

  return filters;
};

const buildSort = (sort) => {
  const sortMap = {
    newest: { createdAt: -1 },
    lowestRent: { rent: 1 },
    highestRent: { rent: -1 },
  };

  return sortMap[sort] || sortMap.newest;
};

const assertListingOwner = (listing, ownerId) => {
  if (listing.ownerId.toString() !== ownerId) {
    throw new AppError(LISTING_MESSAGES.OWNER_ONLY, HTTP_STATUS.FORBIDDEN);
  }
};

export const createListing = async ({ ownerId, body, files }) => {
  if (!files?.length) {
    throw new AppError(LISTING_MESSAGES.IMAGES_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }

  const images = await uploadMultipleImages(files);

  return Listing.create({
    ownerId,
    title: body.title,
    description: body.description,
    location: {
      city: body.city,
      locality: body.locality,
      address: body.address || null,
    },
    rent: Number(body.rent),
    availableFrom: body.availableFrom,
    roomType: body.roomType,
    furnishingStatus: body.furnishingStatus,
    images,
  });
};

export const getListings = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(
    Number(query.limit) || LISTING_PAGINATION.DEFAULT_LIMIT,
    LISTING_PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;
  const filters = buildListingFilters(query);
  const sort = buildSort(query.sort);

  const [listings, total] = await Promise.all([
    Listing.find(filters)
      .select("-__v")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("ownerId", "name email profileImage"),
    Listing.countDocuments(filters),
  ]);

  return {
    listings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getListingById = async (listingId) => {
  const listing = await Listing.findById(listingId).populate("ownerId", "name email profileImage");

  if (!listing || listing.status === LISTING_STATUS.INACTIVE) {
    throw new AppError(LISTING_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return listing;
};

export const updateListing = async ({ listingId, ownerId, body }) => {
  const listing = await Listing.findById(listingId);

  if (!listing || listing.status === LISTING_STATUS.INACTIVE) {
    throw new AppError(LISTING_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  assertListingOwner(listing, ownerId);

  const updates = {
    title: body.title,
    description: body.description,
    rent: body.rent,
    availableFrom: body.availableFrom,
    roomType: body.roomType,
    furnishingStatus: body.furnishingStatus,
  };

  if (body.city || body.locality || body.address) {
    updates.location = {
      city: body.city || listing.location.city,
      locality: body.locality || listing.location.locality,
      address: body.address ?? listing.location.address,
    };
  }

  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

  return Listing.findByIdAndUpdate(listingId, updates, {
    new: true,
    runValidators: true,
  });
};

export const markListingFilled = async ({ listingId, ownerId }) => {
  const listing = await Listing.findById(listingId);

  if (!listing || listing.status === LISTING_STATUS.INACTIVE) {
    throw new AppError(LISTING_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  assertListingOwner(listing, ownerId);
  listing.status = LISTING_STATUS.FILLED;
  await listing.save();

  return listing;
};

export const removeListing = async ({ listingId, ownerId }) => {
  const listing = await Listing.findById(listingId);

  if (!listing || listing.status === LISTING_STATUS.INACTIVE) {
    throw new AppError(LISTING_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  assertListingOwner(listing, ownerId);
  listing.status = LISTING_STATUS.INACTIVE;
  await listing.save();

  return listing;
};

