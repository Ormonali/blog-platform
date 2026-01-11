import React, { useEffect, useState } from "react";
import { getPosts, createPost, updatePost, deletePost } from "./api";
import PostForm from "./components/PostForm";
import PostsList from "./components/PostsList";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await getPosts();
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(post) {
    try {
      await createPost(post);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdate(id, post) {
    try {
      await updatePost(id, post);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    try {
      await deletePost(id);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>📝 Blog Posts</h1>
      <PostForm onSubmit={handleCreate} submitLabel="Add Post" />
      <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #ddd" }} />
      <PostsList posts={posts} loading={loading} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
}
