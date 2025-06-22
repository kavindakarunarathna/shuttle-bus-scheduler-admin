"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function ShuttleTicketPrices() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [createForm, setCreateForm] = useState({ 
    routeName: "", 
    price: "", 
    description: "" 
  });
  const [editForm, setEditForm] = useState({ 
    routeName: "", 
    price: "", 
    description: "" 
  });

  useEffect(() => {
    fetch("/api/shuttle-tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
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
      const res = await fetch("/api/shuttle-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        const newTicket = await res.json();
        setTickets([newTicket, ...tickets]);
        setCreateForm({ routeName: "", price: "", description: "" });
        handleRefresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditForm({ 
      routeName: item.routeName, 
      price: item.price, 
      description: item.description 
    });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/shuttle-tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updatedTicket = await res.json();
        setTickets((prevTickets) =>
          prevTickets.map((item) => (item._id === id ? updatedTicket : item))
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
      const res = await fetch(`/api/shuttle-tickets/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTickets((prevTickets) => prevTickets.filter((item) => item._id !== id));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shuttle-tickets-container" style={{ margin: 120 }}>
      {/* Creation Form */}
      <Card style={{ borderLeftWidth: 0 }}>
        <CardHeader>
          <CardTitle>Add Shuttle Ticket Route</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSubmit} className="shuttle-ticket-form">
            <Input
              type="text"
              placeholder="Route Name"
              value={createForm.routeName}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, routeName: e.target.value })
              }
              required
            />
            <Input
              type="number"
              placeholder="Ticket Price"
              value={createForm.price}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, price: e.target.value })
              }
              required
              step="0.01"
              min="0"
            />
            <Textarea
              placeholder="Route Description"
              value={createForm.description}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, description: e.target.value })
              }
            />
            <Button
              type="submit"
              style={{ marginTop: 10 }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Add Route"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Ticket Routes List */}
      <div className="shuttle-ticket-list">
        {loading ? (
          <Card>
            <CardContent className="loading-state">Loading routes...</CardContent>
          </Card>
        ) : tickets.length === 0 ? (
          <Card>
            <CardContent className="empty-state">
              No shuttle routes available
            </CardContent>
          </Card>
        ) : (
          tickets.map((item, index) => (
            <Card key={index} className="shuttle-ticket-item">
              {editingId === item._id ? (
                // Edit Form
                <form
                  onSubmit={(e) => handleEditSubmit(e, item._id)}
                  className="edit-form"
                >
                  <CardHeader>
                    <CardTitle>Edit Route</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="text"
                      placeholder="Route Name"
                      value={editForm.routeName}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, routeName: e.target.value })
                      }
                      required
                    />
                    <Input
                      type="number"
                      placeholder="Ticket Price"
                      value={editForm.price}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                      required
                      step="0.01"
                      min="0"
                    />
                    <Textarea
                      placeholder="Route Description"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
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
                    <CardTitle>{item.routeName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="ticket-price">LKR {Number(item.price).toFixed(2)}</p>
                    <p className="route-description">{item.description}</p>
                    <time className="route-added-date">
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