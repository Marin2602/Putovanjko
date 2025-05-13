import fs from "fs";
import path from "path";

const geojsonPath = path.resolve("../frontend/public/countries.geojson");
const rawData = fs.readFileSync(geojsonPath, "utf8");
const geoData = JSON.parse(rawData);

export const validCountryNames = geoData.features
  .map((f) => f.properties?.name?.trim())
  .filter(Boolean);
