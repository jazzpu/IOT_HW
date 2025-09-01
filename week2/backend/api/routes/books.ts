import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { books, genres } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const booksRouter = new Hono();

booksRouter.get("/", async (c) => {
  const allBooks = await drizzle.select().from(books);
  return c.json(allBooks);
});

booksRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  // Join books and genres to get the genre title
  const result = await drizzle
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      publishedAt: books.publishedAt,
      genreId: books.genreId,
      description: books.description,
      summary: books.summary,
      genre: genres.title, // joined genre name
    })
    .from(books)
    .leftJoin(genres, eq(books.genreId, genres.id))
    .where(eq(books.id, id));

  if (!result || result.length === 0) {
    return c.json({ error: "Book not found" }, 404);
  }
  return c.json(result[0]);
});
booksRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      title: z.string().min(1),
      author: z.string().min(1),
      publishedAt: z
        .string()
        .refine((value) => dayjs(value, "YYYY-MM-DD", true).isValid(), {
          message: "Invalid date format. Use YYYY-MM-DD.",
        }),
      genreId: z.number().int().optional(),
      description: z.string().optional(),
      summary: z.string().optional(),
    })
  ),
  async (c) => {
    const { title, author, publishedAt, genreId, description, summary } = c.req.valid("json");
    const result = await drizzle
      .insert(books)
      .values({
        title,
        author,
        publishedAt: new Date(publishedAt),
        genreId,
        description,
        summary,
      })
      .returning();
    return c.json({ success: true, book: result[0] }, 201);
  }
);

booksRouter.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      title: z.string().min(1).optional(),
      author: z.string().min(1).optional(),
      publishedAt: z
        .string()
        .refine((value) => dayjs(value, "YYYY-MM-DD", true).isValid(), {
          message: "Invalid date format. Use YYYY-MM-DD.",
        })
        .optional(),
      genreId: z.number().int().optional(),
      description: z.string().optional(),
      summary: z.string().optional(),
    })
  ),
  async (c) => {
    const id = Number(c.req.param("id"));
    const { title, author, publishedAt, genreId, description, summary } = c.req.valid("json");
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (publishedAt !== undefined) updateData.publishedAt = new Date(publishedAt);
    if (genreId !== undefined) updateData.genreId = genreId;
    if (description !== undefined) updateData.description = description;
    if (summary !== undefined) updateData.summary = summary;

    const updated = await drizzle
      .update(books)
      .set(updateData)
      .where(eq(books.id, id))
      .returning();

    if (updated.length === 0) {
      return c.json({ error: "Book not found" }, 404);
    }
    return c.json({ success: true, book: updated[0] });
  }
);

booksRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await drizzle.delete(books).where(eq(books.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Book not found" }, 404);
  }
  return c.json({ success: true, book: deleted[0] });
});

export default booksRouter;
