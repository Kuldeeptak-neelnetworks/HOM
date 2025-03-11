"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "../common/data-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { debounce } from "lodash";
import CustomPagination from "../CustomPagination/CustomPagination";
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
  const pathname = usePathname();
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
  const [searchInput, setSearchInput] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialLimit = Number(searchParams.get("limit")) || 20;
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  // const statusOptions = [
  //   { label: "In Progress", value: "In Progress" },
  //   { label: "In Query", value: "In Query" },
  //   { label: "Completed", value: "Completed" },
  // ];

  // useEffect(() => {
  //   fetchAmendmentData();
  // }, []);

  const onPageChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString()); // ✅ Convert to string first

    params.set("page", newPage.toString());
    params.set("limit", newLimit.toString());

    router.push(`${pathname}?${params.toString()}`);
  };
  // ==============================================================
  // useEffect(() => {
  //   if (searchInput !== "") {
  //     setPage(1);
  //   }
  // }, [searchInput]);

  // Debounced search API call
  // const debouncedSearch = useCallback(
  //   debounce((searchInput) => {
  //     fetchAmendmentData({
  //       page,
  //       limit,
  //       searchInput,
  //       filters,
  //     });
  //   }, 500),
  //   [fetchAmendmentData, filters, page, limit]
  // );

  // useEffect(() => {
  //   debouncedSearch(searchInput);
  //   fetchAmendmentData({
  //     page,
  //     limit,
  //     searchInput,
  //     filters,
  //   });
  //   return () => {
  //     debouncedSearch.cancel();
  //   };
  // }, [searchInput, debouncedSearch, page, limit, filters]);
  // ==========================================================================

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
      setAllAmendments(
        amendmentData?.amendments ? amendmentData?.amendments || [] : []
      );
      setTotalPages(amendmentData?.totalPages);
    }
  }, [amendmentData, router, amendmentData?.totalPages]);

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

  const debouncedSearch = useCallback(
    debounce((input) => {
      fetchAmendmentData({ page, limit, searchInput: input, filters });
    }, 500),
    [fetchAmendmentData, filters, page, limit]
  );

  useEffect(() => {
    debouncedSearch(searchInput);
    return () => debouncedSearch.cancel();
  }, [searchInput, page, limit, filters, debouncedSearch]);

  useEffect(() => {
    if (amendmentData && amendmentData?.amendments) {
      setLoader(false);
      setAllAmendments(amendmentData?.amendments || []);
      setTotalPages(amendmentData?.totalPages);
    }
  }, [amendmentData]);

  useEffect(() => {
    if (Array.isArray(amendmentData?.amendments)) {
      const filterByStatus =
        amendmentData?.amendments &&
        amendmentData?.amendments?.filter((elem: any) => {
          if (filters?.status?.length > 0) {
            return filters?.status?.includes(elem?.status);
          } else {
            return true;
          }
        });

      setAllAmendments(filterByStatus);
    }
  }, [filters?.status, amendmentData?.amendments]);

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
          isClearable
          options={statusOptions}
          onChange={(selectedOption: any) => {
            const selectedValues = selectedOption ? selectedOption.value : [];
            setFilters((prev: any) => ({
              ...prev,
              status: selectedValues,
            }));
            setPage(1);
          }}
          placeholder="Select a Status"
          styles={{
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected
                ? "#29354f"
                : provided.backgroundColor,
              color: state.isSelected ? "white" : provided.color,
              ":hover": {
                backgroundColor: state.isSelected ? "#29354f" : "#f0f0f0",
              },
            }),
          }}
        />
      </div>

      <div className="md:flex justify-center sm:justify-end my-2">
        <PageHeader
          tableInstance={tableInstance}
          setSearchInput={setSearchInput}
        />

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
        text="amendment"
        queryParams={queryParams ? queryParams : ""}
        columns={columns}
        tableInstance={tableInstance}
        loading={loading}
      />
      <CustomPagination
        setLimit={setLimit}
        limit={limit}
        page={page}
        onPageChange={onPageChange}
        data={allAmendments}
        totalPages={totalPages}
      />
    </div>
  );
};

export default AmendmentContent;

