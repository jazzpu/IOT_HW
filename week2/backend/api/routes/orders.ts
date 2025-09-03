import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { orders, orderItems, drinks } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const ordersRouter = new Hono();

ordersRouter.get("/", async (c) => {
  // Get all orders
  const allOrders = await drizzle.select().from(orders);
  // For each order, get items and calculate total
  const results = await Promise.all(
    allOrders.map(async (order) => {
      const items = await drizzle
        .select({
          drinkId: orderItems.drinkId,
          quantity: orderItems.quantity,
          name: drinks.name,
          unitPrice: drinks.price,
        })
        .from(orderItems)
        .leftJoin(drinks, eq(orderItems.drinkId, drinks.id))
        .where(eq(orderItems.orderId, order.id));

      const itemsCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const total = items.reduce((sum, item) => sum + (Number(item.unitPrice) * item.quantity), 0);
      const itemDetails = items.map(item => ({
        drinkId: item.drinkId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        subtotal: Number(item.unitPrice) * item.quantity,
      }));

      return {
        id: order.id,
        createdAt: order.createdAt,
        note: order.note,
        itemsCount: itemsCount.toString(),
        total: total.toFixed(2),
        items: itemDetails,
      };
    })
  );
  return c.json(results);
});

ordersRouter.get(":id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.query.orders.findFirst({
    where: eq(orders.id, id)
  });
  if (!result) {
    return c.json({ error: "Order not found" }, 404);
  }
  return c.json(result);
});

// Create order
ordersRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      note: z.string().nullable().optional(),
      items: z.array(z.object({ drinkId: z.number(), quantity: z.number().min(1) }))
    })
  ),
  async (c) => {
    const { note, items } = await c.req.json();
    const [order] = await drizzle.insert(orders).values({ note }).returning();
    if (!order) return c.json({ error: "Order creation failed" }, 500);
    // Insert order items
    await Promise.all(items.map((item: { drinkId: number; quantity: number }) =>
      drizzle.insert(orderItems).values({ orderId: order.id, drinkId: item.drinkId, quantity: item.quantity })
    ));
    return c.json(order);
  }
);

// Update order note only
ordersRouter.put(
  "/:id",
  zValidator(
    "json",
    z.object({ note: z.string().nullable().optional() })
  ),
  async (c) => {
    const id = Number(c.req.param("id"));
    const { note } = await c.req.json();
    const [order] = await drizzle.update(orders).set({ note }).where(eq(orders.id, id)).returning();
    if (!order) return c.json({ error: "Order not found" }, 404);
    return c.json(order);
  }
);

// Delete order
ordersRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const [order] = await drizzle.delete(orders).where(eq(orders.id, id)).returning();
  if (!order) return c.json({ error: "Order not found" }, 404);
  return c.json({ success: true });
});

export default ordersRouter;
