import express from "express";
import pino from "pino";
import dotenv from "dotenv";
import cors from "cors"; 
import { kafkaProducer, initKafka } from "./kafka.js";
import postRoutes from "./postRoutes.js"; // Import API routes

dotenv.config();
const app = express();

// For readable output
const log = pino({ transport: { target: "pino-pretty" } });

app.use(express.json());
// Enable CORS to allow the frontend (localhost:3000) to connect
app.use(cors());

// --- Routes Setup ---
app.get("/healthz", (_req, res) => res.json({ ok: true }));
// Attach post routes, all under the /api prefix
app.use("/api", postRoutes);
// Get port from environment variables or default to 8080
const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await connectPg();
    await initKafka();
    app.listen(PORT, () => log.info(`Backend listening on :${PORT}`));
    // --- Graceful Shutdown ---
    const shutdown = async () => {
      log.info("Shutting down...");
      try { await kafkaProducer.disconnect(); } catch (e) { log.error(e) }
      process.exit(0);
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (err) {
    log.error(err, "Startup failed");
    process.exit(1);
  }
})();