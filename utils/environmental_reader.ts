import { config } from "../dependecies.ts";

const SERVER_PORT_ENV = "SERVER_PORT_ENV";
const SERVER_PORT_ENV_DEFAULT = 8080;

const DATABASE_URL_ENV = "DATABASE_URL_ENV";
const DATABASE_URL_ENV_DEFAULT = "mongodb://localhost:27017";

const DATABASE_NAME_ENV = "DATABASE_NAME_ENV";
const DATABASE_NAME_ENV_DEFAULT = "control_room";

export const port = () => {
    const server_port = Deno.env.get(SERVER_PORT_ENV);
    if (server_port) return server_port;

    const { PORT } = config();
    if (PORT) return PORT;

    console.log("No port provided, using:", SERVER_PORT_ENV_DEFAULT);
    return SERVER_PORT_ENV_DEFAULT
}

export const mongo_url = () => {
    const dabatase_url = Deno.env.get(DATABASE_URL_ENV);
    if (dabatase_url) return dabatase_url;

    const { MONGO_URL } = config();
    if (MONGO_URL) return MONGO_URL;

    console.log("No database url provided, using:", DATABASE_URL_ENV_DEFAULT);
    return DATABASE_URL_ENV_DEFAULT;
}

export const mongo_db_name = () => {
    const dabatase_name = Deno.env.get(DATABASE_NAME_ENV);
    if (dabatase_name) return dabatase_name;

    const { MONGO_DB_NAME } = config();
    if (MONGO_DB_NAME) return MONGO_DB_NAME;

    console.log("No database name provided, using:", DATABASE_NAME_ENV_DEFAULT);
    return DATABASE_NAME_ENV_DEFAULT;
}
