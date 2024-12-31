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
import { useWebsiteContentStore } from "@/Store/WebsiteContentStore";

const animatedComponents = makeAnimated();

const WebsiteContent: React.FC = () => {
  const router = useRouter();
  const { fetchWebsiteContentData, websiteContentData, loading } =
    useWebsiteContentStore();
  const [allWebsiteContent, setAllWebsiteContent] = useState<any>([]);
  const [loader, setLoader] = useState(true);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");
  const data = useMemo(() => allWebsiteContent, [allWebsiteContent]);
  const [filters, setFilters] = useState<any>({
    status: [],
  });
  const searchParams = useSearchParams();
  const queryParams = searchParams.get("id");

  useEffect(() => {
    fetchWebsiteContentData();
  }, []);

  useEffect(() => {
    if (
      websiteContentData === "Invalid refresh token" ||
      websiteContentData === "User not found" ||
      websiteContentData === "Invalid User Access Token" ||
      websiteContentData === "Invalid access token" ||
      websiteContentData === "Unauthorized request: No access or refresh token"
    ) {
      router.push("/auth/login");
    } else {
      setLoader(false);
      setAllWebsiteContent(websiteContentData ? websiteContentData || [] : []);
    }
  }, [websiteContentData, router]);

  const statusOptions = [
    { label: "Renewal", value: "Renewal" },
    {
      label: "New Customer",
      value: "New Customer",
    },
    { label: "Existing HOM Customer", value: "Existing HOM Customer" },
  ];

  useEffect(() => {
    if (Array.isArray(websiteContentData)) {
      const filterByTypeofCustomer =
        websiteContentData &&
        websiteContentData?.filter((elem: any) => {
          if (filters?.typeOfCustomer?.length > 0) {
            return filters?.typeOfCustomer?.includes(elem?.typeOfCustomer);
          } else {
            return true;
          }
        });

      setAllWebsiteContent(filterByTypeofCustomer);
    }
  }, [filters?.typeOfCustomer, websiteContentData]);
  const tableInstance = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 20,
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
        New Website Content
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
              typeOfCustomer: selectedValues,
            }));
          }}
          placeholder="Select type of customer"
        />
      </div>

      <div className="md:flex justify-center sm:justify-end my-2">
        {websiteContentData && websiteContentData.length > 0 ? (
          <PageHeader tableInstance={tableInstance} />
        ) : (
          ""
        )}

        <div className="flex justify-normal lg:justify-end">
          <Link href={"/websiteContent/addWebsiteContent"}>
            <Button
              variant="outline"
              className=" text-[0.8rem] text-white bg-[#29354f] hover:bg-[#fff] hover:text-[#29354f] boxShadow"
            >
              New Website Content
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

export default WebsiteContent;
