import { relations } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/gel-core";
import * as t from "drizzle-orm/pg-core";

export const students = t.pgTable("students", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  firstname: t.varchar({ length: 100 }).notNull(),
  surname: t.varchar({ length: 80 }).notNull(),
  studentId: t.varchar({ length: 10 }).notNull().unique(),
  dateOfBirth: t.date().notNull(),
  gender: t.varchar({ length: 6 }).notNull()
});

export const genres = t.pgTable("genres", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  title: t
    .varchar({
      length: 255,
    })
    .notNull(),
});

export const books = t.pgTable("books", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  title: t.varchar({ length: 255 }).notNull(),
  author: t.varchar({ length: 255 }).notNull(),
  publishedAt: t.timestamp().notNull(),
  genreId: t.bigint({ mode: "number" }).references(() => genres.id, { onDelete: "set null" }),
  description: t.text(),
  summary: t.text(),
});

export const bookRelations = relations(books, ({ one }) => ({
  genre: one(genres, {
    fields: [books.genreId],
    references: [genres.id],
  })
}));

export const drinks = t.pgTable("drinks", {
  id: t.serial("id").primaryKey(),
  name: t.varchar("name", { length: 255 }).notNull(),
  price: t.numeric("price", { precision: 10, scale: 2 }).notNull(),
});

export const orders = t.pgTable("orders", {
  id: t.serial("id").primaryKey(),
  createdAt: t.timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  note: t.varchar("note", { length: 255 }),
});

export const orderItems = t.pgTable("order_items", {
  id: t.serial("id").primaryKey(),
  orderId: t.integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  drinkId: t.integer("drink_id").notNull().references(() => drinks.id, { onDelete: "restrict" }),
  quantity: t.integer("quantity").notNull().default(1),
  unitPrice: t.numeric("unit_price", { precision: 10, scale: 2 }).notNull(), // snapshot
});
