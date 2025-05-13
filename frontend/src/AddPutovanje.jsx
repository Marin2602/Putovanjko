

import { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button, Box } from "@mui/material";


export default function AddPutovanje({ onDodano }) {

  
  const [naziv, setNaziv] = useState("");
  const [destinacija, setDestinacija] = useState("");
  const [datumOd, setDatumOd] = useState("");
  const [datumDo, setDatumDo] = useState("");
  const [biljeske, setBiljeske] = useState("");
  const [drzava, setDrzava] = useState("");

  const [validCountryNames, setValidCountryNames] = useState([]);

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
  fetch("/countries.geojson")
    .then((res) => res.json())
    .then((data) => {
      const names = data.features.map((f) => f.properties.name);
      setValidCountryNames(names);
    })
    .catch((err) => {
      console.error("Greška kod učitavanja država:", err);
    });


}, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (new Date(datumOd) > new Date(datumDo)) {
      alert("Datum od ne može biti nakon datuma do.");
      return;
    }
    if (!validCountryNames.includes(destinacija)) {
        alert("Molimo unesite ime države na engleskom jeziku (npr. 'Croatia', 'Germany').");
        return;
      }
      
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Niste prijavljeni.");
        return;
      }
      
  
      const response = await axios.post(
        "http://localhost:5000/api/putovanja",
        {
          naziv,
          destinacija,
          datumOd,
          datumDo,
          biljeske,
          drzava: destinacija,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Putovanje spremljeno:", response.data);
  
      // Resetiraj polja
      setNaziv("");
      setDestinacija("");
      setDatumOd("");
      setDatumDo("");
      setBiljeske("");
  
      if (onDodano) {
        onDodano(response.data);
      }
    } catch (err) {
      console.error("Greška kod spremanja:", err);
    }
  };
  

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
       
      <TextField
        fullWidth
        label="Naziv"
        value={naziv}
        onChange={(e) => setNaziv(e.target.value)}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Destinacija"
        value={destinacija}
        onChange={(e) => setDestinacija(e.target.value)}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Datum od"
        type="date"
        value={datumOd}
        onChange={(e) => setDatumOd(e.target.value)}
        required
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        fullWidth
        label="Datum do"
        type="date"
        value={datumDo}
        onChange={(e) => setDatumDo(e.target.value)}
        required
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        fullWidth
        label="Bilješke"
        value={biljeske}
        onChange={(e) => setBiljeske(e.target.value)}
        multiline
        rows={4}
        margin="normal"
      />
      <Button type="submit" variant="contained">
        Dodaj
      </Button>
    </Box>
  );
}
