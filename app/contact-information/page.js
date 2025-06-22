"use client";

import { useState, useEffect } from "react";
import "./campus-security.module.css";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function CampusSecurity() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    emergencyInstructions: ""
  });
  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    emergencyInstructions: ""
  });

  useEffect(() => {
    fetch("/api/campus-security")
      .then((res) => res.json())
      .then((data) => {
        setContacts(data);
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
      const res = await fetch("/api/campus-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        const newContact = await res.json();
        setContacts([newContact, ...contacts]);
        setCreateForm({
          name: "",
          role: "",
          phone: "",
          email: "",
          emergencyInstructions: ""
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
      name: item.name,
      role: item.role,
      phone: item.phone,
      email: item.email,
      emergencyInstructions: item.emergencyInstructions
    });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/campus-security/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updatedContact = await res.json();
        setContacts((prevContacts) =>
          prevContacts.map((item) => (item._id === id ? updatedContact : item))
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
      const res = await fetch(`/api/campus-security/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setContacts((prevContacts) => prevContacts.filter((item) => item._id !== id));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="campus-security-container" style={{ margin: 120 }}>
      <a href="/">Home</a>
      {/* Create Contact Form */}
      <Card style={{ borderLeftWidth: 0 }}>
        <CardHeader>
          <CardTitle>Add Campus Security Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSubmit} className="security-contact-form">
            <Input
              type="text"
              placeholder="Contact Name"
              value={createForm.name}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, name: e.target.value })
              }
              required
            />
            <Input
              type="text"
              placeholder="Role/Position"
              value={createForm.role}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, role: e.target.value })
              }
              required
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={createForm.phone}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, phone: e.target.value })
              }
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={createForm.email}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, email: e.target.value })
              }
              required
            />
            <Textarea
              placeholder="Emergency Contact Instructions"
              value={createForm.emergencyInstructions}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, emergencyInstructions: e.target.value })
              }
              required
            />
            <Button
              type="submit"
              style={{ marginTop: 10 }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Add Contact"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Contacts List */}
      <div className="security-contacts-list">
        {loading ? (
          <Card>
            <CardContent className="loading-state">Loading contacts...</CardContent>
          </Card>
        ) : contacts.length === 0 ? (
          <Card>
            <CardContent className="empty-state">
              No security contacts added yet
            </CardContent>
          </Card>
        ) : (
          contacts.map((item, index) => (
            <Card key={index} className="security-contact-item">
              {editingId === item._id ? (
                // Edit Form
                <form
                  onSubmit={(e) => handleEditSubmit(e, item._id)}
                  className="edit-form"
                >
                  <CardHeader>
                    <CardTitle>Edit Security Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="text"
                      placeholder="Contact Name"
                      value={editForm.name}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Role/Position"
                      value={editForm.role}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                      required
                    />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={editForm.phone}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={editForm.email}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      required
                    />
                    <Textarea
                      placeholder="Emergency Contact Instructions"
                      value={editForm.emergencyInstructions}
                      onChange={(e) =>
                        setEditForm({ ...editForm, emergencyInstructions: e.target.value })
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
                    <CardTitle>{item.name}</CardTitle>
                    <p className="contact-role">{item.role}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="contact-details">
                      <p><strong>Phone:</strong> {item.phone}</p>
                      <p><strong>Email:</strong> {item.email}</p>
                      <p className="emergency-instructions">
                        <strong>Emergency Instructions:</strong> {item.emergencyInstructions}
                      </p>
                      <time className="last-updated">
                        Last Updated: {new Date(item.date).toLocaleString()}
                      </time>
                    </div>
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