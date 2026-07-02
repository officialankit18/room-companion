export const verificationEmailTemplate = ({ name, otp, expiresInMinutes }) => {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h2>Verify your RoomCompanion account</h2>
      <p>Hello ${name},</p>
      <p>Use the OTP below to verify your email address.</p>
      <p style="font-size:24px;font-weight:700;letter-spacing:4px">${otp}</p>
      <p>This OTP expires in ${expiresInMinutes} minutes.</p>
      <p>If you did not create this account, you can ignore this email.</p>
    </div>
  `;
};

