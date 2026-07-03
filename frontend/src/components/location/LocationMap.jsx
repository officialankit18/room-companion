import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 17, { duration: 0.6 });
  }, [map, position]);

  return null;
}

function MapClickHandler({ onPositionChange }) {
  useMapEvents({
    click(event) {
      onPositionChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

export function LocationMap({ latitude, longitude, onPositionChange }) {
  const markerRef = useRef(null);
  const position = useMemo(() => [latitude, longitude], [latitude, longitude]);
  const markerEvents = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (!marker) return;
        const nextPosition = marker.getLatLng();
        onPositionChange({
          latitude: nextPosition.lat,
          longitude: nextPosition.lng,
        });
      },
    }),
    [onPositionChange]
  );

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
      <MapContainer
        center={position}
        className="h-[320px] w-full sm:h-[380px]"
        scrollWheelZoom
        zoom={17}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          ref={markerRef}
          draggable
          eventHandlers={markerEvents}
          position={position}
          title="Drag to adjust property location"
        />
        <MapClickHandler onPositionChange={onPositionChange} />
        <RecenterMap position={position} />
      </MapContainer>
    </div>
  );
}
