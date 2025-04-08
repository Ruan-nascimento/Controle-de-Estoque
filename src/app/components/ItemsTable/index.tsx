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
  getPaginationRowModel,
  ColumnFiltersState,
  Updater,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { columns } from "./columns";
import { Spinner } from "../spinner";
import { Item } from "@/app/controllers/getAllItems";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "lucide-react";

interface ItemsTableProps {
  onSelectionChange: (ids: string[]) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState) => void;
  setOpenEditModal: (val: boolean, item?: Item) => void;
  searchTerm: string;
  items: Item[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function ItemsTable({
  onSelectionChange,
  columnFilters,
  setColumnFilters,
  setOpenEditModal,
  searchTerm,
  items,
  loading,
  error,
  refetch,
}: ItemsTableProps) {
  const [pageIndex, setPageIndex] = useState(0);

  const table = useReactTable({
    data: items,
    columns: columns(setOpenEditModal),
    state: {
      columnFilters,
      globalFilter: searchTerm,
      pagination: {
        pageIndex, 
        pageSize: 10
      },
    },
    onColumnFiltersChange: (updater: Updater<ColumnFiltersState>) => {
      if (typeof updater === "function") {
        setColumnFilters(updater(columnFilters));
      } else {
        setColumnFilters(updater);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

  const totalItems = items.length;
  const pageCount = Math.ceil(totalItems / 10); 

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="border border-zinc-200/20 rounded-lg">
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

      {totalItems > 10 && (
      <div className="flex justify-end gap-2 items-center">
        <Button
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
          disabled={pageIndex === 0}
          className="bg-zinc-700 text-zinc-200 hover:bg-blue-500/60"
        >
          <ArrowLeftCircleIcon/>
        </Button>
        <span className="text-zinc-200">{pageIndex + 1} / {pageCount}</span>
        <Button
          onClick={() => setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))}
          disabled={pageIndex >= pageCount - 1}
          className="bg-zinc-700 text-zinc-200 hover:bg-blue-500/60"
        >
          <ArrowRightCircleIcon/>
        </Button>
      </div>
)}
    </div>
  );
}