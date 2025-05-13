import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";  // koristimo funkciju za generiranje tokena

const router = express.Router();

// Registracija
router.post("/register", async (req, res) => {
  try {
    const { username, lozinka, ponovljenaLozinka, ime, prezime, godine, drzava } = req.body;

    // Provjera jesu li sve vrijednosti unesene
    if (!username || !lozinka || !ponovljenaLozinka || !ime || !prezime || !godine || !drzava) {
      return res.status(400).json({ message: "Sva polja su obavezna." });
    }

    // Provjera lozinki
    if (lozinka !== ponovljenaLozinka) {
      return res.status(400).json({ message: "Lozinke se ne podudaraju." });
    }

    // Provjera postoji li već korisnik
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Korisničko ime je zauzeto." });
    }

    // Hashiranje lozinke
    const hashedPassword = await bcrypt.hash(lozinka, 10);

    // Spremanje korisnika
    const newUser = new User({
      username,
      lozinka: hashedPassword,
      ime,
      prezime,
      godine,
      drzava
    });

    await newUser.save();

    res.status(201).json({ message: "Registracija uspješna." });
  } catch (err) {
    console.error("Greška kod registracije:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, lozinka } = req.body;

  // Provjera unosa korisničkog imena i lozinke
  if (!username || !lozinka) {
    return res.status(400).json({ message: "Unesi korisničko ime i lozinku." });
  }

  try {
    // Provjera postoji li korisnik u bazi
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Neispravni podaci." });
    }

    // Provjera lozinke
    const isMatch = await bcrypt.compare(lozinka, user.lozinka);
    if (!isMatch) {
      return res.status(401).json({ message: "Neispravni podaci." });
    }

    // Generiranje tokena
    const token = generateToken(user._id, user.ime, user.prezime, user.username);

    // Odgovor s tokenom
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Greška kod login:", err);
    res.status(500).json({ message: "Greška na serveru." });
  }
});






export default router;
