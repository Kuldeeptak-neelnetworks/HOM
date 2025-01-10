// import { Loader2, PlusCircleIcon } from "lucide-react";
// import Link from "next/link";
// import * as Yup from "yup";
// import { DataTableColumnHeader } from "../../common/data-table-column-header";
// import { DataTableRowActions } from "../../common/data-table-row-actions";
// import TooltipCommon from "@/components/common/TooltipCommon";

// import User from "../../../asset/images/user.png";

// import React, { useEffect, useState, useRef } from "react";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   CommentsDarkUIconSVG,
//   CommentsUIconSVG,
//   DeletedUserUIconSVG,
//   LikeDarkUIconSVG,
//   LikeUIconSVG,
//   ReplyUIconSVG,
//   ViewsUIconSVG,
// } from "@/utils/SVGs/SVGs";

// import {
//   ChatBubbleIcon,
//   Cross1Icon,
//   DotsHorizontalIcon,
//   DrawingPinIcon,
//   Pencil2Icon,
//   PlusIcon,
// } from "@radix-ui/react-icons";
// import {
//   baseInstance,
//   errorToastingFunction,
//   successToastingFunction,
// } from "@/common/commonFunctions";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import QuillEdior from "@/components/customers/components/QuillEditor";

// import { useEditorStore } from "@/Store/EditorStore";

// import DeleteDialoge from "@/components/Orders/components/DeleteDialoge";

// import PDF from "../../../asset/images/pdf.png";
// import XLSX from "../../../asset/images/xlsx.png";
// import VIDEO from "../../../asset/images/video.png";
// import WORD from "../../../asset/images/word.png";
// import Logo from "../../../asset/images/companydummylog.png";
// import { ScrollArea } from "@/components/ui/scroll-area";

// const Hello= ({ orderId, leadId, userId }: any) => {
//   const [open, setOpen] = useState<boolean>(false);

//   const { fetchLeadsEditorData, leadsEditorData }: any = useEditorStore();

//   const PDFPic = PDF.src;
//   const XLSXPic = XLSX.src;
//   const VIDEOPic = VIDEO.src;
//   const WORDPic = WORD.src;
//   const companyLogo = Logo.src;
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isCommentOpen, setIsCommentOpen] = useState(false);
//   const [editContent, setEditContent] = useState("");
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [selectedEditorId, setSelectedEditorId] = useState<string | null>(null);
//   const [isOpenReplyModel, setIsOpenReplyModel] = useState(false);
//   const [reaplyId, setReplyId] = useState<string | null>(null);
//   const [like, setLike] = React.useState(false);

//   const [commentID, setCommentID] = useState<string | null>(null);
//   const stripHtmlTags = (htmlString: string) => {
//     return htmlString ? htmlString.replace(/<[^>]*>?/gm, "") : "";
//   };
//   // let userDataString: any =
//   //   typeof window !== "undefined" ? localStorage?.getItem("user") : null;
//   // const userData2 = JSON.parse(userDataString);
//   // const userId = userData2?._id;
//   const formatDate = (dateString: any) => {
//     const date = new Date(dateString);
//     const options: any = {
//       day: "2-digit",
//       month: "2-digit",
//       year: "2-digit",
//     };
//     const formattedDate = date.toLocaleDateString("en-GB", options);
//     return formattedDate;
//   };

//   const handlePinTrue = async (id: string) => {
//     try {
//       const response = await baseInstance.patch(`/updates/${id}/pin`, {
//         isPinned: true,
//       });
//       if (response.status === 200) {
//         successToastingFunction(response?.data?.message);

//         fetchLeadsEditorData(leadId);

//         setIsModalOpen(false);
//       }
//     } catch (error: any) {
//       if (error?.response && error?.response?.data) {
//         errorToastingFunction(error?.response?.data.message);
//       }
//     }
//   };
//   const handlePinFalse = async (id: string) => {
//     try {
//       const response = await baseInstance.patch(`/updates/${id}/pin`, {
//         isPinned: false,
//       });
//       if (response.status === 200) {
//         successToastingFunction(response?.data?.message);

//         fetchLeadsEditorData(leadId);

