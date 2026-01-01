import pg from "pg";
import pino from "pino";

const log = pino({ transport: { target: "pino-pretty" } });
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function connectPg() {
  log.info("Connecting to PostgreSQL...");
  await pool.connect();
  log.info("PostgreSQL connected.");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  log.info("Database initialized.");
}

export async function getPosts() {
  const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
  return result.rows;
}

export async function createPost({ title, body }) {
  const result = await pool.query(
    "INSERT INTO posts (title, body) VALUES ($1, $2) RETURNING *",
    [title, body]
  );
  return result.rows[0];
}

// delete post by id
export async function deletePost(id) {
  const result = await pool.query ("DELETE FROM posts WHERE id = $1 RETURNING *", [id])
  return result.rows[0];
}

// Update a post by ID
export async function updatePost(id, { title, body }) {
  const result = await pool.query(
    "UPDATE posts SET title = $1, body = $2 WHERE id = $3 RETURNING *",
    [title, body, id]
  );
  return result.rows[0];
}