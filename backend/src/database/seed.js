import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDatabase } from "../config/database.config.js";
import { FURNISHING_STATUS, LISTING_STATUS, ROOM_TYPES } from "../constants/listing.js";
import { USER_ROLES } from "../constants/roles.js";
import { CompatibilityScore } from "../models/CompatibilityScore.model.js";
import { Conversation } from "../models/Conversation.model.js";
import { EmailVerification } from "../models/EmailVerification.model.js";
import { Interest } from "../models/Interest.model.js";
import { Listing } from "../models/Listing.model.js";
import { Message } from "../models/Message.model.js";
import { Notification } from "../models/Notification.model.js";
import { TenantProfile } from "../models/TenantProfile.model.js";
import { User } from "../models/User.model.js";

dotenv.config({ quiet: true });

const cities = [
  {
    city: "Bangalore",
    localities: ["Indiranagar", "Koramangala", "Whitefield", "HSR Layout"],
    rentBase: 12000,
  },
  {
    city: "Hyderabad",
    localities: ["Gachibowli", "Hitech City", "Madhapur", "Kondapur"],
    rentBase: 10000,
  },
  {
    city: "Pune",
    localities: ["Hinjewadi", "Viman Nagar", "Kharadi", "Baner"],
    rentBase: 9000,
  },
  {
    city: "Delhi",
    localities: ["Saket", "Lajpat Nagar", "Dwarka", "Rohini"],
    rentBase: 11000,
  },
  {
    city: "Noida",
    localities: ["Sector 62", "Sector 137", "Sector 18", "Sector 76"],
    rentBase: 8500,
  },
  {
    city: "Gurgaon",
    localities: ["Cyber City", "Sector 56", "Sohna Road", "DLF Phase 3"],
    rentBase: 13000,
  },
];

const roomTypes = [ROOM_TYPES.PRIVATE_ROOM, ROOM_TYPES.SHARED_ROOM, ROOM_TYPES.ENTIRE_FLAT];
const furnishingStatuses = [
  FURNISHING_STATUS.FULLY_FURNISHED,
  FURNISHING_STATUS.SEMI_FURNISHED,
  FURNISHING_STATUS.UNFURNISHED,
];

const demoImage = (index) => ({
  url: `https://res.cloudinary.com/demo/image/upload/room-companion/listing-${index}.jpg`,
  publicId: `room-companion/listings/demo-${index}`,
});

const createUsers = async () => {
  const password = await bcrypt.hash("Password@123", 12);
  const admin = await User.create({
    name: "RoomCompanion Admin",
    email: "admin@roomcompanion.com",
    password,
    role: USER_ROLES.ADMIN,
    isVerified: true,
  });

  const owners = await User.insertMany(
    Array.from({ length: 10 }, (_, index) => ({
      name: `Demo Owner ${index + 1}`,
      email: `owner${index + 1}@roomcompanion.com`,
      password,
      role: USER_ROLES.OWNER,
      isVerified: true,
    }))
  );

  const tenants = await User.insertMany(
    Array.from({ length: 10 }, (_, index) => ({
      name: `Demo Tenant ${index + 1}`,
      email: `tenant${index + 1}@roomcompanion.com`,
      password,
      role: USER_ROLES.TENANT,
      isVerified: true,
    }))
  );

  return { admin, owners, tenants };
};

const createTenantProfiles = async (tenants) => {
  const profiles = tenants.map((tenant, index) => {
    const cityData = cities[index % cities.length];

    return {
      tenantId: tenant._id,
      preferredLocation: {
        city: cityData.city,
        locality: cityData.localities[index % cityData.localities.length],
      },
      budget: {
        min: cityData.rentBase - 2500,
        max: cityData.rentBase + 4500,
      },
      moveInDate: new Date(Date.now() + (index + 5) * 24 * 60 * 60 * 1000),
      preferredRoomType: roomTypes[index % roomTypes.length],
    };
  });

  await TenantProfile.insertMany(profiles);
};

const createListings = async (owners) => {
  const listings = [];

  for (let index = 0; index < 48; index += 1) {
    const cityData = cities[index % cities.length];
    const locality = cityData.localities[index % cityData.localities.length];
    const rent = cityData.rentBase + (index % 6) * 1200;

    listings.push({
      ownerId: owners[index % owners.length]._id,
      title: `${roomTypes[index % roomTypes.length]} in ${locality}`,
      description: `Clean and practical ${roomTypes[index % roomTypes.length].toLowerCase()} located in ${locality}, ${cityData.city}. Suitable for working professionals and students looking for a reliable rental option.`,
      location: {
        city: cityData.city,
        locality,
        address: `${locality}, ${cityData.city}`,
      },
      rent,
      availableFrom: new Date(Date.now() + (index % 12) * 24 * 60 * 60 * 1000),
      roomType: roomTypes[index % roomTypes.length],
      furnishingStatus: furnishingStatuses[index % furnishingStatuses.length],
      images: [demoImage(index + 1)],
      status: LISTING_STATUS.ACTIVE,
    });
  }

  await Listing.insertMany(listings);
};

const seedDatabase = async () => {
  await connectDatabase();

  await Promise.all([
    User.deleteMany({}),
    EmailVerification.deleteMany({}),
    TenantProfile.deleteMany({}),
    Listing.deleteMany({}),
    CompatibilityScore.deleteMany({}),
    Interest.deleteMany({}),
    Conversation.deleteMany({}),
    Message.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const { owners, tenants } = await createUsers();
  await createTenantProfiles(tenants);
  await createListings(owners);

  console.log("Seed data created successfully");
  console.log("Demo password for all users: Password@123");
  console.log("Admin: admin@roomcompanion.com");

  await mongoose.connection.close();
};

seedDatabase().catch(async (error) => {
  console.error("Seed failed", error);
  await mongoose.connection.close();
  process.exit(1);
});
