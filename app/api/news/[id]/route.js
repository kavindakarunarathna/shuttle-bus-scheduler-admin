import db from "@/lib/db";

// PUT - Update an existing news article by ID
export async function PUT(req, { params }) {
  const { id } = await params; // Extract ID from the dynamic route
  const body = await req.json();
  const { title, content } = body;

  if (!title || !content) {
    return new Response(JSON.stringify({ error: "Title and content are required." }), { status: 400 });
  }

  const date = new Date().toISOString();

  try {
    const result = await new Promise((resolve, reject) => {
      db.run(
        `UPDATE news SET title = ?, content = ?, date = ? WHERE id = ?`,
        [title, content, date, id],
        function (err) {
          if (err) reject(err);
          resolve(this.changes); // This returns the number of updated rows
        }
      );
    });

    if (result === 0) {
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
  const { id } = await params; // Extract ID from the dynamic route

  try {
    const result = await new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM news WHERE id = ?`,
        [id],
        function (err) {
          if (err) reject(err);
          resolve(this.changes); // This returns the number of deleted rows
        }
      );
    });

    if (result === 0) {
      return new Response(JSON.stringify({ error: "News article not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "News article deleted successfully." }), { status: 200 });
  } catch (error) {
    console.error("Error deleting news:", error);
    return new Response(JSON.stringify({ error: "Failed to delete news." }), { status: 500 });
  }
}
