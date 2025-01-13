import pkg from "pg";
import dotenv from "dotenv";

// Cargar el archivo .env
dotenv.config();

const { Pool } = pkg;

// Mostrar las variables de entorno para depuración
console.log("Variables de entorno:");
console.log("Usuario:", process.env.PGUSER);
console.log("Host:", process.env.PGHOST);
console.log("Contraseña:", process.env.PGPASSWORD || "No definida");
console.log("Base de datos:", process.env.PGDATABASE);
console.log("Puerto:", process.env.PGPORT);

export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
  allowExitOnIdle: true,
});

try {
  const result = await pool.query("SELECT NOW()");
  console.log("Database connected at:", result.rows[0].now);
} catch (error) {
  console.error("Error connecting to the database:", error.message);
}
