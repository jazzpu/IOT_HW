// api/routes/orders.ts
import { Hono } from "hono";
import db from "../db/drizzle.js";
import { drinks, orders, orderItems } from "../db/schema";
import { inArray, eq, sql } from "drizzle-orm";

const ordersRouter = new Hono();
// orders.ts
ordersRouter.get("/", async (c) => {
  const result = await db.execute(sql/*sql*/`
    SELECT o.id,
           o.created_at AS "createdAt",
           o.note,
           COALESCE(SUM(oi.quantity), 0) AS "itemsCount",
           COALESCE(SUM(oi.quantity * oi.unit_price::numeric), 0) AS total
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id
    ORDER BY o.id DESC
  `);

  // Drizzle/pg/neon may return either an array OR { rows: [...] }
  const rows = Array.isArray(result) ? result : (result as any).rows;
  return c.json(rows); // <— always an array
});

ordersRouter.post("/", async (c) => {
  const body = await c.req.json().catch(() => ({} as any)) as {
    note?: string;
    items?: Array<{ drinkId: number; quantity: number }>;
  };

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return c.json({ message: "No items" }, 400);
  }

  const wanted = body.items
    .map(i => ({ drinkId: Number(i.drinkId), quantity: Number(i.quantity) }))
    .filter(i => Number.isInteger(i.drinkId) && i.quantity > 0);

  if (wanted.length === 0) return c.json({ message: "Invalid items" }, 400);

  const ids = [...new Set(wanted.map(i => i.drinkId))];
  const rows = await db.select().from(drinks).where(inArray(drinks.id, ids));
  if (rows.length !== ids.length) return c.json({ message: "Unknown drinkId" }, 400);

  const [o] = await db.insert(orders).values({ note: body.note ?? null }).returning();

  await db.insert(orderItems).values(
    wanted.map(w => {
      const d = rows.find(r => r.id === w.drinkId)!;
      return { orderId: o.id, drinkId: d.id, quantity: w.quantity, unitPrice: d.price };
    })
  );

  return c.json({ orderId: o.id }, 201);
});

ordersRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id)) return c.json({ message: "Invalid id" }, 400);

  const deleted = await db.delete(orders).where(eq(orders.id, id)).returning({ id: orders.id });
  if (deleted.length === 0) return c.json({ message: "Not found" }, 404);

  return c.body(null, 204);
});

ordersRouter.get("/", async (c) => {
  const summary = await db.execute(sql/*sql*/`
    SELECT o.id,
           o.created_at AS "createdAt",
           o.note,
           COALESCE(SUM(oi.quantity), 0) AS "itemsCount",
           COALESCE(SUM(oi.quantity * oi.unit_price::numeric), 0) AS total
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id
    ORDER BY o.id DESC
  `);
  return c.json(summary);
});

export default ordersRouter;
