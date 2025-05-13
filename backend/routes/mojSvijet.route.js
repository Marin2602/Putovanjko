import express from "express";
import MojSvijet from "../models/mojSvijet.model.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Dohvati države korisnika
router.get("/", protect, async (req, res) => {
    try {
      const zapis = await MojSvijet.findOne({ user: req.user._id });
  
      if (!zapis || zapis.drzave.length === 0) {
        return res.status(200).json({
          drzave: [],
          poruka: "Nemate još posjećenih država.",
        });
      }
  
      res.json({ drzave: zapis.drzave });
    } catch (err) {
      console.error("Greška kod dohvaćanja država:", err);
      res.status(500).json({ poruka: "Greška na serveru" });
    }
  });

// 🔸 Spremi/uredi države korisnika
router.put("/", protect, async (req, res) => {
  const { drzave } = req.body;

  if (!Array.isArray(drzave)) {
    return res.status(400).json({ poruka: "Nije poslan ispravan popis država." });
  }

  try {
    const update = await MojSvijet.findOneAndUpdate(
      { user: req.user._id },
      { drzave },
      { new: true, upsert: true } // kreira novi ako ne postoji
    );

    res.json(update);
  } catch (err) {
    console.error("Greška kod spremanja država:", err);
    res.status(500).json({ poruka: "Greška na serveru" });
  }
});

export default router;
