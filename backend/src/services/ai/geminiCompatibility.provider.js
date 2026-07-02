import { createGeminiClient } from "../../config/gemini.config.js";
import { COMPATIBILITY_SOURCE } from "../../constants/compatibility.js";

const parseJsonResponse = (text) => {
  const cleanedText = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleanedText);
  const score = Number(parsed.score);

  if (!Number.isFinite(score) || score < 0 || score > 100 || !parsed.explanation) {
    throw new Error("Invalid Gemini compatibility response");
  }

  return {
    score: Math.round(score),
    explanation: String(parsed.explanation).slice(0, 500),
    source: COMPATIBILITY_SOURCE.AI,
  };
};

const buildPrompt = ({ tenantProfile, listing }) => {
  return `
Return JSON only. Compute compatibility score from 0 to 100 based on budget, location, and move-in date.

Tenant:
${JSON.stringify({
  preferredLocation: tenantProfile.preferredLocation,
  budget: tenantProfile.budget,
  moveInDate: tenantProfile.moveInDate,
  preferredRoomType: tenantProfile.preferredRoomType,
})}

Listing:
${JSON.stringify({
  location: listing.location,
  rent: listing.rent,
  availableFrom: listing.availableFrom,
  roomType: listing.roomType,
  furnishingStatus: listing.furnishingStatus,
})}

Return exactly:
{"score":number,"explanation":"short human-readable reason"}
`;
};

export const calculateGeminiCompatibility = async ({ tenantProfile, listing }) => {
  const client = createGeminiClient();

  if (!client) {
    throw new Error("Gemini API key is not configured");
  }

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: buildPrompt({ tenantProfile, listing }),
  });

  return parseJsonResponse(response.text || "");
};

