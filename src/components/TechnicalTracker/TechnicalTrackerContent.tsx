"use client";

import React, { useEffect, useMemo, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "../common/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import BreadcrumbSection from "../common/BreadcrumbSection";

import Select from "react-select";
import makeAnimated from "react-select/animated";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
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
import { useAmendmentStore } from "@/Store/AmendmentStore";
import AddTechnicalDialoge from "./components/AddTechnicalDialoge";
import TechnicalPage from "@/app/technical/page";
import { useTechnicalStore } from "@/Store/TechnicalStore";
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

const TechnicalTrackerContent: React.FC = () => {
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

  const tableInstance = useReactTable({
    data,
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

  return (
    <div className="px-4 py-0 relative">
      {/* <div className="text-xl font-semibold absolute top-[-50px]">
        Technical Tracker
      </div> */}

      <div className="w-[300px] lg:absolute z-50 mt-2 lg:mt-0">
        <Select
          className="text-[0.8rem] boxShadow"
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={statusOptions}
          // value={filters.status}
          onChange={(selectedOptions) => {
            const selectedValues =
              selectedOptions &&
              selectedOptions.map((option: any) => option.value);
            setFilters((prev: any) => ({
              ...prev,
              status: selectedValues,
            }));
          }}
          placeholder="Select a Status"
        />
      </div>

      <div className="md:flex justify-center sm:justify-end my-2">
        {technicalData && technicalData.length > 0 ? (
          <PageHeader tableInstance={tableInstance} />
        ) : (
          ""
        )}
        <AddTechnicalDialoge getAllTechnical={fetchTechnicalData} />
      </div>

      <DataTable
        text=""
        queryParams={queryParams ? queryParams : ""}
        columns={columns}
        tableInstance={tableInstance}
        loading={loading}
      />
    </div>
  );
};

export default TechnicalTrackerContent;
