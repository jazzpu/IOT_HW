import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { drinks } from "../db/schema";

const menusRouter = new Hono();

menusRouter.get("/", async (c) => {
  const rows = await drizzle.select().from(drinks);
  return c.json(rows);
});


export default menusRouter;
