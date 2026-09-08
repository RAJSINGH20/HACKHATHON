import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the dummy Aadhaar dataset
const dataPath = path.join(__dirname, "..", "data", "aadhaarRecords.json");

/**
 * Loads the Aadhaar records from the JSON file.
 * In a real app this would be replaced by a DB query.
 */
const loadAadharRecords = () => {
  const rawData = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(rawData);
};

/**
 * Checks whether an Aadhaar record exists for the given phone number.
 * @param {string} phone - 10-digit mobile number
 * @returns {object|null} matching record or null if not found
 */
const findAadharByPhone = (phone) => {
  const records = loadAadharRecords();
  const match = records.find((record) => record.mobile_number === phone);
  return match || null;
};

export default { findAadharByPhone };