//         setIsModalOpen(false);
//       }
//     } catch (error: any) {
//       if (error?.response && error?.response?.data) {
//         errorToastingFunction(error?.response?.data.message);
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleEdit = (id: string) => {
//     if (editingId === id) {
//       setEditingId(null);
//     } else {
//       setEditingId(id);

//       let editorToEdit = leadsEditorData?.find(
//         (editor: { _id: string }) => editor._id === id
//       );
//     //   if (!editorToEdit) {
//     //     console.log("leads");
//     //     editorToEdit = leadsEditorData.find(
//     //       (editor: { _id: string }) => editor._id === id
//     //     );
//     //   }

//       setEditContent(editorToEdit?.content || "");
//     }
//   };

//   const handleSave = async (id: string) => {
//     try {
//       const response = await baseInstance.patch(`/updates/${id}`, {
//         content: editContent,
//       });
//       if (response.status === 200) {
//         successToastingFunction(response?.data?.message);

//         fetchLeadsEditorData(leadId);

//         setEditingId(null);
//         setIsModalOpen(false);
//       }
//     } catch (error: any) {
//       if (error?.response && error?.response?.data) {
//         errorToastingFunction(error?.response?.data.message);
//       }
//     }
//   };

//   const handleOpenModal = (id: string) => {
//     setSelectedEditorId(id);
//     setIsModalOpen(true);
//   };
//   const addLikesData = async (likeId: string) => {
//     try {
//       // setIsLoading(true);

//       const response = await baseInstance.post(
//         `/updates/toggle/${likeId}/like`
//       );
//       if (response.status === 200) {
//         fetchLeadsEditorData(leadId);

//       }
//     } catch (error) {
//       errorToastingFunction(error);
//     } finally {
//       // setIsLoading(() => false);
//     }
//   };

//   const likeClick = (likeId: string) => {
//     if (likeId) addLikesData(likeId);
//     setLike((prev) => !prev);
//   };

//   // Reply Function
//   // const ReplyClick = (id: string) => {
//   //   if (reaplyId === id) {
//   //     setReplyId(null);
//   //   } else {
//   //     setIsOpenReplyModel(true);
//   //     setReplyId(id);
//   //     // window.scrollTo({
//   //     //   top: 0,
//   //     //   behavior: 'smooth'
//   //     // });
//   //   }
//   // };
//   const ReplyClick = (id:string) => {
//     setIsOpenReplyModel(!isOpenReplyModel);
//     setReplyId(id);
//   };

//   // const showComments = (id: string) => {
//   //   if (commentID === id) {
//   //     setCommentID(null);
//   //   } else {
//   //     setIsCommentOpen(true);
//   //     setCommentID(id);
//   //   }
//   // };
//   const showComments = (id: string) => {
//     setIsCommentOpen(!isCommentOpen);
//     setCommentID(id);
//   };

//   return (
//     <>
//       {length === 0 ? (
//         <PlusCircleIcon
//           className="h-7 w-7 p-1 text-black  cursor-pointer"
//           onClick={handleOpenModal}
//         />
//       ) : (
//         <div className="relative
//         " style={{paddingTop:"6px"}}>
//           <ChatBubbleIcon
//             className="h-7 w-7 p-1 text-black cursor-pointer"
//             onClick={handleOpenModal}
//           />
//           <div
//             className="absolute top-0  bg-red-500  text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
//             onClick={handleOpenModal}
//           >
//             {length}
//           </div>
//         </div>
//       )}

//       {isModalOpen  && (
//         <div className="fixed right-3 top-24 bg-[#fff] w-1/2 z-50 min-h-96  border border-inherit">
//           <div className="p-8">
//           {/* <Link
//                   href="/orders"
//                   className="block px-4 py-2 text-[0.8rem] text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
//                 > */}

//                  <div className="cursor-pointer" onClick={handleCloseModal}>
//         Close Modal
//       </div>
//             {/* </Link> */}
//             <div></div>
//             <div className="w-full">
//               <Tabs defaultValue="updates" className="w-full">
//                 <TabsList className="grid grid-cols-4"  onClick={handleCloseModal}>
//                   fslkdfjlksdjfj
//                   <TabsTrigger value="updates">Updates</TabsTrigger>
//                   <TabsTrigger value="files">Files</TabsTrigger>
//                   <TabsTrigger value="activityLog">Activity Log</TabsTrigger>
//                   <TabsTrigger value="invoices">Invoices</TabsTrigger>
//                   {/* <TabsTrigger value="quotes">Quotes & Invoices</TabsTrigger> */}
//                 </TabsList>
//                 <TabsContent value="updates">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Updates</CardTitle>
//                     </CardHeader>
//                     <CardContent
//                       className="space-y-2"
//                       style={{ minHeight: "400px" }}
//                     >
//                       <div className="space-y-1">

//                         <ScrollArea className="h-[30vh] ">
//                         {Array.isArray(leadsEditorData) &&
//         leadId &&
//         leadsEditorData.map((editor: any) => (
//           <>
//             {editor.isPinned === true && (
//               <div className="flex justify-end">
//                 <p className="bg-orange-400 w-20 text-white flex pr-2">
//                   <DrawingPinIcon />
//                   Pinned
//                 </p>
//               </div>
//             )}

//             <section
//               className="text-gray-600 body-font overflow-hidden border my-2 rounded"
//               key={editor?._id}
//               // id={`editor-${editor?._id}`}
//             >
//               <div className="px-5 py-2 mx-auto">
//                 <div className="flex flex-wrap -m-12">
//                   <div className="p-12 md:w-full flex flex-col items-start">
//                     <div className="flex items-center justify-between w-full border-b-2 border-gray-100">
//                       <div className="inline-flex items-center pb-2 mt-2">
//                         <Avatar className="cursor-pointer">
//                           <AvatarImage
//                             src={editor?.createdBy?.avatar}
//                             className="h-12"
//                             alt="companyLogo"
//                           />
//                           <AvatarFallback>
//                             <img
//                               src={companyLogo}
//                               className="h-12"
//                               alt="companyLogo"
//                             />
//                           </AvatarFallback>
//                         </Avatar>
//                         <span className="flex-grow flex flex-col pl-4">
//                           <span className="title-font font-medium text-gray-900 text-[0.8rem]">
//                             {editor?.createdBy?.fullName
//                               ? editor?.createdBy?.fullName
//                               : ""}
//                           </span>
//                         </span>
//                       </div>
//                       {/* <div className="pr-2 text-[0.9rem]">
//                             {formatDate(
//                               editor?.createdAt ? editor?.createdAt : new Date()
//                             )}
//                           </div> */}
//                       <div
//                         onClick={() => handleOpenModal(editor._id)}
//                         className="cursor-pointer"
//                       >
//                         <DotsHorizontalIcon />
//                       </div>
//                     </div>
//                     {isModalOpen && selectedEditorId === editor._id && (
//                       <div className="absolute top-0 right-0 bg-white w-56 z-50  shadow-lg p-4">

//                         <div className="">
//                           <div
//                             className="cursor-pointer flex justify-end"
//                             onClick={handleCloseModal}
//                           >
//                             <Cross1Icon className="h-5 w-5 text-gray-700" />
//                           </div>
//                           <div className="flex items-center py-2">
//                             <DeleteDialoge
//                               id={editor._id}
//                               entity="updates"
//                               setIsModalOpen={setIsModalOpen}
//                               fetchAllFunction={() =>
//                                 fetchLeadsEditorData(leadId)
//                               }
//                             />
//                             <span className="ml-1 text-gray-700 text-[0.8rem]">
//                               Delete Update
//                             </span>
//                           </div>
//                           <div className="flex items-center py-2">
//                             {editor.isPinned ? (
//                               <div
//                                 onClick={() => handlePinFalse(editor._id)}
//                                 className="cursor-pointer flex items-center"
//                               >
//                                 <DrawingPinIcon className="h-5 w-5 text-gray-700 mr-1  h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//                                 <span className="text-gray-700 text-[0.8rem]">
//                                   Unpin from top
//                                 </span>
//                               </div>
//                             ) : (
//                               <div
//                                 onClick={() => handlePinTrue(editor._id)}
//                                 className="cursor-pointer flex items-center"
//                               >
//                                 <DrawingPinIcon className="h-5 w-5 text-gray-700 mr-1  h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//                                 <span className="text-gray-700 text-[0.8rem]">
//                                   Pin to top
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                           <div
//                             className="flex items-center py-2 cursor-pointer"
//                             onClick={() => handleEdit(editor._id)}
//                           >
//                             <Pencil2Icon className="h-5 w-5 text-gray-700 mr-1  h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//                             <span className="text-gray-700 text-[0.8rem]">Edit</span>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                     {editingId === editor._id ? (
//                       <div>
//                         <input
//                           className="border rounded mt-2 p-2 w-full"
//                           value={editContent}
//                           onChange={(e) => setEditContent(e.target.value)}
//                         />
//                         <button
//                           className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
//                           onClick={() => handleSave(editor._id)}
//                         >
//                           Save
//                         </button>
//                       </div>
//                     ) : (
//                       <p className="leading-relaxed mb-1 text-[0.8rem] mt-2">
//                         {stripHtmlTags(editor?.content ? editor.content : "")}
//                       </p>
//                     )}
//                     <div />

//                     <div className="flex gap-4">
//                       {editor?.files &&
//                         editor?.files?.map((file: any, index: number) => {
//                           // Extract file extension
//                           let fileExtension = "";
//                           if (file) {
//                             const fileNameParts = file.split(".");
//                             if (fileNameParts.length > 1) {
//                               fileExtension =
//                                 fileNameParts.pop()?.toLowerCase() || "";
//                             }
//                           }

//                           // Determine the type of the file based on fileExtension
//                           let fileType = "unknown"; // default to unknown

//                           switch (fileExtension) {
//                             case "pdf":
//                               fileType = "pdf";
//                               break;
//                             case "jpg":
//                             case "jpeg":
//                             case "png":
//                               fileType = "image";
//                               break;
//                             case "xlsx":
//                               fileType = "xlsx";
//                               break;
//                             case "mp4":
//                               fileType = "video";
//                               break;
//                             case "docx":
//                               fileType = "word";
//                               break;
//                             default:
//                               fileType = "unknown";
//                               break;
//                           }

//                           // Prepare the content based on fileType
//                           let content;
//                           if (fileType === "pdf") {
//                             content = (
//                               <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded">
//                                 <a href={file} target="_blank">
//                                   <img
//                                     src={PDFPic}
//                                     alt=""
//                                     className="h-[100px] w-[100px] object-cover rounded"
//                                   />
//                                 </a>
//                               </div>
//                             );
//                           } else if (fileType === "image") {
//                             content = (
//                               <img
//                                 key={index}
//                                 src={file}
//                                 alt=""
//                                 className="h-[100px] w-[100px] object-cover rounded"
//                               />
//                             );
//                           } else if (fileType === "word") {
//                             content = (
//                               <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded">
//                                 <a href={file} target="_blank">
//                                   <img
//                                     src={WORDPic}
//                                     alt=""
//                                     className="h-[100px] w-[100px] object-cover rounded"
//                                   />
//                                 </a>
//                               </div>
//                             );
//                           } else if (fileType === "xlsx") {
//                             content = (
//                               <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded">
//                                 <a href={file} target="_blank">
//                                   <img
//                                     src={XLSXPic}
//                                     alt=""
//                                     className="h-[100px] w-[100px] object-cover rounded"
//                                   />
//                                 </a>
//                               </div>
//                             );
//                           } else if (fileType === "video") {
//                             content = (
//                               <video src={file} width={200} controls></video>
//                             );
//                           } else {
//                             // Handle unknown file types or default case
//                             content = (
//                               <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded">
//                                 <span className="text-gray-600 text-lg">
//                                   Unknown
//                                 </span>
//                               </div>
//                             );
//                           }

//                           return (
//                             <div key={index} className="relative">
//                               {content}
//                             </div>
//                           );
//                         })}
//                     </div>

//                     <div className="flex items-center justify-between flex-wrap  mt-2 w-full  border-t-2 border-gray-100">
//                       <div className="flex justify-between items-center gap-2">
//                         <div
//                           className="text-[0.8rem] border-r-2 pr-2 border-gray-200 flex gap-2 mt-1 items-center cursor-pointer"
//                           onClick={() => likeClick(editor?._id)}
//                         >
//                           <span
//                             className={`${
//                               editor.likes.some(
//                                 (like: any) => like._id === userId
//                               )
//                                 ? "text-[#3a5894] font-bold"
//                                 : ""
//                             }`}
//                           >
//                             Like
//                           </span>
//                           {editor.likes.some(
//                             (like: any) => like._id === userId
//                           ) ? (
//                             <LikeDarkUIconSVG />
//                           ) : (
//                             <LikeUIconSVG />
//                           )}
//                         </div>
//                         <div
//                           className="text-[0.8rem] pr-2 flex gap-2 mt-1 items-center cursor-pointer"
//                           onClick={() => showComments(editor?._id)}
//                         >
//                           <span
//                             className={`${
//                               isCommentOpen ? "text-[#3a5894] font-bold" : ""
//                             }`}
//                           >
//                             Comment
//                           </span>
//                           {isCommentOpen ? (
//                             <CommentsDarkUIconSVG />
//                           ) : (
//                             <CommentsUIconSVG />
//                           )}
//                         </div>
//                       </div>
//                       {/* <div className="mt-2 cursor-pointer">
//                         <span className="text-gray-400 mr-2 inline-flex items-center ml-auto leading-none text-[0.8rem] pr-3 py-1 text-[0.7rem] gap-1">
//                           views
//                           <ViewsUIconSVG />
//                           {editor?.views ? editor?.views?.length : "0"}
//                         </span>
//                       </div> */}
//                     </div>
//                     <div className="text-[0.8rem]">
//                       <span className="font-bold mr-1">
//                         {editor?.likes ? editor?.likes?.length : "0"}
//                       </span>
//                       Likes
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {isCommentOpen && commentID === editor._id && (
//                 <>
//                   {editor.replies.length === 0 &&
//                     editor.replies.constructor === Array && (

//                       <QuillEdior
//                       leadId={leadId}
//                       updateId={editor._id}
//                       indicatorText="reply"
//                       customerId=""
//                       orderId=""

//                       technicalId={""} setIsOpenReplyModel={function (value: React.SetStateAction<boolean>): void {
//                         throw new Error("Function not implemented.");
//                       } }                      />
//                     )}

//                   {/* reply Data list */}
//                   {editor?.replies ? (
//                     <div>
//                       {[...(editor?.replies || [])]
//                          .reverse().map((data: any) => (
//                         // console.log("dataaaaaa", data);

//                         <>
//                           {isOpenReplyModel && reaplyId === data._id &&(
//                               <QuillEdior
//                                 leadId={leadId}
//                                 updateId={editor._id}
//                                 indicatorText="reply"
//                                 customerId={""}
//                                 setIsOpenReplyModel={setIsOpenReplyModel}
//                                 orderId={""}
//                                 technicalId={""}
//                               />
//                             )}
//                           <div className="flex justify-end mr-20">
//                             <DeleteDialoge
//                               id={data._id}
//                               entity="updates/replies"
//                               setIsModalOpen={setIsModalOpen}
//                               fetchAllFunction={() =>
//                                 fetchLeadsEditorData(leadId)
//                               }
//                             />
//                           </div>
//                           <section
//                             className="text-gray-600 body-font overflow-hidden  my-2 rounded "
//                             key={data?._id}
//                           >

//                             <div className="container px-5 py-2 mx-auto bg-gray-100 border rounded w-[90%]">
//                               <div className="flex flex-wrap -m-12">
//                                 <div className="p-12 md:w-full flex flex-col items-start">
//                                   <div className="flex items-center justify-between w-full border-b-2 border-gray-100">
//                                     <div className="inline-flex items-center pb-2 mt-2">
//                                       <Avatar className="cursor-pointer">
//                                         <AvatarImage
//                                           src={data?.createdBy?.avatar}
//                                           className="h-12"
//                                           alt="companyLogo"
//                                         />
//                                         <AvatarFallback>
//                                           <img
//                                             src={companyLogo}
//                                             className="h-12"
//                                             alt="companyLogo"
//                                           />
//                                         </AvatarFallback>
//                                       </Avatar>
//                                       <span className="flex-grow flex flex-col pl-4">
//                                         <span className="title-font font-medium text-gray-900 text-[0.8rem]">
//                                           {data?.createdBy?.fullName
//                                             ? data?.createdBy?.fullName
//                                             : ""}
//                                         </span>
//                                       </span>
//                                     </div>
//                                   </div>

//                                   <p className="leading-relaxed mb-1 text-[0.8rem] mt-2">
//                                     <div
//                                       className="leading-relaxed mb-1 text-[0.8rem] mt-2"
//                                       dangerouslySetInnerHTML={{
//                                         __html: data.content
//                                           ? data.content
//                                           : "",
//                                       }}
//                                     />
//                                   </p>
//                                   <div className="flex gap-4">
//                                     {data?.files &&
//                                       data?.files?.map(
//                                         (file: any, index: number) => {
//                                           // Extract file extension
//                                           let fileExtension = "";
//                                           if (file) {
//                                             const fileNameParts =
//                                               file.split(".");
//                                             if (fileNameParts.length > 1) {
//                                               fileExtension =
//                                                 fileNameParts
//                                                   .pop()
//                                                   ?.toLowerCase() || "";
//                                             }
//                                           }

//                                           // Determine the type of the file based on fileExtension
//                                           let fileType = "unknown"; // default to unknown

//                                           switch (fileExtension) {
//                                             case "pdf":
//                                               fileType = "pdf";
//                                               break;
//                                             case "jpg":
//                                             case "jpeg":
//                                             case "png":
//                                               fileType = "image";
//                                               break;
//                                             case "xlsx":
//                                               fileType = "xlsx";
//                                               break;
//                                             case "mp4":
//                                               fileType = "video";
//                                               break;
//                                             case "docx":
//                                               fileType = "word";
//                                               break;
//                                             default:
//                                               fileType = "unknown";
//                                               break;
//                                           }

//                                           // Prepare the content based on fileType
//                                           let content;
//                                           if (fileType === "pdf") {
//                                             content = (
//                                               <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded">
//                                                 <a href={file} target="_blank">
//                                                   <img
//                                                     src={PDFPic}
//                                                     alt=""
//                                                     className="h-[100px] w-[100px] object-cover rounded"
//                                                   />
//                                                 </a>
//                                               </div>
//                                             );
//                                           } else if (fileType === "image") {
//                                             content = (
//                                               <img
//                                                 key={index}
//                                                 src={file}
//                                                 alt=""
//                                                 className="h-[100px] w-[100px] object-cover rounded"
//                                               />
//                                             );
//                                           } else if (fileType === "word") {
//                                             content = (
//                                               <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded">
//                                                 <a href={file} target="_blank">
//                                                   <img
//                                                     src={WORDPic}
//                                                     alt=""
//                                                     className="h-[100px] w-[100px] object-cover rounded"
//                                                   />
//                                                 </a>
//                                               </div>
//                                             );
//                                           } else if (fileType === "xlsx") {
//                                             content = (
//                                               <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded">
//                                                 <a href={file} target="_blank">
//                                                   <img
//                                                     src={XLSXPic}
//                                                     alt=""
//                                                     className="h-[100px] w-[100px] object-cover rounded"
//                                                   />
//                                                 </a>
//                                               </div>
//                                             );
//                                           } else if (fileType === "video") {
//                                             content = (
//                                               <video
//                                                 src={file}
//                                                 width={200}
//                                                 controls
//                                               ></video>
//                                             );
//                                           } else {
//                                             // Handle unknown file types or default case
//                                             content = (
//                                               <div className="flex items-center justify-center h-[100px] w-[100px] bg-gray-200 rounded">
//                                                 <span className="text-gray-600 text-lg">
//                                                   Unknown
//                                                 </span>
//                                               </div>
//                                             );
//                                           }

//                                           return (
//                                             <div
//                                               key={index}
//                                               className="relative"
//                                             >
//                                               {content}
//                                             </div>
//                                           );
//                                         }
//                                       )}
//                                   </div>
//                                   <div className="flex items-center justify-between flex-wrap  mt-2 w-full  ">
//                                     <div className="flex justify-between gap-2">
//                                       <div
//                                         className="text-[0.8rem] border-r-2 pr-2 border-gray-200 flex gap-2 mt-1 items-center cursor-pointer"
//                                         onClick={() => likeClick(data?._id)}
//                                       >
//                                         <span
//                                           className={`${
//                                             data.likes.some(
//                                               (like: any) => like._id === userId
//                                             )
//                                               ? "text-[#3a5894] font-bold"
//                                               : ""
//                                           }`}
//                                         >
//                                           Like
//                                         </span>
//                                         {data.likes.some(
//                                           (like: any) => like._id === userId
//                                         ) ? (
//                                           <LikeDarkUIconSVG />
//                                         ) : (
//                                           <LikeUIconSVG />
//                                         )}
//                                       </div>
//                                       <div className="text-[0.8rem] border-r-2 pr-2 border-gray-200 flex gap-2 mt-1 items-center cursor-pointer">
//                                         <span className="font-bold">
//                                           {data?.likes
//                                             ? data?.likes?.length
//                                             : "0"}
//                                         </span>
//                                         Likes
//                                       </div>
//                                       <div
//                                         className="text-[0.8rem]  border-r-2 pr-2 border-gray-200 flex gap-2 mt-1 items-center cursor-pointer"
//                                         onClick={() => ReplyClick(data._id)}
//                                       >
//                                         <span
//                                           // className={`${
//                                           //   reply ? "text-[#3a5894] font-bold" : ""
//                                           // }`}
//                                         >
//                                           Reply
//                                         </span>
//                                         <ReplyUIconSVG />
//                                       </div>

//                                       <div className="text-[0.8rem] flex gap-2 mt-1 items-center cursor-pointer">
//                                         <div className="pr-2 text-[0.9rem]">
//                                           {formatDate(
//                                             data?.createdAt
//                                               ? data?.createdAt
//                                               : new Date()
//                                           )}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </section>
//                         </>
//                       ))}
//                     </div>
//                   ) : (
//                     "No Comment added"
//                   )}
//                 </>
//               )}
//             </section>
//           </>
//         ))}
//                         </ScrollArea>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//                 <TabsContent value="files">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Files</CardTitle>
//                     </CardHeader>
//                     <CardContent
//                       className="space-y-2"
//                       style={{ minHeight: "428px" }}
//                     >
//                       <ul className="space-y-2">
//                         <CardTitle>Uploads</CardTitle>
//                         <li>Abc.pdf</li>
//                         <li>Xyz.xls</li>
//                         <li>Pqr.pdf</li>
//                       </ul>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//                 {/* <TabsContent value="activityLog">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Activity Log</CardTitle>
//                     </CardHeader>

//                     <CardContent style={{ minHeight: "428px" }}>
//                       <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b">
//                         <Label htmlFor="name" className="text-right font-bold">
//                           9M
//                         </Label>
//                         <p className="mx-10">Pro-Fit-Window Systems</p>
//                         <p className="mx-3">Rep Name</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent> */}
//                 <TabsContent value="invoices">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Invoices</CardTitle>
//                     </CardHeader>
//                     <CardContent
//                       className="space-y-2"
//                       style={{ minHeight: "428px" }}
//                     >
//                       {/* <div className="">
//                                 {Array.isArray(customerDetails?.vatInvoice)
//                                   ? customerDetails?.vatInvoice?.map((item) => {
//                                       console.log("dadda", item);
//                                       return (
//                                         <a
//                                           className="bg-gray-50 p-3 hover:bg-slate-100 rounded"
//                                           href={item ? item : ""}
//                                           target="_blank"
//                                         >
//                                           {item ? "Show Invoice" : ""}
//                                         </a>
//                                       );
//                                     })
//                                   : "No Data Found"}
//                               </div> */}
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//               </Tabs>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Hello;

// // {Array.isArray(leadsEditorData) &&
// //   leadId &&
// //   leadsEditorData.map((editor: any) => (
// //     <>
// //       {editor.isPinned === true && (
// //         <div className="flex justify-end">
// //           <p className="bg-orange-400 w-20 text-white flex pr-2">
// //             <DrawingPinIcon />
// //             Pinned
// //           </p>
// //         </div>
// //       )}

// //       <section
// //         className="text-gray-600 body-font overflow-hidden border my-2 rounded"
// //         key={editor?._id}

// //       >
// //         <div className="container px-5 py-2 mx-auto">
// //           <div className="flex flex-wrap -m-12">
// //             <div className="p-12 md:w-full flex flex-col items-start">
// //               <div className="flex items-center justify-between w-full border-b-2 border-gray-100">
// //                 <div className="inline-flex items-center pb-2 mt-2">
// //                   <Avatar className="cursor-pointer">
// //                     <AvatarImage
// //                       src={editor?.createdBy?.avatar}
// //                       className="h-12"
// //                       alt="companyLogo"
// //                     />
// //                     <AvatarFallback>
// //                       <img
// //                         // src={companyLogo}
// //                         className="h-12"
// //                         alt="companyLogo"
// //                       />
// //                     </AvatarFallback>
// //                   </Avatar>
// //                   <span className="flex-grow flex flex-col pl-4">
// //                     <span className="title-font font-medium text-gray-900 text-[0.8rem]">
// //                       {editor?.createdBy?.fullName
// //                         ? editor?.createdBy?.fullName
// //                         : ""}
// //                     </span>
// //                   </span>
// //                 </div>
// //                 <div className="pr-1 text-[0.9rem] flex justify-between items-center">
// //                   {/* {formatDate(
// //                   editor?.createdAt
// //                     ? editor?.createdAt
// //                     : new Date()
// //                 )} */}
// //                   <div className="pr-1text-[0.9rem]">
// //                     {/* <DeleteDialoge
// //                       className="mr-2 h-4 w-4"
// //                       id={editor._id}
// //                       entity="updates"
// //                       fetchAllFunction={() =>
// //                         fetchOrderEditorData(orderId)
// //                       }
// //                     /> */}

// //                     {/* <DropdownMenu>
// //                     <DropdownMenuTrigger asChild>

// //                       <DotsHorizontalIcon

// //                       />

// //                     </DropdownMenuTrigger>
// //                     <DropdownMenuContent className="w-37">
// //                       <DropdownMenuGroup>
// //                         <DropdownMenuItem >
// //                           <DeleteDialoge
// //                             className="mr-2 h-4 w-4"
// //                             id={editor._id}
// //                             entity="updates"

// //                             fetchAllFunction={() =>
// //                               fetchOrderEditorData(
// //                                 orderId
// //                               )
// //                             }
// //                           />
// //                           <span>Delete Updates</span>
// //                         </DropdownMenuItem>

// //                       </DropdownMenuGroup>
// //                     </DropdownMenuContent>
// //                   </DropdownMenu> */}
// //                   </div>
// //                   <div
// //                     onClick={() =>
// //                       handleOpenModal(editor._id)
// //                     }
// //                     className="cursor-pointer"
// //                   >
// //                     <DotsHorizontalIcon />
// //                   </div>
// //                   {isModalOpen && selectedEditorId === editor._id && (
// // <div className="fixed inset-0 flex items-start justify-end z-50 bg-black/50">
// // <div className="bg-white w-56 border border-gray-300 shadow-lg p-4 mt-20">
// // <div
// // className="cursor-pointer flex justify-end"
// // onClick={handleCloseModal}
// // >
// // <Cross1Icon className="h-5 w-5 text-gray-700" />
// // </div>
// // <div className="flex items-center py-2">
// // <DeleteDialoge
// // id={editor._id}
// // entity="updates"
// // setIsModalOpen={setIsModalOpen}
// // fetchAllFunction={() => fetchOrderEditorData(orderId)}
// // />
// // <span className="ml-2 text-gray-700">Delete Update</span>
// // </div>
// // <div className="flex items-center py-2">
// // {editor.isPinned ? (
// // <div
// // onClick={() => handlePinFalse(editor._id)}
// // className="cursor-pointer flex items-center"
// // >
// // <DrawingPinIcon className="h-5 w-5 text-gray-700 mr-1" />
// // <span className="text-gray-700">Unpin</span>
// // </div>
// // ) : (
// // <div
// // onClick={() => handlePinTrue(editor._id)}
// // className="cursor-pointer flex items-center"
// // >
// // <DrawingPinIcon className="h-5 w-5 text-gray-700 mr-1" />
// // <span className="text-gray-700">Pin</span>
// // </div>
// // )}
// // </div>
// // <div
// // className="flex items-center py-2 cursor-pointer"
// // onClick={() => handleEdit(editor._id)}
// // >
// // <Pencil2Icon className="h-5 w-5 text-gray-700 mr-1" />
// // <span className="text-gray-700">Edit</span>
// // </div>
// // </div>
// // </div>
// // )}

// //                 </div>
// //               </div>
// // {/*
// //               {editingId === editor._id ? (
// //                 <div>
// //                   <input
// //                     className="border rounded mt-2 p-2 w-full"
// //                     value={editContent}
// //                     onChange={(e) =>
// //                       setEditContent(e.target.value)
// //                     }
// //                   />
// //                   <button
// //                     className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
// //                     onClick={() =>
// //                       handleSave(editor._id)
// //                     }
// //                   >
// //                     Save
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <div>
// //                   <p className="leading-relaxed mb-1 text-[0.8rem] mt-2">
// //                     {stripHtmlTags(
// //                       editor?.content
// //                         ? editor.content
// //                         : ""
// //                     )}
// //                   </p>

// //                 </div>
// //               )} */}
// //               <div className="flex items-center justify-between flex-wrap  mt-2 w-full  border-t-2 border-gray-100">
// //                 <div className="flex justify-between gap-2">
// //                   <div
// //                     className="text-[0.8rem] border-r-2 pr-2 border-gray-200 flex gap-2 mt-1 items-center cursor-pointer"
// //                     onClick={likeClick}
// //                   >
// //                     <span
// //                       className={`${
// //                         like
// //                           ? "text-blue-950 font-bold"
// //                           : ""
// //                       }`}
// //                     >
// //                       Like
// //                     </span>
// //                     <LikeUIconSVG />
// //                   </div>
// //                   <div
// //                     className="text-[0.8rem] flex gap-2 mt-1 items-center cursor-pointer"
// //                     onClick={ReplyClick}
// //                   >
// //                     <span
// //                       className={`${
// //                         reply
// //                           ? "text-blue-950 font-bold"
// //                           : ""
// //                       }`}
// //                     >
// //                       Reply
// //                     </span>
// //                     <ReplyUIconSVG />
// //                   </div>
// //                 </div>
// //                 <div className="mt-2 cursor-pointer">
// //                   <span className="text-gray-400 mr-3 inline-flex items-center ml-auto leading-none text-[0.8rem] pr-3 py-1 border-r-2 border-gray-200 text-[0.7rem]">
// //                     <ViewsUIconSVG />
// //                     1.2K
// //                   </span>
// //                   <span
// //                     className="text-gray-400 inline-flex items-center leading-none text-[0.8rem] text-[0.7rem]"
// //                     onClick={showComments}
// //                   >
// //                     <CommentsUIconSVG />6
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>
// //     </>
// //   ))}
// // {Array.isArray(orderEditorData) &&
// //   orderId &&
// //   orderEditorData.map((editor: any) => (
// //     <>
// //       {editor.isPinned === true && (
// //         <div className="flex justify-end">
// //           <p className="bg-orange-400 w-20 text-white flex pr-2">
// //             <DrawingPinIcon />
// //             Pinned
// //           </p>
// //         </div>
// //       )}

// //       <section
// //         className="text-gray-600 body-font overflow-hidden border my-2 rounded"
// //         key={editor?._id}
// //       >
// //         <div className="container px-5 py-2 mx-auto">
// //           <div className="flex flex-wrap -m-12">
// //             <div className="p-12 md:w-full flex flex-col items-start">
// //               <div className="flex items-center justify-between w-full border-b-2 border-gray-100">
// //                 <div className="inline-flex items-center pb-2 mt-2">
// //                   <Avatar className="cursor-pointer">
// //                     <AvatarImage
// //                       src={editor?.createdBy?.avatar}
// //                       className="h-12"
// //                       alt="companyLogo"
// //                     />
// //                     <AvatarFallback>
// //                       <img
// //                         // src={companyLogo}
// //                         className="h-12"
// //                         alt="companyLogo"
// //                       />
// //                     </AvatarFallback>
// //                   </Avatar>
// //                   <span className="flex-grow flex flex-col pl-4">
// //                     <span className="title-font font-medium text-gray-900 text-[0.8rem]">
// //                       {editor?.createdBy?.fullName
// //                         ? editor?.createdBy?.fullName
// //                         : ""}
// //                     </span>
// //                   </span>
// //                 </div>
// //                 <div className="pr-1 text-[0.9rem] flex justify-between items-center">
// //                   {/* {formatDate(
// //                   editor?.createdAt
// //                     ? editor?.createdAt
// //                     : new Date()
// //                 )} */}
// //                   <div className="pr-1text-[0.9rem]">
// //                     {/* <DeleteDialoge
// //                       className="mr-2 h-4 w-4"
// //                       id={editor._id}
// //                       entity="updates"
// //                       fetchAllFunction={() =>
// //                         fetchOrderEditorData(orderId)
// //                       }
// //                     /> */}

// //                     {/* <DropdownMenu>
// //                     <DropdownMenuTrigger asChild>

// //                       <DotsHorizontalIcon

// //                       />

// //                     </DropdownMenuTrigger>
// //                     <DropdownMenuContent className="w-37">
// //                       <DropdownMenuGroup>
// //                         <DropdownMenuItem >
// //                           <DeleteDialoge
// //                             className="mr-2 h-4 w-4"
// //                             id={editor._id}
// //                             entity="updates"

// //                             fetchAllFunction={() =>
// //                               fetchOrderEditorData(
// //                                 orderId
// //                               )
// //                             }
// //                           />
// //                           <span>Delete Updates</span>
// //                         </DropdownMenuItem>

// //                       </DropdownMenuGroup>
// //                     </DropdownMenuContent>
// //                   </DropdownMenu> */}
// //                   </div>
// //                   <div
// //                     onClick={() =>
// //                       handleOpenModal(editor._id)
// //                     }
// //                     className="cursor-pointer"
// //                   >
// //                     <DotsHorizontalIcon />
// //                   </div>
// //                   {isModalOpen &&
// //                     selectedEditorId === editor._id && (
// //                       <>
// //                         <div className="fixed right-3  bg-white w-56 z-50 border border-gray-300 shadow-lg p-4 top-[260px]">
// //                           <div
// //                             className="cursor-pointer flex justify-end"
// //                             onClick={handleCloseModal}
// //                           >
// //                             <Cross1Icon />
// //                           </div>
// //                           <div className="flex items-center py-2">
// //                             <DeleteDialoge
// //                               //  className="h-5 w-5 text-gray-700"
// //                               id={editor._id}
// //                               entity="updates"
// //                               setIsModalOpen={
// //                                 setIsModalOpen
// //                               }
// //                               fetchAllFunction={() =>
// //                                 fetchOrderEditorData(
// //                                   orderId
// //                                 )
// //                               }
// //                             />
// //                             <span className="ml-2 text-gray-700">
// //                               Delete Update
// //                             </span>
// //                           </div>
// //                           <div className="flex items-center py-2">
// //                             {editor.isPinned ? (
// //                               <div
// //                                 onClick={() =>
// //                                   handlePinFalse(
// //                                     editor._id
// //                                   )
// //                                 }
// //                                 className="cursor-pointer flex items-center"
// //                               >
// //                                 <DrawingPinIcon className="h-5 w-5 text-gray-700 mr-1" />
// //                                 <span className="text-gray-700">
// //                                   Pinned
// //                                 </span>
// //                               </div>
// //                             ) : (
// //                               <div
// //                                 onClick={() =>
// //                                   handlePinTrue(
// //                                     editor._id
// //                                   )
// //                                 }
// //                                 className="cursor-pointer flex items-center"
// //                               >
// //                                 <DrawingPinIcon className="h-5 w-5 text-gray-700 mr-1" />
// //                                 <span className="text-gray-700">
// //                                   Pinned
// //                                 </span>
// //                               </div>
// //                             )}
// //                           </div>
// //                           <div
// //                             className="flex items-center py-2 cursor-pointer"
// //                             onClick={() =>
// //                               handleEdit(editor._id)
// //                             }
// //                           >
// //                             <Pencil2Icon className="h-5 w-5 text-gray-700 mr-1" />
// //                             <span className="text-gray-700">
// //                               Edit
// //                             </span>
// //                           </div>
// //                         </div>

// //                         {/* <div className="fixed right-3 top-10 bg-[#fff] w-56 z-50  border border-inherit">
// //                           <div
// //                             className="cursor-pointer"
// //                             onClick={handleCloseModal}
// //                           >
// //                             X
// //                           </div>
// //                           <div>
// //                             {" "}
// //                             <DeleteDialoge
// //                               className="mr-2 h-4 w-4"
// //                               id={editor._id}
// //                               entity="updates"
// //                               setIsModalOpen={
// //                                 setIsModalOpen
// //                               }
// //                               fetchAllFunction={() =>
// //                                 fetchOrderEditorData(
// //                                   orderId
// //                                 )
// //                               }
// //                             />
// //                             Delte Update
// //                           </div>
// //                           <div className="pr-1">
// //                             {editor.isPinned ===
// //                             true ? (
// //                               <div>
// //                                 <DrawingPinIcon
// //                                   onClick={() =>
// //                                     handlePinFalse(
// //                                       editor._id
// //                                     )
// //                                   }
// //                                 />
// //                               </div>
// //                             ) : (
// //                               <div>
// //                                 <DrawingPinIcon
// //                                   onClick={() =>
// //                                     handlePinTrue(
// //                                       editor._id
// //                                     )
// //                                   }
// //                                 />
// //                                 Pinned
// //                               </div>
// //                             )}
// //                           </div>
// //                           <div  className="pr-1 mr-2 h-4 w-4"
// //                             onClick={() =>
// //                               handleEdit(editor._id)
// //                             }
// //                           >     Edit <Pencil2Icon />

// //                           </div>
// //                         </div> */}
// //                       </>
// //                     )}
// //                 </div>
// //               </div>

// //               {editingId === editor._id ? (
// //                 <div>
// //                   <input
// //                     className="border rounded mt-2 p-2 w-full"
// //                     value={editContent}
// //                     onChange={(e) =>
// //                       setEditContent(e.target.value)
// //                     }
// //                   />
// //                   <button
// //                     className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
// //                     onClick={() =>
// //                       handleSave(editor._id)
// //                     }
// //                   >
// //                     Save
// //                   </button>
// //                 </div>
// //               ) : (
// //                 <div>
// //                   <p className="leading-relaxed mb-1 text-[0.8rem] mt-2">
// //                     {stripHtmlTags(
// //                       editor?.content
// //                         ? editor.content
// //                         : ""
// //                     )}
// //                   </p>

// //                   {/* Additional UI elements like Like, Reply, Views, Comments */}
// //                 </div>
// //               )}
// //               <div className="flex items-center justify-between flex-wrap  mt-2 w-full  border-t-2 border-gray-100">
// //                 <div className="flex justify-between gap-2">
// //                   <div
// //                     className="text-[0.8rem] border-r-2 pr-2 border-gray-200 flex gap-2 mt-1 items-center cursor-pointer"
// //                     onClick={likeClick}
// //                   >
// //                     <span
// //                       className={`${
// //                         like
// //                           ? "text-blue-950 font-bold"
// //                           : ""
// //                       }`}
// //                     >
// //                       Like
// //                     </span>
// //                     <LikeUIconSVG />
// //                   </div>
// //                   <div
// //                     className="text-[0.8rem] flex gap-2 mt-1 items-center cursor-pointer"
// //                     onClick={ReplyClick}
// //                   >
// //                     <span
// //                       className={`${
// //                         reply
// //                           ? "text-blue-950 font-bold"
// //                           : ""
// //                       }`}
// //                     >
// //                       Reply
// //                     </span>
// //                     <ReplyUIconSVG />
// //                   </div>
// //                 </div>
// //                 <div className="mt-2 cursor-pointer">
// //                   <span className="text-gray-400 mr-3 inline-flex items-center ml-auto leading-none text-[0.8rem] pr-3 py-1 border-r-2 border-gray-200 text-[0.7rem]">
// //                     <ViewsUIconSVG />
// //                     1.2K
// //                   </span>
// //                   <span
// //                     className="text-gray-400 inline-flex items-center leading-none text-[0.8rem] text-[0.7rem]"
// //                     onClick={showComments}
// //                   >
// //                     <CommentsUIconSVG />6
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>
// //     </>
// //   ))}
