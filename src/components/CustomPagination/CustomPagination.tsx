import React from "react";
import Select from "react-select";
import {
  Select as Selector,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const CustomPagination = ({
  setLimit,
  limit,
  page,
  onPageChange,
  totalPages,
  data,
}: any) => {
  return (
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
          disabled={page === 1 || data?.length === 0}
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
          disabled={page === 1 || data?.length === 0}
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
          disabled={page === totalPages || data?.length === 0}
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
          disabled={page === totalPages || data?.length === 0}
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
  );
};

export default CustomPagination;
