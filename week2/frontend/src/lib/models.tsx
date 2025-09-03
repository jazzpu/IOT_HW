export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  synopsis?: string;
  publishedAt: string;
  genreId?: number;
  genre?: number;
}

export interface Genre {
  id: number;
  title: string;
}

export interface Drink {
  id: number;
  name: string;
  price: string; // price from PG numeric is string
}

export interface OrderItem {
  drinkId: number;
  quantity: number;
  name?: string;
  unitPrice?: number;
  subtotal?: number;
}

export interface Order {
  id: number;
  createdAt: string;
  note: string | null;
  itemsCount: string;
  total: string;
  items?: OrderItem[];
}