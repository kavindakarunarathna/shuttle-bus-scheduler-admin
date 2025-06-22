"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function AboutUsAdmin() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [createForm, setCreateForm] = useState({ 
    title: "", 
    content: "", 
    order: 0
  });
  const [editForm, setEditForm] = useState({ 
    title: "", 
    content: "", 
    order: 0
  });

  useEffect(() => {
    fetch("/api/about-us")
      .then((res) => res.json())
      .then((data) => {
        // Sort sections by order
        setSections(data.sort((a, b) => a.order - b.order));
        setLoading(false);
      });
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/about-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        const newSection = await res.json();
        setSections([...sections, newSection].sort((a, b) => a.order - b.order));
        setCreateForm({ 
          title: "", 
          content: "", 
          order: 0
        });
        handleRefresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (section) => {
    setEditingId(section._id);
    setEditForm({ 
      title: section.title, 
      content: section.content, 
      order: section.order
    });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/about-us/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updatedSection = await res.json();
        setSections(
          sections
            .map((section) => (section._id === id ? updatedSection : section))
            .sort((a, b) => a.order - b.order)
        );
        setEditingId(null);
        handleRefresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/about-us/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSections(
          sections
            .filter((section) => section._id !== id)
            .sort((a, b) => a.order - b.order)
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="about-us-admin-container" style={{ margin: 120 }}>
      {/* Creation Form */}
      <Card style={{ borderLeftWidth: 0 }}>
        <CardHeader>
          <CardTitle>Add New About Us Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSubmit} className="about-us-form">
            <Input
              type="text"
              placeholder="Section Title"
              value={createForm.title}
              style={{ marginBottom: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, title: e.target.value })
              }
              required
            />
            <Input
              type="number"
              placeholder="Display Order"
              value={createForm.order}
              style={{ marginBottom: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, order: parseInt(e.target.value) || 0 })
              }
              required
            />
            <Textarea
              placeholder="Section Content"
              value={createForm.content}
              style={{ marginBottom: 10, minHeight: 150 }}
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
              {submitting ? "Submitting..." : "Add Section"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Sections List */}
      <div className="about-us-list">
        {loading ? (
          <Card>
            <CardContent className="loading-state">Loading sections...</CardContent>
          </Card>
        ) : sections.length === 0 ? (
          <Card>
            <CardContent className="empty-state">
              No About Us sections created yet
            </CardContent>
          </Card>
        ) : (
          sections.map((section, index) => (
            <Card key={section._id} className="about-us-section" style={{ 
              marginTop: 10,
              borderColor: 'purple'
            }}>
              {editingId === section._id ? (
                // Edit Form
                <form
                  onSubmit={(e) => handleEditSubmit(e, section._id)}
                  className="edit-form"
                >
                  <CardHeader>
                    <CardTitle>Edit Section</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="text"
                      placeholder="Section Title"
                      value={editForm.title}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      required
                    />
                    <Input
                      type="number"
                      placeholder="Display Order"
                      value={editForm.order}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, order: parseInt(e.target.value) || 0 })
                      }
                      required
                    />
                    <Textarea
                      placeholder="Section Content"
                      value={editForm.content}
                      style={{ marginBottom: 10, minHeight: 150 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, content: e.target.value })
                      }
                      required
                    />
                    <div className="action-buttons" style={{ marginTop: 10 }}>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Changes"}
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
                    <CardTitle>
                      {section.title} (Order: {section.order})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{section.content}</p>
                    <time className="section-date">
                      Last Updated: {new Date(section.updatedAt).toLocaleString()}
                    </time>
                    <div className="action-buttons" style={{ marginTop: 10 }}>
                      <Button
                        onClick={() => handleEditClick(section)}
                        style={{ marginRight: 10 }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(section._id)}
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