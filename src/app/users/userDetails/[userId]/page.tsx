"use client";

import {
  baseInstance,
  headerOptions,
  logOutFunction,
} from "@/common/commonFunctions";
import LeadsDetailsContent from "@/components/Leads/components/LeadsDetailsContent";
import SideBarContent from "@/components/Sidebar/SideBarContent";
import UserDetailsContent from "@/components/Users/components/UserDetailsContent";
import CustomerDetailsContent from "@/components/customers/components/CustomerDetailsContent";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const UserDetailsPage = () => {
  const [toggleWidth, setToggleWidth] = useState<boolean>(false);
  return (
    <div className="col-span-6">
      <div>
        <SideBarContent setToggleWidth={setToggleWidth} />
      </div>
      <div
        // className={`${
        //   toggleWidth ? "sm:ml-20 ml-0" : "sm:ml-64 ml-0"
        // } sm:px-4 p-0 transition-all duration-300`}
        className={`${
          toggleWidth ? "sm:ml-64 ml-0" : "sm:ml-20 ml-0"
        } sm:px-4 p-0 transition-all duration-300 bg-[#f2f6fa] min-h-[95vh] `}
      >
        <div className=" dark:border-gray-700">
          <UserDetailsContent />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
