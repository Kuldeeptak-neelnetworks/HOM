"use client";
import SideBarContent from "@/components/Sidebar/SideBarContent";
import dynamic from "next/dynamic";
// import CustomersContent from "@/components/customers/CustomersContent";
const CustomersContent = dynamic(
  () => import("@/components/customers/CustomersContent"),
  { ssr: false }
);

import React, { useEffect, useState } from "react";

const CustomersPage: React.FC = () => {
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
        className={
          toggleWidth
            ? `sm:px-4  p-0 sm:ml-64 ml-0 transition-all duration-300 bg-[#f2f6fa] min-h-[95vh]`
            : `sm:px-4  sm:ml-20 ml-0 transition-all duration-300 bg-[#f2f6fa] min-h-[95vh] `
        }
      >
        <div className="dark:border-gray-700">
          <CustomersContent />
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
