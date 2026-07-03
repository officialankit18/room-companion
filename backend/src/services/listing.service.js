import { LISTING_PAGINATION, LISTING_STATUS } from "../constants/listing.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { LISTING_MESSAGES } from "../constants/messages.js";
import { Listing } from "../models/Listing.model.js";
import { AppError } from "../utils/AppError.js";
import { getOrCreateCompatibilityScore, deleteCompatibilityForListing } from "./compatibility.service.js";
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
      address: body.displayAddress,
      flatNumber: body.flatNumber,
      building: body.building || null,
      landmark: body.landmark || null,
      displayAddress: body.displayAddress,
      state: body.state,
      country: body.country,
      pincode: body.pincode || null,
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
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

export const getTenantMatchedListings = async ({ tenantId, query }) => {
  const data = await getListings(query);

  const listingsWithCompatibility = await Promise.all(
    data.listings.map(async (listing) => {
      const compatibility = await getOrCreateCompatibilityScore({
        tenantId,
        listingId: listing._id,
      });

      return {
        listing,
        compatibility,
      };
    })
  );

  if (query.sort === "highestCompatibility") {
    listingsWithCompatibility.sort((a, b) => b.compatibility.score - a.compatibility.score);
  }

  return {
    listings: listingsWithCompatibility,
    pagination: data.pagination,
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

  if (
    body.city ||
    body.locality ||
    body.displayAddress ||
    body.latitude !== undefined ||
    body.longitude !== undefined
  ) {
    updates.location = {
      city: body.city || listing.location.city,
      locality: body.locality || listing.location.locality,
      address: body.displayAddress ?? body.address ?? listing.location.address,
      flatNumber: body.flatNumber ?? listing.location.flatNumber,
      building: body.building ?? listing.location.building,
      landmark: body.landmark ?? listing.location.landmark,
      displayAddress: body.displayAddress ?? listing.location.displayAddress,
      state: body.state ?? listing.location.state,
      country: body.country ?? listing.location.country,
      pincode: body.pincode ?? listing.location.pincode,
      latitude:
        body.latitude !== undefined ? Number(body.latitude) : listing.location.latitude,
      longitude:
        body.longitude !== undefined ? Number(body.longitude) : listing.location.longitude,
    };
  }

  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

  const updatedListing = await Listing.findByIdAndUpdate(listingId, updates, {
    new: true,
    runValidators: true,
  });

  await deleteCompatibilityForListing(listingId);

  return updatedListing;
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
