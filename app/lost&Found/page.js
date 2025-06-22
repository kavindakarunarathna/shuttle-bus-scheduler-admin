"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function LostAndFound() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [createForm, setCreateForm] = useState({ 
    itemName: "", 
    description: "", 
    location: "", 
    contactInfo: "",
    type: "lost" // Default to lost items
  });
  const [editForm, setEditForm] = useState({ 
    itemName: "", 
    description: "", 
    location: "", 
    contactInfo: "",
    type: "lost"
  });

  useEffect(() => {
    fetch("/api/lost-and-found")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
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
      const res = await fetch("/api/lost-and-found", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        const newItem = await res.json();
        setItems([newItem, ...items]);
        setCreateForm({ 
          itemName: "", 
          description: "", 
          location: "", 
          contactInfo: "",
          type: "lost"
        });
        handleRefresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditForm({ 
      itemName: item.itemName, 
      description: item.description, 
      location: item.location, 
      contactInfo: item.contactInfo,
      type: item.type
    });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/lost-and-found/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updatedItem = await res.json();
        setItems((prevItems) =>
          prevItems.map((item) => (item._id === id ? updatedItem : item))
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
      const res = await fetch(`/api/lost-and-found/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lost-found-container" style={{ margin: 120 }}>
      <a href="/">Home</a>
      {/* Creation Form */}
      <Card style={{ borderLeftWidth: 0 }}>
        <CardHeader>
          <CardTitle>Report Lost or Found Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSubmit} className="lost-found-form">
            <div style={{ display: 'flex', gap: '10px', marginBottom: 10 }}>
              <select
                value={createForm.type}
                onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                style={{ padding: '8px', width: '100%' }}
              >
                <option value="lost">Lost Item</option>
                <option value="found">Found Item</option>
              </select>
            </div>
            <Input
              type="text"
              placeholder="Item Name"
              value={createForm.itemName}
              style={{ marginBottom: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, itemName: e.target.value })
              }
              required
            />
            <Input
              type="text"
              placeholder="Location"
              value={createForm.location}
              style={{ marginBottom: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, location: e.target.value })
              }
              required
            />
            <Input
              type="text"
              placeholder="Contact Information"
              value={createForm.contactInfo}
              style={{ marginBottom: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, contactInfo: e.target.value })
              }
              required
            />
            <Textarea
              placeholder="Item Description"
              value={createForm.description}
              style={{ marginBottom: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, description: e.target.value })
              }
              required
            />
            <Button
              type="submit"
              style={{ marginTop: 10 }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Item"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Items List */}
      <div className="lost-found-list">
        {loading ? (
          <Card>
            <CardContent className="loading-state">Loading items...</CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="empty-state">
              No lost or found items reported
            </CardContent>
          </Card>
        ) : (
          items.map((item, index) => (
            <Card key={index} className="lost-found-item" style={{ 
              borderColor: item.type === 'lost' ? 'red' : 'green',
              marginTop: 10
            }}>
              {editingId === item._id ? (
                // Edit Form
                <form
                  onSubmit={(e) => handleEditSubmit(e, item._id)}
                  className="edit-form"
                >
                  <CardHeader>
                    <CardTitle>Edit Item</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: 10 }}>
                      <select
                        value={editForm.type}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                        style={{ padding: '8px', width: '100%' }}
                      >
                        <option value="lost">Lost Item</option>
                        <option value="found">Found Item</option>
                      </select>
                    </div>
                    <Input
                      type="text"
                      placeholder="Item Name"
                      value={editForm.itemName}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, itemName: e.target.value })
                      }
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Location"
                      value={editForm.location}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Contact Information"
                      value={editForm.contactInfo}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, contactInfo: e.target.value })
                      }
                      required
                    />
                    <Textarea
                      placeholder="Item Description"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
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
                    <CardTitle>
                      {item.type === 'lost' ? 'Lost' : 'Found'}: {item.itemName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Location:</strong> {item.location}</p>
                    <p><strong>Contact:</strong> {item.contactInfo}</p>
                    <time className="item-date">
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