/// <reference types="vite/client" />

const dbURL = import.meta.env.VITE_DB_URL;

export default {
  dialect: 'postgresql',
  schema: './src/utils/schema.tsx',
  out: './drizzle',
  dbCredentials: {
    url: `${dbURL}`,
    connectionString: `${dbURL}`,
  },
};
