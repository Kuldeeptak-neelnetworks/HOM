

"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  AmendmentIconSVG,
  FilesIconSVG,
  GroupOfUsersIconSVG,
  HandshakeIconSVG,
  TechnicalIconSVG,
  HomeIconSVG,
  ReportIconSVG,
  SidebarToggler,
  CopywriterLogoSVG,
  ProductFlowLogoSVG,
  NewWebsiteContentLogoSVG,
  EmployeeLeaveLogoSVG,
  SalesIconSVG,
} from "@/utils/SVGs/SVGs";
import Appbar from "../Appbar/Appbar";
import Link from "next/link";
import Logo from "../../asset/images/logo.png";
import MiniLogo from "../../asset/images/mini-logo.png";
import "../../styles/common.css";
import MenuItem from "./components/MenuItem"; 

interface MenuItemIF {
  id: string;
  title: string;
  link: string;
  icon: JSX.Element;
  subMenues: SubMenuItem[];
}
interface SubMenuItem {
  id: number;
  subtitle: string;
}

const SideBarContent: React.FC<{ setToggleWidth: any }> = ({ setToggleWidth }) => {
  const [toggleSider, setToggleSider] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [openSmallSideBar, setOpenSmallSideBar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null); 

  const logoSrc = Logo.src;
  const MiniLogoSrc = MiniLogo.src;

  const togglerFunction = () => {
    setToggleSider((prev) => !prev);
    setToggleWidth((prev:any) => !prev);
  };


  let userDetails: any =
    typeof window !== "undefined" ? localStorage?.getItem("user") : null;
  let userRole = JSON.parse(userDetails)?.role;


  const showSmallSideBar = () => {
    setOpenSmallSideBar((prev) => !prev);
  };

  useEffect(() => {
    const savedScroll = localStorage.getItem("sidebarScroll");
    if (sidebarRef.current && savedScroll) {
      sidebarRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  const handleScroll = () => {
    if (sidebarRef.current) {
      localStorage.setItem("sidebarScroll", sidebarRef.current.scrollTop.toString());
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <div>
        <button
          data-drawer-target="sidebar-multi-level-sidebar"
          data-drawer-toggle="sidebar-multi-level-sidebar"
          aria-controls="sidebar-multi-level-sidebar"
          type="button"
          onClick={showSmallSideBar}
          onBlur={showSmallSideBar}
          className="inline-flex items-center p-2 mt-2 ms-3 text-[0.8rem] text-gray-500 sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed top-0 left-0 z-40 text-[0.8rem] ${
          toggleSider
            ? "w-[17rem] closedSidebar"
            : `w-[6rem] OpenedSidebar ${openSmallSideBar ? "" : "-translate-x-full"}`
        } h-screen transition-transform sm:translate-x-0`}
        style={{ transition: "all 300ms" }}
        aria-label="Sidebar"
      >
        <div
          ref={sidebarRef} 
          onScroll={handleScroll} 
          className={`h-full ${toggleSider ? "px-3" : ""} pb-4 overflow-y-auto bg-[#29354f] dark:bg-gray-800 text-[#fffff5]`}
        >
          {/* Logo Section */}
          <div
            className={`logo_wrapper flex items-center h-12 border-b border-gray-500 ${
              toggleSider ? "mt-[0.6rem] pb-3" : "px-2"
            }`}
          >
            <div className="cursor-pointer">
              <Link href="/dashboard">
                <img src={toggleSider ? logoSrc : MiniLogoSrc} alt="Logo" />
              </Link>
            </div>
            <div
              className={`${toggleSider ? "ml-[2.2rem] p-2" : "ml-2 p-1"} cursor-pointer bg-[#4b9437] hover:bg-gray-400`}
              onClick={() => togglerFunction()}
            >
              <SidebarToggler />
            </div>
          </div>

          {/* Menu Section */}
          <ul className={`${toggleSider ? "" : "space-y-2"} font-medium mt-[1rem] mainSidebar`}>
            <MenuItem
              label="Dashboard"
              href="/dashboard"
              isSidebarOpen={toggleSider}
              icon={<HomeIconSVG cssClass={"sidebar-icon-svg"} />}
              open={open}
              setOpen={setOpen}
            />
            {userRole !== "admin" ? null : (
              <MenuItem
                label="Users"
                href="/users"
                isSidebarOpen={toggleSider}
                icon={<HandshakeIconSVG cssClass={"sidebar-icon-svg"} />}
                open={open}
                setOpen={setOpen}
              />
            )}
            <MenuItem
              label="Customers"
              href="/customers"
              isSidebarOpen={toggleSider}
              icon={<GroupOfUsersIconSVG cssClass={"sidebar-icon-svg"} />}
              open={open}
              setOpen={setOpen}
            />
            <MenuItem
              label="Leads"
              href="/leads"
              isSidebarOpen={toggleSider}
              icon={<FilesIconSVG cssClass={"sidebar-icon-svg"} />}
              open={open}
              setOpen={setOpen}
            />
            <MenuItem
              label="Orders"
              href="/orders"
              isSidebarOpen={toggleSider}
              icon={<ReportIconSVG cssClass={"sidebar-icon-svg"} />}
              open={open}
              setOpen={setOpen}
            />
            <MenuItem
              label="Sales"
              href="/sales"
              isSidebarOpen={toggleSider}
              icon={<SalesIconSVG cssClass={"sidebar-icon-svg"} />}
              open={open}
              setOpen={setOpen}
            />
            <MenuItem
              label="Amendment"
              href="/amendment"
              isSidebarOpen={toggleSider}
              icon={<AmendmentIconSVG cssClass={"sidebar-icon-svg"} />}
              open={open}
              setOpen={setOpen}
            />
            <MenuItem
              label="Technical Tracker"
              href="/technical"
              isSidebarOpen={toggleSider}
              icon={<TechnicalIconSVG cssClass={"sidebar-icon-svg"} />}
              open={open}
              setOpen={setOpen}
            />
            <MenuItem
              label="Product Flow"
              href="/productFlow"
              isSidebarOpen={toggleSider}
              icon={<ProductFlowLogoSVG cssClass={"sidebar-icon-svg"} />}
              open={open}
              setOpen={setOpen}
            />
            <MenuItem
              label="Copywriter Tracker"
              href="/copywriter"
              isSidebarOpen={toggleSider}
              icon={<CopywriterLogoSVG cssClass={"sidebar-icon-svg"} />}
              open={open}
              setOpen={setOpen}
            />
            <MenuItem
              label="New Website Content"
              href="/websiteContent"
              isSidebarOpen={toggleSider}
              icon={<NewWebsiteContentLogoSVG cssClass={"sidebar-icon-svg"} />}
              open={open}
              setOpen={setOpen}
            />
            <MenuItem
              label="Employee Leave"
              href="/employeeLeaveManagement"
              isSidebarOpen={toggleSider}
              icon={<EmployeeLeaveLogoSVG cssClass={"sidebar-icon-svg"} />}
              open={open}
              setOpen={setOpen}
            />
          </ul>
        </div>
      </aside>

      <Appbar toggleSider={toggleSider} titleData={""} />
    </>
  );
};

export default SideBarContent;




