import mongoose from "mongoose";

const mojSvijetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // po 1 zapis po korisniku
  },
  drzave: {
    type: [String], // array stringova (npr. ["France", "Germany"])
    default: [],
  },
});

const MojSvijet = mongoose.model("MojSvijet", mojSvijetSchema);
export default MojSvijet;