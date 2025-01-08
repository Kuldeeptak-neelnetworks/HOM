"use client";
import { DataTableColumnHeader } from "../../common/data-table-column-header";
import { DataTableRowActions } from "../../common/data-table-row-actions";
import TooltipCommon from "@/components/common/TooltipCommon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CommentsUIconSVG,
  DeletedUserUIconSVG,
  LikeUIconSVG,
  ReplyUIconSVG,
  ViewsUIconSVG,
} from "@/utils/SVGs/SVGs";
import User from "../../../asset/images/user.png";
import { ChatBubbleIcon, PlusIcon } from "@radix-ui/react-icons";
import { baseInstance, errorToastingFunction } from "@/common/commonFunctions";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Label } from "@radix-ui/react-dropdown-menu";
import QuillEdior from "@/components/customers/components/QuillEditor";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditorStore } from "@/Store/EditorStore";
import { useParams } from "next/navigation";
import React from "react";
import ChatModel from "../../common/Editor/ChatModel";
import Link from "next/link";
import SideDrawer from "@/components/common/Editor/SideDrawer";
const UserPic = User.src;
// const companyLogo = Logo.src;

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
    accessorKey: "orderNo",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Order No" />
    ),

    cell: ({ row }: any) =>
      row?.original?.orderNo ? (
        <Link href={`/orders/orderDetails/${row?.original?._id}`}>
          <span className="hover:underline hover:cursor-pointer">
            {row?.original?.orderNo ? row?.original?.orderNo : "N/A"}
          </span>
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
  //   cell: ({ row }: any) => {
  //     return (
  //       <ChatModel
  //         orderId={row?.original?._id}
  //         length={row?.original?.updates?.length}
  //         customerName={row?.original?.customer?.contactName}
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
      return (
        <SideDrawer
          orderId={row?.original?._id}
          length={row?.original?.updates?.length}
          customerName={
            row?.original?.customer?.companyName &&
            row?.original?.customer?.companyName
          }
          invoice={row?.original?.vatInvoice}
        />
      );
    },
  },
  {
    accessorKey: "companyName",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }: any) =>
      row?.original?.customer?.companyName ? (
        <Link href={`/orders/orderDetails/${row?.original?._id}`}>
          <span className="hover:underline hover:cursor-pointer">
            {row?.original?.customer?.companyName
              ? row?.original?.customer?.companyName
              : "N/A"}
          </span>
        </Link>
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
  },
  {
    accessorKey: "dateOfOrder",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Date Of Order" />
    ),
    cell: ({ row }: any) => {
      const orderDate = row?.original?.dateOfOrder;
      return formatDate(orderDate);
    },
  },

  {
    accessorKey: "orderType",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Order Type" />
    ),
    cell: ({ row }: any) =>
      row?.original?.orderType ? (
        row?.original?.orderType
      ) : (
        <div className="text-gray-400">N/A</div>
      ),
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
              <TooltipCommon text={row?.original?.createdBy?.fullName}>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={row?.original?.createdBy?.avatar}
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
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => <DataTableRowActions row={row} />,
  },
];
