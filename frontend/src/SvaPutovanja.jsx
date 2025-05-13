import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent, Stack } from "@mui/material";
import MapaDrzave from "./MapaDrzave";

export default function SvaPutovanja() {
  const [putovanja, setPutovanja] = useState([]);

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
    const fetchPutovanja = async () => {
      const res = await axios.get("http://localhost:5000/api/putovanja/sva");
      setPutovanja(res.data);
    };
    fetchPutovanja();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Sva putovanja korisnika</Typography>
      <Stack spacing={2}>
        {putovanja.map((p) => (
          <Card key={p._id}>
            <CardContent>
            <MapaDrzave drzava={p.destinacija} />

              <Typography variant="h6">{p.naziv}</Typography>
              <Typography>{p.destinacija}</Typography>
              <Typography>
                {new Date(p.datumOd).toLocaleDateString()} - {new Date(p.datumDo).toLocaleDateString()}
              </Typography>
              <Typography>{p.biljeske}</Typography>
              <Typography color="text.secondary">
                Objavio: {p.korisnik?.username}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
