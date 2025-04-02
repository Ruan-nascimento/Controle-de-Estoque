"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ColumnFiltersState } from "@tanstack/react-table";

import { columns } from "./columns";
import { useEffect, useMemo } from "react";
import { Item } from "@/app/controllers/getAllItems";
import { Spinner } from "../spinner";

interface ItemsTableProps {
  setOpenEditModal: (val: boolean, item?: Item) => void;
  columnFilters: ColumnFiltersState;
  onSelectionChange: (selectedIds: string[]) => void;
  searchTerm: string;
  items: Item[];
  loading: boolean; 
  error: string | null; 
  refetch: () => Promise<void>; 
}

export function ItemsTable({
  setOpenEditModal,
  columnFilters,
  onSelectionChange,
  searchTerm,
  items,
  loading,
  error,
  refetch,
}: ItemsTableProps) {
  const table = useReactTable({
    data: items,
    columns: columns(setOpenEditModal),
    state: {
      columnFilters,
      globalFilter: searchTerm,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const name = row.getValue("name") as string;
      return name.toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  const selectedIds = useMemo(
    () => table.getSelectedRowModel().rows.map((row) => row.original.id),
    [table.getSelectedRowModel().rows]
  );

  useEffect(() => {
    onSelectionChange(selectedIds);
  }, [selectedIds, onSelectionChange]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="mt-8 text-center text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="mt-8 border border-zinc-200/20 rounded-lg">
      <Table>
        <TableHeader className="bg-zinc-700/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:shadow-glow-left-blue transition-all cursor-pointer hover:bg-zinc-700/20"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns(setOpenEditModal).length}
                className="h-24 text-center"
              >
                Nenhum Produto encontrado...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}