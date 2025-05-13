import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MapaDrzave from "./MapaDrzave";

export default function ListaPutovanja() {
  const [putovanja, setPutovanja] = useState([]);
  const navigate = useNavigate();

  const fetchPutovanja = async () => {
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
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.warn("Token nije pronađen – korisnik nije prijavljen.");
        return;
      }
  
      const response = await axios.get("http://localhost:5000/api/putovanja", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setPutovanja(response.data);
    } catch (err) {
      console.error("Greška kod dohvaćanja:", err);
    }
  };
  

  useEffect(() => {
    fetchPutovanja();
  }, []);

  const obrisiPutovanje = async (id) => {
    const potvrda = window.confirm("Jesi siguran da želiš obrisati putovanje?");
    if (!potvrda) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Niste prijavljeni.");
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/api/putovanja/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setPutovanja(putovanja.filter(p => p._id !== id));
    } catch (err) {
      console.error("Greška kod brisanja:", err);
    }
  };
  

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Popis putovanja</Typography>
      <Stack spacing={2}>
        {putovanja.length === 0 ? (
          <Typography>Nema unesenih putovanja.</Typography>
        ) : (
          putovanja.map((putovanje) => (
            <Card key={putovanje._id}>
              <CardContent>
                
              <MapaDrzave drzava={putovanje.destinacija} />
                <Typography variant="h6">{putovanje.naziv}</Typography>
                <Typography>{putovanje.destinacija}</Typography>
                <Typography>
                  {new Date(putovanje.datumOd).toLocaleDateString()} - {new Date(putovanje.datumDo).toLocaleDateString()}
                </Typography>
                <Typography>{putovanje.biljeske}</Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(`/uredi-putovanje/${putovanje._id}`)}
                    >
                    Uredi
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => obrisiPutovanje(putovanje._id)}
                  >
                    Obriši
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
}