//  <div className="flex justify-end mr-10 items-start gap-5">
//    <div className="flex justify-end items-center gap-2 mt-2">
//      <span className="text-sm text-[#29354f]">Rows per page:</span>
//      <Selector
//        onValueChange={(value) => setLimit(Number(value))}
//        name="rowsPerPage"
//        value={limit.toString()}
//      >
//        <SelectTrigger className="border-[#73819c] h-[28px] w-20 text-center">
//          <SelectValue placeholder="Rows" />
//        </SelectTrigger>
//        <SelectContent>
//          <SelectGroup>
//            {[10, 20, 50, 100].map((option) => (
//              <SelectItem
//                key={option}
//                value={option.toString()}
//                className="text-sm"
//              >
//                {option}
//              </SelectItem>
//            ))}
//          </SelectGroup>
//        </SelectContent>
//      </Selector>
//    </div>
//    <div className="flex justify-center items-center space-x-2 mt-3 ">
//      <div className="w-full text-center text-[0.8rem]  text-[#29354f]">{`Page ${page} of ${totalPages}`}</div>
//    </div>
//    <div className="flex justify-center items-center space-x-2 mt-2">
//      {/* First Page */}
//      <Button
//        onClick={() => onPageChange(1, limit)}
//        className="px-3 py-1 bg-white border border-gray-400 hover:bg-slate-300"
//        disabled={page === 1 || allAmendments?.length === 0}
//      >
//        <svg
//          width="15"
//          height="15"
//          viewBox="0 0 32 32"
//          fill="none"
//          xmlns="http://www.w3.org/2000/svg"
//        >
//          <path
//            fill-rule="evenodd"
//            clip-rule="evenodd"
//            d="M25.7071 5.29289C26.0976 5.68342 26.0976 6.31658 25.7071 6.70711L16.4142 16L25.7071 25.2929C26.0976 25.6834 26.0976 26.3166 25.7071 26.7071C25.3166 27.0976 24.6834 27.0976 24.2929 26.7071L14.2929 16.7071C13.9024 16.3166 13.9024 15.6834 14.2929 15.2929L24.2929 5.29289C24.6834 4.90237 25.3166 4.90237 25.7071 5.29289Z"
//            fill="black"
//          />
//          <path
//            fill-rule="evenodd"
//            clip-rule="evenodd"
//            d="M15.7071 5.29289C16.0976 5.68342 16.0976 6.31658 15.7071 6.70711L6.41421 16L15.7071 25.2929C16.0976 25.6834 16.0976 26.3166 15.7071 26.7071C15.3166 27.0976 14.6834 27.0976 14.2929 26.7071L4.29289 16.7071C3.90237 16.3166 3.90237 15.6834 4.29289 15.2929L14.2929 5.29289C14.6834 4.90237 15.3166 4.90237 15.7071 5.29289Z"
//            fill="black"
//          />
//        </svg>
//      </Button>

//      {/* Previous Page */}
//      <Button
//        onClick={() => onPageChange(page - 1, limit)}
//        className="px-3 py-1 bg-white border border-gray-400 hover:bg-slate-300"
//        disabled={page === 1 || allAmendments?.length === 0}
//      >
//        <svg
//          width="15"
//          height="15"
//          viewBox="0 0 32 32"
//          fill="none"
//          xmlns="http://www.w3.org/2000/svg"
//        >
//          <path
//            fill-rule="evenodd"
//            clip-rule="evenodd"
//            d="M20.7071 5.29289C21.0976 5.68342 21.0976 6.31658 20.7071 6.70711L11.4142 16L20.7071 25.2929C21.0976 25.6834 21.0976 26.3166 20.7071 26.7071C20.3166 27.0976 19.6834 27.0976 19.2929 26.7071L9.29289 16.7071C8.90237 16.3166 8.90237 15.6834 9.29289 15.2929L19.2929 5.29289C19.6834 4.90237 20.3166 4.90237 20.7071 5.29289Z"
//            fill="black"
//          />
//        </svg>
//      </Button>

//      {/* Next Page */}
//      <Button
//        onClick={() => onPageChange(page + 1, limit)}
//        className="px-3 py-1 bg-white  border border-gray-400 hover:bg-slate-300"
//        disabled={page === totalPages || allAmendments?.length === 0}
//      >
//        <svg
//          width="15"
//          height="15"
//          viewBox="0 0 32 32"
//          fill="none"
//          xmlns="http://www.w3.org/2000/svg"
//        >
//          <path
//            fill-rule="evenodd"
//            clip-rule="evenodd"
//            d="M11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289L22.7071 15.2929C23.0976 15.6834 23.0976 16.3166 22.7071 16.7071L12.7071 26.7071C12.3166 27.0976 11.6834 27.0976 11.2929 26.7071C10.9024 26.3166 10.9024 25.6834 11.2929 25.2929L20.5858 16L11.2929 6.70711C10.9024 6.31658 10.9024 5.68342 11.2929 5.29289Z"
//            fill="black"
//          />
//        </svg>
//      </Button>

//      {/* Last Page */}
//      <Button
//        onClick={() => onPageChange(totalPages, limit)}
//        className="px-3 py-1 bg-white border border-gray-400 hover:bg-slate-300"
//        disabled={page === totalPages || allAmendments?.length === 0}
//      >
//        <svg
//          width="15"
//          height="15"
//          viewBox="0 0 32 32"
//          fill="none"
//          xmlns="http://www.w3.org/2000/svg"
//        >
//          <path
//            fill-rule="evenodd"
//            clip-rule="evenodd"
//            d="M6.29289 5.29289C6.68342 4.90237 7.31658 4.90237 7.70711 5.29289L17.7071 15.2929C18.0976 15.6834 18.0976 16.3166 17.7071 16.7071L7.70711 26.7071C7.31658 27.0976 6.68342 27.0976 6.29289 26.7071C5.90237 26.3166 5.90237 25.6834 6.29289 25.2929L15.5858 16L6.29289 6.70711C5.90237 6.31658 5.90237 5.68342 6.29289 5.29289Z"
//            fill="black"
//          />
//          <path
//            fill-rule="evenodd"
//            clip-rule="evenodd"
//            d="M16.2929 5.29289C16.6834 4.90237 17.3166 4.90237 17.7071 5.29289L27.7071 15.2929C28.0976 15.6834 28.0976 16.3166 27.7071 16.7071L17.7071 26.7071C17.3166 27.0976 16.6834 27.0976 16.2929 26.7071C15.9024 26.3166 15.9024 25.6834 16.2929 25.2929L25.5858 16L16.2929 6.70711C15.9024 6.31658 15.9024 5.68342 16.2929 5.29289Z"
//            fill="black"
//          />
//        </svg>
//      </Button>
//    </div>
//  </div>;
