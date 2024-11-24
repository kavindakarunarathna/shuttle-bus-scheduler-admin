const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(process.cwd(), 'database', 'news.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL
    )`,
    (err) => {
      if (err) console.error('Error creating table:', err);
      else console.log('News table created or already exists.');
    }
  );
});


module.exports = db;
