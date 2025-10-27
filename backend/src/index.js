import express from "express";
import pino from "pino";
import dotenv from "dotenv";
import { connectPg } from "./db.js";
import { kafkaProducer, initKafka } from "./kafka.js";

dotenv.config();
const app = express();
const log = pino({ transport: { target: "pino-pretty" } });

app.use(express.json());
app.get("/healthz", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await connectPg();
    await initKafka();
    app.listen(PORT, () => log.info(`Backend listening on :${PORT}`));

    // graceful shutdown
    const shutdown = async () => {
      log.info("Shutting down...");
      try { await kafkaProducer.disconnect(); } catch {}
      process.exit(0);
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (err) {
    log.error(err, "Startup failed");
    process.exit(1);
  }
})();
