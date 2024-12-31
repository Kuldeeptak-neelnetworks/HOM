"use client";

import React, { useEffect, useMemo, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "../common/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import BreadcrumbSection from "../common/BreadcrumbSection";
import { useCustomerStore } from "@/Store/CustomerStore";
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
import makeAnimated from "react-select/animated";
import Link from "next/link";
import { Button } from "../ui/button";
const animatedComponents = makeAnimated();

// interface CustomerData {
//   message: string;
//   users_data: any[];
//   customer_list: any[];
// }

// Crumbs Array
const crumbs = [
  {
    id: 1,
    title: "Home",
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Customers",
    link: "/customers",
  },
];

const CustomersContent: React.FC = () => {
  const { fetchAllCustomerData, customerData, loading }: any =
    useCustomerStore();
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const [allCustomers, setAllCustomers] = useState([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");
  const data = useMemo(() => allCustomers, [allCustomers]);

  const searchParams = useSearchParams();
  const queryParams = searchParams.get("id");

  let userDetails: any =
    typeof window !== "undefined" ? localStorage?.getItem("user") : null;
  let userRole = JSON.parse(userDetails)?.role;

  const [filters, setFilters] = useState<any>({
    status: [],
  });

  const statusOptions = [
    { label: "In Process", value: "IN PROCESS" },
    { label: "Live", value: "LIVE" },
    { label: "Site Taken Down", value: "SITE TAKEN DOWN" },
    { label: "Suspended", value: "SUSPENDED" },
    { label: "Upload", value: "UPLOAD" },
    { label: "Will Get Cancelled", value: "WILL GET CANCELLED" },
  ];

  useEffect(() => {
    fetchAllCustomerData();
  }, []);

  useEffect(() => {
    if (
      customerData === "Invalid refresh token" ||
      customerData === "User not found" ||
      customerData === "Invalid User Access Token" ||
      customerData === "Invalid access token" ||
      customerData === "Unauthorized request: No access or refresh token"
    ) {
      router.push("/auth/login");
    } else {
      setLoader(false);
      setAllCustomers(
        customerData?.customers ? customerData?.customers || [] : []
      );
    }
  }, [customerData, router]);

  // useEffect(() => {
  //   const filterByStatus = customerData.customers?.filter((elem: any) => {
  //     if (statusValue !== "all") {
  //       return statusValue ? elem.status === statusValue : elem;
  //     } else {
  //       return customerData;
  //     }
  //   });

  //   setAllCustomers(() => filterByStatus);
  // }, [statusValue, customerData]);

  // Table Instance

  // useEffect(() => {
  //   const filterByStatus = customerData?.customers?.filter((elem: any) => {
  //     if (filters?.status?.length > 0) {
  //       return filters?.status?.includes(elem?.status);
  //     } else {
  //       return true;
  //     }
  //   });

  //   setAllCustomers(filterByStatus);
  // }, [filters?.status, customerData]);

  useEffect(() => {
    if (Array.isArray(customerData?.customers)) {
      const filterByStatus: any =
        customerData &&
        customerData?.customers?.filter((elem: any) => {
          if (filters?.status?.length > 0) {
            return filters?.status?.includes(elem?.status);
          } else {
            return true;
          }
        });

      setAllCustomers(filterByStatus);
    }
  }, [filters?.status, customerData?.customers]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  useEffect(() => {
    fetchAllCustomerData(pagination.pageIndex + 1, pagination.pageSize);
  }, [pagination]);

  // const tableInstance = useReactTable({
  //   data,
  //   columns,
  //   // initialState: {
  //   //   pagination: {
  //   //     pageIndex: 2, //custom initial page index
  //   //     pageSize: 10, //custom default page size
  //   //   },
  //   // },
  //   state: {
  //     // pagination,
  //     sorting,
  //     columnVisibility,
  //     rowSelection,
  //     globalFilter: filtering,
  //     columnFilters,
  //   },
  //   manualPagination: true,
  //   onPaginationChange: setPagination,
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
  //   pageCount: customerData.totalPages,
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
    <div className="pr-0 pl-2 py-0 relative ">
      {/* <div className="text-xl font-semibold absolute top-[-54px]">
        Customers
      </div> */}
      {/* <div className="mb-1">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}

      <div className="w-[300px] lg:absolute  z-50 mt-2 lg:mt-0">
        <Select
          className="text-[0.8rem] boxShadow"
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={statusOptions}
          // value={filters.outcome}
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
        {customerData?.customers?.length ||
        customerData?.customers?.length > 0 ? (
          <PageHeader tableInstance={tableInstance} />
        ) : (
          ""
        )}

        <div className="flex justify-normal lg:justify-end">
          <Link href={"/customers/addCustomer"}>
            <Button
              variant="outline"
              className=" text-[0.8rem] text-white bg-[#29354f] hover:bg-[#fff] hover:text-[#29354f] boxShadow"
            >
              New Customer
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

export default CustomersContent;
