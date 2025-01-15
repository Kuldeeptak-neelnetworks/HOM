"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { ActivityDetailsType } from "./CustomerDetailsContent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "../../../asset/images/companydummylog.png";
import { timeAgo } from "@/common/commonFunctions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const companyLogo = Logo.src;

const ActivitySection = ({ activityDetails }: any) => {
  const formatDateOfSlash = (dateString: any) => {
    if (dateString !== null) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return <div className="text-gray-400">N/A</div>;
      }
      // const date = new Date(dateString);
      const options: any = {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      };
      const formattedDate = date.toLocaleDateString("en-GB", options); // Using "en-GB" for day-month-year format
      return formattedDate;
    } else {
      return <div className="text-gray-400">N/A</div>;
    }
  };

  return (
    <div className="overflow-x-hidden border border-[#e1e8f0] px-1 mt-1 py-1  bg-[#fff] boxShadow w-full h-[70vh]">
      <div className="font-bold ml-3 bg-[#e1e8f0] w-fit px-3">Activity</div>
      <div className="h-[64vh] ">
        {activityDetails &&
          activityDetails?.map((activity: any) => {
            return (
              <section
                className="bg-white text-gray-800 border border-[#e1e8f0]  my-2"
                key={activity?._id}
                id={`activity-${activity?._id}`}
              >
                <div className="px-6 py-4 mx-auto">
                  <div className="flex flex-wrap -m-4">
                    <div className="p-2 w-full flex flex-col items-start">
                      <div className="flex items-center justify-between w-full border-b border-[#e1e8f0] pb-2 mb-2 relative">
                        <div className="flex items-center">
                          <Avatar className="cursor-pointer">
                            <AvatarImage
                              src={activity?.createdBy?.avatar}
                              className="rounded-full"
                              alt="user avatar"
                            />
                            <AvatarFallback>
                              <img
                                src={companyLogo}
                                className="rounded-full"
                                alt="company logo"
                              />
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-grow flex flex-col pl-4">
                            <span className="text-gray-900 text-[0.8rem] font-semibold">
                              {activity?.createdBy?.fullName
                                ? activity?.createdBy?.fullName
                                : ""}
                            </span>
                          </span>
                        </div>

                        <div>
                          <span className="font-semibold bg-[#f2f6fa] p-1">
                            {activity?.relatedEntity}
                          </span>
                        </div>

                        <div>
                          <span>Date :</span>
                          <span className="font-semibold">
                            {" "}
                            {formatDateOfSlash(activity?.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* <div className="flex justify-between w-full px-1">
                        <span className="font-semibold ">
                          {activity?.description} by{" "}
                          {activity?.createdBy?.fullName}
                        </span>
                        <span>{`${timeAgo(activity?.createdAt)}`}</span>
                      </div> */}

                      {activity?.activityType === "Create" && (
                        <div className="flex justify-between w-full px-1">
                          <span className="font-semibold ">
                            {activity?.description} by{" "}
                            {activity?.createdBy?.fullName}
                          </span>
                          <span>{`${timeAgo(activity?.createdAt)}`}</span>
                        </div>
                      )}

                      {activity?.activityType !== "Create" && (
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full "
                        >
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex justify-between w-full px-1">
                                <span className="font-semibold ">
                                  {activity?.description} by{" "}
                                  {activity?.createdBy?.fullName}
                                </span>
                                <span>{`${timeAgo(activity?.createdAt)}`}</span>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="border p-3 mb-1">
                              <table className="border border-collapse w-full bg-[#f2f6fa]">
                                <thead>
                                  <tr className="border text-center">
                                    <th className="border px-2 py-1"> </th>{" "}
                                    {/* Empty cell for the corner */}
                                    {Object.keys(activity?.changes || {}).map(
                                      (key) => (
                                        <th
                                          key={key}
                                          className="border px-2 py-1"
                                        >
                                          {key}
                                        </th>
                                      )
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {["Old", "New"].map((rowType) => (
                                    <tr
                                      key={rowType}
                                      className="border text-center"
                                    >
                                      <th className="border px-2 py-1">
                                        {rowType}
                                      </th>{" "}
                                      {/* Vertical heading */}
                                      {Object.values(
                                        activity?.changes || {}
                                      ).map((change: any) => (
                                        <td
                                          key={change[rowType.toLowerCase()]}
                                          className="border px-2 py-1"
                                        >
                                          {change[rowType.toLowerCase()] || "-"}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
      </div>
    </div>
  );
};

export default ActivitySection;
