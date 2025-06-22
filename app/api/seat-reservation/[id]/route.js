import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT - Update an existing news article by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { studentId, name, route, date, time, seats } = body;

  if (!studentId || !name || !route || !date || !time || !seats) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("seatReservation").updateOne(
      { _id: new ObjectId(id) },
      { $set: { studentId, name, route, date, time, seats } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Seat reservation not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ id, studentId, name, route, date, time, seats }), { status: 200 });
  } catch (error) {
    console.error("Error updating seat reservation:", error);
    return new Response(JSON.stringify({ error: "Failed to update reservation." }), { status: 500 });
  }
}

// DELETE - Delete a news article by ID
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("seatReservation").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Seat reservation not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Seat reservation deleted successfully." }), { status: 200 });
  } catch (error) {
    console.error("Error deleting seat reservation:", error);
    return new Response(JSON.stringify({ error: "Failed to delete reservation." }), { status: 500 });
  }
}