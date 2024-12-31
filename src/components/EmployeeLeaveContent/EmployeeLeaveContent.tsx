"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getColumns } from "./components/columns";
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
import Select from "react-select";
import Link from "next/link";
import { Button } from "../ui/button";
import { baseInstance, errorToastingFunction } from "@/common/commonFunctions";
import { useEmployeeLeaveStore } from "@/Store/EmployeeLeaveStore";
import LeaveSection from "./components/LeaveSection";

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

interface UserData {
  fullName?: string;
  avatar?: string;
  mobileNo?: string;
  address?: string;
  role?: string;
}

const EmployeeLeaveContent: React.FC = () => {
  // Hooks and States
  //   const router = useRouter();
  //   const { fetchUsersData, userData, loading } = useUserStore();
  //   const [allUsers, setAllUsers] = useState<any>([]);
  //   const [loader, setLoader] = useState(true);

  //   const [rowSelection, setRowSelection] = React.useState({});
  //   const [columnVisibility, setColumnVisibility] =
  //     React.useState<VisibilityState>({});
  //   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
  //     []
  //   );
  //   const [sorting, setSorting] = React.useState<SortingState>([]);
  //   const [filtering, setFiltering] = React.useState("");
  //   const data = useMemo(() => allUsers, [allUsers]);
  //   const [roleValue, setRoleValue] = useState<any>("");

  //   useEffect(() => {
  //     fetchUsersData();
  //   }, []);

  //   if (data === "Only admins can access this resource") {
  //     router.push("/auth/login");
  //   }

  //   useEffect(() => {
  //     if (userData === "invalid token" || userData === "Unauthorized request") {
  //       router.push("/auth/login");
  //     } else {
  //       setLoader(false);
  //       setAllUsers(userData ? userData || [] : []);
  //     }
  //   }, [userData, router]);

  //   useEffect(() => {
  //     if (Array.isArray(userData)) {
  //       const filterByStatus = userData?.filter((elem: any) => {
  //         if (roleValue !== "all") {
  //           return roleValue ? elem.role === roleValue : elem;
  //         } else {
  //           return userData;
  //         }
  //       });

  //       setAllUsers(() => filterByStatus);
  //     }
  //   }, [roleValue, userData]);

  //   const tableInstance = useReactTable({
  //     data,
  //     columns,
  //     initialState: {
  //       pagination: {
  //         pageIndex: 0, //custom initial page index
  //         pageSize: 25, //custom default page size
  //       },
  //     },
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

  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [employeeID, setEmployeeID] = useState<string | null>(null);
  const {
    fetchEmployeeLeaveData,
    EmployeeLeaveData,
    fetchEmployeeData,
    EmployeeData,
    loading,
  }: any = useEmployeeLeaveStore();
  const [allEmployeesLeaveData, setAllEmployeesLeaveData] = useState([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");
  const [filters, setFilters] = useState<any>({
    leaveType: [],
  });
  const searchParams = useSearchParams();
  const queryParams = searchParams.get("id");
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRoleHOM");
    const EEmployeeID = localStorage.getItem("userIdHOM");
    setUserRole(role);
    setEmployeeID(EEmployeeID);
  }, []);

  const dynamicColumns = useMemo(() => getColumns(userRole), [userRole]);

  useEffect(() => {
    fetchEmployeeLeaveData();
  }, []);

  useEffect(() => {
    if (employeeID) {
      fetchEmployeeData(employeeID);
    }
  }, [employeeID]);

  const data = useMemo(() => allEmployeesLeaveData, [allEmployeesLeaveData]);

  useEffect(() => {
    if (
      EmployeeLeaveData === "Invalid refresh token" ||
      EmployeeLeaveData === "User not found" ||
      EmployeeLeaveData === "Invalid User Access Token" ||
      EmployeeLeaveData === "Invalid access token" ||
      EmployeeLeaveData === "Unauthorized request: No access or refresh token"
    ) {
      router.push("/auth/login");
    } else {
      setAllEmployeesLeaveData(
        EmployeeLeaveData ? EmployeeLeaveData || [] : []
      );
    }
  }, [EmployeeLeaveData, router]);

  useEffect(() => {
    if (Array.isArray(EmployeeLeaveData)) {
      const filterByStatus: any =
        EmployeeLeaveData &&
        EmployeeLeaveData?.filter((elem: any) => {
          if (filters?.leaveType?.length > 0) {
            return filters?.leaveType?.includes(elem?.leaveType);
          } else {
            return true;
          }
        });

      setAllEmployeesLeaveData(filterByStatus);
    }
  }, [filters?.leaveType, EmployeeLeaveData]);

  const leaveTypeOptions = [
    { label: "Sick Leave", value: "Sick Leave" },
    { label: "Vacation", value: "Vacation" },
    { label: "Personal Leave", value: "Personal Leave" },
    { label: "Other", value: "Other" },
  ];

  const tableInstance = useReactTable({
    data,
    columns: dynamicColumns,
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

  const showTable = () => {
    setIsShow((prev) => !prev);
  };

  return (
    <>
      <div className="px-4 py-0 relative">
        {/* <div className="text-xl font-semibold absolute top-[-52px]">Users</div> */}
        {/* <div className="mb-1">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}

        {/* {userRole === "admin" ? (
          <div className="w-[300px] lg:absolute  z-50 mt-2 lg:mt-0">
            <Select
              className="text-[0.8rem] boxShadow"
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={leaveTypeOptions}
              // value={filters.outcome}
              onChange={(selectedOptions) => {
                const selectedValues =
                  selectedOptions &&
                  selectedOptions.map((option: any) => option.value);
                setFilters((prev: any) => ({
                  ...prev,
                  leaveType: selectedValues,
                }));
              }}
              placeholder="Select Leave Type"
            />
          </div>
        ) : (
          ""
        )} */}
        {isShow && (
          <div className="w-[300px] lg:absolute  z-50 mt-2 lg:mt-0">
            <Select
              className="text-[0.8rem] boxShadow"
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={leaveTypeOptions}
              // value={filters.outcome}
              onChange={(selectedOptions) => {
                const selectedValues =
                  selectedOptions &&
                  selectedOptions.map((option: any) => option.value);
                setFilters((prev: any) => ({
                  ...prev,
                  leaveType: selectedValues,
                }));
              }}
              placeholder="Select Leave Type"
            />
          </div>
        )}

        <div className="md:flex justify-center sm:justify-end my-2 gap-2">
          {/* {userRole === "admin" ? (
            allEmployeesLeaveData?.length ||
            allEmployeesLeaveData.length > 0 ? (
              <PageHeader tableInstance={tableInstance} />
            ) : (
              ""
            )
          ) : (
            ""
          )} */}
          {isShow === true ? (
            allEmployeesLeaveData?.length ||
            allEmployeesLeaveData.length > 0 ? (
              <PageHeader tableInstance={tableInstance} />
            ) : (
              ""
            )
          ) : (
            ""
          )}
          <Button
            variant="outline"
            className={`text-[0.8rem] text-white  hover:bg-[#fff] hover:text-[#29354f] ${
              isShow ? "bg-slate-500" : "bg-[#29354f]"
            }`}
            onClick={showTable}
          >
            Visit Logs
          </Button>

          <div className="flex justify-normal lg:justify-end">
            <Link href={"/employeeLeaveManagement/addEmployeeLeave"}>
              <Button
                variant="outline"
                className=" text-[0.8rem] text-white bg-[#29354f] hover:bg-[#fff] hover:text-[#29354f] "
              >
                New Leave
              </Button>
            </Link>
          </div>
        </div>
        {/* {userRole !== "admin" ? <LeaveSection /> : ""}
        {userRole === "admin" ? (
          <DataTable
            columns={dynamicColumns}
            tableInstance={tableInstance}
            loading={loading}
          />
        ) : (
          ""
        )} */}
        {/* {userRole !== "admin" ? <LeaveSection /> : ""} */}
        {!isShow && (
          <LeaveSection
            userRole={userRole}
            EmployeeData={EmployeeData}
            EmployeeLeaveData={EmployeeLeaveData}
          />
        )}
        {isShow && (
          <DataTable
            queryParams={queryParams ? queryParams : ""}
            columns={dynamicColumns}
            tableInstance={tableInstance}
            loading={loading}
          />
        )}
      </div>
    </>
  );
};

export default EmployeeLeaveContent;
