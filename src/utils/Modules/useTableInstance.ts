import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

interface UseTableInstanceProps<T> {
  data: T[];
  columns: any[]; // Replace `any` with the type of your column definitions if using TypeScript
  state: {
    sorting: any;
    columnVisibility: any;
    rowSelection: any;
    globalFilter: any;
    columnFilters: any;
  };
  setState: {
    setFiltering: (filter: any) => void;
    setRowSelection: (selection: any) => void;
    setSorting: (sorting: any) => void;
    setColumnFilters: (filters: any) => void;
    setColumnVisibility: (visibility: any) => void;
  };
}

export function useTableInstance<T>({
  data,
  columns,
  state,
  setState,
}: UseTableInstanceProps<T>) {
  const {
    sorting,
    columnVisibility,
    rowSelection,
    globalFilter,
    columnFilters,
  } = state;
  const {
    setFiltering,
    setRowSelection,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
  } = setState;

  return useReactTable({
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
      globalFilter,
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
}
