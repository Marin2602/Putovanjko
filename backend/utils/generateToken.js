import jwt from "jsonwebtoken";

const generateToken = (id, ime, prezime, username) => {
    return jwt.sign({ id, ime, prezime, username }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  };
  
export default generateToken;
