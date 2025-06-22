import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PUT - Update contact information by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { name, role, phone, email, emergencyInstructions } = body;

  if (!name || !role || !phone || !email || !emergencyInstructions) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("contactInformation").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, role, phone, email, emergencyInstructions } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Contact information not found." }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ id, name, role, phone, email, emergencyInstructions }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating contact info:", error);
    return new Response(JSON.stringify({ error: "Failed to update contact information." }), { status: 500 });
  }
}

// DELETE - Delete contact information by ID
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("contactInformation").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Contact information not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Contact information deleted successfully." }), { status: 200 });
  } catch (error) {
    console.error("Error deleting contact info:", error);
    return new Response(JSON.stringify({ error: "Failed to delete contact information." }), { status: 500 });
  }
}
