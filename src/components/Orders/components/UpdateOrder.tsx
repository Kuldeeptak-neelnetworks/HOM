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

// import QuillEdior from "@/components/customers/components/QuillEditor";
import QuillEdior from "@/components/common/Editor/QuillEditor";
// const QuillEdior = dynamic(() => import('@/components/customers/components/QuillEditor'), { ssr: false });

import { useEditorStore } from "@/Store/EditorStore";

import DeleteDialoge from "@/components/Orders/components/DeleteDialoge";

import PDF from "../../../asset/images/pdf.png";
import XLSX from "../../../asset/images/xlsx.png";
import VIDEO from "../../../asset/images/video.png";
import WORD from "../../../asset/images/word.png";
import Logo from "../../../asset/images/companydummylog.png";
import dynamic from "next/dynamic";
import EditChatModel from "../../common/Editor/EditChatModel";
import QuillEditor from "@/components/customers/components/QuillEditor";
import FilePreviewList from "@/components/common/FilePreviewList";
import LikeComponent from "@/components/common/Editor/LikeComponent";
import ReplyComponent from "@/components/common/Editor/ReplyComponent";

const UpdateOrder = ({ orderId }: any) => {
  const [open, setOpen] = useState<boolean>(false);

  const { fetchOrderEditorData, orderEditorData }: any = useEditorStore();

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
  const stripHtmlTags = (htmlString: string) => {
    return htmlString ? htmlString.replace(/<[^>]*>?/gm, "") : "";
  };
  let userDataString: any =
    typeof window !== "undefined" ? localStorage?.getItem("user") : null;
  const userData2 = JSON.parse(userDataString);
  const [openQuill, setOpenQuill] = useState(false);
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
  const handleOpenQuillEditor = () => {
    setOpenQuill((prevOpen) => !prevOpen);
  };
  const handlePinTrue = async (id: string) => {
    try {
      const response = await baseInstance.patch(`/updates/${id}/pin`, {
        isPinned: true,
      });
      if (response.status === 200) {
        successToastingFunction(response?.data?.message);
        fetchOrderEditorData(orderId);

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
        fetchOrderEditorData(orderId);

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
      const response = await baseInstance.post(
        `/updates/toggle/${likeId}/like`
      );
      if (response.status === 200) {
        fetchOrderEditorData(orderId);
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
      {Array.isArray(orderEditorData) &&
        orderId &&
        orderEditorData.map((editor: any, index: number) => (
          <React.Fragment key={editor.id || index}>
            {editor.isPinned === true && (
              <div className="flex justify-end mb-2">
                <p className="bg-orange-400 text-white flex items-center px-3 py-1 rounded-full text-xs shadow-lg">
                  <DrawingPinIcon className="mr-1 h-4 w-4" />
                  Pinned
                </p>
              </div>
            )}

            <section className="bg-white text-gray-800 border border-gray-300  my-2">
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
                                  fetchOrderEditorData(orderId)
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
                                  <DrawingPinIcon className=" text-gray-700 mr-1  h-7 w-7 p-1 hover:bg-[#29354f]  hover:text-[white] " />
                                  <span className="text-gray-700 text-[0.8rem] ml-[7px]">
                                    Unpin From Top
                                  </span>
                                </div>
                              ) : (
                                <div
                                  onClick={() => handlePinTrue(editor._id)}
                                  className="cursor-pointer flex items-center"
                                >
                                  <DrawingPinIcon className=" text-gray-700 mr-1 h-7 w-7 p-1 hover:bg-[#29354f]  hover:text-[white] " />
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
                                orderId={orderId}
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

                    <FilePreviewList files={editor.files || []} />

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
                    <div className="ml-[2.5rem] mr-[4.5rem]">
                      <p
                        className="w-full text-[0.8rem] text-gray-500  border cursor-pointer border-stroke bg-transparent mx-[16px] my-2 py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        onClick={handleOpenQuillEditor}
                      >
                        Click here to write a reply...
                      </p>

                      {openQuill && (
                        <div className="pb-3 pr-4 pl-4">
                          <QuillEdior
                            productFlowId={""}
                            leadId={""}
                            updateId={editor._id}
                            indicatorText="reply"
                            customerId=""
                            orderId={orderId}
                            setOpenQuill={setOpenQuill}
                            setIsOpenReplyModel={setIsOpenReplyModel}
                            technicalId={""}
                            handleEdit={""}
                            amendmentId={""}
                            copywriterId={""}
                            websiteContentId={""}
                            text={""}
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
                                          fetchOrderEditorData(orderId)
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
                                  <FilePreviewList files={data.files || []} />
                                  <div className="flex items-center justify-between flex-wrap  mt-2 w-full  ">
                                    <div className="flex justify-between gap-2">
                                      <LikeComponent
                                        likes={data.likes}
                                        userId={userId}
                                        likeClick={likeClick} // Pass likeClick function
                                        editorId={data?._id} // Pass editorId
                                      />

                                      <ReplyComponent
                                        isOpenReplyModel={isOpenReplyModel}
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
                            {isOpenReplyModel && reaplyId === data._id && (
                              <div
                                className="mt-2 "
                                style={{
                                  paddingLeft: "57px",
                                  paddingRight: "57px",
                                }}
                              >
                                <QuillEdior
                                  productFlowId={""}
                                  leadId={""}
                                  updateId={editor._id}
                                  indicatorText="reply"
                                  customerId={""}
                                  setOpenQuill={setOpenQuill}
                                  setIsOpenReplyModel={setIsOpenReplyModel}
                                  orderId={orderId}
                                  technicalId={""}
                                  handleEdit={""}
                                  amendmentId={""}
                                  copywriterId={""}
                                  websiteContentId={""}
                                  text={""}
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

export default UpdateOrder;
