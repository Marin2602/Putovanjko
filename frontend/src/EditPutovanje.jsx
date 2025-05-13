import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import countries from "/countries.geojson";


export default function EditPutovanje() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [putovanje, setPutovanje] = useState({
    naziv: "",
    destinacija: "",
    datumOd: "",
    datumDo: "",
    biljeske: "",
  });
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
    const loadCountries = async () => {
      try {
        const res = await fetch("/countries.geojson");
        const data = await res.json();
        const names = data.features.map((f) => f.properties.ADMIN);
        setValidCountryNames(names);
      } catch (err) {
        console.error("Greška kod učitavanja država:", err);
      }
    };
  
    loadCountries();
  }, []);

  useEffect(() => {
    const fetchPutovanje = async () => {
        

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`http://localhost:5000/api/putovanja/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        const data = res.data;

        setPutovanje({
          naziv: data.naziv || "",
          destinacija: data.destinacija || "",
          datumOd: data.datumOd?.substring(0, 10) || "",
          datumDo: data.datumDo?.substring(0, 10) || "",
          biljeske: data.biljeske || "",
        });
      } catch (err) {
        console.error("Greška kod dohvaćanja putovanja:", err);
      }
    };

    fetchPutovanje();
  }, [id]);

  const handleChange = (e) => {
    setPutovanje({ ...putovanje, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
  
      await axios.put(
        `http://localhost:5000/api/putovanja/${id}`,
        putovanje,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      navigate("/");
    } catch (err) {
      console.error("Greška kod spremanja promjena:", err);
    }
  };
  

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Uredi Putovanje</Typography>

      <TextField
        fullWidth
        label="Naziv"
        name="naziv"
        value={putovanje.naziv}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Destinacija"
        name="destinacija"
        value={putovanje.destinacija}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Datum od"
        name="datumOd"
        type="date"
        value={putovanje.datumOd}
        onChange={handleChange}
        required
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        label="Datum do"
        name="datumDo"
        type="date"
        value={putovanje.datumDo}
        onChange={handleChange}
        required
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        fullWidth
        label="Bilješke"
        name="biljeske"
        value={putovanje.biljeske}
        onChange={handleChange}
        multiline
        rows={4}
        margin="normal"
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Spremi promjene
      </Button>
    </Box>
  );
}
