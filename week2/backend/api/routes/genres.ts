import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { genres } from "../db/schema.js";
import { eq } from "drizzle-orm";

const genresRouter = new Hono();

// Get all genres
genresRouter.get("/", async (c) => {
  const allGenres = await drizzle.select().from(genres);
  return c.json(allGenres);
});

// Get genre by id
genresRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const genre = await drizzle.query.genres.findFirst({
    where: eq(genres.id, id),
  });
  if (!genre) {
    return c.json({ error: "Genre not found" }, 404);
  }
  return c.json(genre);
});

// Create a new genre
genresRouter.post("/", async (c) => {
  const { title } = await c.req.json();
  const result = await drizzle.insert(genres).values({ title }).returning();
  return c.json({ success: true, genre: result[0] }, 201);
});

// Update a genre
genresRouter.patch("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const { title } = await c.req.json();
  const updated = await drizzle.update(genres).set({ title }).where(eq(genres.id, id)).returning();
  if (updated.length === 0) {
    return c.json({ error: "Genre not found" }, 404);
  }
  return c.json({ success: true, genre: updated[0] });
});

// Delete a genre
genresRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await drizzle.delete(genres).where(eq(genres.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Genre not found" }, 404);
  }
  return c.json({ success: true, genre: deleted[0] });
});

export default genresRouter;