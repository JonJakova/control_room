import { config } from "../dependecies.ts";

export const port = () => {
    const server_port = Deno.env.get("SERVER_PORT_ENV");
    if (server_port) return server_port;

    const { PORT } = config();
    if (PORT) return PORT;

    console.log("No port provided, using 8080");
    return 8080;
}

export const mongo_url = () => {
    const dabatase_url = Deno.env.get("DATABASE_URL_ENV");
    if (dabatase_url) return dabatase_url;

    const { MONGO_URL } = config();
    if (MONGO_URL) return MONGO_URL;

    console.log("No database url provided, using mongodb://localhost:27017");
    return "mongodb://localhost:27017";
}

export const mongo_db_name = () => {
    const dabatase_name = Deno.env.get("DATABASE_NAME_ENV");
    if (dabatase_name) return dabatase_name;

    const { MONGO_DB_NAME } = config();
    if (MONGO_DB_NAME) return MONGO_DB_NAME;

    console.log("No database name provided, using control_room");
    return "control_room";
}
