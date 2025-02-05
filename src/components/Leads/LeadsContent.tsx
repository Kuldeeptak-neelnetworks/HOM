"use client";

import React, { useEffect, useMemo, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "../common/data-table";
import AddLeadDialoge from "./components/AddLeadDialoge";
import { useRouter, useSearchParams } from "next/navigation";
import BreadcrumbSection from "../common/BreadcrumbSection";
import { useLeadStore } from "@/Store/LeadStore";
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
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import Select from "react-select";
import PageHeader from "../common/PageHeader";
import makeAnimated from "react-select/animated";
import Link from "next/link";
import { Button } from "../ui/button";
import SideDrawer from "../common/Editor/SideDrawer";

const animatedComponents = makeAnimated();

const crumbs = [
  {
    id: 1,
    title: "Home",
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Leads",
    link: "/leads",
  },
];

const LeadsContent: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const { fetchAllLeadData, leadData, loading }: any = useLeadStore();
  const searchParams = useSearchParams();
  const queryParams = searchParams.get("id");
  const router = useRouter();
  const [allLeads, setAllLeads] = useState([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");

  const [filters, setFilters] = useState<any>({
    outcome: [],
  });

  const data = useMemo(() => allLeads, [allLeads]);

  useEffect(() => {
    fetchAllLeadData();
  }, []);

  const outcome = [
    { label: "Appointement Made", value: "Appointement Made" },
    { label: "Callback", value: "Callback" },
    { label: "Not Interseted", value: "Not Interseted" },
    { label: "Old Client", value: "Old Client" },
    { label: "Arrange an Appointment", value: "Arrange an Appointment" },
  ];

  useEffect(() => {
    if (
      leadData === "Invalid refresh token" ||
      leadData === "User not found" ||
      leadData === "Invalid User Access Token" ||
      leadData === "Invalid access token" ||
      leadData === "Unauthorized request: No access or refresh token"
    ) {
      router.push("/auth/login");
    } else {
      setAllLeads(leadData ? leadData?.leads || [] : []);
    }
  }, [leadData?.leads, leadData, router]);

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

  // Filter
  // useEffect(() => {
  //   const filterByOutcome = leadData?.filter((elem: any) => {
  //     if (filters.outcome) {
  //       return filters.outcome ? elem.outcome === filters.outcome : elem;
  //     } else {
  //       return leadData;
  //     }
  //   });

  //   setAllLeads(() => filterByOutcome);
  // }, [outcomeValue, leadData]);

  useEffect(() => {
    if (Array.isArray(leadData?.leads)) {
      const filterByOutcome: any =
        leadData &&
        leadData?.leads?.filter((elem: any) => {
          if (filters?.outcome?.length > 0) {
            return filters?.outcome?.includes(elem?.outcome);
          } else {
            return true;
          }
        });

      setAllLeads(filterByOutcome);
    }
  }, [filters?.outcome, leadData?.leads]);

  return (
    <div className="px-4 py-0 relative">
      {/* <div className="text-xl font-semibold absolute top-[-60px]">Leads</div> */}
      {/* <div className="mb-1">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}

      <div className="w-[300px] lg:absolute z-10 mt-2 lg:mt-0">
        <Select
          className="text-[0.8rem] boxShadow"
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={outcome}
          // value={filters.outcome}
          onChange={(selectedOptions) => {
            const selectedValues =
              selectedOptions &&
              selectedOptions.map((option: any) => option.value);
            setFilters((prev: any) => ({
              ...prev,
              outcome: selectedValues,
            }));
          }}
          placeholder="Select Outcome"
          // className="react-select-custom-styling__container "
          // classNamePrefix="react-select-custom-styling"
        />
      </div>

      <div className="md:flex justify-center sm:justify-end my-2">
        {allLeads?.length > 0 ? (
          <PageHeader tableInstance={tableInstance} />
        ) : (
          ""
        )}
        {/* <AddLeadDialoge getMyLeadData={fetchAllLeadData} /> */}
        <div className="flex justify-normal lg:justify-end ">
          <Link href={"/leads/addLead"}>
            <Button
              variant="outline"
              className=" text-[0.8rem] text-white bg-[#29354f] hover:bg-[#fff] hover:text-[#29354f] boxShadow"
            >
              New Lead
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

export default LeadsContent;
