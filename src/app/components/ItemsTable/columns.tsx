import { ColumnDef } from "@tanstack/react-table";
import { Item } from "@/app/controllers/getAllItems";

export const columns = (
  setOpenEditModal: (val: boolean, item?: Item) => void
): ColumnDef<Item>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Item",
    cell: ({ row }) => (
      <span
        className="hover:underline hover:text-cyan-600 cursor-pointer"
        onClick={() => setOpenEditModal(true, row.original)}
      >
        {row.getValue("name")}
      </span>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: "type",
    header: "Tipo",
    enableColumnFilter: true,
  },
  {
    accessorKey: "flavor",
    header: "Sabor",
    enableColumnFilter: true,
  },
  {
    accessorKey: "qtd",
    header: "Quantidade",
  },
  {
    accessorKey: "value",
    header: "Valor R$",
    cell: ({ row }) => {
      const value = row.getValue("value") as number;
      const formattedValue = new Intl.NumberFormat("pt-br", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
      return <span className="text-green-600 font-semibold">{formattedValue}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    enableColumnFilter: true,
  },
];