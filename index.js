import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "./database/connection.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

import bcrypt from "bcrypt";

app.post("/usuarios", async (req, res) => {
  const { email, password, rol, lenguage } = req.body;

  if (!email || !password || !rol || !lenguage) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar el usuario en la base de datos
    const result = await pool.query(
      "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, hashedPassword, rol, lenguage]
    );

    res.status(201).json({
      message: "Usuario registrado con éxito.",
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña son obligatorios." });
  }

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const user = result.rows[0];

    // Comparar contraseñas encriptadas
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, message: "Inicio de sesión exitoso." });
  } catch (error) {
    console.error("Error en /login:", error.message);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});


app.get("/usuarios", async (req, res) => {
  const authHeader = req.headers["authorization"];

  // Verificar si el token está presente
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Token no proporcionado o inválido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener el email del payload
    const { email } = decoded;

    // Consultar al usuario en la base de datos
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Devolver los datos del usuario
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
});

app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  if (req.method !== "GET") {
    console.log("Body:", req.body);
  }
  next();
});



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
