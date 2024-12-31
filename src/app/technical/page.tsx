"use client";

import SideBarContent from "@/components/Sidebar/SideBarContent";
import BreadcrumbSection from "@/components/common/BreadcrumbSection";
import dynamic from "next/dynamic";
const TechnicalTrackerContent = dynamic(
  () => import("@/components/TechnicalTracker/TechnicalTrackerContent"),
  { ssr: false }
);

import React, { useEffect, useState } from "react";

const TechnicalPage: React.FC = () => {
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
            ? `sm:px-2 p-0 sm:ml-64 ml-0  transition-all duration-300 bg-[#f2f6fa] min-h-[95vh]  `
            : `sm:px-2 p-0 sm:ml-20 ml-0 transition-all duration-300 bg-[#f2f6fa] min-h-[95vh]`
        }
      >
        <div className="rounded-md dark:border-gray-700">
          <TechnicalTrackerContent />
        </div>
      </div>
    </div>
  );
};

export default TechnicalPage;
