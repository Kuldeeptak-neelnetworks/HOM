"use client";

import React, { useEffect, useMemo, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "../common/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Select from "react-select";
import makeAnimated from "react-select/animated";

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

import { useProductflowStore } from "@/Store/ProductFlowStore";
const animatedComponents = makeAnimated();

const ProductflowContent: React.FC = () => {
  // Hooks and States
  const router = useRouter();
  const { fetchProductFlowData, productFlowData, loading } =
    useProductflowStore();
  const [allProductflow, setAllProductflow] = useState<any>([]);
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
  const data = useMemo(() => allProductflow, [allProductflow]);
  const [filters, setFilters] = useState<any>({
    status: [],
  });

  const searchParams = useSearchParams();
  const queryParams = searchParams.get("id");

  useEffect(() => {
    fetchProductFlowData();
  }, []);

  useEffect(() => {
    if (
      productFlowData === "Invalid refresh token" ||
      productFlowData === "User not found" ||
      productFlowData === "Invalid User Access Token" ||
      productFlowData === "Invalid access token" ||
      productFlowData === "Unauthorized request: No access or refresh token"
    ) {
      router.push("/auth/login");
    } else {
      setLoader(false);
      setAllProductflow(productFlowData ? productFlowData || [] : []);
    }
  }, [productFlowData, router]);

  const statusOptions = [
    { label: "Copywriter", value: "Copywriter" },
    { label: "Upload", value: "Upload" },
    { label: "Awaiting Domain", value: "Awaiting Domain" },
    { label: "In Query", value: "In Query" },
    { label: "AWR Cloud/Search Console", value: "AWR Cloud/Search Console" },
    { label: "All Content Added", value: "All Content Added" },
    { label: "QC Changes", value: "QC Changes" },
    { label: "QC", value: "QC" },
    { label: "Quality Control", value: "Quality Control" },
    { label: "Waiting on Area Pages", value: "Waiting on Area Pages" },
    { label: "Upload Query", value: "Upload Query" },
    { label: "Complete", value: "Complete" },
    { label: "Design Stage 1", value: "Design Stage 1" },
    { label: "Design Stage 2", value: "Design Stage 2" },
  ];

  useEffect(() => {
    if (Array.isArray(productFlowData)) {
      const filterByStatus =
        productFlowData &&
        productFlowData?.filter((elem: any) => {
          if (filters?.currentStage?.length > 0) {
            return filters?.currentStage?.includes(elem?.currentStage);
          } else {
            return true;
          }
        });

      setAllProductflow(filterByStatus);
    }
  }, [filters?.currentStage, productFlowData]);
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
      {/* <div className="text-xl font-semibold absolute top-[-52px]">
        Product Flow
      </div> */}

      <div className="w-[300px] lg:absolute  z-50 mt-2 lg:mt-0">
        <Select
          className="text-[0.8rem] boxShadow"
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={statusOptions}
          onChange={(selectedOptions) => {
            const selectedValues =
              selectedOptions &&
              selectedOptions.map((option: any) => option.value);
            setFilters((prev: any) => ({
              ...prev,
              currentStage: selectedValues,
            }));
          }}
          placeholder="Select Current Stage"
        />
      </div>

      <div className="md:flex justify-center sm:justify-end my-2">
        {productFlowData && productFlowData.length > 0 ? (
          <PageHeader tableInstance={tableInstance} />
        ) : (
          ""
        )}

        <div className="flex justify-normal lg:justify-end">
          <Link href={"/productFlow/addProductFlow"}>
            <Button
              variant="outline"
              className=" text-[0.8rem] text-white bg-[#29354f] hover:bg-[#fff] hover:text-[#29354f] boxShadow"
            >
              New Product Flow
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        queryParams={queryParams ? queryParams : ""}
        columns={columns}
        tableInstance={tableInstance}
        loading={loading}
      />
    </div>
  );
};

export default ProductflowContent;
