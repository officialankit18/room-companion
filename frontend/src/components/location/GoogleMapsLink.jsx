import { ExternalLink, MapPinned } from "lucide-react";

import { Button } from "../ui";

const buildGoogleMapsUrl = (location) => {
  const destination =
    Number.isFinite(location?.latitude) && Number.isFinite(location?.longitude)
      ? `${location.latitude},${location.longitude}`
      : location?.displayAddress || location?.address;

  if (!destination) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
};

export function GoogleMapsLink({ location, className = "" }) {
  const href = buildGoogleMapsUrl(location);
  if (!href) return null;

  return (
    <Button
      as="a"
      className={className}
      href={href}
      rel="noreferrer"
      size="sm"
      target="_blank"
      variant="secondary"
    >
      <MapPinned size={16} />
      Open in Google Maps
      <ExternalLink size={14} />
    </Button>
  );
}
