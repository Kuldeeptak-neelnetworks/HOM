"use client";
import SideBarContent from "@/components/Sidebar/SideBarContent";
import dynamic from "next/dynamic";
const InboxContent = dynamic(() => import("@/components/Inbox/InboxContent"), {
  ssr: false,
});
import React, { useEffect, useState } from "react";

const InboxPage: React.FC = () => {
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
            ? `sm:px-2 p-0  sm:ml-64 ml-0 transition-all duration-300  bg-[#f2f6fa] min-h-[95vh] `
            : `sm:px-2 p-0 sm:ml-20 ml-0 transition-all duration-300  bg-[#f2f6fa] min-h-[95vh]`
        }
      >
        <div className="dark:border-gray-700">
          <InboxContent />
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
