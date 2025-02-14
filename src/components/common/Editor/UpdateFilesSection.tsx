"use client";

import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import PDF from "../../../asset/images/pdf.png";
import XLSX from "../../../asset/images/xlsx.png";
import VIDEO from "../../../asset/images/video.png";
import WORD from "../../../asset/images/word.png";
import Logo from "../../../asset/images/companydummylog.png";
import User from "../../../asset/images/user.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/common/commonFunctions";
import TooltipCommon from "@/components/common/TooltipCommon";

const UserLogo = User.src;
const PDFPic = PDF.src;
const XLSXPic = XLSX.src;
const VIDEOPic = VIDEO.src;
const WORDPic = WORD.src;
const companyLogo = Logo.src;

const UpdateFilesSection = ({
  fileData,
  getUpdateFiles,
  productFlowId,
}: any) => {
  const getFilenameFromURL = (url: string) => {
    // Splitting the URL by '/' and getting the last part
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename;
  };

  return (
    <div className="flex flex-col overflow-y-auto bg-white border border-[#e1e8f0] max-h-[176px] min-h-[176px] overflow-scroll">
      {fileData && fileData.length > 0 ? (
        fileData.map((editData: any, index: number) => {
          let fileExtension = "";
          if (editData?.fileUrl) {
            const fileNameParts = editData?.fileUrl.split(".");
            if (fileNameParts.length > 1) {
              fileExtension = fileNameParts.pop()?.toLowerCase() || "";
            }
          }

          // Determine the type of the file based on fileExtension
          let fileType = "unknown";

          switch (fileExtension) {
            case "pdf":
              fileType = "pdf";
              break;
            case "jpg":
            case "jpeg":
            case "png":
              fileType = "image";
              break;
            case "xlsx":
              fileType = "xlsx";
              break;
            case "mp4":
              fileType = "video";
              break;
            case "docx":
              fileType = "word";
              break;
            default:
              fileType = "unknown";
              break;
          }

          // Prepare the content based on fileType
          let content;
          if (fileType === "pdf") {
            content = (
              <a
                href={editData?.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-center h-[70px] w-[100px] bg-gray-200 ">
                  <img
                    src={PDFPic}
                    alt=""
                    className="h-[60px] w-[60px] object-cover "
                  />
                </div>
              </a>
            );
          } else if (fileType === "image") {
            content = (
              <a
                href={editData?.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-center h-[70px] w-[100px] bg-gray-200 ">
                  <img
                    key={index}
                    src={editData?.fileUrl}
                    alt=""
                    className="h-[60px] w-[60px] object-cover "
                  />
                </div>
              </a>
            );
          } else if (fileType === "word") {
            content = (
              <a
                href={editData?.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-center h-[70px] w-[100px] bg-gray-200 ">
                  <img
                    src={WORDPic}
                    alt=""
                    className="h-[60px] w-[60px] object-cover "
                  />
                </div>
              </a>
            );
          } else if (fileType === "xlsx") {
            content = (
              <a
                href={editData?.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-center h-[70px] w-[100px] bg-gray-200">
                  <img
                    src={XLSXPic}
                    alt=""
                    className="h-[60px] w-[60px] object-cover "
                  />
                </div>
              </a>
            );
          } else if (fileType === "video") {
            content = (
              <video
                className="h-[100px] w-[135px]"
                src={editData?.fileUrl}
                width={400}
                controls
              ></video>
            );
          } else {
            // Handle unknown file types or default case
            content = (
              <div className="flex items-center justify-center h-[70px] w-[100px] bg-gray-200">
                <span className="text-gray-600 text-lg">Unknown</span>
              </div>
            );
          }

          return (
            <div
              className=" border flex items-center h-24 mx-2 hover:bg-zinc-100 my-1"
              key={editData?._id}
            >
              <div className="border m-3 flex items-center hover:border-b-zinc-600 hover:shadow-lg">
                {content}
              </div>

              <div className="m-3 flex flex-col justify-around gap-2 text-[0.8rem]">
                <div className="font-bold hover:bg-slate-100 px-3 ">
                  <a
                    href={editData?.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getFilenameFromURL(editData?.fileUrl)}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span>
                    <TooltipCommon text={editData.uploadedBy?.fullName}>
                      <Avatar className="cursor-pointer w-6 h-6">
                        <AvatarImage
                          src={editData?.uploadedBy?.avatar}
                          className="h-6"
                          alt="companyLogo"
                        />
                        <AvatarFallback>
                          <img
                            src={UserLogo}
                            className="h-6"
                            alt="companyLogo"
                          />
                        </AvatarFallback>
                      </Avatar>
                    </TooltipCommon>
                  </span>
                  <span>{formatDate(editData?.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-600 flex items-center justify-center h-[90px] ">
          No data found !
        </div>
      )}
    </div>
  );
};

export default UpdateFilesSection;
