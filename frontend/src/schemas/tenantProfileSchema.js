import { z } from "zod";

export const tenantProfileSchema = z.object({
  city: z.string().min(1, "City is required"),
  locality: z.string().optional(),
  minBudget: z.coerce.number().min(1000, "Minimum budget must be at least 1000"),
  maxBudget: z.coerce.number().min(1000, "Maximum budget must be at least 1000"),
  moveInDate: z.string().min(1, "Move-in date is required"),
  preferredRoomType: z.string().optional(),
}).refine((data) => data.maxBudget >= data.minBudget, {
  message: "Maximum budget must be greater than or equal to minimum budget",
  path: ["maxBudget"],
});

