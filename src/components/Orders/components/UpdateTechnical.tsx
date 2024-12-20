import React, { useEffect, useMemo, useState, useRef } from "react";

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
import User from "../../../asset/images/user.png";
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

import QuillEditor from "@/components/customers/components/QuillEditor";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditorStore } from "@/Store/EditorStore";
import { useParams } from "next/navigation";
import { useOrderStore } from "@/Store/OrderStore";
import DeleteDialoge from "@/components/Orders/components/DeleteDialoge";

import PDF from "../../../asset/images/pdf.png";
import XLSX from "../../../asset/images/xlsx.png";
import VIDEO from "../../../asset/images/video.png";
import WORD from "../../../asset/images/word.png";
import Logo from "../../../asset/images/companydummylog.png";
import CommentSection from "@/components/customers/components/CommentSection";
import EditChatModel from "./EditChatModel";
import FilePreviewList from "@/components/common/FilePreviewList";

const UpdateTechnical = ({ technicalId }: any) => {
  const [open, setOpen] = useState<boolean>(false);
  const UserPic = User.src;
  const { technicalUpdateData, fetchTechnicalUpdateData }: any =
    useEditorStore();
  const { fetchAllOrdersData }: any = useOrderStore();

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
  const [reply, setReply] = React.useState(false);
  // const [comments, setComments] = React.useState(false);
  const [commentID, setCommentID] = useState<string | null>(null);
  const [openQuill, setOpenQuill] = useState(false);
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

        fetchTechnicalUpdateData(technicalId);
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

        fetchTechnicalUpdateData(technicalId);
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
        fetchTechnicalUpdateData(technicalId);
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
  const handleOpenQuillEditor = () => {
    setOpenQuill((prevOpen) => !prevOpen);
  };

  return (
    <>
      {Array.isArray(technicalUpdateData) &&
        technicalId &&
        technicalUpdateData.map((editor: any, index: number) => (
          <React.Fragment key={editor.id || index}>
            {editor.isPinned === true && (
              <div className="flex justify-end mb-2">
                <p className="bg-orange-400 text-white flex items-center px-3 py-1 rounded-full text-xs shadow-lg">
                  <DrawingPinIcon className="mr-1 h-4 w-4" />
                  Pinned
                </p>
              </div>
            )}

            <section className="bg-white text-gray-800 border border-gray-300 rounded-md my-2 ">
              <div className="px-6 py-4 mx-auto">
                <div className="flex flex-wrap -m-4">
                  <div className="p-4 md:w-full flex flex-col items-start">
                    <div className="flex items-center justify-between w-full border-b border-gray-300 pb-2 mb-2 relative">
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
                                  fetchTechnicalUpdateData(technicalId)
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
                                technicalId={technicalId}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div />
                    <div
                      className="leading-relaxed mb-1 text-[0.8rem] mt-2"
                      dangerouslySetInnerHTML={{
                        __html: editor?.content ? editor?.content : "",
                      }}
                    />
                    <FilePreviewList files={editor.files || []} />
                    <div className="flex items-center justify-between flex-wrap  mt-2 w-full  border-t-2 border-gray-100">
                      <div className="flex justify-between items-center gap-2">
                        <div
                          className="text-[0.8rem] border-r-2 pr-2 border-gray-200 flex gap-2 mt-1 items-center cursor-pointer"
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
                  {editor?.replies ? (
                    <div className="ml-[2.5rem] mr-[4.5rem]">
                      <p
                        className="w-full text-[0.8rem] text-gray-500 rounded-md border cursor-pointer border-stroke bg-transparent mx-[16px] my-2 py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        onClick={handleOpenQuillEditor}
                      >
                        Click here to write a reply...
                      </p>

                      {openQuill && (
                        <div className="pb-3 pr-4 pl-4">
                          <QuillEditor
                            productFlowId=""
                            leadId={""}
                            updateId={editor._id}
                            indicatorText="reply"
                            customerId=""
                            orderId={""}
                            setOpenQuill={setOpenQuill}
                            setIsOpenReplyModel={setIsOpenReplyModel}
                            technicalId={technicalId}
                            handleEdit={""}
                            amendmentId={""}
                            copywriterId={""}
                            websiteContentId={""}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    "No Comment added"
                  )}
                  {editor?.replies ? (
                    <div>
                      {[...(editor?.replies || [])]
                        .reverse()
                        .map((data: any) => (
                          <section
                            className="text-gray-600 body-font overflow-hidden  my-2 rounded "
                            key={data?._id}
                          >
                            <div className="container px-5 py-2 mx-auto bg-gray-100 border rounded w-[90%] mt-2">
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
                                          fetchTechnicalUpdateData(technicalId)
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
                                <QuillEditor
                                  productFlowId=""
                                  leadId={""}
                                  updateId={editor._id}
                                  indicatorText="reply"
                                  customerId={""}
                                  setOpenQuill={setOpenQuill}
                                  setIsOpenReplyModel={setIsOpenReplyModel}
                                  orderId={""}
                                  technicalId={technicalId}
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
                    "No reply received"
                  )}
                </>
              )}
            </section>
          </React.Fragment>
        ))}
    </>
  );
};

export default UpdateTechnical;
