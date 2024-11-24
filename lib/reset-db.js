const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the database file
const dbPath = path.join(process.cwd(), 'database', 'test.db');

// Open the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Function to reset the database
const resetDatabase = () => {
  db.serialize(() => {
    // Drop the news table if it exists
    db.run('DROP TABLE IF EXISTS news', (err) => {
      if (err) {
        console.error('Error dropping table:', err);
      } else {
        console.log('Dropped the news table.');
      }
    });

    // Recreate the news table
    db.run(
      `CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL
      )`,
      (err) => {
        if (err) {
          console.error('Error creating table:', err);
        } else {
          console.log('News table recreated.');
        }
      }
    );
  });

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing the database:', err);
    } else {
      console.log('Database connection closed.');
    }
  });
};

// Run the reset
resetDatabase();
