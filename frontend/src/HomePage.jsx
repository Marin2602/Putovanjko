import { useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [user, setUser] = useState(null);
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

    if (token) {
      // Provjeri je li token validan i postavi korisničke podatke
      // Ovdje možeš dodati provjeru tokena na backendu
      setUser({ username: "Test User" }); // Ovdje bi trebalo biti korisničko ime iz tokena
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      {user ? (
        <div>
          <Typography variant="h5">Dobrodošao, {user.username}!</Typography>
          <Button onClick={handleLogout} variant="contained">
            Odjavi se
          </Button>
        </div>
      ) : (
        <div>
          <Typography variant="h6">Molimo prijavite se.</Typography>
        </div>
      )}
    </div>
  );
};

export default HomePage;
