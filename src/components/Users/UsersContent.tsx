"use client";

import React, { useEffect, useMemo, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "../common/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import BreadcrumbSection from "../common/BreadcrumbSection";
import { useUserStore } from "@/Store/UserStore";
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
// import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "../ui/button";

// Crumbs Array
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
];

const UsersContent: React.FC = () => {
  // Hooks and States
  const router = useRouter();
  const { fetchUsersData, userData, loading } = useUserStore();
  const [allUsers, setAllUsers] = useState<any>([]);
  const [loader, setLoader] = useState(true);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");
  const data = useMemo(() => allUsers, [allUsers]);
  const [roleValue, setRoleValue] = useState<any>("");
  const searchParams = useSearchParams();
  const queryParams = searchParams.get("id");

  useEffect(() => {
    fetchUsersData();
  }, []);

  if (data === "Only admins can access this resource") {
    router.push("/auth/login");
  }

  useEffect(() => {
    if (
      userData === "Invalid refresh token" ||
      userData === "User not found" ||
      userData === "Invalid User Access Token" ||
      userData === "Invalid access token" ||
      userData === "Unauthorized request: No access or refresh token"
    ) {
      router.push("/auth/login");
    } else {
      setLoader(false);
      setAllUsers(userData ? userData || [] : []);
    }
  }, [userData, router]);

  useEffect(() => {
    if (Array.isArray(userData)) {
      const filterByStatus = userData?.filter((elem: any) => {
        if (roleValue !== "all") {
          return roleValue ? elem.role === roleValue : elem;
        } else {
          return userData;
        }
      });

      setAllUsers(() => filterByStatus);
    }
  }, [roleValue, userData]);

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
      {/* <div className="text-xl font-semibold absolute top-[-52px]">Users</div> */}
      {/* <div className="mb-1">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}

      <div className="w-[300px] lg:absolute mt-2 lg:mt-0">
        <Select onValueChange={(value: any) => setRoleValue(value)} name="role">
          <SelectTrigger className="border-[#73819c] boxShadow">
            <SelectValue
              placeholder="Select a Role"
              className="text-[0.8rem] text-gray-50"
            />
          </SelectTrigger>
          <SelectContent className="text-[0.8rem]">
            <SelectGroup>
              <SelectLabel className="text-[0.8rem]">Select</SelectLabel>
              <SelectItem value="all" className="text-[0.8rem]">
                All
              </SelectItem>
              <SelectItem value="admin" className="text-[0.8rem]">
                Admin
              </SelectItem>
              <SelectItem value="salesman" className="text-[0.8rem]">
                Sales Person
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="md:flex justify-center sm:justify-end my-2">
        {allUsers?.length || allUsers.length > 0 ? (
          <PageHeader tableInstance={tableInstance} />
        ) : (
          ""
        )}

        <div className="flex justify-normal lg:justify-end">
          <Link href={"/users/addUser"}>
            <Button
              variant="outline"
              className=" text-[0.8rem] text-white bg-[#29354f] hover:bg-[#fff] hover:text-[#29354f] "
            >
              Add New User
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

export default UsersContent;
