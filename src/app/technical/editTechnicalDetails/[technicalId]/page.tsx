"use client";
import SideBarContent from "@/components/Sidebar/SideBarContent";
import EditTechnical from "@/components/TechnicalTracker/components/EditTechnical";
import React, { useEffect, useState } from "react";

const EditTechnicalDetailsPage = () => {
  const [toggleWidth, setToggleWidth] = useState<boolean>(false);
  return (
    <div className="col-span-6">
      <div>
        <SideBarContent setToggleWidth={setToggleWidth} />
      </div>
      <div
        className={`${
          toggleWidth ? "sm:ml-64  ml-0" : "sm:ml-20 ml-0"
        } sm:px-4 p-0 transition-all duration-300 bg-[#f2f6fa] min-h-[95vh] `}
      >
        <div className="rounded-md dark:border-gray-700">
          <EditTechnical />
        </div>
      </div>
    </div>
  );
};

export default EditTechnicalDetailsPage;
