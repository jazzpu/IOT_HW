import { drizzle as drizzlePgsql } from "drizzle-orm/vercel-postgres/index.js";
import * as schema from "./schema.js";

const drizzle = drizzlePgsql({
  casing: "snake_case",
  schema,
});

export default drizzle;
