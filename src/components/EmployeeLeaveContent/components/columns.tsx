"use client";
import { DataTableColumnHeader } from "../../common/data-table-column-header";
import { DataTableRowActions } from "../../common/data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import User from "../../../asset/images/user.png";
import Link from "next/link";
import { formatDate } from "@/common/commonFunctions";
import TooltipCommon from "@/components/common/TooltipCommon";

const UserPic = User.src;

// let userDataString: any =
//   typeof window !== "undefined" ? localStorage?.getItem("user") : null;
// const userData2 = JSON.parse(userDataString);
// const userRole = userData2?.role;

const userRole = localStorage?.getItem("userRoleHOM");

const responseStyles: { [key: string]: string } = {
  Pending: "border-l-[#F7DA16]",
  Approved: "border-l-[#1B6A0A]",
  Rejected: "border-l-[#c6131b]",
};

const leaveTypeStyles: { [key: string]: string } = {
  Other: "border-l-[#FFD700]", // Gold for neutral or miscellaneous
  Vacation: "border-l-[#4CAF50]", // Green for positive (vacation time)
  "Personal Leave": "border-l-[#FF9800]", // Orange for personal time
  "Sick Leave": "border-l-[#F44336]",
};

const renderResponse = (response: string) => (
  <div
    className={`p-1 text-center font-bold border border-l-8 w-[120px] ${
      responseStyles[response] || ""
    }`}
  >
    {response}
  </div>
);
const renderLeaveType = (leaveType: string) => (
  <div
    className={`p-1 text-center font-bold border border-l-8 w-[120px] ${
      leaveTypeStyles[leaveType] || ""
    }`}
  >
    {leaveType}
  </div>
);

export const getColumns = (userRole: string | null) => [
  // {
  //   accessorKey: "_id",
  //   header: ({ column }: any) => (
  //     <DataTableColumnHeader column={column} title="Sr. No." />
  //   ),
  //   cell: ({ row }: any) => row.index + 1,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "avatar",
    header: "Profile Picture",
    cell: ({ row }: any) => {
      return (
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src={row?.original?.employeeId?.avatar} className="" />
            <AvatarFallback>
              <img src={UserPic} className="" />
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },

  {
    accessorKey: "fullName",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="User Name" />
    ),
    cell: ({ row }: any) =>
      row?.original?.employeeId?.fullName ? (
        <Link
          href={`/employeeLeaveManagement/employeeLeaveDetails/${row?.original?._id}`}
        >
          <span className="hover:underline hover:cursor-pointer text-nowrap">
            {row?.original?.employeeId?.fullName
              ? row?.original?.employeeId?.fullName
              : "N/A"}
          </span>
        </Link>
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
  },

  {
    accessorKey: "email",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }: any) =>
      row?.original?.employeeId?.email ? (
        <span className="text-nowrap">
          {row?.original?.employeeId?.email
            ? row?.original?.employeeId?.email
            : "N/A"}
        </span>
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
  },
  {
    accessorKey: "leaveType",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Leave Type" />
    ),
    cell: ({ row }: any) =>
      row?.original?.leaveType ? (
        <span className="text-nowrap">
          {row?.original?.leaveType
            ? renderLeaveType(row?.original?.leaveType)
            : "N/A"}
        </span>
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
  },

  {
    accessorKey: "leaveReason",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Leave Reason" />
    ),
    cell: ({ row }: any) =>
      row?.original?.leaveReason ? (
        <span className="text-nowrap flex justify-center">
          <span>
            {row?.original?.leaveReason ? row?.original?.leaveReason : "N/A"}
          </span>
        </span>
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
  },
  {
    accessorKey: "DatesOnHoliday",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Dates On Holiday" />
    ),
    cell: ({ row }: any) => {
      const startDate = row.original.startDate || "N/A"; // Access the first name
      const endDate = row.original.endDate || "N/A"; // Access the last name

      return (
        <TooltipCommon text={`${row?.original?.totalDayHoliday} Days`}>
          <span className="text-nowrap flex justify-center cursor-pointer">
            <span className=" bg-slate-200 px-3 py-1">
              {`${formatDate(startDate)} - ${formatDate(endDate)}`}
            </span>
          </span>
        </TooltipCommon>
      );
    },
  },
  {
    accessorKey: "returnDate",
    header: ({ column }: any) => (
      <DataTableColumnHeader
        column={column}
        title="Date You Will Return To Office"
      />
    ),
    cell: ({ row }: any) =>
      row?.original?.returnDate ? (
        <span className="text-nowrap flex justify-center">
          <span>
            {row?.original?.returnDate
              ? formatDate(row?.original?.returnDate)
              : "N/A"}
          </span>
        </span>
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
  },
  {
    accessorKey: "totalWorkingDays",
    header: ({ column }: any) => (
      <DataTableColumnHeader
        column={column}
        title="Total Number of Working Days on Leave"
      />
    ),
    cell: ({ row }: any) =>
      row?.original?.totalWorkingDays ? (
        <span className="flex justify-center">
          <span>
            {row?.original?.totalWorkingDays
              ? row?.original?.totalWorkingDays
              : "N/A"}
          </span>
        </span>
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
  },

  {
    accessorKey: "managerResponse",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Manager Response" />
    ),
    cell: ({ row }: any) =>
      row?.original?.managerResponse ? (
        <span className="text-nowrap flex justify-center">
          <span>
            {row?.original?.managerResponse
              ? renderResponse(row?.original?.managerResponse)
              : "N/A"}
          </span>
        </span>
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
  },
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }: any) => <DataTableRowActions row={row} />,
  // },

  ...(userRole === "admin"
    ? [
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }: any) => <DataTableRowActions row={row} />,
        },
      ]
    : []),
];
