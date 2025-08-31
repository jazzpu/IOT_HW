import { Hono } from "hono";
import studentsRouter from "./students.js";
import booksRouter from "./books.js";
import { bearerAuth } from "hono/bearer-auth";
import { env } from "hono/adapter";

const apiRouter = new Hono();

apiRouter.get("/", (c) => {
  return c.json({ message: "Students API" });
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

export default apiRouter;
