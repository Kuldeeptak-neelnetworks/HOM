"use client";

import SideBarContent from "@/components/Sidebar/SideBarContent";
import AddWebsiteContentForm from "@/components/WebsiteContent/components/AddWebsiteContentForm";
import React, { useState } from "react";

const AddWebsiteContentFormPage: React.FC = () => {
  const [toggleWidth, setToggleWidth] = useState<boolean>(false);
  return (
    <div className="col-span-6">
      <div>
        <SideBarContent setToggleWidth={setToggleWidth} />
      </div>
      <div
        className={
          toggleWidth
            ? `sm:p-4 p-0 sm:ml-64 ml-0  transition-all duration-300 bg-[#f2f6fa] min-h-[95vh]`
            : ` sm:p-4 p-0 sm:ml-20 ml-0 transition-all duration-300 bg-[#f2f6fa] min-h-[95vh]`
        }
      >
        <div className=" dark:border-gray-700">
          <AddWebsiteContentForm />
        </div>
      </div>
    </div>
  );
};

export default AddWebsiteContentFormPage;
