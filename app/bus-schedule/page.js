"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function BusSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [createForm, setCreateForm] = useState({
    routeNumber: "",
    departure: "",
    arrival: "",
    departureTime: "",
    arrivalTime: ""
  });
  const [editForm, setEditForm] = useState({
    routeNumber: "",
    departure: "",
    arrival: "",
    departureTime: "",
    arrivalTime: ""
  });

  useEffect(() => {
    fetch("/api/bus-schedules")
      .then((res) => res.json())
      .then((data) => {
        setSchedules(data);
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
      const res = await fetch("/api/bus-schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        const newSchedule = await res.json();
        setSchedules([newSchedule, ...schedules]);
        setCreateForm({
          routeNumber: "",
          departure: "",
          arrival: "",
          departureTime: "",
          arrivalTime: ""
        });
        handleRefresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditForm({ ...item });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/bus-schedules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updatedSchedule = await res.json();
        setSchedules((prevSchedules) =>
          prevSchedules.map((item) => (item._id === id ? updatedSchedule : item))
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
      const res = await fetch(`/api/bus-schedules/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSchedules((prevSchedules) => 
          prevSchedules.filter((item) => item._id !== id)
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bus-schedule-container" style={{ margin: 120 }}>
      <a href="/">Home</a>
      {/* Creation Form */}
      <Card style={{ borderLeftWidth: 0 }}>
        <CardHeader>
          <CardTitle>Add Bus Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSubmit} className="bus-schedule-form">
            <Input
              type="text"
              placeholder="Bus Number"
              value={createForm.routeNumber}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, routeNumber: e.target.value })
              }
              required
            />
            <Input
              type="text"
              placeholder="Departure Location"
              value={createForm.departure}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, departure: e.target.value })
              }
              required
            />
            <Input
              type="text"
              placeholder="Arrival Location"
              value={createForm.arrival}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, arrival: e.target.value })
              }
              required
            />
            <Input
              type="time"
              placeholder="Departure Time"
              value={createForm.departureTime}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, departureTime: e.target.value })
              }
              required
            />
            <Input
              type="time"
              placeholder="Arrival Time"
              value={createForm.arrivalTime}
              style={{ marginTop: 10 }}
              onChange={(e) =>
                setCreateForm({ ...createForm, arrivalTime: e.target.value })
              }
              required
            />
            <Button
              type="submit"
              style={{ marginTop: 10 }}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Add Schedule"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Bus Schedules List */}
      <div className="bus-schedules-list">
        {loading ? (
          <Card>
            <CardContent className="loading-state">
              Loading bus schedules...
            </CardContent>
          </Card>
        ) : schedules.length === 0 ? (
          <Card>
            <CardContent className="empty-state">
              No bus schedules added yet
            </CardContent>
          </Card>
        ) : (
          schedules.map((item) => (
            <Card key={item._id} className="bus-schedule-item">
              {editingId === item._id ? (
                // Edit Form
                <form
                  onSubmit={(e) => handleEditSubmit(e, item._id)}
                  className="edit-form"
                >
                  <CardHeader>
                    <CardTitle>Edit Bus Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="text"
                      placeholder="Route Number"
                      value={editForm.routeNumber}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, routeNumber: e.target.value })
                      }
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Departure Location"
                      value={editForm.departure}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, departure: e.target.value })
                      }
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Arrival Location"
                      value={editForm.arrival}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, arrival: e.target.value })
                      }
                      required
                    />
                    <Input
                      type="time"
                      placeholder="Departure Time"
                      value={editForm.departureTime}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, departureTime: e.target.value })
                      }
                      required
                    />
                    <Input
                      type="time"
                      placeholder="Arrival Time"
                      value={editForm.arrivalTime}
                      style={{ marginBottom: 10 }}
                      onChange={(e) =>
                        setEditForm({ ...editForm, arrivalTime: e.target.value })
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
                    <CardTitle>Route {item.routeNumber}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="bus-route-details">
                      {item.departure} to {item.arrival}
                    </p>
                    <div className="bus-times">
                      <span>Departure: {item.departureTime}</span>
                      <span style={{ marginLeft: 10 }}>
                        Arrival: {item.arrivalTime}
                      </span>
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