/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  // DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Charts } from "./ChartSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label as Labil,
  LabelList,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/common/commonFunctions";
import Link from "next/link";
// import { useEmployeeLeaveStore } from "@/Store/EmployeeLeaveStore";

const statuses = {
  Completed: "text-green-400 bg-green-400/10",
  Error: "text-rose-400 bg-rose-400/10",
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function LeaveSection({
  userRole,
  EmployeeData,
  EmployeeLeaveData,
}: any) {
  const stats = [
    { name: "Total Annual Leave Entitlement", value: "20" },
    {
      name: "Leave Taken",
      value:
        +EmployeeData?.toalremaingleave && 20 - +EmployeeData?.toalremaingleave,
    },
    {
      name: "Leave Balance",
      value: EmployeeData?.toalremaingleave && EmployeeData?.toalremaingleave,
    },
  ];

  let approvedRequests: any[] = [];
  let pendingRequests: any[] = [];
  let rejectedRequests: any[] = [];

  if (Array.isArray(EmployeeLeaveData)) {
    approvedRequests = EmployeeLeaveData.filter(
      (e: any) => e.managerResponse === "Approved"
    );

    pendingRequests = EmployeeLeaveData.filter(
      (e: any) => e.managerResponse === "Pending"
    );

    rejectedRequests = EmployeeLeaveData.filter(
      (e: any) => e.managerResponse === "Rejected"
    );
  }

  const leaveStatus = [
    {
      name: "Total Approved Leaves",
      value: approvedRequests && approvedRequests?.length,
    },
    {
      name: "Total Pending  Leaves",
      value: pendingRequests && pendingRequests?.length,
    },
    {
      name: "Total Rejected Leaves",
      value: rejectedRequests && rejectedRequests?.length,
    },
  ];

  return (
    <div>
      <main>
        <header>
          {/* Stats */}
          <div className="grid grid-cols-1  sm:grid-cols-1 lg:grid-cols-3 border  bg-white boxShadow">
            {userRole !== "admin"
              ? stats.map((stat, statIdx) => (
                  <div
                    key={stat.name}
                    className={classNames(
                      statIdx % 2 === 1
                        ? "  sm:border-l "
                        : statIdx === 2
                        ? " lg:border-l "
                        : "",
                      "px-4 py-4 sm:px-6 lg:px-8"
                    )}
                  >
                    <p className="text-sm font-medium leading-6 ">
                      {stat.name}
                    </p>
                    <p className=" flex items-baseline gap-x-2">
                      <span className="text-xl font-semibold tracking-tight ">
                        {stat.value} <span className="text-md">Days</span>
                      </span>
                    </p>
                  </div>
                ))
              : leaveStatus?.map((stat, statIdx) => (
                  <div
                    key={stat.name}
                    className={classNames(
                      statIdx % 2 === 1
                        ? "  sm:border-l "
                        : statIdx === 2
                        ? " lg:border-l "
                        : "",
                      "px-4 py-4 sm:px-6 lg:px-8"
                    )}
                  >
                    <p className="text-sm font-medium leading-6 ">
                      {stat.name}
                    </p>
                    <p className=" flex items-baseline gap-x-2">
                      <span className="text-xl font-semibold tracking-tight ">
                        {stat.value}
                      </span>
                    </p>
                  </div>
                ))}
          </div>
          {/* <Charts /> */}
          {userRole === "admin" ? (
            <div className="my-2 ">
              <div className="lg:flex gap-2">
                <Card className="lg:w-[50%] boxShadow">
                  <CardHeader>
                    <CardTitle className="text-[1rem]">
                      States Of Leave in This Year
                    </CardTitle>
                    <CardDescription>Graphical represantation</CardDescription>
                    <CardContent>
                      <ChartContainer
                        config={{
                          steps: {
                            label: "Leaves",
                            color: "#859bc9",
                          },
                        }}
                      >
                        <BarChart
                          accessibilityLayer
                          margin={{
                            left: -4,
                            right: -4,
                          }}
                          data={[
                            {
                              date: "2024-01-31",
                              steps: 10,
                            },
                            {
                              date: "2024-02-29",
                              steps: 15,
                            },
                            {
                              date: "2024-03-31",
                              steps: 6,
                            },
                            {
                              date: "2024-04-30",
                              steps: 13,
                            },
                            {
                              date: "2024-05-31",
                              steps: 43,
                            },
                            {
                              date: "2024-06-30",
                              steps: 23,
                            },
                            {
                              date: "2024-07-31",
                              steps: 16,
                            },
                            {
                              date: "2024-08-31",
                              steps: 55,
                            },
                          ]}
                        >
                          <Bar
                            dataKey="steps"
                            fill="var(--color-steps)"
                            radius={5}
                            fillOpacity={0.6}
                            activeBar={<Rectangle fillOpacity={0.8} />}
                          />
                          <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={4}
                            tickFormatter={(value) => {
                              return new Date(value).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                }
                              );
                            }}
                          />
                          <ChartTooltip
                            defaultIndex={7}
                            content={
                              <ChartTooltipContent
                                hideIndicator
                                labelFormatter={(value) => {
                                  return new Date(value).toLocaleDateString(
                                    "en-US",
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    }
                                  );
                                }}
                              />
                            }
                            cursor={false}
                          />
                          <ReferenceLine
                            y={1200}
                            stroke="hsl(var(--muted-foreground))"
                            strokeDasharray="3 3"
                            strokeWidth={1}
                          >
                            <Labil
                              position="insideBottomLeft"
                              value="Average Leaves"
                              offset={10}
                              fill="hsl(var(--foreground))"
                            />
                            <Labil
                              position="insideTopLeft"
                              value="12,343"
                              className="text-lg"
                              fill="hsl(var(--foreground))"
                              offset={10}
                              startOffset={100}
                            />
                          </ReferenceLine>
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center pb-[10px] mb-[10px] text-[0.8rem]">
                      <Label htmlFor="name" className="text-right font-bold">
                        Total Leaves of this year :
                      </Label>
                      <p className="mx-2 bg-slate-100 px-1">24</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="lg:w-[50%]  boxShadow">
                  <Tabs defaultValue="Pending Request" className=" ">
                    <TabsList className="grid w-full grid-cols-3 bg-[#ffffff] boxShadow">
                      {/* <TabsTrigger value="New Request" className="bg-gray-200">
                        New Request
                        <span className="bg-green-300 px-2 mx-1 rounded-full">
                          1
                        </span>
                      </TabsTrigger> */}
                      <TabsTrigger
                        value="Pending Request"
                        className="bg-yellow-200"
                      >
                        Pending Request
                        {pendingRequests?.length > 0 ? (
                          <span className="bg-green-300 px-2 mx-1 rounded-full">
                            {pendingRequests?.length}
                          </span>
                        ) : (
                          ""
                        )}
                      </TabsTrigger>
                      <TabsTrigger
                        value="Approved Request"
                        className="bg-green-200"
                      >
                        Approved Request
                      </TabsTrigger>
                      <TabsTrigger
                        value="Rejected Request"
                        className="bg-red-200"
                      >
                        Rejected Request
                      </TabsTrigger>
                    </TabsList>

                    {/* <TabsContent value="New Request" className="boxShadow">
                      <Card className="mx-2">
                        <CardHeader>
                          <CardTitle className="text-[0.8rem]">
                            David Beckham
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            <AccordionItem value="item-1">
                              <AccordionTrigger className="hover:no-underline">
                                On : 01/10/2024
                              </AccordionTrigger>
                              <AccordionContent className="border p-3 mb-1">
                                <table className="border border-collapse w-full bg-[#f2f6fa]">
                                  <thead>
                                    <tr className="border text-center">
                                      <th className="border px-2 py-1">
                                        Start Date
                                      </th>
                                      <th className="border px-2 py-1">
                                        End Date
                                      </th>
                                      <th className="border px-2 py-1">
                                        Return Date
                                      </th>
                                      <th className="border px-2 py-1"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="border text-center">
                                      <td className="border px-2 py-1 ">
                                        01/10/2024
                                      </td>
                                      <td className="border px-2 py-1">
                                        10/10/2024
                                      </td>
                                      <td className="border px-2 py-1">
                                        11/10/2024
                                      </td>
                                      <td
                                        className="border px-2 py-1"
                                        rowSpan={2}
                                      >
                                        <Button className="py-1 my-1">
                                          Response
                                        </Button>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                    </TabsContent> */}
                    <TabsContent value="Pending Request">
                      <Card className="mx-2">
                        <CardHeader>
                          <CardTitle className="text-[0.9rem]">
                            Pending Requests
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 h-[466px] overflow-y-auto text-[0.8rem]">
                          {pendingRequests?.length > 0 ? (
                            <div>
                              {pendingRequests.map(
                                (pendReq: any, index: number) => (
                                  <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full "
                                  >
                                    <AccordionItem value="item-1">
                                      <AccordionTrigger className="hover:no-underline">
                                        <span>
                                          {pendReq?.employeeId?.fullName}
                                        </span>
                                        <span>
                                          On : {formatDate(pendReq?.startDate)}
                                        </span>
                                      </AccordionTrigger>
                                      <AccordionContent className="border p-3 mb-1">
                                        <table className="border border-collapse w-full bg-[#f2f6fa]">
                                          <thead>
                                            <tr className="border text-center">
                                              <th className="border px-2 py-1">
                                                Start Date
                                              </th>
                                              <th className="border px-2 py-1">
                                                End Date
                                              </th>
                                              <th className="border px-2 py-1">
                                                Return Date
                                              </th>
                                              <th className="border px-2 py-1"></th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr className="border text-center">
                                              <td className="border px-2 py-1 ">
                                                {formatDate(pendReq?.startDate)}
                                              </td>
                                              <td className="border px-2 py-1">
                                                {formatDate(pendReq?.endDate)}
                                              </td>
                                              <td className="border px-2 py-1">
                                                {formatDate(
                                                  pendReq?.returnDate
                                                )}
                                              </td>
                                              <td
                                                className="border px-2 py-1"
                                                rowSpan={2}
                                              >
                                                <Link
                                                  href={` /employeeLeaveManagement/editEmployeeLeave/${
                                                    pendReq?._id
                                                      ? pendReq?._id
                                                      : ""
                                                  }`}
                                                >
                                                  <Button className="py-1 my-1">
                                                    Response
                                                  </Button>
                                                </Link>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                )
                              )}
                            </div>
                          ) : (
                            <div>No pending leave requests found</div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="Approved Request">
                      <Card className="mx-2">
                        <CardHeader>
                          <CardTitle className="text-[0.9rem]">
                            Approved Requests
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 h-[466px] overflow-y-auto text-[0.8rem]">
                          {approvedRequests?.length > 0 ? (
                            <div>
                              {approvedRequests.map(
                                (appReq: any, index: number) => (
                                  <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full hover:bg-slate-50 "
                                  >
                                    <AccordionItem value={`item-${index}`}>
                                      <AccordionTrigger className="hover:no-underline">
                                        <span>
                                          {appReq?.employeeId?.fullName}
                                        </span>
                                        <span>
                                          On : {formatDate(appReq?.startDate)}
                                        </span>
                                      </AccordionTrigger>
                                      <AccordionContent className="border p-3 mb-1">
                                        <table className="border border-collapse w-full bg-[#f2f6fa]">
                                          <thead>
                                            <tr className="border text-center">
                                              <th className="border px-2 py-1">
                                                Start Date
                                              </th>
                                              <th className="border px-2 py-1">
                                                End Date
                                              </th>
                                              <th className="border px-2 py-1">
                                                Return Date
                                              </th>
                                              <th className="border px-2 py-1">
                                                Approved By
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr className="border text-center">
                                              <td className="border px-2 py-1 ">
                                                {formatDate(appReq?.startDate)}
                                              </td>
                                              <td className="border px-2 py-1">
                                                {formatDate(appReq?.endDate)}
                                              </td>
                                              <td className="border px-2 py-1">
                                                {formatDate(appReq?.returnDate)}
                                              </td>
                                              <td className="border px-2 py-1">
                                                {appReq?.approvedBy?.fullName}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                )
                              )}
                            </div>
                          ) : (
                            <div>No approved leave requests found</div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="Rejected Request">
                      <Card className="mx-2">
                        <CardHeader>
                          <CardTitle className="text-[0.9rem]">
                            Rejected Requests
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 h-[466px] overflow-y-auto text-[0.8rem]">
                          {rejectedRequests?.length > 0 ? (
                            <div>
                              {rejectedRequests.map(
                                (rejReq: any, index: number) => (
                                  <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full "
                                  >
                                    <AccordionItem value="item-1">
                                      <AccordionTrigger className="hover:no-underline">
                                        <span>
                                          {rejReq?.employeeId?.fullName}
                                        </span>
                                        <span>
                                          On : {formatDate(rejReq?.startDate)}
                                        </span>
                                      </AccordionTrigger>
                                      <AccordionContent className="border p-3 mb-1">
                                        <table className="border border-collapse w-full bg-[#f2f6fa]">
                                          <thead>
                                            <tr className="border text-center">
                                              <th className="border px-2 py-1">
                                                Start Date
                                              </th>
                                              <th className="border px-2 py-1">
                                                End Date
                                              </th>
                                              <th className="border px-2 py-1">
                                                Return Date
                                              </th>
                                              <th className="border px-2 py-1">
                                                Rejected By
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr className="border text-center">
                                              <td className="border px-2 py-1 ">
                                                {formatDate(rejReq?.startDate)}
                                              </td>
                                              <td className="border px-2 py-1">
                                                {formatDate(rejReq?.endDate)}
                                              </td>
                                              <td className="border px-2 py-1">
                                                {formatDate(rejReq?.returnDate)}
                                              </td>
                                              <td className="border px-2 py-1">
                                                {rejReq?.approvedBy?.fullName}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                )
                              )}
                            </div>
                          ) : (
                            <div>No rejected leave requests found</div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            </div>
          ) : (
            <div className="my-6 flex gap-4">
              <Tabs defaultValue="Approved Request" className="w-[700px] ">
                <TabsList className="grid w-full grid-cols-3 bg-[#ffffff] boxShadow">
                  <TabsTrigger
                    value="Approved Request"
                    className="bg-green-200"
                  >
                    Approved Request
                  </TabsTrigger>
                  <TabsTrigger
                    value="Pending Request"
                    className="bg-yellow-200"
                  >
                    Pending Request
                    {pendingRequests?.length > 0 ? (
                      <span className="bg-green-300 px-2 mx-1 rounded-full">
                        {pendingRequests?.length}
                      </span>
                    ) : (
                      ""
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="Rejected Request" className="bg-red-200">
                    Rejected Request
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="Approved Request">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[0.9rem]">
                        My Approved Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2  overflow-y-auto text-[0.8rem]">
                      {approvedRequests?.length > 0 ? (
                        <div>
                          {approvedRequests.map(
                            (appReq: any, index: number) => (
                              <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                              >
                                <AccordionItem value="item-1">
                                  <AccordionTrigger className="hover:no-underline">
                                    On : {formatDate(appReq?.startDate)}
                                  </AccordionTrigger>
                                  <AccordionContent className="border p-3 mb-1">
                                    <table className="border border-collapse w-full bg-[#f2f6fa]">
                                      <thead>
                                        <tr className="border text-center">
                                          <th className="border px-2 py-1"></th>
                                          <th className="border px-2 py-1">
                                            End Date
                                          </th>
                                          <th className="border px-2 py-1">
                                            Return Date
                                          </th>
                                          <th className="border px-2 py-1">
                                            Approved By
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="border text-center">
                                          <td className="border px-2 py-1 ">
                                            {formatDate(appReq?.startDate)}
                                          </td>
                                          <td className="border px-2 py-1">
                                            {formatDate(appReq?.endDate)}
                                          </td>
                                          <td className="border px-2 py-1">
                                            {formatDate(appReq?.returnDate)}
                                          </td>
                                          <td className="border px-2 py-1">
                                            {appReq?.approvedBy?.fullName}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            )
                          )}
                        </div>
                      ) : (
                        <div>No approved leave requests found</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="Pending Request">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[0.9rem]">
                        My Pending Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 overflow-y-auto text-[0.8rem]">
                      {pendingRequests?.length > 0 ? (
                        <div>
                          {pendingRequests.map(
                            (pendReq: any, index: number) => (
                              <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                              >
                                <AccordionItem value="item-1">
                                  <AccordionTrigger className="hover:no-underline">
                                    On : {formatDate(pendReq?.startDate)}
                                  </AccordionTrigger>
                                  <AccordionContent className="border p-3 mb-1">
                                    <table className="border border-collapse w-full bg-[#f2f6fa]">
                                      <thead>
                                        <tr className="border text-center">
                                          <th className="border px-2 py-1">
                                            Start Date
                                          </th>
                                          <th className="border px-2 py-1">
                                            End Date
                                          </th>
                                          <th className="border px-2 py-1">
                                            Return Date
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="border text-center">
                                          <td className="border px-2 py-1 ">
                                            {formatDate(pendReq?.startDate)}
                                          </td>
                                          <td className="border px-2 py-1">
                                            {formatDate(pendReq?.endDate)}
                                          </td>
                                          <td className="border px-2 py-1">
                                            {formatDate(pendReq?.returnDate)}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            )
                          )}
                        </div>
                      ) : (
                        <div>No pending leave requests found</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="Rejected Request">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[0.9rem]">
                        My Rejected Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2  overflow-y-auto text-[0.8rem] ">
                      {rejectedRequests?.length > 0 ? (
                        <div>
                          {rejectedRequests.map(
                            (rejReq: any, index: number) => (
                              <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                              >
                                <AccordionItem value="item-1">
                                  <AccordionTrigger className="hover:no-underline">
                                    On : {formatDate(rejReq?.startDate)}
                                  </AccordionTrigger>
                                  <AccordionContent className="border p-3 mb-1 ">
                                    <table className="border border-collapse w-full bg-[#f2f6fa]">
                                      <thead>
                                        <tr className="border text-center">
                                          <th className="border px-2 py-1">
                                            Start Date
                                          </th>
                                          <th className="border px-2 py-1">
                                            End Date
                                          </th>
                                          <th className="border px-2 py-1">
                                            Return Date
                                          </th>
                                          <th className="border px-2 py-1">
                                            Rejected By
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr className="border text-center">
                                          <td className="border px-2 py-1 ">
                                            {formatDate(rejReq?.startDate)}
                                          </td>
                                          <td className="border px-2 py-1">
                                            {formatDate(rejReq?.endDate)}
                                          </td>
                                          <td className="border px-2 py-1">
                                            {formatDate(rejReq?.returnDate)}
                                          </td>
                                          <td className="border px-2 py-1">
                                            {rejReq?.approvedBy?.fullName}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            )
                          )}
                        </div>
                      ) : (
                        <div>No rejected leave requests found</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {EmployeeData?.toalremaingleave < 0 ? (
                <Card className="w-[50%] h-[200px]  boxShadow ">
                  <CardHeader>
                    <CardTitle className="text-[1rem]">
                      Leave Balance Alert
                    </CardTitle>
                    <CardDescription className="text-rose-400 bg-rose-400/10 text-[0.9rem]">
                      Warning: You have exhausted your leave balance!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    You have used all 20 of your allotted leaves. Please be
                    aware that you currently have no remaining leave days.
                    Consider planning your time off accordingly.
                  </CardContent>
                </Card>
              ) : (
                ""
              )}
            </div>
          )}
        </header>
      </main>
    </div>
  );
}

// ==============================

{
  /* <Card className="w-[50%] h-[600px] boxShadow">
                <CardHeader>
                  <CardTitle className="text-[1rem]">
                    Total Leave Requests in This Month
                  </CardTitle>
                  <CardDescription>Details Of leave Requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                    <Label htmlFor="name" className="text-right font-bold">
                      Total Leaves of this month :
                    </Label>
                    <p className="mx-2 bg-slate-100 px-1">55</p>
                  </div>

                  <CardDescription>
                    Leave Requests Employee wise
                  </CardDescription>

                  <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem] mt-5">
                    <Label htmlFor="username" className="text-right font-bold">
                      Kyle :
                    </Label>
                    <p className="mx-2  bg-slate-100 px-1">12</p>
                  </div>
                  <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem] mt-5">
                    <Label htmlFor="username" className="text-right font-bold">
                      Zomi :
                    </Label>
                    <p className="mx-2  bg-slate-100 px-1">8</p>
                  </div>
                  <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem] mt-5">
                    <Label htmlFor="username" className="text-right font-bold">
                      Drak :
                    </Label>
                    <p className="mx-2  bg-slate-100 px-1">9</p>
                  </div>
                  <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem] mt-5">
                    <Label htmlFor="username" className="text-right font-bold">
                      Stuart :
                    </Label>
                    <p className="mx-2  bg-slate-100 px-1">6</p>
                  </div>
                  <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem] mt-5">
                    <Label htmlFor="username" className="text-right font-bold">
                      James :
                    </Label>
                    <p className="mx-2  bg-slate-100 px-1">9</p>
                  </div>
                  <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem] mt-5">
                    <Label htmlFor="username" className="text-right font-bold">
                      Robin :
                    </Label>
                    <p className="mx-2  bg-slate-100 px-1">4</p>
                  </div>
                  <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem] mt-5">
                    <Label htmlFor="username" className="text-right font-bold">
                      Thapa :
                    </Label>
                    <p className="mx-2  bg-slate-100 px-1">2</p>
                  </div>
                  <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem] mt-5">
                    <Label htmlFor="username" className="text-right font-bold">
                      Moana :
                    </Label>
                    <p className="mx-2  bg-slate-100 px-1">0</p>
                  </div>
                </CardContent>
              </Card> */
}

{
  /* <Card className="w-[50%] h-[600px] boxShadow">
                <CardHeader>
                  <CardTitle className="text-[1rem]">
                    States Of Leave in This Year
                  </CardTitle>
                  <CardDescription>Graphical represantation</CardDescription>
                  <CardContent>
                    <ChartContainer
                      config={{
                        steps: {
                          label: "Leaves",
                          color: "#859bc9",
                        },
                      }}
                    >
                      <BarChart
                        accessibilityLayer
                        margin={{
                          left: -4,
                          right: -4,
                        }}
                        data={[
                          {
                            date: "2024-01-31",
                            steps: 10,
                          },
                          {
                            date: "2024-02-29",
                            steps: 15,
                          },
                          {
                            date: "2024-03-31",
                            steps: 6,
                          },
                          {
                            date: "2024-04-30",
                            steps: 13,
                          },
                          {
                            date: "2024-05-31",
                            steps: 43,
                          },
                          {
                            date: "2024-06-30",
                            steps: 23,
                          },
                          {
                            date: "2024-07-31",
                            steps: 16,
                          },
                          {
                            date: "2024-08-31",
                            steps: 55,
                          },
                        ]}
                      >
                        <Bar
                          dataKey="steps"
                          fill="var(--color-steps)"
                          radius={5}
                          fillOpacity={0.6}
                          activeBar={<Rectangle fillOpacity={0.8} />}
                        />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={4}
                          tickFormatter={(value) => {
                            return new Date(value).toLocaleDateString("en-US", {
                              month: "long",
                            });
                          }}
                        />
                        <ChartTooltip
                          defaultIndex={7}
                          content={
                            <ChartTooltipContent
                              hideIndicator
                              labelFormatter={(value) => {
                                return new Date(value).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                );
                              }}
                            />
                          }
                          cursor={false}
                        />
                        <ReferenceLine
                          y={1200}
                          stroke="hsl(var(--muted-foreground))"
                          strokeDasharray="3 3"
                          strokeWidth={1}
                        >
                          <Labil
                            position="insideBottomLeft"
                            value="Average Leaves"
                            offset={10}
                            fill="hsl(var(--foreground))"
                          />
                          <Labil
                            position="insideTopLeft"
                            value="12,343"
                            className="text-lg"
                            fill="hsl(var(--foreground))"
                            offset={10}
                            startOffset={100}
                          />
                        </ReferenceLine>
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center pb-[10px] mb-[10px] text-[0.8rem]">
                    <Label htmlFor="name" className="text-right font-bold">
                      Total Leaves of this year :
                    </Label>
                    <p className="mx-2 bg-slate-100 px-1">24</p>
                  </div>
                </CardContent>
              </Card> */
}

{
  /* <div className="my-3">
                <Card className=" boxShadow w-[1000px]">
                  <CardHeader>
                    <CardTitle className="text-[1rem]">
                      Total Leave Requests in This Month
                    </CardTitle>
                    <CardDescription>Details Of leave Requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Leave Requests Employee wise
                    </CardDescription>

                    <ChartContainer
                      config={{
                        steps: {
                          label: "Leaves",
                          color: "#859bc9",
                        },
                      }}
                    >
                      <BarChart
                        accessibilityLayer
                        margin={{
                          left: -4,
                          right: -4,
                        }}
                        data={[
                          {
                            date: "2024-01-31",
                            employee1: 2,
                            employee2: 3,
                            employee3: 1,
                            employee4: 4,
                            employee5: 5,
                          },
                          {
                            date: "2024-02-29",
                            employee1: 3,
                            employee2: 2,
                            employee3: 4,
                            employee4: 1,
                            employee5: 5,
                          },
                          {
                            date: "2024-03-31",
                            employee1: 5,
                            employee2: 1,
                            employee3: 2,
                            employee4: 3,
                            employee5: 4,
                          },
                          {
                            date: "2024-04-30",
                            employee1: 1,
                            employee2: 2,
                            employee3: 5,
                            employee4: 4,
                            employee5: 6,
                          },
                          {
                            date: "2024-05-31",
                            employee1: 9,
                            employee2: 6,
                            employee3: 10,
                            employee4: 0,
                            employee5: 0,
                          },
                          {
                            date: "2024-06-30",
                            employee1: 9,
                            employee2: 6,
                            employee3: 10,
                            employee4: 8,
                            employee5: 1,
                          },
                          {
                            date: "2024-07-31",
                            employee1: 9,
                            employee2: 6,
                            employee3: 10,
                            employee4: 3,
                            employee5: 4,
                          },
                          {
                            date: "2024-08-31",
                            employee1: 9,
                            employee2: 6,
                            employee3: 5,
                            employee4: 16,
                            employee5: 8,
                          },
                        ]}
                      >
                        <Bar
                          dataKey="employee1"
                          fill="#8884d8"
                          radius={5}
                          fillOpacity={0.6}
                          isAnimationActive={false} // Disable animation on hover
                        />
                        <Bar
                          dataKey="employee2"
                          fill="#82ca9d"
                          radius={5}
                          fillOpacity={0.6}
                          isAnimationActive={false}
                        />
                        <Bar
                          dataKey="employee3"
                          fill="#ffc658"
                          radius={5}
                          fillOpacity={0.6}
                          isAnimationActive={false}
                        />
                        <Bar
                          dataKey="employee4"
                          fill="#ff8042"
                          radius={5}
                          fillOpacity={0.6}
                          isAnimationActive={false}
                        />
                        <Bar
                          dataKey="employee5"
                          fill="#00C49F"
                          radius={5}
                          fillOpacity={0.6}
                          isAnimationActive={false}
                        />

                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={4}
                          tickFormatter={(value) => {
                            return new Date(value).toLocaleDateString("en-US", {
                              month: "long",
                            });
                          }}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              labelFormatter={(value) => {
                                return new Date(value).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                );
                              }}
                            />
                          }
                          cursor={false} // Disable the default cursor on hover
                        />
                      </BarChart>
                    </ChartContainer>
                    <div className="flex items-center pb-[10px] mb-[10px]  text-[0.8rem]">
                      <Label htmlFor="name" className="text-right font-bold">
                        Total Leaves of this month :
                      </Label>
                      <p className="mx-2 bg-slate-100 px-1">55</p>
                    </div>
                  </CardContent>
                </Card>
              </div> */
}
