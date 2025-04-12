// components/SellersTable.tsx
//"use client";

import React, { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Seller {
  id: string;
  locations: {
    LocName: string;
  };
  Price: number;
  Name: string;
  "Shop Address": string;
  "Phone Num": string;
}

interface SellersTableProps {
  sellers: Seller[];
}

const SellersTable: React.FC<SellersTableProps> = ({ sellers }) => {
  const columns = useMemo<ColumnDef<Seller>[]>(
    () => [
      {
        accessorKey: "locations.LocName",
        header: "Location",
        cell: info => info.getValue() as string,
      },
      {
        accessorKey: "Price",
        header: "Price (₹)",
      },
      {
        accessorKey: "Name",
        header: "Seller Name",
      },
      {
        accessorKey: "Shop Address",
        header: "Shop Address",
      },
      {
        accessorKey: "Phone Num",
        header: "Phone Number",
      },
    ],
    []
  );

  const table = useReactTable({
    data: sellers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="pt-10 pb-4 text-3xl sm:text-4xl font-extrabold text-center text-white tracking-tight mb-10 relative z-10">
        <span className="relative inline-block px-4 ">
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-20 rounded-xl blur-md"></span>
          <span className="relative z-10">Available Sellers</span>
        </span>
      </h2>
      <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_30px_rgba(0,0,0,0.1)]">
        <Table className="w-full text-sm sm:text-base">
          <TableCaption className="text-white/70 text-center py-4">
            List of sellers for the selected item and location.
          </TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-blue-500 text-white font-semibold text-sm uppercase tracking-wide">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 py-3 text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-2 text-white">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default React.memo(SellersTable);
