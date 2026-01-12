import pkg from "pg";
import { configDotenv } from "dotenv";
const { Pool } = pkg;

configDotenv();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


export async function query(text, params) {
  return pool.query(text, params);
}
