import { MongoClient } from "../dependecies.ts"
import { config } from "../dependecies.ts"

const client = new MongoClient();

await client.connect(config().MONGO_URL);
console.log("Connected to MongoDB");

export const control_room_db = client.database(config().MONGO_DB_NAME);
export default client;
