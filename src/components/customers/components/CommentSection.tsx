"use client";
import React, { useState } from "react";
import QuillEdior from "./QuillEditor";
import Logo from "../../../asset/images/companydummylog.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PDF from "../../../asset/images/pdf.png";
import XLSX from "../../../asset/images/xlsx.png";
import VIDEO from "../../../asset/images/video.png";
import WORD from "../../../asset/images/word.png";
import {
  LikeDarkUIconSVG,
  LikeUIconSVG,
  ReplyUIconSVG,
  ViewsUIconSVG,
} from "@/utils/SVGs/SVGs";
import { formatDate } from "@/common/commonFunctions";
import QuillEditor from "./QuillEditor";
import { useEditorStore } from "@/Store/EditorStore";
import DeleteDialoge from "@/components/Orders/components/DeleteDialoge";

const PDFPic = PDF.src;
const XLSXPic = XLSX.src;
const VIDEOPic = VIDEO.src;
const WORDPic = WORD.src;
const companyLogo = Logo.src;

const CommentSection = ({
  customerId,
  editor,
  userId,
  ReplyClick,
  addViewsData,
  likeClick,
}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEditorId, setSelectedEditorId] = useState<string | null>(null);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const { fetchEditorData, leadsEditorData }: any = useEditorStore();
  const [isOpenReplyModel, setIsOpenReplyModel] = useState(false);
  const [commentID, setCommentID] = useState<string | null>(null);
  const [reaplyId, setReplyId] = useState<string | null>(null);
  return (
    <div className="w-[90%] flex flex-col justify-center mx-7 my-2">
      <>
        {editor.replies.length === 0 &&
          editor.replies.constructor === Array && (
            <div className="pb-3 pr-4 pl-4">
              <QuillEditor
                leadId=""
                updateId={editor._id}
                indicatorText="reply"
                customerId={customerId}
                orderId=""
                technicalId={""}
                setOpenQuill={() => {}}
                setIsOpenReplyModel={setIsOpenReplyModel}
                handleEdit={""}
                amendmentId={""}
                copywriterId={""}
                productFlowId={""}
                websiteContentId={""}
              />
            </div>
          )}

        {editor?.replies ? (
          <div>
            {[...(editor?.replies || [])].reverse().map((data: any) => (
              <section
                className="text-gray-600 body-font overflow-hidden  my-2 rounded-md "
                key={data?._id}
              >
                <div className="container px-5 py-2 mx-auto bg-gray-100 border rounded-md w-[90%]">
                  <div className="flex flex-wrap -m-12">
                    <div className="p-12 md:w-full flex flex-col items-start">
                      <div className="flex items-center justify-between w-full border-b-2 border-gray-100">
                        <div className="inline-flex items-center pb-2 mt-2">
                          <Avatar className="cursor-pointer">
                            <AvatarImage
                              src={data?.createdBy?.avatar}
                              className=""
                              alt="companyLogo"
                            />
                            <AvatarFallback>
                              <img
                                src={companyLogo}
                                className=""
                                alt="companyLogo"
                              />
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-grow flex flex-col pl-4">
                            <span className="title-font font-medium text-gray-900 text-[0.8rem]">
                              {data?.createdBy?.fullName
                                ? data?.createdBy?.fullName
                                : ""}
                            </span>
                          </span>
                        </div>
                        <div className="pr-2 text-[0.8rem]">
                          <DeleteDialoge
                            id={data._id}
                            entity="updates/replies"
                            setIsModalOpen={setIsModalOpen}
                            fetchAllFunction={() => fetchEditorData(customerId)}
                          />
                        </div>
                      </div>

                      <p className="leading-relaxed mb-1 text-[0.8rem] mt-2">
                        <div
                          className="leading-relaxed mb-1 text-[0.8rem] mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_li]:leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: data.content ? data.content : "",
                          }}
                        />
                      </p>
                      <div className="flex gap-4">
                        {data?.files &&
                          data?.files?.map((file: any, index: number) => {
                            // Extract file extension
                            let fileExtension = "";
                            if (file) {
                              const fileNameParts = file.split(".");
                              if (fileNameParts.length > 1) {
                                fileExtension =
                                  fileNameParts.pop()?.toLowerCase() || "";
                              }
                            }

                            // Determine the type of the file based on fileExtension
                            let fileType = "unknown"; // default to unknown

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
                                <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded">
                                  <a href={file} target="_blank">
                                    <img
                                      src={PDFPic}
                                      alt=""
                                      className="h-[100px] w-[100px] object-cover rounded"
                                    />
                                  </a>
                                </div>
                              );
                            } else if (fileType === "image") {
                              content = (
                                <img
                                  key={index}
                                  src={file}
                                  alt=""
                                  className="h-[100px] w-[100px] object-cover rounded"
                                />
                              );
                            } else if (fileType === "word") {
                              content = (
                                <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded">
                                  <a href={file} target="_blank">
                                    <img
                                      src={WORDPic}
                                      alt=""
                                      className="h-[100px] w-[100px] object-cover rounded"
                                    />
                                  </a>
                                </div>
                              );
                            } else if (fileType === "xlsx") {
                              content = (
                                <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded">
                                  <a href={file} target="_blank">
                                    <img
                                      src={XLSXPic}
                                      alt=""
                                      className="h-[100px] w-[100px] object-cover rounded"
                                    />
                                  </a>
                                </div>
                              );
                            } else if (fileType === "video") {
                              content = (
                                <video src={file} width={200} controls></video>
                              );
                            } else {
                              // Handle unknown file types or default case
                              content = (
                                <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded-md">
                                  <span className="text-gray-600 text-lg">
                                    Unknown
                                  </span>
                                </div>
                              );
                            }

                            return (
                              <div key={index} className="relative">
                                {content}
                              </div>
                            );
                          })}
                      </div>

                      <div className="flex items-center justify-between flex-wrap  mt-2 w-full  ">
                        <div className="flex justify-between gap-2">
                          <div
                            className="text-[0.8rem] border-r-2 pr-2 border-gray-200 flex gap-2 mt-1 items-center cursor-pointer"
                            onClick={() => likeClick(data?._id)}
                          >
                            <span
                              className={`${
                                data.likes.some(
                                  (like: any) => like._id === userId
                                )
                                  ? "text-[#3a5894] font-bold"
                                  : ""
                              }`}
                            >
                              Like
                            </span>
                            {data.likes.some(
                              (like: any) => like._id === userId
                            ) ? (
                              <LikeDarkUIconSVG />
                            ) : (
                              <LikeUIconSVG />
                            )}
                          </div>
                          {/* <div className="text-[0.8rem] border-r-2 pr-2 border-gray-200 flex gap-2 mt-1 items-center cursor-pointer">
                            <span className="font-bold">
                              {data?.likes ? data?.likes?.length : "0"}
                            </span>
                            Likes
                          </div> */}
                          <div
                            className="text-[0.8rem]  border-r-2 pr-2 border-gray-200 flex gap-2 mt-1 items-center cursor-pointer"
                            onClick={() => ReplyClick(data._id)}
                          >
                            <span
                              className={`${
                                isOpenReplyModel
                                  ? "text-[#3a5894] font-bold"
                                  : ""
                              }`}
                            >
                              Reply
                            </span>
                            <ReplyUIconSVG />
                          </div>

                          <div className="text-[0.8rem] flex gap-2 mt-1 items-center cursor-pointer">
                            <div className="pr-2 text-[0.8rem]">
                              {formatDate(
                                data?.createdAt ? data?.createdAt : new Date()
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {isOpenReplyModel && reaplyId === data._id && (
                  <div
                    className="mt-2 "
                    style={{
                      paddingLeft: "57px",
                      paddingRight: "57px",
                    }}
                  >
                    <QuillEditor
                      productFlowId={""}
                      setOpenQuill={() => {}}
                      leadId={""}
                      updateId={editor._id}
                      indicatorText="reply"
                      customerId={customerId}
                      setIsOpenReplyModel={setIsOpenReplyModel}
                      orderId={""}
                      technicalId={""}
                      handleEdit={""}
                      amendmentId={""}
                      copywriterId={""}
                      websiteContentId={""}
                    />
                  </div>
                )}
              </section>
            ))}
          </div>
        ) : (
          "No Comment added"
        )}
      </>
    </div>
  );
};

export default CommentSection;
