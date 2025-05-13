const Putovanje = require('../models/putovanjeModel');

const createPutovanje = async (req, res) => {
  const { naziv, datumPocetka, datumZavrsetka, biljeske } = req.body;

  if (!naziv || !datumPocetka || !datumZavrsetka) {
    return res.status(400).json({ poruka: 'Sva polja osim bilješki su obavezna.' });
  }

  try {
    const novoPutovanje = await Putovanje.create({
      naziv,
      datumPocetka,
      datumZavrsetka,
      biljeske
    });
    res.status(201).json(novoPutovanje);
  } catch (err) {
    res.status(500).json({ poruka: err.message });
  }
};
