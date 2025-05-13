import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { LinearProgress, Typography } from "@mui/material";


export default function SvijetMapa() {
  const [geoData, setGeoData] = useState(null);
  const [posjecene, setPosjecene] = useState([]);
  const [praveDrzave, setPraveDrzave] = useState([]); // iz drzave.json


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return;
      }
    
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      const ucitajDrzave = async () => {
        try {
          const res = await fetch("/drzave.json");
          const data = await res.json();
          setPraveDrzave(data); // 195 država
        } catch (err) {
          console.error("Greška kod učitavanja drzave.json:", err);
        }
      };
    
    const ucitajGeoJSON = async () => {
      const res = await fetch("/countries.geojson");
      const data = await res.json();
      setGeoData(data);
    };

    const ucitajPosjecene = async () => {
      
      const res = await axios.get("http://localhost:5000/api/moj-svijet", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosjecene(res.data.drzave || []);
    };
    ucitajDrzave();
    ucitajGeoJSON();
    ucitajPosjecene();
  }, []);

  const styleFeature = (feature) => {
    const naziv = (feature.properties.name || "").toLowerCase();
    const jeBio = posjecene.map((d) => d.toLowerCase()).includes(naziv);
  
    return {
      fillColor: jeBio ? "#4caf50" : "#e0e0e0",
      weight: 1,
      color: "black",
      fillOpacity: jeBio ? 0.8 : 0.2,
    };
  };
  

  if (!geoData) return <p>Učitavanje mape...</p>;

  return (
    <>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "400px", width: "100%" }}
        worldCopyJump={true}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        <GeoJSON data={geoData} style={styleFeature} />
      </MapContainer>
  
      {praveDrzave.length > 0 && (
  <Typography sx={{ mt: 3 }}>
    <strong>Statistika:</strong> {posjecene.length} od {praveDrzave.length} država posjećeno (
    {((posjecene.length / praveDrzave.length) * 100).toFixed(2)}%)
  </Typography>


)}
    <LinearProgress variant="determinate" value={(posjecene.length / praveDrzave.length) * 100} sx={{ mt: 2 }} />


    </>
  );
}
