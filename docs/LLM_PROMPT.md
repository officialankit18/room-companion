# LLM Compatibility Prompt

Provider: Gemini 2.5 Flash

The backend sends structured tenant and listing data, then asks Gemini to return JSON only.

```text
Return JSON only. Compute compatibility score from 0 to 100 based on budget, location, and move-in date.

Tenant:
{
  "preferredLocation": { "city": "Noida", "locality": "Sector 62" },
  "budget": { "min": 8000, "max": 12000 },
  "moveInDate": "2026-07-15",
  "preferredRoomType": "Private Room"
}

Listing:
{
  "location": { "city": "Noida", "locality": "Sector 62" },
  "rent": 9500,
  "availableFrom": "2026-07-10",
  "roomType": "Private Room",
  "furnishingStatus": "Fully Furnished"
}

Return exactly:
{"score":number,"explanation":"short human-readable reason"}
```

Example output:

```json
{
  "score": 94,
  "explanation": "Excellent location match and the rent is within the tenant's preferred budget."
}
```

If Gemini fails, the backend uses rule-based fallback:

- Location: 50%
- Budget: 40%
- Move-in date: 10%

