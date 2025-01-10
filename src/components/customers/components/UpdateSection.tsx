"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "../../../asset/images/companydummylog.png";
import {
  LikeDarkUIconSVG,
  LikeUIconSVG,
  ReplyDarkUIconSVG,
  ReplyUIconSVG,
} from "@/utils/SVGs/SVGs";
import {
  baseInstance,
  errorToastingFunction,
  formatDate,
  successToastingFunction,
} from "@/common/commonFunctions";
import EditChatModel from "@/components/common/Editor/EditChatModel";
import {
  Cross1Icon,
  DotsHorizontalIcon,
  DrawingPinIcon,
} from "@radix-ui/react-icons";
import DeleteDialoge from "@/components/Orders/components/DeleteDialoge";
import { useEditorStore } from "@/Store/EditorStore";
// import QuillEditor from "./QuillEditor";
import QuillEditor from "../../../components/common/Editor/QuillEditor";
import FilePreviewList from "@/components/common/FilePreviewList";
import LikeComponent from "@/components/common/Editor/LikeComponent";
import ReplyComponent from "@/components/common/Editor/ReplyComponent";
const companyLogo = Logo.src;

const UpdateSection = React.memo(
  ({
    editorData,
    likeClick,
    // ReplyClick,
    userId,
    id,
    comments,
    likeID,
    // commentID,
    // showComments,
    addViewsData,
    customerId,
    handleEdit,
  }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEditorId, setSelectedEditorId] = useState<string | null>(
      null
    );
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const { fetchEditorData }: any = useEditorStore();
    const [isOpenReplyModel, setIsOpenReplyModel] = useState(false);
    const [commentID, setCommentID] = useState<string | null>(null);
    const [reaplyId, setReplyId] = useState<string | null>(null);
    const [openQuill, setOpenQuill] = useState(false);

    const handleOpenQuillEditor = () => {
      setOpenQuill((prevOpen) => !prevOpen);
    };
    const ReplyClick = (id: string) => {
      setIsOpenReplyModel(!isOpenReplyModel);
      setReplyId(id);
    };
    const handleOpenModal = (id: string) => {
      setSelectedEditorId(id);
      setIsModalOpen(true);
    };
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
    const handlePinTrue = async (id: string) => {
      try {
        const response = await baseInstance.patch(`/updates/${id}/pin`, {
          isPinned: true,
        });
        if (response.status === 200) {
          successToastingFunction(response?.data?.message);

          fetchEditorData(customerId);

          setIsModalOpen(false);
        }
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        }
      }
    };
    const handlePinFalse = async (id: string) => {
      try {
        const response = await baseInstance.patch(`/updates/${id}/pin`, {
          isPinned: false,
        });
        if (response.status === 200) {
          successToastingFunction(response?.data?.message);

          fetchEditorData(customerId);

          setIsModalOpen(false);
        }
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        }
      }
    };
    const showComments = (id: string) => {
      setIsCommentOpen(!isCommentOpen);
      setCommentID(id);
    };

    return (
      <div
        className=" border border-[#e1e8f0] px-1 mt-1 py-1 bg-[#fff] boxShadow"
        style={{ width: "50%" }}
      >
        {/* <div className="h-[64vh] overflow-y-auto"> */}
        <ScrollArea className="h-[64vh] ">
          {Array.isArray(editorData) && editorData
            ? editorData &&
              editorData?.map((editor: any) => {
                return (
                  <React.Fragment key={editor?._id}>
                    {editor.isPinned === true && (
                      <div className="flex justify-end mb-2">
                        <p className="bg-orange-400 text-white flex items-center px-3 py-1 rounded-full text-xs ">
                          <DrawingPinIcon className="mr-1 h-4 w-4" />
                          Pinned
                        </p>
                      </div>
                    )}
                    <section
                      className="bg-white text-gray-800 border border-[#e1e8f0]  my-2"
                      key={editor?._id}
                      id={`editor-${editor?._id}`}
                    >
                      <div className="px-6 py-4 mx-auto">
                        <div className="flex flex-wrap -m-4">
                          <div className="p-2 w-full flex flex-col items-start">
                            <div className="flex items-center justify-between w-full border-b border-[#e1e8f0] pb-2 mb-2 relative">
                              <div className="flex items-center">
                                <Avatar className="cursor-pointer">
                                  <AvatarImage
                                    src={editor?.createdBy?.avatar}
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
                                  <span className="font-medium text-gray-900 text-[0.8rem]">
                                    {editor?.createdBy?.fullName
                                      ? editor?.createdBy?.fullName
                                      : ""}
                                  </span>
                                </span>
                              </div>

                              <div
                                onClick={() => handleOpenModal(editor._id)}
                                className="cursor-pointer"
                              >
                                <DotsHorizontalIcon className="h-5 w-5 text-gray-700 hover:text-gray-900" />
                              </div>

                              {isModalOpen &&
                                selectedEditorId === editor._id && (
                                  <div className="absolute top-0 right-0 bg-white w-56 z-50  p-4 shadow-lg ">
                                    <div className="">
                                      <div
                                        className="cursor-pointer flex justify-end "
                                        onClick={handleCloseModal}
                                      >
                                        <Cross1Icon className="h-4 w-4 text-gray-700 hover:text-black hover:bg-slate-100" />
                                      </div>
                                      <div className="flex items-center py-2 hover:bg-slate-100">
                                        <DeleteDialoge
                                          id={editor._id}
                                          entity="updates"
                                          setIsModalOpen={setIsModalOpen}
                                          setIsCommentOpen={setIsCommentOpen}
                                          fetchAllFunction={() =>
                                            fetchEditorData(customerId)
                                          }
                                          deleteText="Delete Update"
                                        />
                                      </div>
                                      <div className="flex items-center py-2 hover:bg-slate-100">
                                        {editor.isPinned ? (
                                          <div
                                            onClick={() =>
                                              handlePinFalse(editor._id)
                                            }
                                            className="cursor-pointer flex items-center"
                                          >
                                            <DrawingPinIcon className=" text-gray-700 mr-1  h-7 w-7 p-1 hover:bg-[#29354f]  hover:text-[white]" />
                                            <span className="text-gray-700 text-[0.8rem] ml-[7px]">
                                              Unpin From Top
                                            </span>
                                          </div>
                                        ) : (
                                          <div
                                            onClick={() =>
                                              handlePinTrue(editor._id)
                                            }
                                            className="cursor-pointer flex items-center"
                                          >
                                            <DrawingPinIcon className=" text-gray-700 mr-1 h-7 w-7 p-1 hover:bg-[#29354f]  hover:text-[white]" />
                                            <span className="text-gray-700 text-[0.8rem] ml-[8px]">
                                              Pin To Top
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center py-2 cursor-pointer hover:bg-slate-100">
                                        <EditChatModel
                                          id={editor._id}
                                          setIsModalOpen={setIsModalOpen}
                                          customerId={customerId}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>

                            <div
                              className="leading-relaxed mb-1 text-[0.8rem] mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_li]:leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: editor?.content ? editor?.content : "",
                              }}
                            />

                            <FilePreviewList files={editor?.files || []} />

                            <div className="flex items-center justify-between flex-wrap  mt-2 w-full  border-t-2 border-gray-100">
                              <div className="flex justify-between items-center gap-2">
                                <LikeComponent
                                  likes={editor.likes}
                                  userId={userId}
                                  likeClick={likeClick} // Pass likeClick function
                                  editorId={editor._id} // Pass editorId
                                />
                                <ReplyComponent
                                  isOpenReplyModel={isCommentOpen}
                                  replyId={commentID}
                                  dataId={editor?._id}
                                  onReplyClick={showComments}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {isCommentOpen && commentID === editor._id && (
                        <>
                          {editor?.replies ? (
                            <div className="mx-20">
                              <p
                                className="w-full text-gray-500 border cursor-pointer border-stroke bg-transparent my-2 py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                onClick={handleOpenQuillEditor}
                              >
                                Click here to write a reply..
                              </p>
                              {openQuill && (
                                <div className="pb-3 pr-4 pl-4">
                                  <QuillEditor
                                    productFlowId={""}
                                    leadId={""}
                                    updateId={editor._id}
                                    indicatorText="reply"
                                    customerId={customerId}
                                    orderId={""}
                                    technicalId={""}
                                    setOpenQuill={setOpenQuill}
                                    setIsOpenReplyModel={setIsOpenReplyModel}
                                    handleEdit={""}
                                    amendmentId={""}
                                    copywriterId={""}
                                    websiteContentId={""}
                                  />
                                </div>
                              )}

                              {[...(editor?.replies || [])]
                                .reverse()
                                .map((data: any) => (
                                  <section
                                    className="text-gray-600 body-font my-2  "
                                    key={data?._id}
                                  >
                                    <div className="px-5 py-2 mx-auto bg-gray-100 border w-full">
                                      <div className="flex flex-wrap ">
                                        <div className="md:w-full flex flex-col items-start">
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
                                                setIsOpenReplyModel={
                                                  setIsOpenReplyModel
                                                }
                                                fetchAllFunction={() =>
                                                  fetchEditorData(customerId)
                                                }
                                              />
                                            </div>
                                          </div>

                                          <p className="leading-relaxed mb-1 text-[0.8rem] mt-2">
                                            <div
                                              className="leading-relaxed mb-1 text-[0.8rem] mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_li]:leading-relaxed"
                                              dangerouslySetInnerHTML={{
                                                __html: data.content
                                                  ? data.content
                                                  : "",
                                              }}
                                            />
                                          </p>

                                          <FilePreviewList
                                            files={data?.files || []}
                                          />

                                          <div className="flex items-center justify-between flex-wrap mt-2 w-full  ">
                                            <div className="flex justify-between gap-2">
                                              <LikeComponent
                                                likes={data.likes}
                                                userId={userId}
                                                likeClick={likeClick} // Pass likeClick function
                                                editorId={data?._id} // Pass editorId
                                              />

                                              <ReplyComponent
                                                isOpenReplyModel={
                                                  isOpenReplyModel
                                                }
                                                replyId={reaplyId}
                                                dataId={data._id}
                                                onReplyClick={ReplyClick}
                                              />
                                              <div className="text-[0.8rem] flex gap-2 mt-1 items-center cursor-pointer">
                                                <div className="pr-2 text-[0.8rem]">
                                                  {formatDate(
                                                    data?.createdAt
                                                      ? data?.createdAt
                                                      : new Date()
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {isOpenReplyModel &&
                                      reaplyId === data._id && (
                                        <div className="mt-2">
                                          <QuillEditor
                                            productFlowId={""}
                                            setOpenQuill={setOpenQuill}
                                            leadId={""}
                                            updateId={editor._id}
                                            indicatorText="reply"
                                            customerId={customerId}
                                            setIsOpenReplyModel={
                                              setIsOpenReplyModel
                                            }
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
                      )}
                    </section>
                  </React.Fragment>
                );
              })
            : "No Data Available"}
        </ScrollArea>
      </div>
    );
  }
);

export default UpdateSection;
