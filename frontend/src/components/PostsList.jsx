import React from "react";

export default function PostsList({ posts, loading }) {
  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (posts.length === 0) {
    return <p>No posts yet. Create your first post!</p>;
  }

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
          <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>{post.title}</h3>
          <p style={{ margin: "0 0 8px 0", color: "#666" }}>{post.body}</p>
          <small style={{ color: "#999" }}>
            Created at: {new Date(post.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}