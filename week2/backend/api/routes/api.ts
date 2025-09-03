import { Hono } from "hono";
import studentsRouter from "./students.js";
import booksRouter from "./books.js";
import genresRouter from "./genres.js";
import drinksRouter from "./drinks.js";
import ordersRouter from "./orders.js";
import { bearerAuth } from "hono/bearer-auth";
import { env } from "hono/adapter";

const apiRouter = new Hono();

apiRouter.get("/", (c) => {
  return c.json({ message: "API Alive" });
});

apiRouter.use(
  "*",
  bearerAuth({
    verifyToken: async (token, c) => {
      const { API_SECRET } = env<{ API_SECRET: string }>(c);
      return token === API_SECRET;
    },
  })
);

apiRouter.route("/students", studentsRouter);
apiRouter.route("/books", booksRouter);
apiRouter.route("/genres", genresRouter);

apiRouter.route("/drinks", drinksRouter);
apiRouter.route("/orders", ordersRouter);

export default apiRouter;
