import express from "express";
import pino from "pino";
import { getPosts, createPost, deletePost, updatePost } from "./db.js";
import { sendPostCreatedEvent } from "./kafka.js";
import { sendPostEvent } from "./kafka.js";

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

// 3. PUT /api/posts/:id - Update a post
router.put("/posts/:id", async (req, res) => {
  try {
    const updatedPost = await updatePost(req.params.id, req.body);
    if (!updatedPost) return res.status(404).json({ error: "Post not found" });

    await sendPostEvent("post.updated", updatedPost);
    res.json(updatedPost);
  } catch (error) {
    log.error(error, "Error updating post");
    res.status(500).json({ error: "Failed to update post" });
  }
});

// 4. DELETE /api/posts/:id - Delete a post
router.delete("/posts/:id", async (req, res) => {
  try {
    const deletedPost = await deletePost(req.params.id);
    if (!deletedPost) return res.status(404).json({ error: "Post not found" });

    // Cette ligne fonctionnera maintenant car sendPostEvent est importé
    await sendPostEvent("post.deleted", deletedPost);
    res.json({ message: "Post deleted successfully", post: deletedPost });
  } catch (error) {
    log.error(error, "Error deleting post");
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;