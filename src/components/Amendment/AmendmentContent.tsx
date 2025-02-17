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
import AddAmendmentDialoge from "./components/AddAmendmentDialoge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    title: "Amendments",
    link: "",
  },
];

const AmendmentContent: React.FC = () => {
  // Hooks and States
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParams = searchParams.get("id");
  const { fetchAmendmentData, amendmentData, loading } = useAmendmentStore();
  const [allAmendments, setAllAmendments] = useState<any>([]);
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
  const data = useMemo(() => allAmendments, [allAmendments]);
  const [filters, setFilters] = useState<any>({
    status: [],
  });

  // const statusOptions = [
  //   { label: "In Progress", value: "In Progress" },
  //   { label: "In Query", value: "In Query" },
  //   { label: "Completed", value: "Completed" },
  // ];

  useEffect(() => {
    fetchAmendmentData();
  }, []);

  useEffect(() => {
    if (
      amendmentData === "Invalid refresh token" ||
      amendmentData === "User not found" ||
      amendmentData === "Invalid User Access Token" ||
      amendmentData === "Invalid access token" ||
      amendmentData === "Unauthorized request: No access or refresh token"
    ) {
      router.push("/auth/login");
    } else {
      setLoader(false);
      setAllAmendments(amendmentData ? amendmentData || [] : []);
    }
  }, [amendmentData, router]);

  // useEffect(() => {
  //   const filterByStatus = amendmentData?.filter((elem: any) => {
  //     if (statusValue !== "all") {
  //       return statusValue ? elem.status === statusValue : elem;
  //     } else {
  //       return amendmentData;
  //     }
  //   });

  //   setAllAmendments(() => filterByStatus);
  // }, [statusValue, amendmentData]);

  const statusOptions = [
    { label: "In Process", value: "In Process" },
    { label: "In Query", value: "In Query" },
    { label: "Complete", value: "Complete" },
  ];

  useEffect(() => {
    if (Array.isArray(amendmentData)) {
      const filterByStatus =
        amendmentData &&
        amendmentData?.filter((elem: any) => {
          if (filters?.status?.length > 0) {
            return filters?.status?.includes(elem?.status);
          } else {
            return true;
          }
        });

      setAllAmendments(filterByStatus);
    }
  }, [filters?.status, amendmentData]);

  // Table Instance
  // const tableInstance = useReactTable({
  //   data,
  //   columns,
  //   // initialState: {
  //   //   pagination: {
  //   //     pageIndex: 2, //custom initial page index
  //   //     pageSize: 20, //custom default page size
  //   //   },
  //   // },
  //   state: {
  //     sorting,
  //     columnVisibility,
  //     rowSelection,
  //     globalFilter: filtering,
  //     columnFilters,
  //   },
  //   onGlobalFilterChange: setFiltering,
  //   enableRowSelection: true,
  //   onRowSelectionChange: setRowSelection,
  //   onSortingChange: setSorting,
  //   onColumnFiltersChange: setColumnFilters,
  //   onColumnVisibilityChange: setColumnVisibility,
  //   getCoreRowModel: getCoreRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFacetedRowModel: getFacetedRowModel(),
  //   getFacetedUniqueValues: getFacetedUniqueValues(),
  // });

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
      {/* <div className="text-xl font-semibold absolute top-[-60px]">
        Amendments
      </div> */}
      {/* <div className="mb-1">
        <BreadcrumbSection crumbs={crumbs} />
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
          // className="react-select-custom-styling__container "
          // classNamePrefix="react-select-custom-styling "
        />
      </div>

      <div className="md:flex justify-center sm:justify-end my-2">
        {amendmentData?.length || amendmentData?.length > 0 ? (
          <PageHeader tableInstance={tableInstance} />
        ) : (
          ""
        )}
        {/* <AddAmendmentDialoge getAllAmendment={fetchAmendmentData} />
         */}
          <div className="flex justify-normal lg:justify-end">
          <Link href={"/amendment/addAmendment"}>
            <Button
              variant="outline"
              className=" text-[0.8rem] text-white bg-[#29354f] hover:bg-[#fff] hover:text-[#29354f] boxShadow"
            >
              New Amendment
            </Button>
          </Link>
        </div>
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

export default AmendmentContent;
