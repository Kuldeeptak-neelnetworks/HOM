"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "../../ui/badge";
import { Checkbox } from "../../ui/checkbox";

import { labels, priorities, statuses } from "../data/data";
import User from "../../../asset/images/user.png";
import { Task } from "../data/schema";
import { DataTableColumnHeader } from "../../common/data-table-column-header";
import { DataTableRowActions } from "../../common/data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const UserPic = User.src;

import { createColumnHelper } from "@tanstack/react-table";
import TooltipCommon from "@/components/common/TooltipCommon";
import { DeletedUserUIconSVG } from "@/utils/SVGs/SVGs";
import ChatModel from "@/components/common/Editor/ChatModel";
import Link from "next/link";
import SideDrawer from "@/components/common/Editor/SideDrawer";

// const formatDate = (dateString: any) => {
//   const date = new Date(dateString);
//   const options: Intl.DateTimeFormatOptions = {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   };
//   const formattedDate = date.toLocaleDateString("en-US", options);
//   return formattedDate;
// };

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

const outComeStyles: { [key: string]: string } = {
  "Appointement Made": "border-l-[#0E00B2]",
  Callback: "border-l-[#1B6A0A]",
  "Not Interseted": "border-l-[#F7DA16]",
  "Old Client": "border-l-[#3D3D3D]",
  "Arrange an Appointment": "border-l-[#CF4D15]",
};

const renderOutcome = (outcome: string) => (
  <div
    className={`p-1  text-center font-bold border border-l-8 w-[170px] ${
      outComeStyles[outcome] || ""
    }`}
  >
    {outcome}
  </div>
);

export const columns = [
  // {
  //   accessorKey: "companyName",
  //   header: ({ column }: any) => (
  //     <DataTableColumnHeader column={column} title="Company Name" />
  //   ),
  //   // cell: ({ row }: any) => {
  //   //   console.log("Rowww", row?.original);
  //   // },
  //   // row?.original?.customer_id?.companyName
  //   //   ? row.original.customer_id.companyName
  //   //   : row?.original?.customerName
  //   //   ? row.original.customerName
  //   //   : "N/A",

  //   cell: ({ row }: any) =>
  //     row?.original?.customerName ? (
  //       <Link href={`/leads/leadsDetails/${row?.original?._id}`}>
  //         <span className="hover:underline hover:cursor-pointer text-nowrap">
  //           {
  //             // row?.original?.customer_id?.companyName
  //             //   ? row?.original?.customer_id?.companyName
  //             //   :
  //             row?.original?.customerName
  //           }
  //         </span>
  //       </Link>
  //     ) : (
  //       <div className="text-gray-400">N/A</div>
  //     ),
  // },
  {
    accessorKey: "companyName",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Company Name" />
    ),
    cell: ({ row }: any) =>
      row?.original?.customerName ? (
        <Link href={`/leads/leadsDetails/${row?.original?._id}`}>
          <div className="hover:underline hover:cursor-pointer w-[180px]">
            {row?.original?.customerName}
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
  //       leadId={row?.original?._id}
  //       length={row?.original?.updates?.length}
  //       customerName={
  //         row?.original?.customer_id?.companyName
  //           ? row?.original?.customer_id?.companyName
  //           : row?.original?.customerName
  //       }
  //     />
  //   ),
  // },
  {
    accessorKey: "update",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Update" />
    ),
    cell: ({ row }: any) => (
      <SideDrawer
        leadId={row?.original?._id}
        length={row?.original?.updates?.length}
        customerName={
          row?.original?.customer_id?.companyName
            ? row?.original?.customer_id?.companyName
            : row?.original?.customerName
        }
      />
    ),
  },
  {
    accessorKey: "contactName",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    // cell: ({ row }: any) => row?.original?.customer_id?.contactName|| row?.original?.contactPerson,
    // cell: ({ row }: any) =>
    //   row?.original?.customer_id?.contactName
    //     ? row?.original?.customer_id?.contactName
    //     : row?.original?.contactPerson
    //     ? row?.original?.contactPerson
    //     : "N/A",
    cell: ({ row }: any) =>
      row?.original ? (
        <span className="hover:underline hover:cursor-pointer text-nowrap">
          {row?.original?.customer_id?.contactName
            ? row?.original?.customer_id?.contactName
            : row?.original?.contactPerson
            ? row?.original?.contactPerson
            : "N/A"}
        </span>
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }: any) => {
      const createdAt = row?.original?.createdAt;
      return formatDate(createdAt);
    },
  },
  {
    accessorKey: "createdBy",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Rep Name" />
    ),
    cell: ({ row }: any) => {
      if (row?.original?.generated_by) {
        if (row?.original?.generated_by?.avatar !== "") {
          return (
            <div className="flex items-center">
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
            <div className="flex items-center">
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
          <div className="flex items-center">
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
    accessorKey: "outcome",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="OutCome" />
    ),
    cell: ({ row }: any) => {
      if (row?.original?.outcome) {
        return renderOutcome(row?.original?.outcome);
      } else {
        return (
          <div className="text-gray-400 flex justify-center xl:justify-normal">
            N/A
          </div>
        );
      }
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => <DataTableRowActions row={row} />,
  },
];
