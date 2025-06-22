import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");
    const reservations = await db.collection("seatReservation").find({}).sort({ date: -1 }).toArray();

    return new Response(JSON.stringify(reservations), { status: 200 });
  } catch (error) {
    console.error("Error fetching seat reservations:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch reservations." }), { status: 500 });
  }
}

export async function POST(req) {
  const body = await req.json();
  const { studentId, name, route, date, time, seats, price } = body;

  if (!studentId || !name || !route || !date || !time || !seats || !price) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ShuttleTrackDB");

    const result = await db.collection("seatReservation").insertOne({
      studentId,
      name,
      route,
      date,
      time,
      seats,
      price,
      isPaymentCompleted: false
    });

    return new Response(JSON.stringify({ id: result.insertedId, studentId, name, route, date, time, seats }), { status: 201 });
  } catch (error) {
    console.error("Error creating seat reservation:", error);
    return new Response(JSON.stringify({ error: "Failed to create reservation." }), { status: 500 });
  }
}