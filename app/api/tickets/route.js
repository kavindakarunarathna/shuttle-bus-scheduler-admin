import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");
    const schedule = await db.collection("busSchedule").find({}).sort({ date: -1 }).toArray();

    return new Response(JSON.stringify(schedule), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch schedule." }), { status: 500 });
  }
}

export async function POST(req) {
  const body = await req.json();
  const { routeNumber, departure, arrival, departureTime, arrivalTime } = body;

  if (!routeNumber || !departure || !arrival || !departureTime || !arrivalTime) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }
// ShuttleTrack
  const date = new Date().toISOString();

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("busSchedule").insertOne({
      routeNumber,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      date,
    });

    return new Response(JSON.stringify({ id: result.insertedId, routeNumber, departure, arrival, departureTime, arrivalTime, date }), { status: 201 });
  } catch (error) {
    console.error("Error creating bus schedule:", error);
    return new Response(JSON.stringify({ error: "Failed to create bus schedule." }), { status: 500 });
  }
}