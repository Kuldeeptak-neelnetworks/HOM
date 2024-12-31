"use client";

// import EditAmendmentContent from "@/components/Amendment/components/EditAmendmentContent";
import SideBarContent from "@/components/Sidebar/SideBarContent";
import EditUserContent from "@/components/Users/EditUser/EditUserContent";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
const EditAmendmentContent = dynamic(
  () => import("@/components/Amendment/components/EditAmendmentContent"),
  { ssr: false }
);
import React, { useEffect, useState } from "react";

const EditAmendmentDetailsPage = () => {
  const [toggleWidth, setToggleWidth] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or some fallback UI
  }

  return (
    <div className="col-span-6">
      <div>
        <SideBarContent setToggleWidth={setToggleWidth} />
      </div>
      <div
        className={`${
          toggleWidth ? "sm:ml-64  ml-0" : "sm:ml-20 ml-0"
        } sm:px-4 p-0 transition-all duration-300 min-h-[95vh] bg-[#f2f6fa]`}
      >
        <div className="rounded-md dark:border-gray-700">
          <EditAmendmentContent />
        </div>
      </div>
    </div>
  );
};

export default EditAmendmentDetailsPage;
