import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { students } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const studentsRouter = new Hono();

studentsRouter.get("/", async (c) => {
  const allstudents = await drizzle.select().from(students);
  return c.json(allstudents);
});


studentsRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.query.students.findFirst({
    where: eq(students.id, id)
  });
  if (!result) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json(result);
});
studentsRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      firstname: z.string().min(1),
      surname: z.string().min(1),
      studentId: z.string().min(1).max(10),
      dateOfBirth: z.string(),
      gender: z.string().min(1).max(6),
    })
  ),

  async (c) => {
    const { firstname, surname, studentId, dateOfBirth, gender } = c.req.valid("json");
    const result = await drizzle
      .insert(students)
      .values({
        firstname,
        surname,
        studentId,
        dateOfBirth,
        gender
      })
      .returning();
    return c.json({ success: true, student: result[0] }, 201);
  }
);

studentsRouter.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      firstname: z.string().min(1).optional(),
      surname: z.string().min(1).optional(),
      studentId: z.string().min(8),
      dateOfBirth: z.iso
        .datetime({
          offset: true,
        })
        .optional(),
      gender: z.string().min(1),
    })
  ),
  async (c) => {
    const id = Number(c.req.param("id"));
    const data = c.req.valid("json");
    const updated = await drizzle.update(students).set(data).where(eq(students.id, id)).returning();
    if (updated.length === 0) {
      return c.json({ error: "Student not found" }, 404);
    }
    return c.json({ success: true, student: updated[0] });
  }
);

studentsRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await drizzle.delete(students).where(eq(students.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json({ success: true, student: deleted[0] });
});

export default studentsRouter;
