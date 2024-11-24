import db from "@/lib/db";

export async function GET(req) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM news ORDER BY date DESC`, [], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch {
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
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO news (title, content, date) VALUES (?, ?, ?)`,
        [title, content, date],
        function (err) {
          if (err) reject(err);
          resolve();
        }
      );
    });
    return new Response(
      JSON.stringify({ title, content, date }),
      { status: 201 }
    );
  } catch {
    return new Response(JSON.stringify({ error: "Failed to create news." }), { status: 500 });
  }
}

