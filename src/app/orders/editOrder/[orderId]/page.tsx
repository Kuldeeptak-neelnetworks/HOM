"use client";

import {
  baseInstance,
  headerOptions,
  logOutFunction,
} from "@/common/commonFunctions";
import EditLeads from "@/components/Leads/components/EditLeads";
import LeadsDetailsContent from "@/components/Leads/components/LeadsDetailsContent";
import EditOrder from "@/components/Orders/components/EditOrder";
import SideBarContent from "@/components/Sidebar/SideBarContent";
import CustomerDetailsContent from "@/components/customers/components/CustomerDetailsContent";
// import EditCustomer from "@/components/customers/components/EditCustomer";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditOrderPage = () => {
  const [toggleWidth, setToggleWidth] = useState<boolean>(false);
  return (
    <div className="col-span-6">
      <div>
        <SideBarContent setToggleWidth={setToggleWidth} />
      </div>
      <div
        className={`${
          toggleWidth ? "sm:ml-64 ml-0" : "sm:ml-20 ml-0"
        } sm:px-4 p-0 transition-all duration-300 bg-[#f2f6fa] min-h-[95vh] `}
      >
        <div className="rounded-md dark:border-gray-700">
          <EditOrder />
        </div>
      </div>
    </div>
  );
};

export default EditOrderPage;
