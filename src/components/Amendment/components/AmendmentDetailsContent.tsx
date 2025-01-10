"use client";

import BreadcrumbSection from "@/components/common/BreadcrumbSection";
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
// import { columns2 } from "./columns2";
import { DataTable } from "@/components/common/data-table";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  baseInstance,
  errorToastingFunction,
  formatDate,
  headerOptions,
} from "@/common/commonFunctions";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { LoaderIconSVG } from "@/utils/SVGs/SVGs";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import EventComponentBox from "./EventComponentBox";
// import { AddAppointmentDialoge } from "./AddAppointmentDialoge";
import User from "../../../asset/images/user.png";

const UserPic = User.src;

const customerData = [
  {
    id: 1,
    order_date: "2024-04-12",
    order_value: 400,
    order_status: "Pending",
  },
  {
    id: 2,
    order_date: "2024-04-13",
    order_value: 150,
    order_status: "Completed",
  },
  {
    id: 3,
    order_date: "2024-04-14",
    order_value: 350,
    order_status: "Completed",
  },
  {
    id: 4,
    order_date: "2024-04-15",
    order_value: 450,
    order_status: "Pending",
  },
  {
    id: 5,
    order_date: "2024-04-15",
    order_value: 450,
    order_status: "Pending",
  },
];

const crumbs = [
  {
    id: 1,
    title: "Home",
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Users",
    link: "/users",
  },
  {
    id: 3,
    title: "User Details",
    link: "",
  },
];

interface AmendmentDetailType {
  customer: {
    companyName: string;
  };
  customer_status: string;
  date_complete: string;
  date_current: string;
  priority: string;
  refNo: string;
  status: string;
}

const AmendmentDetailsContent = () => {
  const { amendmentId } = useParams();
  const router = useRouter();
  const [rowSelection, setRowSelection] = React.useState({});
  // const [customerDetails, setCustomerDetails] = React.useState();
  // const [leadDetails, setLeadDetails] = React.useState<
  //   CustomerDetailType[] | undefined
  // >(undefined);

  const [amendmentDetails, setAmendmentDetails] =
    React.useState<AmendmentDetailType | null>(null);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");

  const [date, setDate] = useState<Date | undefined>(new Date("2024-04-08"));
  const [showEventBox, setShowEventBox] = useState(false);

  const openEventModelFunction = () => {
    setShowEventBox(true);
  };

  const openDropDown = () => {
    setOpen(true);
  };

  const [open, setOpen] = useState<boolean>(false);
  //   const data = useMemo(() => customerData, [customerData]);
  //   const columns = useMemo(() => columns2, [columns2]);

  const getAmendmentDetails = async () => {
    try {
      const result = await baseInstance.get(`/amendments/${amendmentId}`);
      if (result.status === 200) {
        setAmendmentDetails(result?.data?.data);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
        // logOutFunction(error?.response?.data?.message);
        // router.push("/auth/login");
      }
    }
  };

  useEffect(() => {
    getAmendmentDetails();
  }, []);
  // Table Instance
  //   const tableInstance = useReactTable({
  //     data,
  //     columns,
  //     state: {
  //       sorting,
  //       columnVisibility,
  //       rowSelection,
  //       globalFilter: filtering,
  //       columnFilters,
  //     },
  //     onGlobalFilterChange: setFiltering,
  //     enableRowSelection: true,
  //     onRowSelectionChange: setRowSelection,
  //     onSortingChange: setSorting,
  //     onColumnFiltersChange: setColumnFilters,
  //     onColumnVisibilityChange: setColumnVisibility,
  //     getCoreRowModel: getCoreRowModel(),
  //     getFilteredRowModel: getFilteredRowModel(),
  //     getPaginationRowModel: getPaginationRowModel(),
  //     getSortedRowModel: getSortedRowModel(),
  //     getFacetedRowModel: getFacetedRowModel(),
  //     getFacetedUniqueValues: getFacetedUniqueValues(),
  //   });
  return (
    <div className="sm:px-4 py-0 relative ">
      <div className="text-[1rem] font-semibold absolute top-[-40px] px-4 sm:px-0">
        {amendmentDetails?.customer?.companyName || "Loading..."}
      </div>
      {/* <div className="mb-4">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}
      {/* Main Customer details section  */}
      <div className="flex gap-5 mt-2 ">
        <div className="">
          <Card className="w-[575px] h-[100%] boxShadow">
            <CardHeader>
              <CardTitle className="text-[1rem]">Amendment Data</CardTitle>
              <CardDescription>Details Of existing Amendment</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Company Name  */}
              <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                <Label htmlFor="name" className="text-right font-bold">
                  Company Name :
                </Label>
                <p className="mx-2">
                  {amendmentDetails?.customer?.companyName || "Loading..."}
                </p>
              </div>
              {/* Status */}
              <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                <Label htmlFor="name" className="text-right font-bold">
                  Status :
                </Label>
                <p className="mx-2 bg-slate-100 px-1">
                  {amendmentDetails?.status || "Loading..."}
                </p>
              </div>
              {/*  RefNo */}
              <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                <Label htmlFor="username" className="text-right font-bold">
                  RefNo :
                </Label>
                <p className="mx-2">
                  {amendmentDetails?.refNo || "Loading..."}
                </p>
              </div>
              {/* Priority  */}
              <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                <Label htmlFor="username" className="text-right font-bold">
                  Priority :
                </Label>
                <p className="mx-2">
                  {amendmentDetails?.priority || "Loading..."}
                </p>
              </div>
              {/* Date Current  */}
              <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                <Label htmlFor="username" className="text-right font-bold">
                  Date Current :
                </Label>
                <p className="mx-2">
                  {formatDate(amendmentDetails?.date_current) || "Loading..."}
                </p>
              </div>
              {/* Address  */}
              {amendmentDetails?.date_complete ? (
                <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                  <Label htmlFor="username" className="text-right font-bold">
                    Date Complete :
                  </Label>
                  <p className="mx-2">
                    {formatDate(amendmentDetails?.date_complete)}
                  </p>
                </div>
              ) : (
                ""
              )}
            </CardContent>
          </Card>

          {/* ==================================== */}
        </div>
        <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
          {/* <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className=" border"
            onDayClick={() => openDropDown()}
          />
          {showEventBox ? (
            <EventComponentBox setShowEventBox={setShowEventBox} />
          ) : (
            ""
          )} */}

          {/* <EventComponentBox setShowEventBox={setShowEventBox} /> */}
        </div>
      </div>

      {/* <div className="mt-5">
        <DataTable
          // data={data}
          columns={columns2}
          tableInstance={tableInstance}
        />
      </div> */}
    </div>
  );
};

export default AmendmentDetailsContent;
