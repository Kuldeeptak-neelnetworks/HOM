"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PDF from "../../../asset/images/pdf.png";
import XLSX from "../../../asset/images/xlsx.png";
import VIDEO from "../../../asset/images/video.png";
import WORD from "../../../asset/images/word.png";
import Logo from "../../../asset/images/companydummylog.png";
import {
  CommentsDarkUIconSVG,
  CommentsUIconSVG,
  LikeDarkUIconSVG,
  LikeUIconSVG,
  ReplyDarkUIconSVG,
  ReplyUIconSVG,
  ViewsUIconSVG,
} from "@/utils/SVGs/SVGs";
import CommentSection from "./CommentSection";
import {
  baseInstance,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import {
  Cross1Icon,
  DotsHorizontalIcon,
  DrawingPinIcon,
} from "@radix-ui/react-icons";
import DeleteDialoge from "@/components/Orders/components/DeleteDialoge";
import { useEditorStore } from "@/Store/EditorStore";
import QuillEditor from "./QuillEditor";
import FilePreviewList from "@/components/common/FilePreviewList";
import EditChatModel from "@/components/common/Editor/EditChatModel";

const PDFPic = PDF.src;
const XLSXPic = XLSX.src;
const VIDEOPic = VIDEO.src;
const WORDPic = WORD.src;
const companyLogo = Logo.src;

const OrderDetailsInCustomer = ({ orderData }: any) => {
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
    <div className="border border-[#e1e8f0] px-1 mt-1 py-1  bg-[#fff] boxShadow ">
      <ScrollArea className="h-[85vh] ">
        {orderData
          ? orderData &&
            orderData?.map((order: any) => {
              return (
                <section
                  className="bg-white text-gray-800 border border-[#e1e8f0]  my-2"
                  key={order?._id}
                  id={`editor-${order?._id}`}
                >
                  <div className="px-6 py-4 mx-auto">
                    <div className="flex flex-wrap -m-4">
                      <div className="p-2 w-full flex flex-col items-start">
                        <div className="flex items-center justify-between w-full border-b border-[#e1e8f0] pb-2 mb-2 relative">
                          <div className="flex items-center">
                            <Avatar className="cursor-pointer">
                              <AvatarImage
                                src={order?.createdBy?.avatar}
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
                                {order?.createdBy?.fullName
                                  ? order?.createdBy?.fullName
                                  : ""}
                              </span>
                            </span>
                          </div>

                          <div>
                            <span>Order No :</span>
                            <span className="font-semibold">
                              {" "}
                              {order?.orderNo}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="font-semibold">
                            Date Of Order :{" "}
                          </span>
                          <span>{formatDateOfSlash(order?.dateOfOrder)}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Order Type : </span>
                          <span>
                            {order?.orderType ? order?.orderType : "-"}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold">Order Value : </span>
                          <span>{order?.orderValue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })
          : "No Data Available"}
      </ScrollArea>
    </div>
  );
};

export default OrderDetailsInCustomer;
