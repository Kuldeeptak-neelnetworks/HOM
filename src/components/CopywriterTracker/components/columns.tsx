"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "../../ui/badge";
import { Checkbox } from "../../ui/checkbox";

import User from "../../../asset/images/user.png";
import { DataTableColumnHeader } from "../../common/data-table-column-header";
import { DataTableRowActions } from "../../common/data-table-row-actions";

const UserPic = User.src;

import { createColumnHelper } from "@tanstack/react-table";
import TooltipCommon from "@/components/common/TooltipCommon";

import dynamic from "next/dynamic";
import Link from "next/link";
import SideDrawer from "@/components/common/Editor/SideDrawer";
const ChatModel = dynamic(
  () => import("@/components/common/Editor/ChatModel"),
  { ssr: false }
);
const columnHelper = createColumnHelper();

const copywriterStatusStyles: { [key: string]: string } = {
  Rework: "border-l-[#873600]",
  COMPLETED: "border-l-[#4338ca] ",
  "Homepage In Process": "border-l-[#3A5276]",
  "Additional Pages in Process": "border-l-[#1O6776]",
  "Remaining Pages in Processe": "border-l-[#1B5276]",
  "Homepage Complete": "border-l-[#1C9276] ",
  "In Query": "border-l-[#1H5276] ",
  "Held for Critical": "border-l-[#fb7185]",
  "Waiting on Info": "border-l-[#14b8a6]",
  "COMPLETED REWORK": "border-l-[#0369a1] ",
  "Area Pages Remaining": "border-l-[#4469a1] ",
  "Blog pages": "border-l-[#0899a1] ",
  "Extra Pages": "border-l-[#fb7185] ",
};

const renderCopywriterStatus = (copywriterTaskStatus: string) => (
  <div
    className={`p-1 rounded-md text-center font-bold border border-l-8 w-[190px] text-nowrap ${
      copywriterStatusStyles[copywriterTaskStatus] || ""
    }`}
  >
    {copywriterTaskStatus}
  </div>
);

const formatDate = (dateString: any) => {
  if (dateString !== null) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return <div className="text-gray-400">N/A</div>;
    }
    // const date = new Date(dateString);
    const options: any = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    };
    const formattedDate = date.toLocaleDateString("en-GB", options); // Using "en-GB" for day-month-year format
    return formattedDate;
  } else {
    return <div className="text-gray-400">N/A</div>;
  }
};
export const columns = [
  {
    accessorKey: "companyName",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }: any) => {
      return (
        <Link href={`/copywriter/copywriterDetails/${row?.original?._id}`}>
          <span className="text-nowrap hover:underline">
            {row?.original?.customer?.companyName}
          </span>
        </Link>
      );
    },
  },
  // {
  //   accessorKey: "update",
  //   header: ({ column }: any) => (
  //     <DataTableColumnHeader column={column} title="Update" />
  //   ),
  //   cell: ({ row }: any) => (
  //     <ChatModel
  //       copywriterId={row?.original?._id}
  //       length={row?.original?.updates?.length}
  //       customerName={row?.original?.customer?.contactName}
  //     />
  //   ),
  // },
  {
    accessorKey: "update",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Update" />
    ),
    cell: ({ row }: any) => {
      return (
        <SideDrawer
          copywriterId={row?.original?._id}
          length={row?.original?.updates?.length}
          customerName={
            row?.original?.customer?.companyName &&
            row?.original?.customer?.companyName
          }
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }: any) => {
      if (row?.original?.status) {
        return renderCopywriterStatus(row?.original?.status);
      } else {
        return <div className="text-gray-400">-</div>;
      }
    },
  },

  {
    accessorKey: "dateComplete",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Completed Date" />
    ),
    cell: ({ row }: any) => {
      const date = row?.original?.dateComplete;
      return formatDate(date);
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => <DataTableRowActions row={row} />,
  },
];
