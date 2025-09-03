import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

export const students = t.pgTable("students", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  fname: t
    .varchar({
      length: 255,
    })
    .notNull(),
  lname: t
    .varchar({
      length: 255,
    })
    .notNull(),
  studentId: t
    .varchar({
      length: 255,
    })
    .notNull()
    .unique(),
    dob: t.date().notNull(),
  sex: t
    .varchar({
      length: 10,
    })
    .notNull(),
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
  title: t
    .varchar({
      length: 255,
    })
    .notNull(),
  author: t
    .varchar({
      length: 255,
    })
    .notNull(),
  description: t.text(),
  synopsis: t.text(),
  publishedAt: t.timestamp().notNull(),

  genreId: t.bigint({ mode: "number" }).references(() => genres.id, {
    onDelete: "set null",
  }),
});

export const bookRelations = relations(books, ({ one }) => ({
  genre: one(genres, {
    fields: [books.genreId],
    references: [genres.id],
  }),
}));

// Drinks table
export const drinks = t.pgTable("drinks", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  name: t.varchar({ length: 255 }).notNull(),
  price: t.numeric().notNull(),
});

// Orders table
export const orders = t.pgTable("orders", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  createdAt: t.timestamp().defaultNow().notNull(),
  note: t.text(),
});

// OrderItems table
export const orderItems = t.pgTable("order_items", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  orderId: t.bigint({ mode: "number" }).references(() => orders.id, { onDelete: "cascade" }).notNull(),
  drinkId: t.bigint({ mode: "number" }).references(() => drinks.id, { onDelete: "restrict" }).notNull(),
  quantity: t.integer().notNull(),
});

export const drinkRelations = relations(drinks, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const orderRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  drink: one(drinks, {
    fields: [orderItems.drinkId],
    references: [drinks.id],
  }),
}));
