"use client";
import SideBarContent from "@/components/Sidebar/SideBarContent";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
// import ProfileContent from "@/components/Profile/ProfileContent";
const ProfileContent = dynamic(
  () => import("@/components/Profile/ProfileContent"),
  { ssr: false }
);

const ProfilePage: React.FC = () => {
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
            ? `sm:px-4  p-0 sm:ml-64 ml-0  transition-all duration-300`
            : `sm:px-4  p-0 sm:ml-20 ml-0 transition-all duration-300`
        }
      >
        <div className=" dark:border-gray-700">
          <ProfileContent />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
