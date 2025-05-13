import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  lozinka: { type: String, required: true },
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
  godine: { type: Number, required: true },
  drzava: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
