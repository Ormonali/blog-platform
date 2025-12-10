import express from "express";
import pino from "pino";
import { getPosts, createPost } from "./db.js";
import { sendPostCreatedEvent } from "./kafka.js";

const router = express.Router();
const log = pino({ transport: { target: "pino-pretty" } });

// 1. GET /api/posts - Récupère tous les posts
router.get("/posts", async (_req, res) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (error) {
    log.error(error, "Error fetching posts");
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// 2. POST /api/posts - Crée un nouveau post et envoie un événement Kafka
router.post("/posts", async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: "Title and body are required" });
  }

  try {
    // Étape 1: Créer le post dans PostgreSQL
    const newPost = await createPost({ title, body });
    
    // Étape 2: Envoyer un événement Kafka (pour les futurs microservices)
    await sendPostCreatedEvent(newPost);
    
    // Étape 3: Retourner le nouveau post au frontend
    res.status(201).json(newPost);
  } catch (error) {
    log.error(error, "Error creating post");
    res.status(500).json({ error: "Failed to create post" });
  }
});

export default router;