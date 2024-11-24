import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("newsDatabase");
    const news = await db.collection("news").find({}).sort({ date: -1 }).toArray();

    return new Response(JSON.stringify(news), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch news." }), { status: 500 });
  }
}

export async function POST(req) {
  const body = await req.json();
  const { title, content } = body;

  if (!title || !content) {
    return new Response(JSON.stringify({ error: "Title and content are required." }), { status: 400 });
  }

  const date = new Date().toISOString();

  try {
    const client = await clientPromise;
    const db = client.db("newsDatabase");
    const result = await db.collection("news").insertOne({ title, content, date });

    return new Response(
      JSON.stringify({ _id: result.insertedId, title, content, date }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create news." }), { status: 500 });
  }
}
