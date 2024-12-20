"use client";

import * as React from "react";
import "../../styles/common.css";
import { ColumnDef, flexRender } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { LoaderIconSVG } from "@/utils/SVGs/SVGs";
import "../../styles/common.css";
import { ScrollArea } from "../ui/scroll-area";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  tableInstance: any;
  loading: boolean;
  queryParams: string;
}

export function DataTable<TData, TValue>({
  queryParams,
  columns,
  tableInstance,
  loading,
}: DataTableProps<TData, TValue>) {
  // return (
  //   <div className="space-y-4 text-[#676879]">
  //     <div className="rounded-md border">
  //       <div className="h-[78vh] overflow-x-auto bg-[#fff] boxShadow">
  //         <div className="overflow-x-auto max-w-[100%] ">
  //           <Table className="bg-[#fff]">
  //             <TableHeader className="bg-[#29354f] sticky top-0 z-10 ">
  //               {/* Make the header sticky */}
  //               {tableInstance &&
  //                 tableInstance?.getHeaderGroups()?.map((headerGroup: any) => (
  //                   <TableRow key={headerGroup?.id}>
  //                     {headerGroup?.headers?.map((header: any) => {
  //                       return (
  //                         <TableHead
  //                           key={header?.id}
  //                           colSpan={header?.colSpan}
  //                           className={`${
  //                             header?.id === "actions" ||
  //                             header?.id === "avatar"
  //                               ? "flex justify-center items-center text-nowrap "
  //                               : "text-nowrap"
  //                           } text-white`}
  //                         >
  //                           {header?.isPlaceholder
  //                             ? null
  //                             : flexRender(
  //                                 header?.column?.columnDef?.header,
  //                                 header?.getContext()
  //                               )}
  //                         </TableHead>
  //                       );
  //                     })}
  //                   </TableRow>
  //                 ))}
  //             </TableHeader>
  //             <TableBody>
  //               {loading ? (
  //                 <TableRow>
  //                   <TableCell colSpan={columns?.length} className="h-24 ">
  //                     {tableInstance?.options?.data?.[0] &&
  //                     Object.keys(tableInstance?.options?.data[0]).some(
  //                       (item) => item === "socialMedia"
  //                     ) ? (
  //                       <div className="flex justify-start ml-[500px]">
  //                         <LoaderIconSVG />
  //                         <span className="px-2">Loading...</span>
  //                       </div>
  //                     ) : (
  //                       <div className="flex justify-center">
  //                         <LoaderIconSVG />
  //                         <span className="px-2">Loading...</span>
  //                       </div>
  //                     )}
  //                   </TableCell>
  //                 </TableRow>
  //               ) : tableInstance?.getRowModel()?.rows?.length !== 0 ? (
  //                 tableInstance?.getRowModel()?.rows?.map((row: any) => (
  //                   <TableRow
  //                     key={row?.id}
  //                     data-state={row?.getIsSelected() && "selected"}
  //                     className="bg-slate-200"
  //                   >
  //                     {row?.getVisibleCells()?.map((cell: any) => (
  //                       <TableCell
  //                         key={cell?.id}
  //                         className={`${
  //                           cell?.column?.id === "actions" ||
  //                           cell?.column?.id === "avatar"
  //                             ? "flex justify-center items-center text-nowrap"
  //                             : ""
  //                         }`}
  //                       >
  //                         {flexRender(
  //                           cell?.column?.columnDef?.cell,
  //                           cell?.getContext()
  //                         )}
  //                       </TableCell>
  //                     ))}
  //                   </TableRow>
  //                 ))
  //               ) : (
  //                 <TableRow>
  //                   <TableCell
  //                     colSpan={columns?.length}
  //                     className="h-24 text-center"
  //                   >
  //                     <div role="status" className="flex justify-center">
  //                       No data Found !!
  //                     </div>
  //                   </TableCell>
  //                 </TableRow>
  //               )}
  //             </TableBody>
  //           </Table>
  //         </div>
  //       </div>
  //     </div>
  //     <DataTablePagination table={tableInstance} />
  //   </div>
  // );

  return (
    <div className="space-y-4 text-[#676879]">
      <div className="rounded-md border">
        <div className="h-[78vh] overflow-x-auto bg-[#fff] boxShadow">
          <Table className="bg-[#fff]">
            <TableHeader className="bg-[#29354f] sticky top-0 z-10">
              {tableInstance?.getHeaderGroups()?.map((headerGroup: any) => (
                <TableRow key={headerGroup?.id}>
                  {headerGroup?.headers?.map((header: any) => (
                    <TableHead
                      key={header?.id}
                      colSpan={header?.colSpan}
                      className={`text-nowrap text-white`}
                    >
                      {header?.isPlaceholder
                        ? null
                        : flexRender(
                            header?.column?.columnDef?.header,
                            header?.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24">
                    <div className="flex justify-center">
                      <LoaderIconSVG />
                      <span className="px-2">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : tableInstance?.getRowModel()?.rows?.length !== 0 ? (
                tableInstance.getRowModel().rows.map((row: any) => {
                  const isHighlighted = row.original._id === queryParams; // Check if the row ID matches queryParams
                  return (
                    <TableRow
                      key={row.id}
                      className={isHighlighted ? "bg-[#ced7ea]" : ""}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell: any) => (
                        <TableCell key={cell.id} className="text-nowrap">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div role="status" className="flex justify-center">
                      No data Found !!
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={tableInstance} />
    </div>
  );
}
