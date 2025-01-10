"use client";
import { SearchIconSVG } from "@/utils/SVGs/SVGs";
import React, { useState } from "react";

const PageHeader = ({ tableInstance }: any) => {
  const { initialState, options } = tableInstance;
  return (
    <div className="relative flex items-center md:mx-4 my-3 md:my-0">
      <span className="absolute pl-2">
        <SearchIconSVG />
      </span>
      <input
        className="input-field w-100 border border-1 text-[0.8rem] border-gray-400 py-[0.42rem]  px-[2rem] outline-none boxShadow"
        type="text"
        placeholder="Search"
        // value={initialState?.globalFilter?.filtering || ""}
        onChange={(e) => {
          options.onGlobalFilterChange(e.target.value);
        }}
      />
    </div>
  );
};

export default PageHeader;
