import React, { useState, useEffect } from "react";

export default function PostForm({ initialPost = null, onSubmit, onCancel, submitLabel = "Save" }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || "");
      setBody(initialPost.body || "");
    } else {
      setTitle("");
      setBody("");
    }
  }, [initialPost]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      alert("Title and body are required");
      return;
    }
    if (onSubmit) {
      await onSubmit({ title: title.trim(), body: body.trim() });
    }
    // Clear only when creating new post (no initialPost)
    if (!initialPost) {
      setTitle("");
      setBody("");
    }
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
      <h2>{initialPost ? "Edit Post" : "Create New Post"}</h2>
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
      <div style={{ display: "flex", gap: "8px" }}>
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
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
