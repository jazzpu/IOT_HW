import useSWR from "swr";
import { Container, Table, Title } from "@mantine/core";

type Row = { id: number; createdAt: string; note: string | null; itemsCount: string; total: string };

export default function AdminOrders() {
  const { data } = useSWR<Row[]>("/orders"); // GET /api/v1/orders

  return (
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
          {data?.map(r => (
            <Table.Tr key={r.id}>
              <Table.Td>{r.id}</Table.Td>
              <Table.Td>{new Date(r.createdAt).toLocaleString()}</Table.Td>
              <Table.Td>{r.itemsCount}</Table.Td>
              <Table.Td>{Number(r.total).toFixed(2)} ฿</Table.Td>
              <Table.Td>{r.note ?? "-"}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  );
}
