"use client";
import SideBarContent from "@/components/Sidebar/SideBarContent";
import React, { useEffect, useState } from "react";
import { AxiosError, all } from "axios";

import {
  baseInstance,
  formatDate,
  getUserData,
  headerOptions,
  logOutFunction,
} from "../../common/commonFunctions";
import {
  LatestAmendmentsUIconSVG,
  LatestLeadsUIconSVG,
  LatestOrdersUIconSVG,
  LoaderIconSVG,
} from "@/utils/SVGs/SVGs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import errorMap from "zod/locales/en.js";
import BreadcrumbSection from "@/components/common/BreadcrumbSection";
import { useCustomerStore } from "@/Store/CustomerStore";
import { useLeadStore } from "@/Store/LeadStore";
import { useUserStore } from "@/Store/UserStore";
import { useOrderStore } from "@/Store/OrderStore";
import { useAmendmentStore } from "@/Store/AmendmentStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Label } from "@/components/ui/label";

const DashBoardPage: React.FC = () => {
  const { fetchAmendmentData, amendmentData }: any = useAmendmentStore();
  const { fetchAllLeadData, leadData }: any = useLeadStore();
  const { fetchAllOrdersData, orderData }: any = useOrderStore();
  const { fetchAllCustomerData, customerData }: any = useCustomerStore();
  const { fetchUsersData, userData }: any = useUserStore();
  const router = useRouter();
  const [toggleWidth, setToggleWidth] = useState<boolean>(false);
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allAmendments, setAllAmendments] = useState<any[]>([]);

  let userDetails: any =
    typeof window !== "undefined" ? localStorage?.getItem("user") : null;

  let userRole = JSON.parse(userDetails)?.role;

  useEffect(() => {
    setAllLeads(leadData?.leads && leadData?.leads ? leadData?.leads : "");
    setAllOrders(orderData?.orders ? orderData?.orders : "");
    setAllAmendments(amendmentData ? amendmentData : "");
  }, [leadData?.leads, orderData, amendmentData]);

  // ===========================================================
  const blockData = (data: any[]) => [...data].reverse().slice(0, 5);

  useEffect(() => {
    fetchAllLeadData();
    fetchAllOrdersData();
    fetchAmendmentData();
    fetchAllCustomerData();
    userRole === "salesman" ? "" : fetchUsersData();
  }, []);

  useEffect(() => {
    if (
      allLeads === undefined ||
      leadData === "Invalid refresh token" ||
      leadData === "User not found" ||
      leadData === "Invalid User Access Token" ||
      leadData === "Invalid access token" ||
      leadData === "Unauthorized request: No access or refresh token"
    ) {
      router.push("/auth/login");
    }
  }, [allLeads, leadData]);

  return (
    <div className="col-span-6">
      <div>
        <SideBarContent setToggleWidth={setToggleWidth} />
      </div>
      <div>
        <div
          className={
            toggleWidth
              ? `sm:px-4  sm:ml-64 ml-0 bg-[#edf0f5] transition-all duration-300 relative text-[0.8rem]`
              : `sm:px-4  sm:ml-20 ml-0  bg-[#edf0f5] transition-all duration-300 relative text-[0.8rem]`
          }
        >
          <div className="p-4 rounded-md dark:border-gray-700">
            <div
              className={
                toggleWidth
                  ? `text-[1rem] font-semibold absolute top-[-30px]`
                  : `text-[1rem] font-semibold absolute top-[-30px]`
              }
            >
              Dashboard
            </div>
            {/* <div className="mb-4">
              <BreadcrumbSection />
            </div> */}
            {userRole === "salesman" ? (
              <div className="sm:flex gap-3">
                <Card className="sm:w-[25%] h-[100px] xl:h-[120px] boxShadow mb-5">
                  <CardHeader className="p-[1rem] xl:p-[1.5rem]">
                    <CardTitle className=" text-[0.8rem] xl:text-[1rem]">
                      Total Leads
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[1rem] xl:text-[1.5rem] font-bold">
                    {allLeads ? allLeads.length : ""}
                  </CardContent>
                </Card>
                <Card className="sm:w-[25%] h-[100px] xl:h-[120px] boxShadow mb-5">
                  <CardHeader className="p-[1rem] xl:p-[1.5rem]">
                    <CardTitle className=" text-[0.8rem] xl:text-[1rem]">
                      Total Customers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[1rem] xl:text-[1.5rem] font-bold">
                    {customerData?.customers
                      ? customerData?.customers?.length
                      : ""}
                  </CardContent>
                </Card>
                <Card className="sm:w-[25%] h-[100px] xl:h-[120px] boxShadow mb-5">
                  <CardHeader className="p-[1rem] xl:p-[1.5rem]">
                    <CardTitle className=" text-[0.8rem] xl:text-[1rem]">
                      Total Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[1rem] xl:text-[1.5rem] font-bold">
                    {allOrders ? allOrders.length : ""}
                  </CardContent>
                </Card>
                <Card className="sm:w-[25%] h-[100px] xl:h-[120px] boxShadow mb-5">
                  <CardHeader className="p-[1rem] xl:p-[1.5rem]">
                    <CardTitle className=" text-[0.8rem] xl:text-[1rem]">
                      Total Amendments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[1rem] xl:text-[1.5rem] font-bold">
                    {allAmendments ? allAmendments.length : ""}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="sm:flex gap-3">
                <Card className="sm:w-[20%] h-[100px] xl:h-[120px] boxShadow mb-5">
                  <CardHeader className="p-[1rem] xl:p-[1.5rem]">
                    <CardTitle className=" text-[0.8rem] xl:text-[1rem]">
                      Total Leads
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[1rem] xl:text-[1.5rem] font-bold">
                    {allLeads ? allLeads.length : ""}
                  </CardContent>
                </Card>
                <Card className="sm:w-[20%] h-[100px] xl:h-[120px] boxShadow mb-5">
                  <CardHeader className="p-[1rem] xl:p-[1.5rem]">
                    <CardTitle className=" text-[0.8rem] xl:text-[1rem]">
                      Total Customers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[1rem] xl:text-[1.5rem] font-bold">
                    {customerData?.customers
                      ? customerData?.customers?.length
                      : ""}
                  </CardContent>
                </Card>
                <Card className="sm:w-[20%] h-[100px] xl:h-[120px] boxShadow mb-5">
                  <CardHeader className="p-[1rem] xl:p-[1.5rem]">
                    <CardTitle className=" text-[0.8rem] xl:text-[1rem]">
                      Total Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[1rem] xl:text-[1.5rem] font-bold">
                    {allOrders ? allOrders.length : ""}
                  </CardContent>
                </Card>
                <Card className="sm:w-[20%] h-[100px] xl:h-[120px] boxShadow mb-5">
                  <CardHeader className="p-[1rem] xl:p-[1.5rem]">
                    <CardTitle className=" text-[0.8rem] xl:text-[1rem]">
                      Total Amendments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[1rem] xl:text-[1.5rem] font-bold">
                    {allAmendments ? allAmendments.length : ""}
                  </CardContent>
                </Card>
                <Card className="sm:w-[20%] h-[100px] xl:h-[120px] boxShadow mb-5">
                  <CardHeader className="p-[1rem] xl:p-[1.5rem]">
                    <CardTitle className=" text-[0.8rem] xl:text-[1rem]">
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[1rem] xl:text-[1.5rem] font-bold">
                    {userData ? userData.length : ""}
                  </CardContent>
                </Card>
              </div>
            )}
            <div className="sm:grid sm:grid-cols-3 gap-4 mb-4">
              {/* latest Leads  */}
              <div className="flex flex-col items-center  rounded-md bg-[#ffffff] dark:bg-gray-800 shadow-lg my-3 sm:my-0">
                <p className="mt-5  bg-gray-100 p-6 rounded-full">
                  <LatestLeadsUIconSVG />
                </p>

                <p className="text-[0.8rem] md:text-[0.9rem] lg:text-[1.2rem] pt-5 pb-3 text-center font-semibold">
                  New Leads
                </p>
                <p className="text-[0.8rem] mb-4 text-[#676879]">
                  Track the Latest Leads
                </p>
                <div className=" w-full px-5 xl:px-10 ">
                  <ul>
                    {allLeads === undefined ? (
                      <div className="flex justify-center mb-6">
                        <LoaderIconSVG />
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : allLeads.length > 0 ? (
                      blockData(allLeads)?.map((item, index) => (
                        <li
                          className={`my-2 rounded-2xl  ${
                            index === 4 ? "border-none" : "border-b-2"
                          }`}
                          key={item?._id}
                        >
                          <div className="p-[1rem] text-center rounded flex justify-between gap-3 flex-col lg:flex-row">
                            <Link
                              className="font-bold  text-[0.8rem] xl:text-[0.9rem] lg:text-left lg:w-[40%] overflow-x-auto hover:underline"
                              href={`/leads/leadsDetails/${item?._id}`}
                            >
                              {item?.customer_id?.companyName
                                ? item?.customer_id?.companyName
                                : item?.customerName
                                ? item?.customerName
                                : "-"}
                            </Link>
                            {/* </Link> */}
                            <p className="font-semibold lg:text-left text-[#676879] lg:w-[33%] overflow-x-auto">
                              <span className="text-left">
                                {item?.customer_id?.contactName
                                  ? item?.customer_id?.contactName
                                  : "-"}
                              </span>
                            </p>
                            <p className="font-[300] lg:text-left lg:w-[18%] lg:ml-auto">
                              <span>
                                {item?.createdAt
                                  ? formatDate(item?.createdAt)
                                  : ""}
                              </span>
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <div className="flex justify-center mb-6">
                        No leads data found..!!
                      </div>
                    )}
                  </ul>
                </div>
              </div>

              {/* New Orders  */}
              <div className="flex flex-col items-center  rounded-md bg-[#ffffff] dark:bg-gray-800 shadow-lg my-3 sm:my-0">
                <p className="mt-5  bg-gray-100 p-6 rounded-full">
                  <LatestOrdersUIconSVG />
                </p>
                <p className="text-[0.8rem] md:text-[0.9rem] lg:text-[1.2rem] pt-5 pb-3 text-center font-semibold">
                  New Orders
                </p>
                <p className="text-[0.8rem] mb-4 text-[#676879]">
                  Track the Latest Orders
                </p>
                <div className="w-full px-5 xl:px-10 ">
                  <ul>
                    {allOrders === undefined ? (
                      <div className="flex justify-center mb-6">
                        <LoaderIconSVG />
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : allOrders.length > 0 ? (
                      blockData(allOrders)?.map((item, index) => (
                        <li
                          className={`my-2 rounded-2xl  ${
                            index === 4 ? "border-none" : "border-b-2"
                          }`}
                          key={item?._id}
                        >
                          <div className="p-[1rem] text-center rounded flex justify-between gap-3 flex-col lg:flex-row">
                            <p className="font-bold text-[0.8rem] xl:text-[0.9rem] lg:text-left lg:w-[40%] overflow-x-auto">
                              <Link
                                className="font-bold  text-[0.8rem] xl:text-[0.9rem] lg:text-left lg:w-[40%] overflow-x-auto hover:underline"
                                href={`/orders/orderDetails/${item?._id}`}
                              >
                                <span>
                                  {item?.orderNo ? item?.orderNo : "-"}
                                </span>
                              </Link>
                            </p>
                            <p className="font-semibold lg:text-left text-[#676879] lg:w-[33%] overflow-x-auto">
                              <span>
                                {item?.customer?.companyName
                                  ? item?.customer?.companyName
                                  : "-"}
                              </span>
                            </p>
                            <p className="font-[300] lg:text-left lg:w-[18%] lg:ml-auto">
                              <span>
                                {item?.dateOfOrder
                                  ? formatDate(item?.dateOfOrder)
                                  : "-"}
                              </span>
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <div className="flex justify-center mb-6">
                        No orders data found..!!
                      </div>
                    )}
                  </ul>
                </div>
              </div>

              {/* New Amendments  */}
              <div className="flex flex-col items-center  rounded-md bg-[#ffffff] dark:bg-gray-800 shadow-lg my-3 sm:my-0">
                <p className="mt-5 bg-gray-100 p-6 rounded-full">
                  <LatestAmendmentsUIconSVG />
                </p>
                <p className="text-[0.8rem] md:text-[0.9rem] lg:text-[1.2rem] pt-5 pb-3 text-center font-semibold">
                  New Amendments
                </p>
                <p className="text-[0.8rem] mb-4 text-center text-[#676879]">
                  Track the Latest Amendments
                </p>
                <div className="w-full px-5 xl:px-10 ">
                  <ul>
                    {allAmendments === undefined ? (
                      <div className="flex justify-center mb-6">
                        <LoaderIconSVG />
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : allAmendments.length > 0 ? (
                      blockData(allAmendments)?.map((item, index) => (
                        <li
                          className={`my-2 rounded-2xl ${
                            index === 4 ? "border-none" : "border-b-2"
                          }`}
                          key={item?._id}
                        >
                          <div className="p-[1rem] text-center rounded flex justify-between gap-3 flex-col lg:flex-row">
                            <Link
                              className="font-bold text-[0.8rem] xl:text-[0.9rem] lg:text-left lg:w-[40%] overflow-x-auto hover:underline"
                              href={`/amendment/amendmentDetails/${item?._id}`}
                            >
                              {item?.customer?.companyName || "-"}
                            </Link>
                            <p className="font-semibold lg:text-left text-[#676879] lg:w-[33%] overflow-x-auto">
                              {item?.customer?.contactName || "-"}
                            </p>
                            <p className="font-[300] lg:text-left lg:w-[18%] lg:ml-auto">
                              {item?.createdAt
                                ? formatDate(item?.createdAt)
                                : "-"}
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <div className="flex justify-center mb-6">
                        No amendments data found..!!
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardPage;
