"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "../common/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import BreadcrumbSection from "../common/BreadcrumbSection";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label as Labil,
  LabelList,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import PageHeader from "../common/PageHeader";
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
  Select as Selector,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAmendmentStore } from "@/Store/AmendmentStore";
// import AddTechnicalDialoge from "./components/AddTechnicalDialoge";
import TechnicalPage from "@/app/technical/page";
import { useTechnicalStore } from "@/Store/TechnicalStore";
import { baseInstance } from "@/common/commonFunctions";
import axios from "axios";
import { useSalesStore } from "@/Store/SalesStore";
import SalesmanBarChart from "./components/SalesmanBarChart";
import OrderChart from "./components/OrderChart";
import MonthlySalesBarChart from "./components/MonthlySalesBarChart";
import RenewalsBarChart from "./components/RenewalBarChart";
import { columns as cols } from "./components/columns";
const animatedComponents = makeAnimated();

// Crumbs Array
const crumbs = [
  {
    id: 1,
    title: "Home",
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Technical Tracker",
    link: "",
  },
];

const SalesContent: React.FC = () => {
  const { fetchSalesData, fetchMonthlySalesData, SalesData, MonthlySalesData } =
    useSalesStore();
  // Hooks and States
  const router = useRouter();
  const { fetchTechnicalData, technicalData, loading } = useTechnicalStore();
  const [allTechnicals, setAllTechnicals] = useState<any>([]);
  const [loader, setLoader] = useState(true);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");
  const [statusValue, setStatusValue] = React.useState("");
  const data = useMemo(() => allTechnicals, [allTechnicals]);
  const [filters, setFilters] = useState<any>({
    status: [],
  });
  const [orderYear, setOrderYear] = useState<any>("");
  const [orderMonth, setOrderMonth] = useState<any>("");
  const [orderMonthlyYear, setOrderMonthlyYear] = useState<any>("");
  const searchParams = useSearchParams();
  const queryParams = searchParams.get("id");

  // const statusOptions = [
  //   { label: "In Progress", value: "In Progress" },
  //   { label: "In Query", value: "In Query" },
  //   { label: "Completed", value: "Completed" },
  // ];

  useEffect(() => {
    fetchTechnicalData();
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Get month and format as two digits
    const year = currentDate.getFullYear().toString();

    setOrderMonth(month);
    setOrderMonthlyYear(year);
    setOrderYear(year);
  }, []);

  useEffect(() => {
    if (
      technicalData === "Invalid refresh token" ||
      technicalData === "User not found" ||
      technicalData === "Invalid User Access Token" ||
      technicalData === "Invalid access token" ||
      technicalData === "Unauthorized request: No access or refresh token"
    ) {
      router.push("/auth/login");
    } else {
      setLoader(false);
      setAllTechnicals(technicalData ? technicalData || [] : []);
    }
  }, [technicalData, router]);

  const statusOptions = [
    { label: "In Process", value: "In Process" },
    { label: "In Query", value: "In Query" },
    { label: "Complete", value: "Complete" },
    { label: "Back With Repo", value: "Back With Repo" },
  ];

  useEffect(() => {
    if (Array.isArray(technicalData)) {
      const filterByStatus =
        technicalData &&
        technicalData?.filter((elem: any) => {
          if (filters?.status?.length > 0) {
            return filters?.status?.includes(elem?.status);
          } else {
            return true;
          }
        });

      setAllTechnicals(filterByStatus);
    }
  }, [filters?.status, technicalData]);

  useEffect(() => {
    fetchSalesData(orderYear);
  }, [orderYear]);

  useEffect(() => {
    fetchMonthlySalesData(orderMonth, orderMonthlyYear);
  }, [orderMonth, orderMonthlyYear]);

  const columns = useMemo(() => cols, [cols]);
  const dataOrders = useMemo(
    () => MonthlySalesData?.totalOrders?.orders,
    [MonthlySalesData?.totalOrders?.orders]
  );

  const tableInstance = useReactTable({
    data: MonthlySalesData?.totalOrders?.orders
      ? MonthlySalesData?.totalOrders?.orders
      : "",
    columns,
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 25, //custom default page size
      },
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter: filtering,
      columnFilters,
    },
    onGlobalFilterChange: setFiltering,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 3; // Adjust range as needed
    const endYear = currentYear; // Adjust range as needed
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => startYear + index
    );
  };
  const yearOptions = getYearOptions();

  return (
    <>
      {/* Yearly  */}
      <div className="px-4 relative">
        <div className="lg:flex justify-end my-3">
          <div className="w-36">
            <Selector
              onValueChange={(value: any) => setOrderYear(value)}
              name="orderyear"
              value={orderYear}
            >
              <SelectTrigger className="border-[#73819c] h-[38px] boxShadow">
                <SelectValue
                  placeholder="Select a year"
                  className="text-[0.8rem] text-gray-50 "
                />
              </SelectTrigger>
              <SelectContent className="text-[0.8rem] ">
                <SelectGroup>
                  <SelectLabel className="text-[0.8rem]">
                    Select a year
                  </SelectLabel>
                  {yearOptions.map((year) => (
                    <SelectItem
                      key={year}
                      value={year.toString()}
                      className="text-[0.8rem]"
                    >
                      {year}
                    </SelectItem>
                  ))}
                  {/* <SelectItem value="2022" className="text-[0.8rem]">
                    2022
                  </SelectItem>
                  <SelectItem value="2023" className="text-[0.8rem]">
                    2023
                  </SelectItem>
                  <SelectItem value="2024" className="text-[0.8rem]">
                    2024
                  </SelectItem>
                  <SelectItem value="2025" className="text-[0.8rem]">
                    2025
                  </SelectItem> */}
                </SelectGroup>
              </SelectContent>
            </Selector>
          </div>
        </div>

        <div className="lg:flex gap-4 my-3 lg:my-0">
          <Card className="w-full lg:w-[60%] boxShadow">
            <CardHeader>
              <CardTitle className="text-[1rem]">
                Sales Performance This Year
              </CardTitle>
              <CardDescription>
                Graphical representation of sales data
              </CardDescription>
              <CardContent>
                <SalesmanBarChart
                  orderStats={
                    SalesData?.orderStats ? SalesData?.orderStats : ""
                  }
                />
              </CardContent>
            </CardHeader>
            <CardContent>
              <div className="flex items-center pb-[10px] mb-[10px] text-[0.8rem]">
                <Label htmlFor="name" className="text-right font-bold">
                  Total Order Value of this year :
                </Label>
                <p className="mx-2 bg-slate-100 px-1">
                  {SalesData?.orderStats?.reduce(
                    (total: any, item: any) => total + item.totalOrderValue,
                    0
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full lg:w-[40%] boxShadow">
            <CardHeader>
              <CardTitle className="text-[1rem]">
                Sales Performance This Year
              </CardTitle>
              <CardDescription>
                Graphical representation of sales data
              </CardDescription>
              <CardContent>
                <OrderChart
                  data={
                    SalesData?.totalOverallResult
                      ? SalesData?.totalOverallResult
                      : ""
                  }
                />
              </CardContent>
            </CardHeader>
            <CardContent>
              <div className="flex items-center pb-[10px] mb-[10px] text-[0.8rem]">
                <Label htmlFor="name" className="text-right font-bold">
                  Total Order Value of this year :
                </Label>
                <p className="mx-2 bg-slate-100 px-1">
                  {SalesData?.orderStats?.reduce(
                    (total: any, item: any) => total + item.totalOrderValue,
                    0
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* monthly  */}
      <div className="px-4 py-4 relative my-5 ">
        <div className="flex justify-end my-3 gap-2">
          <div className="w-36">
            <Selector
              onValueChange={(value: any) => setOrderMonth(value)}
              name="orderMonth"
              value={orderMonth}
            >
              <SelectTrigger className="border-[#73819c] h-[38px] boxShadow">
                <SelectValue
                  placeholder="Select a month"
                  className="text-[0.8rem] text-gray-50 "
                />
              </SelectTrigger>
              <SelectContent className="text-[0.8rem] ">
                <SelectGroup>
                  <SelectLabel className="text-[0.8rem]">
                    Select a month
                  </SelectLabel>
                  <SelectItem value="01" className="text-[0.8rem]">
                    Jan
                  </SelectItem>
                  <SelectItem value="02" className="text-[0.8rem]">
                    Feb
                  </SelectItem>
                  <SelectItem value="03" className="text-[0.8rem]">
                    Mar
                  </SelectItem>
                  <SelectItem value="04" className="text-[0.8rem]">
                    Apr
                  </SelectItem>
                  <SelectItem value="05" className="text-[0.8rem]">
                    May
                  </SelectItem>
                  <SelectItem value="06" className="text-[0.8rem]">
                    Jun
                  </SelectItem>
                  <SelectItem value="07" className="text-[0.8rem]">
                    July
                  </SelectItem>
                  <SelectItem value="08" className="text-[0.8rem]">
                    Aug
                  </SelectItem>
                  <SelectItem value="09" className="text-[0.8rem]">
                    Sep
                  </SelectItem>
                  <SelectItem value="10" className="text-[0.8rem]">
                    Oct
                  </SelectItem>
                  <SelectItem value="11" className="text-[0.8rem]">
                    Nov
                  </SelectItem>
                  <SelectItem value="12" className="text-[0.8rem]">
                    Dec
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Selector>
          </div>
          <div className="w-36">
            <Selector
              onValueChange={(value: any) => setOrderMonthlyYear(value)}
              name="orderMonthlyYear"
              value={orderMonthlyYear}
            >
              <SelectTrigger className="border-[#73819c] h-[38px] boxShadow">
                <SelectValue
                  placeholder="Select a year"
                  className="text-[0.8rem] text-gray-50 "
                />
              </SelectTrigger>
              <SelectContent className="text-[0.8rem] ">
                <SelectGroup>
                  <SelectLabel className="text-[0.8rem]">
                    Select a year
                  </SelectLabel>
                  {yearOptions.map((year) => (
                    <SelectItem
                      key={year}
                      value={year.toString()}
                      className="text-[0.8rem]"
                    >
                      {year}
                    </SelectItem>
                  ))}
                  {/* <SelectItem value="2022" className="text-[0.8rem]">
                    2022
                  </SelectItem>
                  <SelectItem value="2023" className="text-[0.8rem]">
                    2023
                  </SelectItem>
                  <SelectItem value="2024" className="text-[0.8rem]">
                    2024
                  </SelectItem> */}
                </SelectGroup>
              </SelectContent>
            </Selector>
          </div>
        </div>

        <div className="lg:flex gap-4 my-3 lg:my-0">
          <Card className="w-full lg:w-[50%] boxShadow">
            <CardHeader>
              <CardTitle className="text-[1rem]">
                Monthly Total New Business Performance
              </CardTitle>
              <CardDescription>
                Graphical representation of monthly sales data
              </CardDescription>
              <CardContent>
                <MonthlySalesBarChart
                  monthlySalesData={
                    MonthlySalesData?.totalNewBusiness
                      ? MonthlySalesData?.totalNewBusiness
                      : ""
                  }
                />
              </CardContent>
            </CardHeader>
            {/* <CardContent>
              <div className="flex items-center pb-[10px] mb-[10px] text-[0.8rem]">
                <Label htmlFor="name" className="text-right font-bold">
                  Total Order Value This Month:
                </Label>
                <p className="mx-2 bg-slate-100 px-1">
                  {MonthlySalesData.totalNewBusiness.reduce(
                    (total, item) => total + item.totalOrderValue,
                    0
                  )}
                </p>
              </div>
            </CardContent> */}
          </Card>
          <Card className="w-full lg:w-[50%] boxShadow">
            <CardHeader>
              <CardTitle className="text-[1rem]">
                Monthly Renewals Performance
              </CardTitle>
              <CardDescription>
                Graphical representation of monthly renewals data
              </CardDescription>
              <CardContent>
                <RenewalsBarChart
                  totalRenewals={
                    MonthlySalesData?.totalRenewals
                      ? MonthlySalesData.totalRenewals
                      : []
                  }
                />
              </CardContent>
            </CardHeader>
            {/* <CardContent>
              <div className="flex items-center pb-[10px] mb-[10px] text-[0.8rem]">
                <Label htmlFor="name" className="text-right font-bold">
                  Total Order Value from Renewals This Month:
                </Label>
                <p className="mx-2 bg-slate-100 px-1">
                  {MonthlySalesData.totalRenewals?.reduce(
                    (total, item) => total + item.totalOrderValue,
                    0
                  )}
                </p>
              </div>
            </CardContent> */}
          </Card>
        </div>
      </div>

      {/* OrderTables  */}
      <div className="px-4 py-4 relative my-5 ">
        <div className="flex gap-2  my-2">
          <p className="bg-slate-100 w-fit p-2 ">
            <span className="font-bold">Total Order Count</span> :{" "}
            {MonthlySalesData?.totalOrders?.totalOrderCount}
          </p>
          <p className="bg-slate-100 w-fit p-2 ">
            <span className="font-bold">Total Order Value</span> :{" "}
            {MonthlySalesData?.totalOrders?.totalOrderValue}
          </p>
        </div>
        <DataTable
          text=""
          queryParams={queryParams ? queryParams : ""}
          columns={columns}
          tableInstance={tableInstance}
          loading={loading}
        />
      </div>
    </>
  );
};

export default SalesContent;
