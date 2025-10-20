"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { QRCodeModal } from "@/components/ui/qr-code-modal";
import { LinkStatsModal } from "@/components/ui/link-stats-modal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Link } from "@/types/link.type";
import { useLinkStore } from "@/stores/link.store";
import { useAuthStore } from "@/stores/auth.store";
import { useLinkStoreInitializer } from "@/hooks/use-link-store-initializer";
import { getShortUrl } from "@/lib/utils";

export const columns: ColumnDef<Link>[] = [
  {
    accessorKey: "original_url",
    header: "Liên kết",
    cell: ({ row }) => (
      <div
        className="max-w-xs truncate"
        title={row.getValue("original_url") as string}
      >
        <a
          className="hover:underline cursor-pointer hover:text-primary text-sm"
          onClick={() => {
            // open in new tab
            window.open(row.getValue("original_url"), "_blank");
          }}
        >
          {row.getValue("original_url")}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "short_code",
    header: () => {
      return <div className="text-left">URL Rút gọn</div>;
    },
    cell: ({ row }) => {
      const shortCode = row.getValue("short_code") as string;
      const fullUrl = getShortUrl(shortCode);
      return (
        <div className="max-w-xs truncate flex items-center gap-2 ">
          <a
            className="hover:underline cursor-pointer hover:text-primary text-sm"
            onClick={() => {
              // open in new tab
              window.open(fullUrl, "_blank");
            }}
          >
            {fullUrl}
          </a>
          <CopyButton text={fullUrl} />
        </div>
      );
    },
  },
  {
    accessorKey: "qr_code",
    header: () => <div className="text-center">Mã QR</div>,
    cell: ({ row }) => {
      const link = row.original;
      return (
        <div className="text-center font-medium">
          <QRCodeModal linkId={link.id} />
        </div>
      );
    },
  },
  {
    accessorKey: "click_count",
    header: () => <div className="text-center">Xem thống kê</div>,
    cell: ({ row }) => {
      const link = row.original;
      return (
        <div className="text-center">
          <LinkStatsModal
            linkId={link.id}
            trigger={
              <Button variant="outline" size="sm">
                Xem
              </Button>
            }
          />
        </div>
      );
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   header: () => <div className="text-center">Hành động</div>,
  //   cell: ({ row }) => {
  //     const link = row.original;
  //     return (
  //       <div className="text-center">
  //         <LinkActionsModal
  //           link={link}
  //           trigger={
  //             <Button variant="ghost" size="sm">
  //               <MoreHorizontal className="h-4 w-4" />
  //             </Button>
  //           }
  //         />
  //       </div>
  //     );
  //   },
  // },
];

export default function LinkTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { links, isLoading } = useLinkStore();
  const { user_profile } = useAuthStore();

  // Initialize link store based on authentication status
  useLinkStoreInitializer();
  // Sort links by created_at (newest first)
  const sortedLinks = React.useMemo(() => {
    return [...links].sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA; // Newest first
    });
  }, [links]);

  const table = useReactTable({
    data: sortedLinks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full bg-white">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {user_profile?.role === "anonymous"
                    ? "Chưa có liên kết nào được tạo. Tạo liên kết đầu tiên của bạn!"
                    : "Chưa có liên kết nào được tạo."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button> */}
        </div>
      </div>
    </div>
  );
}
