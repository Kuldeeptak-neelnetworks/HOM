"use client";

import {
  baseInstance,
  headerOptions,
  logOutFunction,
} from "@/common/commonFunctions";
import { AddAppointmentDialoge } from "@/components/Leads/components/AddAppointmentDialoge";
import AddAppointmentForm from "@/components/Leads/components/AddAppointmentForm";
import EditAppointmentForm from "@/components/Leads/components/EditAppointmentForm";
import LeadsDetailsContent from "@/components/Leads/components/LeadsDetailsContent";
import SideBarContent from "@/components/Sidebar/SideBarContent";
import React, { useEffect, useState } from "react";

const AddAppointmentPage = () => {
  const [toggleWidth, setToggleWidth] = useState<boolean>(false);
  return (
    <div className="col-span-6">
      <div>
        <SideBarContent setToggleWidth={setToggleWidth} />
      </div>
      <div
        className={`${
          toggleWidth ? "sm:ml-64 ml-0" : "sm:ml-20 ml-0"
        } p-0 sm:px-4 transition-all duration-300 bg-[#f2f6fa] min-h-[95vh] `}
      >
        <div className="rounded-md dark:border-gray-700">
          <AddAppointmentDialoge />
        </div>
      </div>
    </div>
  );
};

export default AddAppointmentPage;
