import { MongoClient } from "mongodb";

const uri = 'mongodb+srv://admin:admin1111@my-cluster.a7hyf.mongodb.net/newsDb'; // Place the connection string in your .env file
let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // Ensure the client is reused during development to avoid connection exhaustion
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, it's best to not use a global variable
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
