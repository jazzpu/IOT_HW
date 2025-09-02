import { Hono } from "hono";
import { cors } from "hono/cors";
import apiRouter from "./routes/api.js";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

// Allow these origins
const allowedOrigins = new Set([
  "https://frontend-dusky-three-15.vercel.app",
  "http://localhost:5173",
]);

app.use(
  "/*",
  cors({
    origin: (origin /*: string | null*/, c) => {
      // Non-browser or same-origin requests might not send an Origin
      if (!origin) return "*"; // ok if credentials: false
      return allowedOrigins.has(origin) ? origin : null; // <- must return string|null
    },
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: false, // set to true only if you use cookies/Authorization + credentials
    maxAge: 86400,
  })
);

app.route("/v1", apiRouter);

export const config = { runtime: "edge" };
export default handle(app);
