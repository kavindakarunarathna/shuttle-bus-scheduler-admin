import clientPromise from "@/lib/mongodb";

// GET - Retrieve all lost and found items
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const items = await db.collection("lostAndFound").find({}).sort({ date: -1 }).toArray();
    return new Response(JSON.stringify(items), { status: 200 });
  } catch (error) {
    console.error("Error fetching lost and found items:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch items." }), { status: 500 });
  }
}

// POST - Add a new lost and found item
export async function POST(req) {
  const body = await req.json();
  const { itemName, description, location, contactInfo, type } = body;

  if (!itemName || !description || !location || !contactInfo || !type) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }

  const date = new Date().toISOString();

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("lostAndFound").insertOne({
      itemName,
      description,
      location,
      contactInfo,
      type,
      date,
    });

    return new Response(JSON.stringify({ id: result.insertedId, itemName, description, location, contactInfo, type, date }), { status: 201 });
  } catch (error) {
    console.error("Error creating lost and found item:", error);
    return new Response(JSON.stringify({ error: "Failed to create item." }), { status: 500 });
  }
}
