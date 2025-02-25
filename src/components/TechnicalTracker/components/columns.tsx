"use client";
import SideDrawer from "@/components/common/Editor/SideDrawer";
import { DataTableColumnHeader } from "../../common/data-table-column-header";
import { DataTableRowActions } from "../../common/data-table-row-actions";

import dynamic from "next/dynamic";
import Link from "next/link";
const ChatModel = dynamic(
  () => import("@/components/common/Editor/ChatModel"),
  { ssr: false }
);

const statusStyles: { [key: string]: string } = {
  "In Query": "border-l-[#0E00B2]",
  Complete: "border-l-[#1B6A0A]",
  "In Process": "border-l-[#F7DA16]",
  "Back With Repo": "border-l-[#A8DA16]",
};

const priorityStyles: { [key: string]: string } = {
  "1 Day SLA": "border-l-[#CF4D15]",
  "2 Day SLA": "border-l-[#AF4D15]",
  "3 Day SLA": "border-l-[#KF4D15]",
  Critical: "border-l-[#3D3D3D]",
  Low: "border-l-[#3B3B3b]",
};

const technicalStatusStyles: { [key: string]: string } = {
  "GSUITE Setup": "border-l-[#873600] ",
  "Email Backup": "border-l-[#1A5276] ",
  "Domain/Email Forward": "border-l-[#3A5276] ",
  "Email Setup Call": "border-l-[#1O6776] ",
  Others: "border-l-[#1A1234] ",
  "Server Setup": "border-l-[#1B5276] ",
  "Website Down": "border-l-[#1C9276] ",
  "Hosting Setup": "border-l-[#1H5276] ",
  "Issue With Emails": "border-l-[#1K5276] ",
  "Suspension/Termination": "border-l-[#fb7185] ",
  "SSL Issue": "border-l-[#1Y5276] ",
};

const renderStatus = (status: string) => (
  <div
    className={`p-1 rounded text-center font-bold border border-l-8 w-[115px] ${
      statusStyles[status] || ""
    }`}
  >
    {status}
  </div>
);

const renderPriority = (priority: string) => (
  <div
    className={`p-1 rounded text-center font-bold border border-l-8 w-[100px] ${
      priorityStyles[priority] || ""
    }`}
  >
    {priority}
  </div>
);

const renderTechnicalTaskStatus = (technicalTaskStatus: string) => (
  <div
    className={`p-1 rounded text-center font-bold border border-l-8 w-[163px] ${
      technicalStatusStyles[technicalTaskStatus] || ""
    }`}
  >
    {technicalTaskStatus}
  </div>
);

export const columns = [
  {
    accessorKey: "companyName",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),

    cell: ({ row }: any) =>
      row?.original?.customer?.companyName ? (
        <Link href={`/technical/technicalDetails/${row?.original?._id}`}>
          <div className="hover:underline hover:cursor-pointer text-nowrap">
            {row?.original?.customer?.companyName
              ? row?.original?.customer?.companyName
              : "N/A"}
          </div>
        </Link>
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
  },

  // {
  //   accessorKey: "update",
  //   header: ({ column }: any) => (
  //     <DataTableColumnHeader column={column} title="Update" />
  //   ),
  //   cell: ({ row }: any) => (
  //     <ChatModel
  //       technicalId={row?.original?._id}
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
      // console.log("cvbnm,", row.original);
      return (
        <SideDrawer
          technicalId={row?.original?._id}
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
    accessorKey: "refNumber",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Ref No." />
    ),
    cell: ({ row }: any) => {
      return <div className="w-[30px]">{row?.original?.refNumber}</div>;
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }: any) => {
      if (row?.original?.status) {
        return (
          <div className="">{renderPriority(row?.original?.priority)}</div>
        );
      } else {
        return <div className="text-gray-400">-</div>;
      }
    },
  },
  {
    accessorKey: "status",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }: any) => {
      if (row?.original?.status) {
        return <span className="">{renderStatus(row?.original?.status)}</span>;
      } else {
        return <div className="text-gray-400">-</div>;
      }
    },
  },
  {
    accessorKey: "technicalTask",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Technical Task" />
    ),
    cell: ({ row }: any) => {
      if (row?.original?.status) {
        return (
          <span className="">
            {renderTechnicalTaskStatus(row?.original?.technicalTask)}
          </span>
        );
      } else {
        return <div className="text-gray-400">-</div>;
      }
    },
  },
  {
    accessorKey: "timeTakenMinutes",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Time Taken Minutes" />
    ),
    cell: ({ row }: any) => {
      return (
        <div className="w-[100px] text-center flex justify-center">
          {row?.original?.timeTakenMinutes}
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => <DataTableRowActions row={row} />,
  },
];
