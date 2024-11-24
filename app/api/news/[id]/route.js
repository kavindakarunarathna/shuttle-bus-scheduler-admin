import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT - Update an existing news article by ID
export async function PUT(req, { params }) {
  const { id } = params; // Extract ID from the dynamic route
  const body = await req.json();
  const { title, content } = body;

  if (!title || !content) {
    return new Response(JSON.stringify({ error: "Title and content are required." }), { status: 400 });
  }

  const date = new Date().toISOString();

  try {
    const client = await clientPromise;
    const db = client.db("newsDatabase");

    // Update the news article by ID
    const result = await db.collection("news").updateOne(
      { _id: new ObjectId(id) }, // Filter by _id
      { $set: { title, content, date } } // Fields to update
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "News article not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ id, title, content, date }), { status: 200 });
  } catch (error) {
    console.error("Error updating news:", error);
    return new Response(JSON.stringify({ error: "Failed to update news." }), { status: 500 });
  }
}

// DELETE - Delete a news article by ID
export async function DELETE(req, { params }) {
  const { id } = params; // Extract ID from the dynamic route

  try {
    const client = await clientPromise;
    const db = client.db("newsDatabase");

    // Delete the news article by ID
    const result = await db.collection("news").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "News article not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "News article deleted successfully." }), { status: 200 });
  } catch (error) {
    console.error("Error deleting news:", error);
    return new Response(JSON.stringify({ error: "Failed to delete news." }), { status: 500 });
  }
}
