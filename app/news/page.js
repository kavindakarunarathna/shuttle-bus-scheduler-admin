"use client";

import { useState, useEffect } from "react";
import "./news.module.css";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); // Tracks the ID of the news being edited
  const [createForm, setCreateForm] = useState({ title: "", content: "" });
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      });
  }, []);

  const handleRefresh = () => {
    window.location.reload(); // Reloads the current page
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        const newNews = await res.json();
        setNews([newNews, ...news]);
        setCreateForm({ title: "", content: "" });
        handleRefresh()
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditForm({ title: item.title, content: item.content });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updatedNews = await res.json();
        setNews((prevNews) =>
          prevNews.map((item) => (item._id === id ? updatedNews : item))
        );
        setEditingId(null);
        handleRefresh()
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNews((prevNews) => prevNews.filter((item) => item._id !== id));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="news-container" style={{ margin: 120 }}>
      {/* Creation Form */}
      <Card style={{ borderLeftWidth: 0 }}>
        <CardHeader>
          <CardTitle>Add News</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSubmit} className="news-form">
            <Input
              type="text"
              placeholder="News Title"
              value={createForm.title}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, title: e.target.value })
              }
              required
            />
            <Textarea
              placeholder="News Content"
              value={createForm.content}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, content: e.target.value })
              }
              required
            />
            <Button
              type="submit"
              style={{ marginTop: 10 }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Add News"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* News List */}
      <div className="news-list">
        {loading ? (
          <Card>
            <CardContent className="loading-state">Loading news...</CardContent>
          </Card>
        ) : news.length === 0 ? (
          <Card>
            <CardContent className="empty-state">
              No news articles yet
            </CardContent>
          </Card>
        ) : (
          news.map((item, index) => (
            <Card key={index} className="news-item">
              {editingId === item._id ? (
                // Edit Form
                <form
                  onSubmit={(e) => handleEditSubmit(e, item._id)}
                  className="edit-form"
                >
                  <CardHeader>
                    <CardTitle>Edit News</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="text"
                      placeholder="News Title"
                      value={editForm.title}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      required
                    />
                    <Textarea
                      placeholder="News Content"
                      value={editForm.content}
                      onChange={(e) =>
                        setEditForm({ ...editForm, content: e.target.value })
                      }
                      required
                    />
                    <div className="action-buttons" style={{ marginTop: 10 }}>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setEditingId(null)}
                        style={{ marginLeft: 10 }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </form>
              ) : (
                // View Mode
                <>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="news-content">{item.content}</p>
                    <time className="news-date">
                      {new Date(item.date).toLocaleString()}
                    </time>
                    <div className="action-buttons" style={{ marginTop: 10 }}>
                      <Button
                        onClick={() => handleEditClick(item)}
                        style={{ marginRight: 10 }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(item._id)}
                        disabled={submitting}
                      >
                        {submitting ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
