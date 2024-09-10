import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import * as dbSchema from './schema';

export const dbCredentials = {
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!, 10),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!
};

const client = new Client(dbCredentials);
(async () => { await client.connect() })();

export const db = drizzle(client, { schema: dbSchema });