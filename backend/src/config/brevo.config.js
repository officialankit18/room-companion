import SibApiV3Sdk from "sib-api-v3-sdk";

const apiClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = apiClient.authentications["api-key"];

if (process.env.BREVO_API_KEY) {
  apiKey.apiKey = process.env.BREVO_API_KEY;
}

export const brevoEmailClient = new SibApiV3Sdk.TransactionalEmailsApi();

export const brevoSender = {
  email: process.env.BREVO_SENDER_EMAIL,
  name: process.env.BREVO_SENDER_NAME || "RoomCompanion",
};

