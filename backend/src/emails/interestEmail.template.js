export const highCompatibilityInterestTemplate = ({
  ownerName,
  tenantName,
  listingTitle,
  score,
  explanation,
}) => `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
    <h2>High compatibility interest received</h2>
    <p>Hello ${ownerName},</p>
    <p>${tenantName} is interested in your listing: <strong>${listingTitle}</strong>.</p>
    <p><strong>Compatibility Score:</strong> ${score}%</p>
    <p>${explanation}</p>
    <p>Open RoomCompanion to accept or decline this request.</p>
  </div>
`;

export const interestDecisionTemplate = ({ tenantName, listingTitle, status }) => `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
    <h2>Your interest request was ${status.toLowerCase()}</h2>
    <p>Hello ${tenantName},</p>
    <p>Your request for <strong>${listingTitle}</strong> was ${status.toLowerCase()} by the owner.</p>
    <p>Open RoomCompanion to view the latest status.</p>
  </div>
`;

export const offlineMessageTemplate = ({ receiverName, senderName, listingTitle }) => `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
    <h2>New message on RoomCompanion</h2>
    <p>Hello ${receiverName},</p>
    <p>${senderName} sent you a new message regarding <strong>${listingTitle}</strong>.</p>
    <p>Open RoomCompanion to continue chatting.</p>
  </div>
`;
