import clientPromise from "@/lib/mongodb";

// GET - Retrieve all shuttle tickets
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const tickets = await db.collection("shuttleTickets").find({}).sort({ date: -1 }).toArray();
    return new Response(JSON.stringify(tickets), { status: 200 });
  } catch (error) {
    console.error("Error fetching shuttle tickets:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch tickets." }), { status: 500 });
  }
}

// POST - Add a new shuttle ticket
export async function POST(req) {
  const body = await req.json();
  const { routeName, price, description } = body;

  if (!routeName || !price || !description) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }

  const date = new Date().toISOString();

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("shuttleTickets").insertOne({
      routeName,
      price,
      description,
      date,
    });

    return new Response(
      JSON.stringify({ id: result.insertedId, routeName, price, description, date }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating shuttle ticket:", error);
    return new Response(JSON.stringify({ error: "Failed to create ticket." }), { status: 500 });
  }
}
