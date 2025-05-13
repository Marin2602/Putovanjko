import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { Container, Typography, Button, AppBar, Toolbar } from "@mui/material";
import ListaPutovanja from "./ListaPutovanja";
import AddPutovanje from "./AddPutovanje";
import EditPutovanje from "./EditPutovanje"
import Register from "./Register";
import Login from "./Login";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import SvaPutovanja from "./SvaPutovanja";

import HomePage from "./HomePage"; // Početna stranica ili dashboard
import MojSvijet from "./MojSvijet";
import UrediSvijet from "./UrediSvijet";



function App() {

  const [username, setUsername] = useState("");
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    } catch (err) {
      console.error("Neispravan token:", err);
      localStorage.removeItem("token");
      window.location.href = "/login"; // automatski logout ako je token loš
    }
  } else {
    console.warn("Token nije pronađen – korisnik nije prijavljen.");
  }
}, []);
  return (
    <Router>
      <Container sx={{ mt: 4 }}>
      <AppBar position="fixed" margintop="mt:10">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Putovanjko
            <img
                src="/clipart1060448.png"
                alt="Logo"
                style={{ height: "32px", marginLeft: "8px" }}
              />
          </Typography>{username && (
          <Typography sx={{ ml: 2 }}>
            Dobro došao, <strong>{username}</strong>
          </Typography>
        )}
        
        
        <Button color="inherit" component={Link} to="/sva-putovanja">Početna</Button>
          
          <Button color="inherit" component={Link} to="/">Moja putovanja</Button>

          
          <Button color="inherit" component={Link} to="/dodaj-putovanje">Dodaj novo putovanje</Button>
          <Button color="inherit" component={Link} to="/moj-svijet">Globus</Button>

          <Button
          color="inherit"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login"; // preusmjeri na login
          }}
        >
          Odjava
        </Button>
        </Toolbar>
      </AppBar>

        <Routes>
          <Route path="/" element={<ListaPutovanja />} />
          <Route path="/dodaj-putovanje" element={<AddPutovanje />} />
          <Route path="/uredi-putovanje/:id" element={<EditPutovanje />} />
          <Route path="/registracija" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/sva-putovanja" element={<SvaPutovanja />} />
          <Route path="/moj-svijet" element={<MojSvijet />} />
          <Route path="/moj-svijet/uredi" element={<UrediSvijet />} />

        </Routes>
      </Container>
    </Router>
  );
}

export default App;
