import useSWR from "swr";
import axios from "axios";
import { useMemo, useState } from "react";
import { Button, Card, Container, Divider, Grid, Group, NumberInput, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCart } from "../lib/cart";
import Layout from "../components/layout";

type Drink = { id: number; name: string; price: string }; // price from PG numeric is string

export default function MenusPage() {

  const { data: drinks, isLoading } = useSWR<Drink[]>("/drinks");
  const { cart, add, setQty, remove, clear } = useCart();
  const [note, setNote] = useState("");

  const lines = useMemo(() => {
    if (!drinks) return [];
    return cart.map(ci => {
      const d = drinks.find(x => x.id === ci.drinkId);
      if (!d) return null;
      const unitPrice = Number(d.price);
      return { drinkId: d.id, name: d.name, quantity: ci.quantity, unitPrice, subtotal: unitPrice * ci.quantity };
    }).filter(Boolean) as { drinkId: number; name: string; quantity: number; unitPrice: number; subtotal: number }[];
  }, [cart, drinks]);

  const total = lines.reduce((s, l) => s + l.subtotal, 0);

  const checkout = async () => {
    if (!cart.length) return notifications.show({ color: "yellow", title: "ยังไม่มีรายการ", message: "โปรดเลือกเครื่องดื่ม" });
    try {
      await axios.post("/orders", {
        note: note || null,
        items: cart.map(i => ({ drinkId: i.drinkId, quantity: i.quantity })),
      });
      notifications.show({ color: "teal", title: "สั่งสำเร็จ", message: "ออเดอร์ถูกบันทึกแล้ว" });
      clear(); setNote("");
    } catch (e: any) {
      notifications.show({ color: "red", title: "สั่งซื้อไม่สำเร็จ", message: e?.response?.data?.message ?? "กรุณาลองใหม่" });
    }
  };

  return (
    <Layout>
      <Container className="mt-8">
        <Title order={2}>เมนูเครื่องดื่ม</Title>
        <Divider my="md" />
        {isLoading && <Text>กำลังโหลด...</Text>}

        <Grid>
          {drinks?.map(d => (
            <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }} key={d.id}>
              <Card withBorder radius="md" padding="md">
                <Text fw={600}>{d.name}</Text>
                <Text c="dimmed" mt={4}>{Number(d.price).toFixed(2)} ฿</Text>
                <Group mt="sm" justify="space-between">
                  <Button size="xs" onClick={() => add(d.id, 1)}>เพิ่ม</Button>
                  <NumberInput
                    size="xs"
                    min={0}
                    value={cart.find(i => i.drinkId === d.id)?.quantity ?? 0}
                    onChange={(v) => setQty(d.id, Number(v) || 0)}
                    w={100}
                  />
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        <Divider my="lg" />
        <Title order={3}>ตะกร้า</Title>
        {!lines.length && <Text c="dimmed">ยังไม่มีรายการ</Text>}

        {lines.map(l => (
          <Group key={l.drinkId} justify="space-between" mt="xs">
            <Text>{l.name} × {l.quantity}</Text>
            <Group gap="xs">
              <Text>{l.subtotal.toFixed(2)} ฿</Text>
              <Button size="xs" variant="light" color="red" onClick={() => remove(l.drinkId)}>ลบ</Button>
            </Group>
          </Group>
        ))}

        {!!lines.length && (
          <>
            <Group justify="space-between" mt="md">
              <Text fw={600}>รวม</Text>
              <Text fw={700}>{total.toFixed(2)} ฿</Text>
            </Group>
            <Group mt="md" gap="sm">
              <input
                placeholder="โน้ต (เช่น หวานน้อย)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
              />
              <Button onClick={checkout}>ยืนยันออเดอร์</Button>
              <Button variant="light" color="gray" onClick={clear}>ล้างตะกร้า</Button>
            </Group>
          </>
        )}
      </Container>
    </Layout>
  );
}
