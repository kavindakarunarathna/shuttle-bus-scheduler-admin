import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT - Update an existing news article by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { routeNumber, departure, arrival, departureTime, arrivalTime } = body;

  if (!routeNumber || !departure || !arrival || !departureTime || !arrivalTime) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("busSchedule").updateOne(
      { _id: new ObjectId(id) },
      { $set: { routeNumber, departure, arrival, departureTime, arrivalTime } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Bus schedule not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ id, routeNumber, departure, arrival, departureTime, arrivalTime }), { status: 200 });
  } catch (error) {
    console.error("Error updating bus schedule:", error);
    return new Response(JSON.stringify({ error: "Failed to update bus schedule." }), { status: 500 });
  }
}


// DELETE - Delete a news article by ID
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("busSchedule").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Bus schedule not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Bus schedule deleted successfully." }), { status: 200 });
  } catch (error) {
    console.error("Error deleting bus schedule:", error);
    return new Response(JSON.stringify({ error: "Failed to delete bus schedule." }), { status: 500 });
  }
}
