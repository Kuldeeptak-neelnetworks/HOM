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
const ChatModel = dynamic(
  () => import("@/components/common/Editor/ChatModel"),
  { ssr: false }
);
const columnHelper = createColumnHelper();

const productFlowStatusStyles: { [key: string]: string } = {
  Copywriter: "border-l-[#873600]",
  Upload: "border-l-[#4338ca] ",
  "Awaiting Domain": "border-l-[#3A5276]",
  "In Query": "border-l-[#1O6776]",
  Others: "border-l-[#1A1234] ",
  "AWR Cloud/Search Console": "border-l-[#1B5276]",
  "All Content Added": "border-l-[#1C9276] ",
  "QC Changes": "border-l-[#1H5276] ",
  QC: "border-l-[#1K5276] ",
  "Quality Control": "border-l-[#fb7185] ",
  "Waiting on Area Pages": "border-l-[#14b8a6]",
  "Upload Query": "border-l-[#0369a1] ",
  Complete: "border-l-[#a78bfa]",
  "Design Stage 1": "border-l-[#a21caf]",
  "Design Stage 2": "border-l-[#db2777]",
};

const renderProductFlowStatus = (productFlowTaskStatus: string) => (
  <div
    className={`p-1 rounded text-center font-bold border border-l-8 w-[150px] ${
      productFlowStatusStyles[productFlowTaskStatus] || ""
    }`}
  >
    {productFlowTaskStatus}
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
        <Link href={`/productFlow/productFlowDetails/${row?.original?._id}`}>
          <div className="hover:underline text-nowrap">
            {row?.original?.customer?.companyName}
          </div>
        </Link>
      );
    },
  },

  {
    accessorKey: "update",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Update" />
    ),
    cell: ({ row }: any) => (
      <ChatModel
        productFlowId={row?.original?._id}
        length={row?.original?.updates?.length}
        customerName={row?.original?.customer?.contactName}
      />
    ),
  },

  // {
  //   accessorKey: "refNumber",
  //   header: ({ column }: any) => (
  //     <DataTableColumnHeader column={column} title="Ref No." />
  //   ),
  //   cell: (info: any) => info.renderValue(),
  // },

  {
    accessorKey: "currentStage",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Current Stage" />
    ),
    cell: ({ row }: any) => {
      if (row?.original?.currentStage) {
        return renderProductFlowStatus(row?.original?.currentStage);
      } else {
        return <div className="text-gray-400">-</div>;
      }
    },
  },
  {
    accessorKey: "datePhase1Instructed",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Date Phase 1" />
    ),
    cell: ({ row }: any) => {
      const date = row?.original?.datePhase1Instructed;
      return <div className="w-[30px]">{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "datePhase2Instructed",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Date Phase 2" />
    ),
    cell: ({ row }: any) => {
      const date = row?.original?.datePhase2Instructed;
      return <div className="w-[30px]">{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "demoLink",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Demo Link" />
    ),
    cell: ({ row }: any) => {
      return row?.original?.demoLink ? (
        <a href={row?.original?.demoLink} target="_blank">
          <div className="bg-gray-100 text-center w-[60px] hover:font-semibold hover:bg-gray-200">
            Link
          </div>
        </a>
      ) : (
        <div className="text-gray-400 text-center w-[60px]">N/A</div>
      );
    },
  },
  {
    accessorKey: "demoCompletedDate",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Demo Completed Date" />
    ),
    cell: ({ row }: any) => {
      const date = row?.original?.demoCompletedDate;
      return <div className="w-[30px]">{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "liveDate",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Live Date" />
    ),
    cell: ({ row }: any) => {
      const date = row?.original?.liveDate;
      return <div className="w-[30px]">{formatDate(date)}</div>;
    },
  },
  // {
  //   accessorKey: "notes",
  //   header: ({ column }: any) => (
  //     <DataTableColumnHeader column={column} title="Update" />
  //   ),
  //   cell: ({ row }: any) => {
  //     return row?.original?.notes;
  //   },
  // },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => <DataTableRowActions row={row} />,
  },
];
