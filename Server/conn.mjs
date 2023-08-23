import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let conn;
let db;
try {
  conn = await client.connect();
  db = conn.db("Chatroom");
} catch(e) {
  console.error(e);
}


export default db;
