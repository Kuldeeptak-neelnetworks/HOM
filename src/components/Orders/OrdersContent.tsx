"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import BreadcrumbSection from "../common/BreadcrumbSection";
import { DataTable } from "../common/data-table";
import { columns as cols } from "./components/columns";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useOrderStore } from "@/Store/OrderStore";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  Select as Selector,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import PageHeader from "../common/PageHeader";
import { useSearchParams } from "next/navigation";
import { debounce } from "lodash";
const animatedComponents = makeAnimated();

const crumbs = [
  {
    id: 1,
    title: "Home",
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Orders",
    link: "/orders",
  },
];

const OrdersContent = () => {
  const { fetchAllOrdersData, orderData, loading }: any = useOrderStore();
  const [orderList, setOrderList] = useState<any>([]);
  const [yearOptions, setYearOptions] = useState<any[]>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // Read page and limit from URL or set default values
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");
  const data = useMemo(() => orderList, [orderList]);
  const columns = useMemo(() => cols, [cols]);
  const [filters, setFilters] = useState<any>({
    orderType: [],
  });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryParams = searchParams.get("id");

  const initialPage = Number(searchParams.get("page")) || 1;
  const initialLimit = Number(searchParams.get("limit")) || 20;

  const [orderYear, setOrderYear] = useState<any>("");
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  // useEffect(() => {
  //   if (orderYear && orderYear) fetchAllOrdersData(orderYear);
  // }, [orderYear]);

  const orderTypeOptions = [
    { label: "New Business", value: "New Business" },
    { label: "Renewal", value: "Renewal" },
  ];
  const orderYearsOptions = [
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
  ];

  useEffect(() => {
    if (
      orderData === "Invalid refresh token" ||
      orderData === "User not found" ||
      orderData === "Invalid User Access Token" ||
      orderData === "Invalid access token" ||
      orderData === "Unauthorized request: No access or refresh token"
    ) {
      router.push("/auth/login");
    } else {
      setLoader(false);
      setOrderList(orderData ? orderData?.orders || [] : []);
      setTotalPages(orderData?.totalPages);
    }
  }, [orderData, router, orderData?.totalPages]);

  const tableInstance = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 100, //custom default page size
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

  // useEffect(() => {
  //   const filterByOrderType = orderData?.orders?.filter((elem: any) => {
  //     if (filters?.orderType?.length > 0) {
  //       return filters?.orderType?.includes(elem?.orderType);
  //     } else {
  //       return true;
  //     }
  //   });

  //   setOrderList(filterByOrderType);
  // }, [filters?.orderType, orderData]);

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 3; // Adjust range as needed
    const endYear = currentYear; // Adjust range as needed
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => startYear + index
    );
  };

  // Set default orderYear to current year and yearOptions when page loads
  useEffect(() => {
    setYearOptions(getYearOptions());
    setOrderYear(new Date().getFullYear().toString()); // Set default to current year
  }, []);
  // const yearOptions = getYearOptions();

  // useEffect(() => {
  //   if (orderYear && orderYear)
  //     fetchAllOrdersData({
  //       year: orderYear,
  //       page,
  //       limit,
  //       searchInput,
  //       filters,
  //     });
  // }, [orderYear, page, limit, searchInput, filters]);

  const onPageChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString()); // ✅ Convert to string first

    params.set("page", newPage.toString());
    params.set("limit", newLimit.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (orderYear || limit) {
      setPage(1);
    }
  }, [orderYear, limit]);

  useEffect(() => {
    if (searchInput !== "") {
      setPage(1);
    }
  }, [searchInput]);

  // ========================================

  // Debounced search API call
  const debouncedSearch = useCallback(
    debounce((searchInput) => {
      if (orderYear)
        fetchAllOrdersData({
          page,
          limit,
          year: orderYear,
          searchInput,
          filters,
        });
    }, 500),
    [fetchAllOrdersData, orderYear, filters, page, limit] // Add necessary dependencies
  );

  useEffect(() => {
    if (searchInput.trim().length > 0) {
      debouncedSearch(searchInput);
    } else if (orderYear) {
      fetchAllOrdersData({
        page,
        limit,
        year: orderYear,
        searchInput,
        filters,
      });
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchInput, debouncedSearch, page, limit, orderYear, filters]);

  return (
    <div className="px-4 py-0 relative">
      {/* <div className="text-xl font-semibold absolute top-[-60px]">Orders</div> */}
      {/* <div className="mb-1">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}

      <div className="w-[300px] md:w-[500px] lg:absolute z-50 mt-2 lg:mt-0 md:flex gap-2">
        <Select
          className="text-[0.8rem] border-red-400 w-full mb-2 md:mb-0 boxShadow"
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={orderTypeOptions}
          // value={filters.status}
          onChange={(selectedOptions) => {
            const selectedValues =
              selectedOptions &&
              selectedOptions.map((option: any) => option.value);
            setFilters((prev: any) => ({
              ...prev,
              orderType: selectedValues,
            }));
          }}
          placeholder="Select Order Type"
        />

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
              <SelectLabel className="text-[0.8rem]">Select a year</SelectLabel>
              {yearOptions &&
                yearOptions?.map((year) => (
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

      <div className="md:flex justify-center sm:justify-end my-2">
        {
          <div className="mt-[3px]">
            <PageHeader
              tableInstance={tableInstance}
              setSearchInput={setSearchInput}
              // serchInput={serchInput}
            />
          </div>
        }

        <div className="flex md:justify-end justify-start">
          <Link href={"/orders/addOrder"}>
            <Button
              variant="outline"
              className="text-[0.8rem] text-white bg-[#29354f] hover:bg-[#fff] hover:text-[#29354f] boxShadow"
            >
              Add Order
            </Button>
          </Link>
        </div>
      </div>
      <DataTable
        queryParams={queryParams ? queryParams : ""}
        columns={columns}
        tableInstance={tableInstance}
        loading={loading}
        text="orders"
      />
      <div className="absolute bottom-[-20px] bg-white text-[0.89rem] boxShadow">
        <div className="p-1">
          <div>
            <span className="font-bold">Total Order Value :</span>
            <span className="px-1">
              {orderData?.totals?.totalOrderValue.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="font-bold">Total Dd Monthly :</span>
            <span className="px-1">
              {orderData?.totals?.totalDdMonthly.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mr-10 items-start gap-5">
        <div className="flex justify-end items-center gap-2 mt-2">
          <span className="text-sm text-[#29354f]">Rows per page:</span>
          <Selector
            onValueChange={(value) => setLimit(Number(value))}
            name="rowsPerPage"
            value={limit.toString()}
          >
            <SelectTrigger className="border-[#73819c] h-[28px] w-20 text-center">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[10, 20, 50, 100].map((option) => (
                  <SelectItem
                    key={option}
                    value={option.toString()}
                    className="text-sm"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Selector>
        </div>
        <div className="flex justify-center items-center space-x-2 mt-3 ">
          <div className="w-full text-center text-[0.8rem]  text-[#29354f]">{`Page ${page} of ${totalPages}`}</div>
        </div>
        <div className="flex justify-center items-center space-x-2 mt-2">
          {/* First Page */}
          <Button
            onClick={() => onPageChange(1, limit)}
            className="px-3 py-1 bg-white border border-gray-400 hover:bg-slate-300"
            disabled={page === 1 || orderList?.length === 0}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M25.7071 5.29289C26.0976 5.68342 26.0976 6.31658 25.7071 6.70711L16.4142 16L25.7071 25.2929C26.0976 25.6834 26.0976 26.3166 25.7071 26.7071C25.3166 27.0976 24.6834 27.0976 24.2929 26.7071L14.2929 16.7071C13.9024 16.3166 13.9024 15.6834 14.2929 15.2929L24.2929 5.29289C24.6834 4.90237 25.3166 4.90237 25.7071 5.29289Z"
                fill="black"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M15.7071 5.29289C16.0976 5.68342 16.0976 6.31658 15.7071 6.70711L6.41421 16L15.7071 25.2929C16.0976 25.6834 16.0976 26.3166 15.7071 26.7071C15.3166 27.0976 14.6834 27.0976 14.2929 26.7071L4.29289 16.7071C3.90237 16.3166 3.90237 15.6834 4.29289 15.2929L14.2929 5.29289C14.6834 4.90237 15.3166 4.90237 15.7071 5.29289Z"
                fill="black"
              />
            </svg>
          </Button>

          {/* Previous Page */}
          <Button
            onClick={() => onPageChange(page - 1, limit)}
            className="px-3 py-1 bg-white border border-gray-400 hover:bg-slate-300"
            disabled={page === 1 || orderList?.length === 0}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20.7071 5.29289C21.0976 5.68342 21.0976 6.31658 20.7071 6.70711L11.4142 16L20.7071 25.2929C21.0976 25.6834 21.0976 26.3166 20.7071 26.7071C20.3166 27.0976 19.6834 27.0976 19.2929 26.7071L9.29289 16.7071C8.90237 16.3166 8.90237 15.6834 9.29289 15.2929L19.2929 5.29289C19.6834 4.90237 20.3166 4.90237 20.7071 5.29289Z"
                fill="black"
              />
            </svg>
          </Button>

          {/* Next Page */}
          <Button
            onClick={() => onPageChange(page + 1, limit)}
            className="px-3 py-1 bg-white  border border-gray-400 hover:bg-slate-300"
            disabled={page === totalPages || orderList?.length === 0}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289L22.7071 15.2929C23.0976 15.6834 23.0976 16.3166 22.7071 16.7071L12.7071 26.7071C12.3166 27.0976 11.6834 27.0976 11.2929 26.7071C10.9024 26.3166 10.9024 25.6834 11.2929 25.2929L20.5858 16L11.2929 6.70711C10.9024 6.31658 10.9024 5.68342 11.2929 5.29289Z"
                fill="black"
              />
            </svg>
          </Button>

          {/* Last Page */}
          <Button
            onClick={() => onPageChange(totalPages, limit)}
            className="px-3 py-1 bg-white border border-gray-400 hover:bg-slate-300"
            disabled={page === totalPages || orderList?.length === 0}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.29289 5.29289C6.68342 4.90237 7.31658 4.90237 7.70711 5.29289L17.7071 15.2929C18.0976 15.6834 18.0976 16.3166 17.7071 16.7071L7.70711 26.7071C7.31658 27.0976 6.68342 27.0976 6.29289 26.7071C5.90237 26.3166 5.90237 25.6834 6.29289 25.2929L15.5858 16L6.29289 6.70711C5.90237 6.31658 5.90237 5.68342 6.29289 5.29289Z"
                fill="black"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.2929 5.29289C16.6834 4.90237 17.3166 4.90237 17.7071 5.29289L27.7071 15.2929C28.0976 15.6834 28.0976 16.3166 27.7071 16.7071L17.7071 26.7071C17.3166 27.0976 16.6834 27.0976 16.2929 26.7071C15.9024 26.3166 15.9024 25.6834 16.2929 25.2929L25.5858 16L16.2929 6.70711C15.9024 6.31658 15.9024 5.68342 16.2929 5.29289Z"
                fill="black"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrdersContent;
