import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { drinks } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const drinksRouter = new Hono();

drinksRouter.get("/", async (c) => {
  const allDrinks = await drizzle.select().from(drinks);
  return c.json(allDrinks);
});

drinksRouter.get(":id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.query.drinks.findFirst({
    where: eq(drinks.id, id)
  });
  if (!result) {
    return c.json({ error: "Drink not found" }, 404);
  }
  return c.json(result);
});

// Create drink
drinksRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1),
      price: z.string().min(1),
    })
  ),
  async (c) => {
    const { name, price } = await c.req.json();
    const [drink] = await drizzle
      .insert(drinks)
      .values({ name, price })
      .returning();
    return c.json(drink);
  }
);

// Update drink
drinksRouter.put(
  "/:id",
  zValidator(
    "json",
    z.object({
      name: z.string().min(1).optional(),
      price: z.string().min(1).optional(),
    })
  ),
  async (c) => {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const [drink] = await drizzle
      .update(drinks)
      .set(body)
      .where(eq(drinks.id, id))
      .returning();
    if (!drink) return c.json({ error: "Drink not found" }, 404);
    return c.json(drink);
  }
);

// Delete drink
drinksRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const [drink] = await drizzle
    .delete(drinks)
    .where(eq(drinks.id, id))
    .returning();
  if (!drink) return c.json({ error: "Drink not found" }, 404);
  return c.json({ success: true });
});

export default drinksRouter;
