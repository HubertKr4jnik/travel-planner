"use client";
import leaflet from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import markerIconx2 from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconx2,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Map({ places }) {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={1}
      scrollWheelZoom={true}
      className="h-140 w-full mt-4 rounded"
    >
      <TileLayer
        attribution="&copy; <a href='https://openstreetmap.org'>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Object.entries(places).map(([timestamp, place]) => {
        if (place.lat !== undefined && place.lon !== undefined) {
          return (
            <Marker key={timestamp} position={[place.lat, place.lon]}>
              <Popup>{place.name}</Popup>
            </Marker>
          );
        }
      })}
    </MapContainer>
  );
}
