// server.js
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import express from "express";
import cors from "cors";
import { createConnection } from "mysql2/promise";
import config from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


const db = await createConnection(config);

export default app;
