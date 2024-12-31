"use client";

import {
  baseInstance,
  headerOptions,
  logOutFunction,
} from "@/common/commonFunctions";
import SideBarContent from "@/components/Sidebar/SideBarContent";
import dynamic from "next/dynamic";
// import CustomerDetailsContent from "@/components/customers/components/CustomerDetailsContent";
const CustomerDetailsContent = dynamic(
  () => import("@/components/customers/components/CustomerDetailsContent"),
  { ssr: false }
);
import React, { useEffect, useState } from "react";

const customerDetailsPage = () => {
  const [toggleWidth, setToggleWidth] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or some fallback UI
  }
  return (
    <div className="col-span-6">
      <div>
        <SideBarContent setToggleWidth={setToggleWidth} />
      </div>
      <div
        // className={
        //   toggleWidth
        //     ? `p-4 ml-20 transition-all duration-300`
        //     : `p-4 ml-64 transition-all duration-300`
        // }
        className={`${
          toggleWidth ? "sm:ml-64 ml:0" : "sm:ml-20 ml:0"
        } sm:px-2 py-1 transition-all duration-300 bg-[#f2f6fa] min-h-[95vh] `}
      >
        <div className="rounded-md dark:border-gray-700">
          <CustomerDetailsContent />
        </div>
      </div>
    </div>
  );
};

export default customerDetailsPage;
