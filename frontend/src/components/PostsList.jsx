import React, { useState } from "react";
import PostForm from "./PostForm";

export default function PostsList({ posts, loading, onUpdate, onDelete }) {
  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (posts.length === 0) {
    return <p>No posts yet. Create your first post!</p>;
  }
  const [editingId, setEditingId] = useState(null);

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "12px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {editingId === post.id ? (
            <PostForm
              initialPost={post}
              submitLabel="Update"
              onSubmit={async (data) => {
                if (onUpdate) await onUpdate(post.id, data);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>{post.title}</h3>
              <p style={{ margin: "0 0 8px 0", color: "#666" }}>{post.body}</p>
              <small style={{ color: "#999" }}>
                Created at: {new Date(post.created_at).toLocaleString()}
              </small>
              <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setEditingId(post.id)}
                  style={{ padding: "6px 10px", cursor: "pointer" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Delete this post?")) {
                      if (onDelete) onDelete(post.id);
                    }
                  }}
                  style={{ padding: "6px 10px", cursor: "pointer", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px" }}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}