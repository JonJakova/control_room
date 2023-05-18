import { MongoClient } from "../dependecies.ts"
import { mongo_db_name, mongo_url } from "../utils/environmental_reader.ts";

const client = new MongoClient();

await client.connect(mongo_url());
console.log("Connected to MongoDB");

export const control_room_db = client.database(mongo_db_name());
export default client;