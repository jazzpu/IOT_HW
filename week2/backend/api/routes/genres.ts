import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { genres } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const genresRouter = new Hono();

genresRouter.get("/", async (c) => {
    const allGenres = await drizzle.select().from(genres);
    return c.json(allGenres);
});

genresRouter.get("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const result = await drizzle.query.genres.findFirst({
        where: eq(genres.id, id),
    });
    if (!result) {
        return c.json({ error: "Genre not found" }, 404);
    }
    return c.json(result);
});

genresRouter.post("/",
    zValidator(
        "json",
        z.object({
            title: z.string().min(1, "Title is required"),
        })
    ),
    async (c) => {
        const { title } = c.req.valid("json");
        const result = await drizzle
            .insert(genres)
            .values({ title })
            .returning();
        return c.json({ success: true, genre: result[0] }, 201);
});

genresRouter.patch("/:id",
    zValidator(
        "json",
        z.object({
            title: z.string().min(1, "Title is required"),
        })
    ),
    async (c) => {
        const id = Number(c.req.param("id"));
        const { title } = c.req.valid("json");
        const result = await drizzle
            .update(genres)
            .set({ title })
            .where(eq(genres.id, id))
            .returning();
        if (result.length === 0) {
            return c.json({ error: "Genre not found" }, 404);
        }
        return c.json({ success: true, genre: result[0] });
});

genresRouter.delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const result = await drizzle
        .delete(genres)
        .where(eq(genres.id, id))
        .returning();
    if (result.length === 0) {
        return c.json({ error: "Genre not found" }, 404);
    }
    return c.json({ success: true, message: "Genre deleted successfully" });
});

export default genresRouter;