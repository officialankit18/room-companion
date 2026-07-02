import SibApiV3Sdk from "sib-api-v3-sdk";

import { appConfig } from "../config/app.config.js";
import { brevoEmailClient, brevoSender } from "../config/brevo.config.js";
import { OTP_CONFIG } from "../constants/auth.js";
import {
  highCompatibilityInterestTemplate,
  interestDecisionTemplate,
  offlineMessageTemplate,
} from "./interestEmail.template.js";
import { verificationEmailTemplate } from "./verificationEmail.template.js";

const canSendEmail = () =>
  Boolean(process.env.BREVO_API_KEY && brevoSender.email);

export const sendVerificationEmail = async ({ email, name, otp }) => {
  if (!canSendEmail()) {
    if (appConfig.nodeEnv !== "production") {
      console.warn("Brevo credentials missing. Verification email skipped in development.");
      return;
    }

    throw new Error("Email service is not configured");
  }

  const emailPayload = new SibApiV3Sdk.SendSmtpEmail();
  emailPayload.sender = brevoSender;
  emailPayload.to = [{ email, name }];
  emailPayload.subject = "Verify your RoomCompanion account";
  emailPayload.htmlContent = verificationEmailTemplate({
    name,
    otp,
    expiresInMinutes: OTP_CONFIG.EXPIRES_IN_MINUTES,
  });

  await brevoEmailClient.sendTransacEmail(emailPayload);
};

const sendHtmlEmail = async ({ to, subject, htmlContent }) => {
  if (!canSendEmail()) {
    if (appConfig.nodeEnv !== "production") {
      console.warn("Brevo credentials missing. Email skipped in development.");
      return;
    }

    throw new Error("Email service is not configured");
  }

  const emailPayload = new SibApiV3Sdk.SendSmtpEmail();
  emailPayload.sender = brevoSender;
  emailPayload.to = [to];
  emailPayload.subject = subject;
  emailPayload.htmlContent = htmlContent;

  await brevoEmailClient.sendTransacEmail(emailPayload);
};

export const sendHighCompatibilityInterestEmail = async (payload) => {
  await sendHtmlEmail({
    to: {
      email: payload.ownerEmail,
      name: payload.ownerName,
    },
    subject: "High compatibility interest on RoomCompanion",
    htmlContent: highCompatibilityInterestTemplate(payload),
  });
};

export const sendInterestDecisionEmail = async (payload) => {
  await sendHtmlEmail({
    to: {
      email: payload.tenantEmail,
      name: payload.tenantName,
    },
    subject: `Your RoomCompanion request was ${payload.status.toLowerCase()}`,
    htmlContent: interestDecisionTemplate(payload),
  });
};

export const sendOfflineMessageEmail = async (payload) => {
  await sendHtmlEmail({
    to: {
      email: payload.receiverEmail,
      name: payload.receiverName,
    },
    subject: "New message on RoomCompanion",
    htmlContent: offlineMessageTemplate(payload),
  });
};
