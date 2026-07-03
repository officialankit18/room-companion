import { z } from "zod";

const requiredCoordinate = (label, min, max) =>
  z.preprocess(
    (value) => (value === "" || value === null || value === undefined ? Number.NaN : Number(value)),
    z
      .number({ error: `Valid ${label} is required` })
      .min(min, `Valid ${label} is required`)
      .max(max, `Valid ${label} is required`)
  );

export const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  city: z.string().min(1, "City is required"),
  locality: z.string().min(1, "Locality is required"),
  flatNumber: z.string().min(1, "Flat or house number is required"),
  building: z.string().optional(),
  landmark: z.string().optional(),
  displayAddress: z.string().min(1, "Select a valid property location"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  pincode: z.string().optional(),
  latitude: requiredCoordinate("latitude", -90, 90),
  longitude: requiredCoordinate("longitude", -180, 180),
  rent: z.coerce.number().min(1, "Rent is required"),
  availableFrom: z.string().min(1, "Available date is required"),
  roomType: z.enum(["Private Room", "Shared Room", "Entire Flat"]),
  furnishingStatus: z.enum(["Fully Furnished", "Semi Furnished", "Unfurnished"]),
});
