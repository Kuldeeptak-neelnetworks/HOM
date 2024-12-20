"use Client";
import React, { useEffect, useState, useRef } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CommentsDarkUIconSVG,
  CommentsUIconSVG,
  DeletedUserUIconSVG,
  LikeDarkUIconSVG,
  LikeUIconSVG,
  ReplyUIconSVG,
  ViewsUIconSVG,
} from "@/utils/SVGs/SVGs";

import {
  ChatBubbleIcon,
  Cross1Icon,
  DotsHorizontalIcon,
  DrawingPinIcon,
  Pencil2Icon,
  PlusIcon,
} from "@radix-ui/react-icons";
import {
  baseInstance,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";

import QuillEdior from "@/components/customers/components/QuillEditor";

import { useEditorStore } from "@/Store/EditorStore";

import DeleteDialoge from "@/components/Orders/components/DeleteDialoge";

import PDF from "../../../asset/images/pdf.png";
import XLSX from "../../../asset/images/xlsx.png";
import VIDEO from "../../../asset/images/video.png";
import WORD from "../../../asset/images/word.png";
import Logo from "../../../asset/images/companydummylog.png";
import EditChatModel from "@/components/Orders/components/EditChatModel";
import FilePreviewList from "@/components/common/FilePreviewList";

const UpdateAmendment = ({ amendmentId }: any) => {
  const [open, setOpen] = useState<boolean>(false);

  const { fetchAmendmentUpdateData, amendmentUpdateData }: any =
    useEditorStore();

  const PDFPic = PDF.src;
  const XLSXPic = XLSX.src;
  const VIDEOPic = VIDEO.src;
  const WORDPic = WORD.src;
  const companyLogo = Logo.src;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEditorId, setSelectedEditorId] = useState<string | null>(null);
  const [isOpenReplyModel, setIsOpenReplyModel] = useState(false);
  const [reaplyId, setReplyId] = useState<string | null>(null);
  const [like, setLike] = React.useState(false);

  const [commentID, setCommentID] = useState<string | null>(null);
  const stripHtmlTags = (htmlString: string) => {
    return htmlString ? htmlString.replace(/<[^>]*>?/gm, "") : "";
  };
  let userDataString: any =
    typeof window !== "undefined" ? localStorage?.getItem("user") : null;
  const userData2 = JSON.parse(userDataString);
  const userId = userData2?._id;

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const options: any = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate;
  };

  const handlePinTrue = async (id: string) => {
    try {
      const response = await baseInstance.patch(`/updates/${id}/pin`, {
        isPinned: true,
      });
      if (response.status === 200) {
        successToastingFunction(response?.data?.message);

        fetchAmendmentUpdateData(amendmentId);

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

        fetchAmendmentUpdateData(amendmentId);

        setIsModalOpen(false);
      }
    } catch (error: any) {
      if (error?.response && error?.response?.data) {
        errorToastingFunction(error?.response?.data.message);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = (id: string) => {
    setSelectedEditorId(id);
    setIsModalOpen(true);
  };
  const addLikesData = async (likeId: string) => {
    try {
      // setIsLoading(true);

      const response = await baseInstance.post(
        `/updates/toggle/${likeId}/like`
      );
      if (response.status === 200) {
        fetchAmendmentUpdateData(amendmentId);
      }
    } catch (error) {
      errorToastingFunction(error);
    } finally {
      // setIsLoading(() => false);
    }
  };

  const likeClick = (likeId: string) => {
    if (likeId) addLikesData(likeId);
    setLike((prev) => !prev);
  };

  const ReplyClick = (id: string) => {
    setIsOpenReplyModel(!isOpenReplyModel);
    setReplyId(id);
  };

  const showComments = (id: string) => {
    setIsCommentOpen(!isCommentOpen);
    setCommentID(id);
  };

  return (
    <>
      {Array.isArray(amendmentUpdateData) &&
        amendmentId &&
        amendmentUpdateData.map((editor: any, index: number) => (
          <React.Fragment key={editor.id || index}>
            {editor.isPinned === true && (
              <div className="flex justify-end mb-2">
                <p className="bg-orange-400 text-white flex items-center px-3 py-1 rounded-full text-xs shadow-lg">
                  <DrawingPinIcon className="mr-1 h-4 w-4" />
                  Pinned
                </p>
              </div>
            )}

            <section className="bg-white text-gray-800 border border-gray-300 rounded-md my-2">
              <div className="px-6 py-4 mx-auto">
                <div className="flex flex-wrap -m-4">
                  <div className="p-4 md:w-full flex flex-col items-start">
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
                            {editor?.createdBy?.fullName || ""}
                          </span>
                        </span>
                      </div>
                      <div
                        onClick={() => handleOpenModal(editor._id)}
                        className="cursor-pointer"
                      >
                        <DotsHorizontalIcon className="h-5 w-5 text-gray-700 hover:text-gray-900" />
                      </div>
                      {isModalOpen && selectedEditorId === editor._id && (
                        <div className="absolute top-0 right-0 bg-white w-52 z-50  shadow-lg p-4">
                          <div className="">
                            <div
                              className="cursor-pointer flex justify-end "
                              onClick={handleCloseModal}
                            >
                              <Cross1Icon className="h-4 w-4 text-gray-700 hover:text-gray-900" />
                            </div>
                            <div className="flex items-center py-2 hover:bg-slate-100">
                              <DeleteDialoge
                                id={editor._id}
                                entity="updates"
                                setIsModalOpen={setIsModalOpen}
                                setIsCommentOpen={setIsCommentOpen}
                                fetchAllFunction={() =>
                                  fetchAmendmentUpdateData(amendmentId)
                                }
                                deleteText="Delete Update"
                              />
                            </div>
                            <div className="flex items-center py-2 hover:bg-slate-100">
                              {editor.isPinned ? (
                                <div
                                  onClick={() => handlePinFalse(editor._id)}
                                  className="cursor-pointer flex items-center"
                                >
                                  <DrawingPinIcon className=" text-gray-700 mr-1  h-7 w-7 p-1 hover:bg-[#29354f]  hover:text-[white] rounded-sm" />
                                  <span className="text-gray-700 text-[0.8rem] ml-[7px]">
                                    Unpin From Top
                                  </span>
                                </div>
                              ) : (
                                <div
                                  onClick={() => handlePinTrue(editor._id)}
                                  className="cursor-pointer flex items-center"
                                >
                                  <DrawingPinIcon className=" text-gray-700 mr-1 h-7 w-7 p-1 hover:bg-[#29354f]  hover:text-[white] rounded-sm" />
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
                                amendmentId={amendmentId}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className="leading-relaxed mb-1 text-[0.8rem] mt-2"
                      dangerouslySetInnerHTML={{
                        __html: editor?.content ? editor?.content : "",
                      }}
                    />

                    <FilePreviewList files={editor?.files || []} />

                    <div className="flex items-center justify-between flex-wrap  mt-2 w-full  border-t border-[#e1e8f0]">
                      <div className="flex justify-between items-center gap-2">
                        <div
                          className="text-[0.8rem] border-r-2 pr-2 border-[#e1e8f0] flex gap-2 mt-1 items-center cursor-pointer"
                          onClick={() => likeClick(editor?._id)}
                        >
                          <span
                            className={`${
                              editor.likes.some(
                                (like: any) => like._id === userId
                              )
                                ? "text-[#3a5894] font-bold"
                                : ""
                            }`}
                          >
                            Like
                          </span>
                          {editor.likes.some(
                            (like: any) => like._id === userId
                          ) ? (
                            <LikeDarkUIconSVG />
                          ) : (
                            <LikeUIconSVG />
                          )}
                        </div>
                        <div
                          className="text-[0.8rem] pr-2 flex gap-2 mt-1 items-center cursor-pointer"
                          onClick={() => showComments(editor?._id)}
                        >
                          <span
                            className={`${
                              isCommentOpen ? "text-[#3a5894] font-bold" : ""
                            }`}
                          >
                            Reply
                          </span>
                          <ReplyUIconSVG />
                          {/* {isCommentOpen ? (
                            <CommentsDarkUIconSVG />
                          ) : (
                            <CommentsUIconSVG />
                          )} */}
                        </div>
                      </div>
                    </div>
                    {/* <div className="text-[0.8rem]">
                      <span className="font-bold mr-1">
                        {editor?.likes ? editor?.likes?.length : "0"}
                      </span>
                      Likes
                    </div> */}
                  </div>
                </div>
              </div>

              {isCommentOpen && commentID === editor._id && (
                <>
                  {editor.replies.length === 0 &&
                    editor.replies.constructor === Array && (
                      <div className="pb-3 pr-4 pl-4">
                        <QuillEdior
                          leadId={""}
                          amendmentId={amendmentId}
                          updateId={editor._id}
                          indicatorText="reply"
                          customerId=""
                          orderId=""
                          technicalId={""}
                          setOpenQuill={() => {}}
                          setIsOpenReplyModel={setIsOpenReplyModel}
                          handleEdit={""}
                          copywriterId={""}
                          productFlowId={""}
                          websiteContentId={""}
                        />
                      </div>
                    )}

                  {/* reply Data list */}
                  {editor?.replies ? (
                    <div>
                      {[...(editor?.replies || [])]
                        .reverse()
                        .map((data: any) => (
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
                                        setIsOpenReplyModel={
                                          setIsOpenReplyModel
                                        }
                                        fetchAllFunction={() =>
                                          fetchAmendmentUpdateData(amendmentId)
                                        }
                                      />
                                    </div>
                                  </div>

                                  <p className="leading-relaxed mb-1 text-[0.8rem] mt-2">
                                    <div
                                      className="leading-relaxed mb-1 text-[0.8rem] mt-2"
                                      dangerouslySetInnerHTML={{
                                        __html: data.content
                                          ? data.content
                                          : "",
                                      }}
                                    />
                                  </p>

                                  <FilePreviewList files={data.files || []} />
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
                                          {data?.likes
                                            ? data?.likes?.length
                                            : "0"}
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
                            {isOpenReplyModel && reaplyId === data._id && (
                              <div
                                className="mt-2 "
                                style={{
                                  paddingLeft: "57px",
                                  paddingRight: "57px",
                                }}
                              >
                                <QuillEdior
                                  setOpenQuill={() => {}}
                                  leadId={""}
                                  productFlowId=""
                                  updateId={editor._id}
                                  indicatorText="reply"
                                  customerId={""}
                                  setIsOpenReplyModel={setIsOpenReplyModel}
                                  orderId={""}
                                  technicalId={""}
                                  handleEdit={""}
                                  amendmentId={amendmentId}
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
        ))}
    </>
  );
};

export default UpdateAmendment;
