"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
// Removed custom Select import

export default function ShuttleSeatReservationPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tickets, setTickets] = useState([]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Create form state
  const [createForm, setCreateForm] = useState({
    studentId: "",
    name: "",
    route: "",
    date: "",
    time: "",
    seats: 1,
    isPaymentCompleted: false
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    studentId: "",
    name: "",
    route: "",
    date: "",
    time: "",
    seats: 1,
    isPaymentCompleted: false
  });

  // Available routes
  const campusRoutes = [
    "North Campus to Main Campus",
    "Main Campus to South Campus",
    "Student Housing to Main Campus",
    "Research Park to Main Campus"
  ];

  useEffect(() => {
    fetch("/api/shuttle-tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
      });

    fetch("/api/seat-reservation")
      .then((res) => res.json())
      .then((data) => {
        setReservations(data);
        setLoading(false);
      });
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    // Show modal first
    setShowPaymentModal(true);
  };

  const confirmPaymentAndSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/seat-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({price: getPrice(), ...createForm}),
      });
      if (res.ok) {
        const newReservation = await res.json();
        setReservations([newReservation, ...reservations]);
        setCreateForm({
          studentId: "",
          name: "",
          route: "",
          date: "",
          time: "",
          seats: 1,
          isPaymentCompleted: false,
        });
        setCardDetails({ cardNumber: "", expiry: "", cvc: "" });
        setShowPaymentModal(false);
        handleRefresh();
      }
    } catch (error) {
      console.error("Reservation submission error:", error);
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
      const res = await fetch(`/api/seat-reservation/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updatedReservation = await res.json();
        setReservations((prevReservations) =>
          prevReservations.map((item) => (item._id === id ? updatedReservation : item))
        );
        setEditingId(null);
        handleRefresh();
      }
    } catch (error) {
      console.error("Reservation update error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/seat-reservation/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReservations((prevReservations) =>
          prevReservations.filter((item) => item._id !== id)
        );
      }
    } catch (error) {
      console.error("Reservation deletion error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmedPaymentSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/seat-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        const newReservation = await res.json();
        setReservations([newReservation, ...reservations]);
        setCreateForm({
          studentId: "",
          name: "",
          route: "",
          date: "",
          time: "",
          seats: 1,
          isPaymentCompleted: false
        });
        setCardDetails({ cardNumber: "", expiry: "", cvv: "" });
        setShowPaymentModal(false);
        handleRefresh();
      }
    } catch (error) {
      console.error("Reservation submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTicket = () => tickets.find(item => item?.description === createForm?.route);

  const getPrice = () => {
    const ticket = selectedTicket();
    return ticket ? ticket.price * createForm.seats : 0;
  };
  
  return (
    <div className="shuttle-reservation-container p-8 max-w-4xl mx-auto min-h-screen">
      <a href="/">Home</a>
      {/* Reservation Creation Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Reserve Campus Shuttle Seat</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Student ID"
              value={createForm.studentId}
              onChange={(e) =>
                setCreateForm({ ...createForm, studentId: e.target.value })
              }
              required
              className="w-full"
              disabled={showPaymentModal}
            />
            <Input
              type="text"
              placeholder="Full Name"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm({ ...createForm, name: e.target.value })
              }
              required
              className="w-full"
              disabled={showPaymentModal}
            />

            <select
              value={createForm.route}
              onChange={(e) =>
                setCreateForm({ ...createForm, route: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
              disabled={showPaymentModal}
            >
              <option value="">Select Route</option>
              {tickets.map((route, index) => (
                <option key={index} value={route?.description}>
                  {route?.description}
                </option>
              ))}
            </select>

            <Input
              type="date"
              placeholder="Date"
              value={createForm.date}
              onChange={(e) =>
                setCreateForm({ ...createForm, date: e.target.value })
              }
              required
              className="w-full"
              disabled={showPaymentModal}
            />

            <Input
              type="time"
              placeholder="Time"
              value={createForm.time}
              onChange={(e) =>
                setCreateForm({ ...createForm, time: e.target.value })
              }
              required
              className="w-full"
              disabled={showPaymentModal}
            />

            <div className="flex items-center space-x-4">
              <label className="flex-grow">Number of Seats:</label>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  setCreateForm(prev => ({
                    ...prev,
                    seats: Math.max(1, prev.seats - 1)
                  }))
                }
                disabled={showPaymentModal}
              >
                -
              </Button>
              <span>{createForm.seats}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  setCreateForm(prev => ({
                    ...prev,
                    seats: Math.min(4, prev.seats + 1)
                  }))
                }
                disabled={showPaymentModal}
              >
                +
              </Button>
            </div>

            <h1>LKR {(getPrice()).toFixed(2)}</h1>

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || showPaymentModal}
            >
              {submitting ? "Reserving..." : "Reserve Seats"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {showPaymentModal && (
        <div className="bg-white rounded-lg shadow-lg w-full space-y-4" style={{ padding: 50 }}>
          <h2 className="text-xl font-semibold text-center">Enter Card Details</h2>

          <Input
            type="text"
            placeholder="Card Number"
            value={cardDetails.cardNumber}
            onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
            required
          />
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="CVC"
              value={cardDetails.cvc}
              onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
              required
            />
          </div>

          <div className="flex space-x-2 mt-4">
            <Button
              onClick={confirmPaymentAndSubmit}
              className="flex-grow"
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Pay & Reserve"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
              className="flex-grow"
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Reservations List */}
      <div className="reservations-list space-y-4">
        {loading ? (
          <Card>
            <CardContent className="text-center p-4">
              Loading shuttle reservations...
            </CardContent>
          </Card>
        ) : reservations.length === 0 ? (
          <Card>
            <CardContent className="text-center p-4">
              No shuttle seat reservations yet
            </CardContent>
          </Card>
        ) : (
          reservations.map((item) => (
            <Card key={item._id} className="reservation-item">
              {editingId === item._id ? (
                // Edit Form
                <form
                  onSubmit={(e) => handleEditSubmit(e, item._id)}
                  className="space-y-4"
                >
                  <CardHeader>
                    <CardTitle>Edit Reservation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="text"
                      placeholder="Student ID"
                      value={editForm.studentId}
                      onChange={(e) =>
                        setEditForm({ ...editForm, studentId: e.target.value })
                      }
                      required
                      className="w-full mb-2"
                    />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      required
                      className="w-full mb-2"
                    />

                    <select
                      value={editForm.route}
                      onChange={(e) =>
                        setEditForm({ ...editForm, route: e.target.value })
                      }
                      className="w-full p-2 border rounded mb-2"
                      required
                    >
                      <option value="">Select Route</option>
                      {campusRoutes.map((route) => (
                        <option key={route} value={route}>
                          {route}
                        </option>
                      ))}
                    </select>

                    <Input
                      type="date"
                      placeholder="Date"
                      value={editForm.date}
                      onChange={(e) =>
                        setEditForm({ ...editForm, date: e.target.value })
                      }
                      required
                      className="w-full mb-2"
                    />

                    <Input
                      type="time"
                      placeholder="Time"
                      value={editForm.time}
                      onChange={(e) =>
                        setEditForm({ ...editForm, time: e.target.value })
                      }
                      required
                      className="w-full mb-2"
                    />

                    <div className="flex items-center space-x-4 mb-2">
                      <label className="flex-grow">Seats:</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setEditForm(prev => ({
                            ...prev,
                            seats: Math.max(1, prev.seats - 1)
                          }))
                        }
                      >
                        -
                      </Button>
                      <span>{editForm.seats}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setEditForm(prev => ({
                            ...prev,
                            seats: Math.min(4, prev.seats + 1)
                          }))
                        }
                      >
                        +
                      </Button>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button
                        type="submit"
                        className="flex-grow"
                        disabled={submitting}
                      >
                        {submitting ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        className="flex-grow"
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
                    <CardTitle>Shuttle Reservation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Student ID:</strong> {item.studentId}</p>
                      <p><strong>Name:</strong> {item.name}</p>
                      <p><strong>Route:</strong> {item.route}</p>
                      <p><strong>Date:</strong> {item.date}</p>
                      <p><strong>Time:</strong> {item.time}</p>
                      <p><strong>Seats Reserved:</strong> {item.seats}</p>
                      <p><strong>Price:</strong> LKR {item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button
                        onClick={() => handleEditClick(item)}
                        className="flex-grow"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(item._id)}
                        disabled={submitting}
                        className="flex-grow"
                      >
                        {submitting ? "Canceling..." : "Cancel Reservation"}
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