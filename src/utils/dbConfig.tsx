import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const dbURL = import.meta.env.VITE_DB_URL;

const sql = neon(`${dbURL}`);

export const db = drizzle(sql, {
  schema,
});
