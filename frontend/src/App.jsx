import React, { useEffect, useState } from "react";
import { api } from "./api";
import PostForm from "./components/PostForm";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(post) {
    await api.post("/posts", post);
    fetchPosts();
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>📝 Blog Posts</h1>
      <PostForm onCreate={handleCreate} />
      <hr />
      {loading ? (
        <p>Loading...</p>
      ) : (
        posts.map((p) => (
          <div key={p.id} style={{ borderBottom: "1px solid #ddd", marginBottom: 12, paddingBottom: 8 }}>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
            <small>{new Date(p.created_at).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}
