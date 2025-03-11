"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "../../common/data-table-column-header";
import { DataTableRowActions } from "../../common/data-table-row-actions";
import User from "../../../asset/images/user.png";
import { DeletedUserUIconSVG } from "@/utils/SVGs/SVGs";
import TooltipCommon from "@/components/common/TooltipCommon";
import Link from "next/link";

const UserPic = User.src;

// const statusStyles: { [key: string]: string } = {
//   "IN PROCESS": "border-l-[#F7DA16]",
//   LIVE: "border-l-[#1B6A0A]",
//   "SITE TAKEN DOWN": "border-l-[#0E00B2]",
//   SUSPENDED: "border-l-[#3D3D3D]",
//   UPLOAD: "border-l-[#CF4D15]",
//   "WILL GET CANCELLED": "border-l-[#A70B01]",
// };
const statusStyles: { [key: string]: string } = {
  "IN PROCESS": "border-l-[#F7DA16]",
  LIVE: "border-l-[#1B6A0A]",
  "SITE TAKEN DOWN": "border-l-[#0E00B2]",
  SUSPENDED: "border-l-[#3D3D3D]",
  UPLOAD: "border-l-[#CF4D15]",
  "WILL GET CANCELLED": "border-l-[#A70B01]",
};

const renderStatus = (status: string) => (
  <div
    className={`p-1 text-center font-bold border border-l-8 w-[180px] ${
      statusStyles[status] || ""
    }`}
  >
    {status}
  </div>
);

export const columns = [
  // {
  //   accessorKey: "id",
  //   header: ({ column }: any) => (
  //     <DataTableColumnHeader column={column} title="Sr. No." />
  //   ),
  //   cell: ({ row }: any) => row.index + 1,
  // },
  {
    accessorKey: "customerNo",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Customer No" />
    ),
    // cell: (info: any) => info.renderValue(),
    cell: ({ row }: any) =>
      row?.original?.customerNo ? (
        row?.original?.customerNo
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
  },

  {
    accessorKey: "companyName",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Company Name" />
    ),
    cell: ({ row }: any) =>
      row?.original?.companyName ? (
        <Link href={`/customers/customerDetails/${row?.original?._id}`}>
          <div className="hover:underline hover:cursor-pointer w-[180px]">
            {row?.original?.companyName}
          </div>
        </Link>
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
  },
  {
    accessorKey: "contactName",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }: any) => {
      if (row?.original?.contactName !== "") {
        return <div className="w-[140px]">{row.original?.contactName}</div>;
      } else {
        return <div className="text-gray-400">N/A</div>;
      }
    },
  },

  {
    accessorKey: "mobileNo",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }: any) => {
      if (row?.original?.mobileNo !== "") {
        return row.original?.mobileNo;
      } else {
        return <div className="text-gray-400">N/A</div>;
      }
    },
  },
  {
    accessorKey: "createdBy",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Rep Name" />
    ),
    cell: ({ row }: any) => {
      if (row?.original?.createdBy !== null) {
        if (row?.original?.createdBy?.avatar !== "") {
          return (
            <div className="flex items-center">
              <TooltipCommon text={row?.original?.createdBy[0]?.fullName}>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={row?.original?.createdBy[0]?.avatar}
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
              <TooltipCommon text={row?.original?.createdBy?.fullName}>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={UserPic} className="" />
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
    accessorKey: "status",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }: any) => {
      if (row?.original?.status !== "Unknown") {
        return renderStatus(row?.original?.status);
      } else {
        return <div className="text-gray-400">N/A</div>;
      }
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => <DataTableRowActions row={row} />,
  },
];
