import { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { Box, Button, Checkbox, FormControlLabel, Typography } from "@mui/material";

export default function UrediSvijet() {
  const [sveDrzave, setSveDrzave] = useState([]);
  const [oznacene, setOznacene] = useState([]);
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
    const ucitajDrzave = async () => {
      try {
        const res = await fetch("/drzave.json");
        const data = await res.json();
        setSveDrzave(data);
      } catch (err) {
        console.error("Greška kod učitavanja država:", err);
      }    
    };

    const dohvatOznacenih = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/moj-svijet", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOznacene(res.data.drzave || []);
      } catch (err) {
        console.error("Greška kod dohvaćanja označenih država:", err);
      }
    };

    ucitajDrzave();
    dohvatOznacenih();
  }, []);

  const handleToggle = (drzava) => {
    setOznacene((prev) =>
      prev.includes(drzava)
        ? prev.filter((d) => d !== drzava)
        : [...prev, drzava]
    );
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/moj-svijet",
        { drzave: oznacene },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/moj-svijet");
    } catch (err) {
      console.error("Greška kod spremanja država:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Uredi države 🌍
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
  {sveDrzave.map((drzava, i) => (
    <Box key={i} sx={{ width: "200px" }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={oznacene.includes(drzava)}
            onChange={() => handleToggle(drzava)}
          />
        }
        label={drzava}
      />
    </Box>
  ))}
</Box>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={handleSubmit}
      >
        Spremi
      </Button>
    </Box>
  );
}
