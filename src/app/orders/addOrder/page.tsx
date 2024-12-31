"use client";
import SideBarContent from "@/components/Sidebar/SideBarContent";
import React, { useState } from "react";

import AddOrderForm from "@/components/Orders/components/AddOrderForm";

const AddOrderFormPage: React.FC = () => {
  const [toggleWidth, setToggleWidth] = useState<boolean>(false);
  return (
    <div className="col-span-6">
      <div>
        <SideBarContent setToggleWidth={setToggleWidth} />
      </div>
      <div
        className={
          toggleWidth
            ? `sm:px-4 p-0 sm:ml-64 ml-0  transition-all duration-300 bg-[#f2f6fa] min-h-[95vh] `
            : ` sm:px-4 p-0 sm:ml-20 ml-0 transition-all duration-300 bg-[#f2f6fa] min-h-[95vh] `
        }
        // className={
        //   toggleWidth
        //     ? `sm:px-4 p-0 sm:ml-20 ml-0 transition-all duration-300`
        //     : `sm:px-4 p-0 sm:ml-64 ml-0  transition-all duration-300`
        // }
      >
        <div className="rounded-md dark:border-gray-700">
          <AddOrderForm />
        </div>
      </div>
    </div>
  );
};

export default AddOrderFormPage;
