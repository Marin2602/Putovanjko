import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [ponovljenaLozinka, setPonovljenaLozinka] = useState("");
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [godine, setGodine] = useState("");
  const [drzava, setDrzava] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      // Provjera je li lozinka i ponovljena lozinka iste
      if (lozinka !== ponovljenaLozinka) {
        return setError("Lozinke se ne podudaraju.");
      }

      const response = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        lozinka,
        ponovljenaLozinka,
        ime,
        prezime,
        godine,
        drzava,
      });

      console.log(response.data);
      navigate("/login"); // Nakon uspješne registracije, preusmjeri na login
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Došlo je do greške.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto" }}>
      <Typography variant="h5" gutterBottom>Registracija</Typography>
      <form onSubmit={handleRegister}>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          fullWidth
          label="Korisničko ime"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Lozinka"
          type="password"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Ponovljena lozinka"
          type="password"
          value={ponovljenaLozinka}
          onChange={(e) => setPonovljenaLozinka(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Ime"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Prezime"
          value={prezime}
          onChange={(e) => setPrezime(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Godine"
          value={godine}
          onChange={(e) => setGodine(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Država"
          value={drzava}
          onChange={(e) => setDrzava(e.target.value)}
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Registriraj se
        </Button>
      </form>
    </Box>
  );
};

export default Register;
