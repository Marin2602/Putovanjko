import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button, List, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SvijetMapa from "./SvijetMapa";

export default function MojSvijet() {
  const [drzave, setDrzave] = useState([]);
  const [poruka, setPoruka] = useState("");
  const navigate = useNavigate();

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
    const fetchDrzave = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/moj-svijet", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDrzave(res.data.drzave || []);
        if (res.data.poruka) {
          setPoruka(res.data.poruka);
        }
      } catch (err) {
        console.error("Greška kod dohvaćanja država:", err);
        setPoruka("Greška pri dohvaćanju podataka.");
      }
    };

    fetchDrzave();
  }, []);

  return (
    <Box sx={{ p: 3, pt:10 }}>
      <Typography variant="h4" gutterBottom>
        Moj Svijet 🌍
        <SvijetMapa />

      </Typography>

      {poruka && (
        <Typography sx={{ mb: 2 }} color="text.secondary">
          {poruka}
        </Typography>
      )}

      {!poruka && (
        <>
          <Typography variant="h6">Posjećene države:</Typography>
          <List>
            {drzave.map((d, i) => (
              <ListItem key={i}>{d}</ListItem>
            ))}
          </List>
        </>
      )}

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => navigate("/moj-svijet/uredi")}
      >
        Uredi
      </Button>
    </Box>
  );
}
