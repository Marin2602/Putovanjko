import express from "express";
import Putovanje from "../models/putovanje.model.js"; 
import protect from "../middleware/authMiddleware.js";
import { validCountryNames } from "../utils/validCountries.js";
const router = express.Router();

// Dohvati putovanja prijavljenog korisnika
router.get("/", protect, async (req, res) => {
  try {
    const mojaPutovanja = await Putovanje.find({ korisnik: req.user.id });
    res.json(mojaPutovanja);
  } catch (err)   {
    res.status(500).json({ poruka: "Greška pri dohvaćanju putovanja" });
  }
});
router.get("/sva", async (req, res) => {
  try {
    const putovanja = await Putovanje.find().populate("korisnik", "username");
    res.json(putovanja);
  } catch (err) {
    console.error("Greška:", err);
    res.status(500).json({ poruka: "Greška pri dohvaćanju putovanja" });
  }
});

// Dodaj novo putovanje
router.post("/", protect, async (req, res) => {
  console.log("Korisnik iz tokena:", req.user);
  const { naziv, destinacija, datumOd, datumDo, biljeske } = req.body;
  if (!validCountryNames.includes(destinacija?.trim())) {
    return res.status(400).json({ message: "Nevažeća država. Koristi engleski naziv." });
  }
  try {
    const novoPutovanje = new Putovanje({ 
      naziv, 
      destinacija, 
      datumOd, 
      datumDo, 
      biljeske,
      destinacija,
      korisnik: req.user.id
    });

    const spremljeno = await novoPutovanje.save();
    res.status(201).json(spremljeno);
  } catch (err) {
    res.status(400).json({ poruka: "Greška kod spremanja" });
  }
});

// Dohvati pojedinačno putovanje
router.get("/:id", protect, async (req, res) => {
  try {
    const putovanje = await Putovanje.findById(req.params.id);
    if (!putovanje || putovanje.korisnik.toString() !== req.user.id) {
      return res.status(403).json({ poruka: "Nemaš pristup ovom putovanju" });
    }
    res.json(putovanje);
  } catch (err) {
    res.status(404).json({ poruka: "Putovanje nije pronađeno" });
  }
});

// Ažuriraj putovanje
router.put("/:id", protect, async (req, res) => {
  try {
    const putovanje = await Putovanje.findById(req.params.id);
    if (!putovanje || putovanje.korisnik.toString() !== req.user.id) {
      return res.status(403).json({ poruka: "Nemaš dozvolu za uređivanje" });
    }

    const updated = await Putovanje.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ poruka: "Greška kod ažuriranja" });
  }
});

// Obriši putovanje
router.delete("/:id", protect, async (req, res) => {
  try {
    const putovanje = await Putovanje.findById(req.params.id);
    if (!putovanje || putovanje.korisnik.toString() !== req.user.id) {
      return res.status(403).json({ poruka: "Nemaš dozvolu za brisanje" });
    }

    await putovanje.deleteOne();
    res.json({ poruka: "Putovanje obrisano" });
  } catch (err) {
    res.status(400).json({ poruka: "Greška kod brisanja" });
  }
});

export default router;
