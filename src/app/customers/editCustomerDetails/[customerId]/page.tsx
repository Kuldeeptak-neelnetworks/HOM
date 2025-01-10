"use client";

import SideBarContent from "@/components/Sidebar/SideBarContent";
// import EditCustomerContent from "@/components/customers/EditCustomer/EditCustomerContent";
const EditCustomerContent = dynamic(
  () => import("@/components/customers/EditCustomer/EditCustomerContent"),
  { ssr: false }
);
import CustomerDetailsContent from "@/components/customers/components/CustomerDetailsContent";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditCustomerDetailsPage = () => {
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
        } p-0 sm:px-4 transition-all duration-300 bg-[#f2f6fa] min-h-[95vh] `}
      >
        <div className="dark:border-gray-700">
          <EditCustomerContent />
        </div>
      </div>
    </div>
  );
};

export default EditCustomerDetailsPage;
