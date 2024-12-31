"use client";
import EditEmployeeLeaveForm from "@/components/EmployeeLeaveContent/components/EditEmployeeLeaveForm";
import SideBarContent from "@/components/Sidebar/SideBarContent";
import React, { useState } from "react";

const EditEmployeeLeavePage = () => {
  const [toggleWidth, setToggleWidth] = useState<boolean>(false);
  return (
    <div className="col-span-6">
      <div>
        <SideBarContent setToggleWidth={setToggleWidth} />
      </div>
      <div
        className={`${
          toggleWidth ? "sm:ml-64 ml-0" : "sm:ml-20 ml-0"
        } p-0 sm:p-4 transition-all duration-300 bg-[#f2f6fa] min-h-[95vh] `}
      >
        <div className="rounded-md dark:border-gray-700">
          <EditEmployeeLeaveForm />
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeLeavePage;
