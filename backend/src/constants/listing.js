export const LISTING_STATUS = {
  ACTIVE: "ACTIVE",
  FILLED: "FILLED",
  INACTIVE: "INACTIVE",
};

export const ROOM_TYPES = {
  PRIVATE_ROOM: "Private Room",
  SHARED_ROOM: "Shared Room",
  ENTIRE_FLAT: "Entire Flat",
};

export const FURNISHING_STATUS = {
  FULLY_FURNISHED: "Fully Furnished",
  SEMI_FURNISHED: "Semi Furnished",
  UNFURNISHED: "Unfurnished",
};

export const LISTING_IMAGE_LIMITS = {
  MIN_COUNT: 1,
  MAX_COUNT: 5,
  MAX_SIZE_BYTES: 2 * 1024 * 1024,
};

export const LISTING_PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
};

export const LISTING_STATUS_VALUES = Object.values(LISTING_STATUS);
export const ROOM_TYPE_VALUES = Object.values(ROOM_TYPES);
export const FURNISHING_STATUS_VALUES = Object.values(FURNISHING_STATUS);

