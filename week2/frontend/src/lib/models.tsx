export interface Book {
  id: number;
  title: string;
  author: string;
  publishedAt: string;
  genreId?: number;
  description?: string;
  summary?: string;
}

export interface Genre {
  id: number;
  title: string;
}

export interface Drink {
  id: number;
  name: string;
  price: string;
}

export interface Order {
  id: number;
  createdAt: string;
  order?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  unitPrice: number;
}