"use client";

import dynamic from "next/dynamic";
import SideBarContent from "@/components/Sidebar/SideBarContent";

import React, { useState } from "react";
const AmendmentDetailsContent = dynamic(
  () => import("@/components/Amendment/components/AmendmentDetailsContent"),
  { ssr: false }
);

const AmendmentDetailsPage: React.FC = () => {
  const [toggleWidth, setToggleWidth] = useState<boolean>(false);
  return (
    <div className="col-span-6">
      <div>
        <SideBarContent setToggleWidth={setToggleWidth} />
      </div>
      <div
        className={`${
          toggleWidth ? "sm:ml-64 ml-0" : "sm:ml-20 ml-0"
        } sm:px-4 p-0 transition-all duration-300 bg-[#f2f6fa] min-h-[95vh]`}
      >
        <div className=" dark:border-gray-700 ">
          <AmendmentDetailsContent />
        </div>
      </div>
    </div>
  );
};

export default AmendmentDetailsPage;
