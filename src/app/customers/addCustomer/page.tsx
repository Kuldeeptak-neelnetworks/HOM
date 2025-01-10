"use client";

import SideBarContent from "@/components/Sidebar/SideBarContent";
const AddCustomerContent = dynamic(
  () => import("@/components/customers/components/AddCustomerContent"),
  { ssr: false }
);
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const AddCustomerDetailsPage = () => {
  const [toggleWidth, setToggleWidth] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  return (
    <div className="col-span-6">
      <div>
        <SideBarContent setToggleWidth={setToggleWidth} />
      </div>
      <div
        className={`${
          toggleWidth ? "sm:ml-64 ml-0" : "sm:ml-20 ml-0"
        } p-0 sm:px-4 transition-all duration-300 bg-[#f2f6fa]`}
      >
        <div className="dark:border-gray-700 ">
          <AddCustomerContent />
        </div>
      </div>
    </div>
  );
};

export default AddCustomerDetailsPage;
