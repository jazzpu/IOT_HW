
import useSWR from "swr";
import { Container, Table, Title } from "@mantine/core";
import type { Order } from "../lib/models";
import Layout from "../components/layout";
import Loading from "../components/loading";

export default function AdminOrders() {
  const { data, isLoading } = useSWR<Order[]>("/orders"); // GET /api/v1/orders

  if (isLoading) return <Layout><Loading /></Layout>;

  // Sort orders by created date (latest to oldest)
  const sortedData = data?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Layout>
      <Container className="mt-8">
        <Title order={2}>Orders</Title>
        <Table striped highlightOnHover withTableBorder withColumnBorders mt="md">
          <Table.Thead>
            <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Items</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Note</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {sortedData?.map((r) => (
              <Table.Tr key={r.id}>
                <Table.Td>{r.id}</Table.Td>
                <Table.Td>{new Date(r.createdAt).toLocaleString()}</Table.Td>
                <Table.Td>
                  {Array.isArray(r.items) && r.items.length > 0 ? (
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {r.items.map((item: any, idx: number) => (
                        <li key={idx}>
                          {item.name} x {item.quantity} @ {item.unitPrice} ฿ = {item.subtotal} ฿
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "-"
                  )}
                </Table.Td>
                <Table.Td>{Number(r.total).toFixed(2)} ฿</Table.Td>
                <Table.Td>{r.note ?? "-"}</Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>
    </Container>
    </Layout>
  );
}
