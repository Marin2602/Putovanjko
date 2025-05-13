import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api//login`, {
        username,
        lozinka,
      });

      // Spremi token u localStorage (ili sesiju)
      localStorage.setItem("token", response.data.token);
      window.location.href = "/";
      // Preusmjeri korisnika na početnu stranicu
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Došlo je do greške.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto" }}>
      <Typography variant="h5" gutterBottom>Prijava</Typography>
      <form onSubmit={handleLogin}>
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
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Prijavi se
        </Button>
        <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate("/registracija")}
              >
                Registriraj se
              </Button>
      </form>
    </Box>
  );
};

export default Login;
