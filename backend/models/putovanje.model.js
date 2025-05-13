import mongoose from "mongoose";

const putovanjeSchema = new mongoose.Schema({
  naziv: String,
  destinacija: String,
  datumOd: Date,
  datumDo: Date,
  biljeske: String,
  korisnik: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ovo mora odgovarati nazivu u user.model.js
    required: true
  }
});

const Putovanje = mongoose.model("Putovanje", putovanjeSchema);
export default Putovanje;
