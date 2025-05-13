import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-lozinka"); // korisnik bez lozinke
      next();
    } catch (error) {
      console.error("Neispravan token:", error);
      return res.status(401).json({ message: "Neautoriziran pristup." });
    }
  } else {
    return res.status(401).json({ message: "Token nije dostavljen." });
  }
};

export default protect;
