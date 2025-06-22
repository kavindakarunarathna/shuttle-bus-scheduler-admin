import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT - Update a lost and found item by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { itemName, description, location, contactInfo, type } = body;

  if (!itemName || !description || !location || !contactInfo || !type) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("lostAndFound").updateOne(
      { _id: new ObjectId(id) },
      { $set: { itemName, description, location, contactInfo, type } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Item not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ id, itemName, description, location, contactInfo, type }), { status: 200 });
  } catch (error) {
    console.error("Error updating item:", error);
    return new Response(JSON.stringify({ error: "Failed to update item." }), { status: 500 });
  }
}

// DELETE - Delete a lost and found item by ID
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("lostAndFound").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Item not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Item deleted successfully." }), { status: 200 });
  } catch (error) {
    console.error("Error deleting item:", error);
    return new Response(JSON.stringify({ error: "Failed to delete item." }), { status: 500 });
  }
}
