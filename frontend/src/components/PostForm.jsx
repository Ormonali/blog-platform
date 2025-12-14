import React, { useState } from "react";

export default function PostForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      alert("Title and body are required");
      return;
    }
    await onCreate({ title: title.trim(), body: body.trim() });
    setTitle("");
    setBody("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "20px",
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <h2>Create New Post</h2>
      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="title" style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
          }}
          required
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label htmlFor="body" style={{ display: "block", marginBottom: "4px", fontWeight: "bold" }}>
          Body
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Enter post content"
          rows={4}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
            resize: "vertical",
          }}
          required
        />
      </div>
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Add Post
      </button>
    </form>
  );
}
