"use client";
import User from "../../../asset/images/user.png";
import { DataTableColumnHeader } from "../../common/data-table-column-header";
import { DataTableRowActions } from "../../common/data-table-row-actions";
const UserPic = User.src;

import { createColumnHelper } from "@tanstack/react-table";
import TooltipCommon from "@/components/common/TooltipCommon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeletedUserUIconSVG } from "@/utils/SVGs/SVGs";
import ChatModel from "@/components/common/Editor/ChatModel";
import Link from "next/link";

const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  const options: any = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  };
  const formattedDate = date.toLocaleDateString("en-GB", options); // Using "en-GB" for day-month-year format
  return formattedDate;
};

const statusStyles: { [key: string]: string } = {
  "In Query": "border-l-[#0E00B2]",
  Complete: "border-l-[#1B6A0A]",
  "In Process": "border-l-[#F7DA16]",
};

const priorityStyles: { [key: string]: string } = {
  Critical: "border-l-[#CF4D15]",
  Low: "border-l-[#3D3D3D]",
};

const customerStatusStyles: { [key: string]: string } = {
  "Live Site": "border-l-[#873600]",
  "Demo Link": "border-l-[#1A5276]",
};

const renderStatus = (status: string) => (
  <div
    className={`p-1 rounded-md text-center font-bold border border-l-8 w-[80px] ${
      statusStyles[status] || ""
    }`}
  >
    {status}
  </div>
);

const renderPriority = (priority: string) => (
  <div
    className={`p-1 rounded-md text-center font-bold border border-l-8 w-[80px] ${
      priorityStyles[priority] || ""
    }`}
  >
    {priority}
  </div>
);

const renderCustomerStatus = (customerStatus: string) => (
  <div
    className={`p-1 rounded-md text-center font-bold border border-l-8 w-[80px] ${
      customerStatusStyles[customerStatus] || ""
    }`}
  >
    {customerStatus}
  </div>
);

export const columns = [
  // {
  //   accessorKey: "id",
  //   header: ({ column }: any) => (
  //     <DataTableColumnHeader column={column} title="Sr. No." />
  //   ),
  //   cell: ({ row }: any) => row.index + 1,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "companyName",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    // cell: ({ row }: any) => {
    //   return row?.original?.customer?.companyName;
    // },
    cell: ({ row }: any) =>
      row?.original?.customer?.companyName ? (
        <Link href={`/amendment/amendmentDetails/${row?.original?._id}`}>
          <div className="hover:underline hover:cursor-pointer text-nowrap">
            {row?.original?.customer?.companyName}
          </div>
        </Link>
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
  },

  {
    accessorKey: "update",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Update" />
    ),
    cell: ({ row }: any) => (
      <ChatModel
        amendmentId={row?.original?._id}
        length={row?.original?.updates?.length}
        customerName={row?.original?.customer?.contactName}
      />
    ),
  },

  {
    accessorKey: "avatar",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Rep Name" />
    ),
    cell: ({ row }: any) => {
      if (row?.original?.generated_by) {
        if (row?.original?.generated_by?.avatar !== "") {
          return (
            <div className="flex items-start w-[40px]">
              <TooltipCommon text={row?.original?.generated_by?.fullName}>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={row?.original?.generated_by?.avatar}
                    className=""
                  />
                  <AvatarFallback>
                    <img src={UserPic} className="" />
                  </AvatarFallback>
                </Avatar>
              </TooltipCommon>
            </div>
          );
        } else {
          return (
            <div className="flex items-center w-[40px]">
              <TooltipCommon text={row?.original?.generated_by?.fullName}>
                <Avatar className="cursor-pointer">
                  <AvatarFallback>
                    <img src={UserPic} className="" />
                  </AvatarFallback>
                </Avatar>
              </TooltipCommon>
            </div>
          );
        }
      } else {
        return (
          <div className="flex items-center w-[40px]">
            <Avatar>
              <AvatarFallback>
                <DeletedUserUIconSVG />
              </AvatarFallback>
            </Avatar>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "refNo",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Ref No." />
    ),
    // cell: (info: any) => info.renderValue(),
    cell: ({ row }: any) => {
      return <div className="w-[30px]">{row?.original?.refNo}</div>;
    },
  },
  {
    accessorKey: "date_current",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }: any) => {
      const dateCurrent = row?.original?.date_current;
      return <div className="w-[40px]">{formatDate(dateCurrent)}</div>;
    },
  },

  {
    accessorKey: "customer_status",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Customer Status" />
    ),
    cell: ({ row }: any) => {
      if (row?.original?.customer_status) {
        return renderCustomerStatus(row?.original?.customer_status);
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
        return renderStatus(row?.original?.status);
      } else {
        return <div className="text-gray-400">-</div>;
      }
    },
  },
  {
    accessorKey: "date_complete",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Date Completed" />
    ),

    cell: ({ row }: any) => {
      if (row?.original?.date_complete !== null) {
        const dateComplete = row?.original?.date_complete;
        return <div className="w-[40px]">{formatDate(dateComplete)}</div>;
      } else {
        return <div className="text-gray-400">N/A</div>;
      }
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),

    cell: ({ row }: any) => {
      if (row?.original?.priority) {
        return renderPriority(row?.original?.priority);
      } else {
        return <div className="text-gray-400">-</div>;
      }
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => <DataTableRowActions row={row} />,
  },
];
