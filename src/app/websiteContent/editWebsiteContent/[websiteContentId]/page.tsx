"use client";

import SideBarContent from "@/components/Sidebar/SideBarContent";
import EditWebsiteContent from "@/components/WebsiteContent/components/EditWebsiteContent";
import React, { useEffect, useState } from "react";

const EditWebsiteContentPage = () => {
  const [toggleWidth, setToggleWidth] = useState<boolean>(false);
  return (
    <div className="col-span-6">
      <div>
        <SideBarContent setToggleWidth={setToggleWidth} />
      </div>
      <div
        className={`${
          toggleWidth ? "sm:ml-64 ml-0" : "sm:ml-20 ml-0"
        } p-0 sm:p-4 transition-all duration-300 bg-[#f2f6fa] min-h-[93vh]`}
      >
        <div className="rounded-md dark:border-gray-700">
          <EditWebsiteContent />
        </div>
      </div>
    </div>
  );
};

export default EditWebsiteContentPage;
