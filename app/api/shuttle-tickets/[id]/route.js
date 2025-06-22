import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT - Update a shuttle ticket by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { routeName, price, description } = body;

  if (!routeName || !price || !description) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("shuttleTickets").updateOne(
      { _id: new ObjectId(id) },
      { $set: { routeName, price, description } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Ticket not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ id, routeName, price, description }), { status: 200 });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return new Response(JSON.stringify({ error: "Failed to update ticket." }), { status: 500 });
  }
}

// DELETE - Delete a shuttle ticket by ID
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("shuttleTickets").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Ticket not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Ticket deleted successfully." }), { status: 200 });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return new Response(JSON.stringify({ error: "Failed to delete ticket." }), { status: 500 });
  }
}
