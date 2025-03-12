"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect } from "react";
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
import { useEditorStore } from "@/Store/EditorStore";
import SideDrawer from "@/components/common/Editor/SideDrawer";
const companyLogo = Logo.src;

const ActivitySection = ({ activityDetails,loading }: any) => {
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
    <div className="overflow-x-hidden border bg-[#fff] px-1 mt-1 py-1 boxShadow w-full h-[70vh]">
      <div className="font-bold ml-3 bg-[#fff] w-fit px-3">Activity</div>
      <div className="h-[64vh] overflow-y-auto">
        {activityDetails && (
          <div className="relative">
            <table className="border border-collapse w-full mt-2">
              {/* Sticky header */}
              {/* <thead className="bg-[#29354f] sticky top-0 z-10 text-white">
              <tr className="border text-white">
                <th className="border px-4 py-2 h-10">Date</th>
                <th className="border px-4 py-2 h-10">Full Name</th>
                <th className="border px-4 py-2 h-10">Description</th>
                <th className="border px-4 py-2 h-10">Related Entity</th>
              </tr>
            </thead> */}
            </table>

            {/* Scrollable body */}
            <div className="h-[60vh] overflow-y-auto">
              <table className="border border-collapse w-full mt-2">
                <tbody>
                  {activityDetails?.map((activity: any) => (
                    <tr key={activity?._id} className="border">
                      <td className="border py-1 px-4 h-10">
                        {formatDateOfSlash(activity?.createdAt) || "N/A"}
                      </td>
                      <td className="border py-1 px-4 h-10">
                        {activity?.createdBy?.fullName || "N/A"}
                      </td>
                      <td className="border py-1 px-4 h-10">
                        {activity?.description || "N/A"}
                      </td>
                      <td className="border py-1 px-4 h-10">
                        <SideDrawer
                          length={
                            activity?.relatedEntityId?.updates?.length || 0
                          }
                          cust={activity?.customerId?._id}
                          {...{
                            amendmentId:
                              activity.relatedEntity === "Amendment"
                                ? activity.relatedEntityId?._id
                                : undefined,
                            userId:
                              activity.relatedEntity === "User"
                                ? activity.relatedEntityId?._id
                                : undefined,

                            customerId:
                              activity.relatedEntity === "Customer"
                                ? activity.relatedEntityId?._id
                                : undefined,

                            technicalId:
                              activity.relatedEntity === "TechnicalTracker"
                                ? activity.relatedEntityId?._id
                                : undefined,
                            orderId:
                              activity.relatedEntity === "Order"
                                ? activity.relatedEntityId?._id
                                : undefined,
                            leadId:
                              activity.relatedEntity === "Lead"
                                ? activity.relatedEntityId?._id
                                : undefined,
                            productFlowId:
                              activity.relatedEntity === "ProductFlow"
                                ? activity.relatedEntityId?._id
                                : undefined,
                            websiteContentId:
                              activity.relatedEntity === "WebsiteContent"
                                ? activity.relatedEntityId?._id
                                : undefined,
                            copywriterId:
                              activity.relatedEntity === "Copywriter"
                                ? activity.relatedEntityId?._id
                                : undefined,
                                custID:activity.customerId?._id
                          }}
                        />
                      </td>
                      <td className="border py-1 px-4 h-10">
                        {activity?.relatedEntity || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
    //     <div className="overflow-x-hidden border border-[#e1e8f0] px-1 mt-1 py-1 bg-[#fff] boxShadow w-full h-[70vh]">
    //   <div className="font-bold ml-3 bg-[#e1e8f0] w-fit px-3">Activity</div>
    //   <div className="h-[64vh] overflow-y-auto">
    //     {activityDetails && (
    //       <table className="border border-collapse w-full bg-[#f2f6fa] mt-2">
    //         <thead>
    //           <tr className="border text-center">
    //           {/* <th className="border px-2 py-1">Date</th> */}
    //             {/* <th className="border px-2 py-1">Avatar</th> */}
    //             {/* <th className="border px-2 py-1">Full Name</th>
    //                   <th className="border px-2 py-1">Description</th>
    //             <th className="border px-2 py-1">Related Entity</th> */}

    //             {/* <th className="border px-2 py-1">Activity Type</th> */}

    //             {/* <th className="border px-2 py-1">Changes</th> */}
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {activityDetails?.map((activity: any) => (
    //             <tr key={activity?._id} className="border text-center">
    //                    <td className="border px-2 py-1">
    //                 {formatDateOfSlash(activity?.createdAt) || "N/A"}
    //               </td>

    //               {/* <td className="border px-2 py-1">

    //                 <Avatar className="cursor-pointer">
    //                   <AvatarImage
    //                     src={activity?.createdBy?.avatar}
    //                     className="rounded-full"
    //                     alt="user avatar"
    //                   />
    //                   <AvatarFallback>
    //                     <img
    //                       src={companyLogo}
    //                       className="rounded-full"
    //                       alt="company logo"
    //                     />
    //                   </AvatarFallback>
    //                 </Avatar>
    //               </td> */}
    //               <td className="border px-2 py-1">
    //                 {activity?.createdBy?.fullName || "N/A"}
    //               </td>
    //               <td className="border px-2 py-1">
    //                 {activity?.description || "N/A"}
    //               </td>
    //               <td className="border px-2 py-1">
    //                 {activity?.relatedEntity || "N/A"}
    //               </td>
    // {/*
    //               <td className="border px-2 py-1">
    //                 {activity?.activityType || "N/A"}
    //               </td> */}

    //               {/* <td className="border px-2 py-1">
    //                 {activity?.activityType === "Create" ? (
    //                   "-"
    //                 ) : (
    //                   <Accordion type="single" collapsible>
    //                     <AccordionItem value={`item-${activity._id}`}>
    //                       <AccordionTrigger className="hover:no-underline">
    //                         View Changes
    //                       </AccordionTrigger>
    //                       <AccordionContent className="border p-3 mb-1">
    //                         <table className="border border-collapse w-full bg-[#f2f6fa]">
    //                           <thead>
    //                             <tr className="border text-center">
    //                               <th className="border px-2 py-1"> </th>
    //                               {Object.keys(activity?.changes || {}).map(
    //                                 (key) => (
    //                                   <th key={key} className="border px-2 py-1">
    //                                     {key}
    //                                   </th>
    //                                 )
    //                               )}
    //                             </tr>
    //                           </thead>
    //                           <tbody>
    //                             {["Old", "New"].map((rowType) => (
    //                               <tr
    //                                 key={rowType}
    //                                 className="border text-center"
    //                               >
    //                                 <th className="border px-2 py-1">{rowType}</th>
    //                                 {Object.values(activity?.changes || {}).map(
    //                                   (change: any) => (
    //                                     <td
    //                                       key={change[rowType.toLowerCase()]}
    //                                       className="border px-2 py-1"
    //                                     >
    //                                       {change[rowType.toLowerCase()] || "-"}
    //                                     </td>
    //                                   )
    //                                 )}
    //                               </tr>
    //                             ))}
    //                           </tbody>
    //                         </table>
    //                       </AccordionContent>
    //                     </AccordionItem>
    //                   </Accordion>
    //                 )}
    //               </td> */}
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     )}
    //   </div>
    // </div>


  );
};

export default ActivitySection;
