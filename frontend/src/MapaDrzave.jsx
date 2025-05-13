import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

function FitBounds({ geoFeature }) {
  const map = useMap();

  useEffect(() => {
    if (geoFeature) {
      const layer = new L.GeoJSON(geoFeature);
      map.fitBounds(layer.getBounds());
    }
  }, [geoFeature, map]);

  return null;
}

export default function MapaDrzave({ drzava }) {
  const [worldData, setWorldData] = useState(null);
  const [geoFeature, setGeoFeature] = useState(null);

  useEffect(() => {
    fetch("/countries.geojson")
      .then((res) => res.json())
      .then((data) => setWorldData(data))
      .catch((err) => console.error("Greška kod učitavanja geojson:", err));
  }, []);

  useEffect(() => {
    if (!drzava || !worldData) return;

    const feature = worldData.features.find((f) => {
      const name = f?.properties?.name;
      return (
        typeof name === "string" &&
        name.trim().toLowerCase() === drzava.trim().toLowerCase()
      );
    });

    if (feature) {
      setGeoFeature(feature);
    } else {
      console.warn("❗ Država nije pronađena:", drzava);
    }
  }, [drzava, worldData]);

  if (!geoFeature) return null;

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "200px", width: "100%", marginTop: "10px" }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON
        data={geoFeature}
        style={{
          fillColor: "rgba(0, 123, 255, 0.4)",
          color: "#007bff",
          weight: 1,
        }}
      />
      <FitBounds geoFeature={geoFeature} />
    </MapContainer>
  );
}
