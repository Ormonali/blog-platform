import React, { useState } from "react";

export default function PostForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !body) return alert("Title and body required");
    await onCreate({ title, body });
    setTitle("");
    setBody("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={{ width: "100%", padding: 8, marginBottom: 6 }}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Body"
        rows={3}
        style={{ width: "100%", padding: 8, marginBottom: 6 }}
      />
      <button type="submit" style={{ padding: "8px 16px" }}>
        Add Post
      </button>
    </form>
  );
}
