import clientPromise from "@/lib/mongodb";

// GET - Retrieve all contact information entries
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const contacts = await db.collection("contactInformation").find({}).sort({ date: -1 }).toArray();
    return new Response(JSON.stringify(contacts), { status: 200 });
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch contact information." }), { status: 500 });
  }
}

// POST - Add a new contact information entry
export async function POST(req) {
  const body = await req.json();
  const { name, role, phone, email, emergencyInstructions } = body;

  if (!name || !role || !phone || !email || !emergencyInstructions) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }

  const date = new Date().toISOString();

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("contactInformation").insertOne({
      name,
      role,
      phone,
      email,
      emergencyInstructions,
      date,
    });

    return new Response(
      JSON.stringify({ id: result.insertedId, name, role, phone, email, emergencyInstructions, date }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contact info:", error);
    return new Response(JSON.stringify({ error: "Failed to create contact information." }), { status: 500 });
  }
}
