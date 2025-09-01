import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";

export type CartItem = { drinkId: number; quantity: number };
type CartCtx = {
  cart: CartItem[];
  add: (drinkId: number, qty?: number) => void;
  setQty: (drinkId: number, qty: number) => void;
  remove: (drinkId: number) => void;
  clear: () => void;
};
const CartContext = createContext<CartCtx | null>(null);
const COOKIE_KEY = "cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  useEffect(() => { const raw = Cookies.get(COOKIE_KEY); if (raw) try { setCart(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { Cookies.set(COOKIE_KEY, JSON.stringify(cart), { sameSite: "Lax", expires: 2 }); }, [cart]);

  const api = useMemo<CartCtx>(() => ({
    cart,
    add: (id, qty = 1) => setCart(p => {
      const i = p.findIndex(x => x.drinkId === id);
      if (i === -1) return [...p, { drinkId: id, quantity: qty }];
      const next = [...p]; next[i] = { ...next[i], quantity: next[i].quantity + qty }; return next;
    }),
    setQty: (id, qty) => setCart(p => {
      const i = p.findIndex(x => x.drinkId === id);
      if (i === -1 && qty > 0) return [...p, { drinkId: id, quantity: qty }];
      if (i === -1) return p;
      if (qty <= 0) return p.filter(x => x.drinkId !== id);
      const next = [...p]; next[i] = { drinkId: id, quantity: qty }; return next;
    }),
    remove: id => setCart(p => p.filter(x => x.drinkId !== id)),
    clear: () => setCart([]),
  }), [cart]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
