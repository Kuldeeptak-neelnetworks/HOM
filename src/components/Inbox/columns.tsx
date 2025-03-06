"use client";

import { ColumnDef } from "@tanstack/react-table";

// import { Badge } from "../../ui/badge";
// import { Checkbox } from "../../ui/checkbox";

import User from "../../asset/images/user.png";

import { DataTableColumnHeader } from "../common/data-table-column-header";
import { DataTableRowActions } from "../common/data-table-row-actions";
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
    className={`p-1 text-center font-bold border border-l-8 w-[190px] text-nowrap ${
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
      <DataTableColumnHeader column={column} title="Assigned By" />
    ),
    cell: ({ row }: any) => {
      return (
        <Link href={`/copywriter/copywriterDetails/${row?.original?._id}`}>
          <span className="text-nowrap hover:underline">
            {row?.original?.assignedBy?.fullName}
          </span>
        </Link>
      );
    },
  },
  {
    accessorKey: "message",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }: any) => {
      const message = row?.original?.message;
      const title = row?.original?.title;
      const mentionedUsers = row?.original?.mentionedUsers;
      const itemType = row?.original?.itemType; // Example: "Amendment"

      const mentionedText = mentionedUsers
        ? mentionedUsers.map((user: any) => `@${user.fullName}`).join(", ")
        : null;

      const updateMessage = itemType
        ? `Mentioned in ${itemType} Update`
        : "No update type available";

      return (
        <>
          <div className="text-sm font-semibold text-black">
            {mentionedText ? (
              <>
                <span className="text-[#1f76c2]">{mentionedText}</span>{" "}
                {updateMessage}
              </>
            ) : (
              <span className="text-black">
                {title ? title : "No title available"}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {message ? message : "No message available"}
          </div>
        </>
      );
    },
  },
  // {
  //   accessorKey: "update",
  //   header: ({ column }: any) => <DataTableColumnHeader column={column} title="Update" />,
  //   cell: ({ row }: any) => {
  //     return (
  //       <SideDrawer
  //         amendmentId={row?.original?.item?._id}
  //         technicalId={row?.original?.item?._id }
  //         orderId={row?.original?.item?._id}
  //         leadId={row?.original?.item?._id }
  //         productFlowId={row?.original?.item?._id}
  //         websiteContentId={row?.original?.item?._id }
  //         copywriterId={row?.original?.item?._id }
  //        length={row?.original?.updates?.length}
  //         customerName={row?.original?.customer?.companyName && row?.original?.customer?.companyName}

  //       />

  //     );
  //   },
  // },
  {
    accessorKey: "update",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Update" />
    ),
    cell: ({ row }: any) => {
      const itemType = row?.original?.itemType; // Get the itemType

      // Initialize the properties to pass to SideDrawer
      const sideDrawerProps: any = {
        length: row?.original?.updates?.length,
        customerName: row?.original?.customer?.companyName || "",
      };

      // Conditionally add the ID property based on the itemType
      if (itemType === "Amendment") {
        sideDrawerProps.amendmentId = row?.original?.item?._id;
      } else if (itemType === "TechnicalTracker") {
        sideDrawerProps.technicalId = row?.original?.item?._id;
      } else if (itemType === "Order") {
        sideDrawerProps.orderId = row?.original?.item?._id;
      } else if (itemType === "Lead") {
        sideDrawerProps.leadId = row?.original?.item?._id;
      } else if (itemType === "ProductFlow") {
        sideDrawerProps.productFlowId = row?.original?.item?._id;
      } else if (itemType === "WebsiteContent") {
        sideDrawerProps.websiteContentId = row?.original?.item?._id;
      } else if (itemType === "Copywriter") {
        sideDrawerProps.copywriterId = row?.original?.item?._id;
      }

      // Return the SideDrawer with the appropriate props
      return <SideDrawer {...sideDrawerProps} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }: any) => {
      const date = row?.original?.createdAt;
      return formatDate(date);
    },
  },
];

export const TableBody = ({ data }: any) => {
  return (
    <tbody>
      {data.map((row: any) => {
        const isRead = row?.isRead;
        return (
          <tr
            key={row._id}
            className={`${
              isRead
                ? "bg-white text-gray-700 hover:bg-gray-50"
                : "bg-blue-50 text-blue-800 hover:bg-blue-100"
            } transition-all duration-300 ease-in-out cursor-pointer`}
          >
            {columns.map((column) => (
              <td key={column.accessorKey} className="px-4 py-2">
                {column.cell ? column.cell({ row }) : null}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};

//   export const columns = [
//     {
//       accessorKey: "companyName",
//       header: ({ column }: any) => (
//         <DataTableColumnHeader column={column} title="Assigned By" />
//       ),
//       cell: ({ row }: any) => {
//         const isRead = row?.original?.isRead; // Assuming isRead is part of the row data

//         return (
//           <Link href={`/copywriter/copywriterDetails/${row?.original?._id}`}>
//             <span
//               className={`text-nowrap hover:underline ${
//                 isRead ? "text-gray-700" : "text-blue-600"
//               }`}
//             >
//               {row?.original?.assignedBy?.fullName}
//             </span>
//           </Link>
//         );
//       },
//     },
//     {
//       accessorKey: "message",
//       header: ({ column }: any) => (
//         <DataTableColumnHeader column={column} title="Title" />
//       ),
//       cell: ({ row }: any) => {
//         const message = row?.original?.message;
//         const title = row?.original?.title;
//         const mentionedUsers = row?.original?.mentionedUsers;
//         const itemType = row?.original?.itemType;
//         const isRead = row?.original?.isRead; // Assuming isRead is part of the row data

//         const mentionedText = mentionedUsers
//           ? mentionedUsers.map((user: any) => `@${user.fullName}`).join(", ")
//           : null;

//         const updateMessage = itemType
//           ? `Mentioned in ${itemType} Update`
//           : "No update type available";

//         return (
//           <>
//             <div
//               className={`text-sm font-semibold text-black ${
//                 isRead
//                   ? "bg-white text-gray-700 hover:bg-gray-50"
//                   : "bg-blue-50 text-blue-800 hover:bg-blue-100"
//               } transition-all duration-300 ease-in-out cursor-pointer`}
//             >
//               {mentionedText ? (
//                 <>
//                   <span className="text-[#1f76c2]">{mentionedText}</span> {updateMessage}
//                 </>
//               ) : (
//                 <span className="text-black">{title ? title : "No title available"}</span>
//               )}
//             </div>
//             <div className="text-xs text-gray-600 mt-1">
//               {message ? message : "No message available"}
//             </div>
//           </>
//         );
//       },
//     },
//     {
//       accessorKey: "update",
//       header: ({ column }: any) => <DataTableColumnHeader column={column} title="Update" />,
//       cell: ({ row }: any) => {
//         const isRead = row?.original?.isRead; // Assuming isRead is part of the row data

//         return (
//           <SideDrawer
//             amendmentId={row?.original?.item?._id}
//             length={row?.original?.updates?.length}
//             customerName={row?.original?.customer?.companyName}
//             className={isRead ? "text-gray-500" : "text-blue-500"}
//           />
//         );
//       },
//     },
//     {
//       accessorKey: "createdAt",
//       header: ({ column }: any) => <DataTableColumnHeader column={column} title="Created At" />,
//       cell: ({ row }: any) => {
//         const date = row?.original?.createdAt;
//         const isRead = row?.original?.isRead; // Assuming isRead is part of the row data

//         return (
//           <span className={isRead ? "text-gray-700" : "text-blue-600"}>
//             {formatDate(date)}
//           </span>
//         );
//       },
//     },
//   ];
