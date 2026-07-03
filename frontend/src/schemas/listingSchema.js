import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  city: z.string().min(1, "City is required"),
  locality: z.string().min(1, "Locality is required"),
  address: z.string().optional(),
  rent: z.coerce.number().min(1, "Rent is required"),
  availableFrom: z.string().min(1, "Available date is required"),
  roomType: z.enum(["Private Room", "Shared Room", "Entire Flat"]),
  furnishingStatus: z.enum(["Fully Furnished", "Semi Furnished", "Unfurnished"]),
});

