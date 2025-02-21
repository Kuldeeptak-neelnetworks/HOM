"use client";
import BreadcrumbSection from "@/components/common/BreadcrumbSection";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  baseInstance,
  errorToastingFunction,
  formatDate,
  successToastingFunction,
} from "@/common/commonFunctions";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
// import QuillEdior from "./QuillEditor";
import QuillEdior from "../../common/Editor/QuillEditor";
import { useEditorStore } from "@/Store/EditorStore";
import UpdateSection from "./UpdateSection";
import UpdateFilesSection from "../../common/Editor/UpdateFilesSection";
import { AddFilesDarkUIconSVG, EditCustomerIconSVG } from "@/utils/SVGs/SVGs";
import { Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import TooltipCommon from "@/components/common/TooltipCommon";
import PDF from "../../../asset/images/pdf.png";
import OrderDetailsInCustomer from "./OrderDetailsInCustomer";
import ActivitySection from "./ActivitySection";
import { Loader } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import XLSX from "../../../asset/images/xlsx.png";
import VIDEO from "../../../asset/images/video.png";
import WORD from "../../../asset/images/word.png";
import Logo from "../../../asset/images/companydummylog.png";
import User from "../../../asset/images/user.png";
import ReportFileSection from "@/components/common/Editor/ReportFileSection";
const UserLogo = User.src;
const PDFPic = PDF.src;

let userDataString: any =
  typeof window !== "undefined" ? localStorage?.getItem("user") : null;
const userData2 = JSON.parse(userDataString);
const userId = userData2?._id;

const crumbs = [
  {
    id: 1,
    title: "Home",
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Customers",
    link: "/customers",
  },
  {
    id: 3,
    title: "Customer Details",
    link: "",
  },
];

interface Order {
  _id: string;
  createdBy: {
    _id: string;
    email: string;
  };
  customer: {
    _id: string;
  };
  dateOfOrder: string;
  orderType: string;
  renewalStatus: string;
  orderValue: number;
  deposit: number;
  numberOfInstallments: number;
  DdMonthly: number;
  dateOfFirstDd: string;
  depositMethod: string;
  customerAccountName: string;
  customerAccountNumber: string;
  customerSortCode: string;
  googleEmailRenewCampaign: string;
  customerSignature: string;
}

interface OrdersDetailsType {
  orders: Order[];
}
interface CustomerDetailType {
  id: number;
  contactName: string;
  companyName: string;
  customerEmail: string;
  mobileNo: string;
  landlineNo: string;
  customerNo: string;
  gaCode: string;
  htAccess: string;
  liveDate: string;
  newGACode: string;
  ordersRenewals: string;
  postcode: string;
  sitemap: string;
  ssl: string;
  status: string;
  streetNoName: string;
  town: string;
  url: string;
  county: string;
  logo: string;
  vatInvoice: string;
}
interface updateFileDetailType {
  id: number;
  createdAt: string;
  fileUrl: string;
  itemId: string;
  itemType: string;
  source: string;
}
export interface ActivityDetailsType {
  _id: number;
  activityType: string;
  createdAt: string;
  createdBy: {};
  customerId: {};
  description: string;
  relatedEntity: string;
  relatedEntityId: any;
}

const CustomerDetailsContent = ({ handleUpdate }: any) => {
  const [textTab, setTextTab] = useState("activity");
  const { customerId } = useParams();
  const {
    fetchEditorData,
    fetchacData,
    editorData,
    acData,
    loading,
    fetchCutomerFileData,
    customerFileData,
    fetchFileData,
    fileData,
  }: any = useEditorStore();
  const [customerDetails, setCustomerDetails] =
    React.useState<CustomerDetailType | null>(null);

  const [activityDetails, setActivityDetails] =
    React.useState<ActivityDetailsType | null>(null);

  const [orderDetails, setOrderDetails] =
    React.useState<OrdersDetailsType | null>(null);
  const [updateFileDetails, setUpdateFileDetails] =
    React.useState<updateFileDetailType | null>(null);
  const [like, setLike] = React.useState(false);
  const [reply, setReply] = React.useState(false);
  const [comments, setComments] = React.useState(false);
  const [commentID, setCommentID] = React.useState("");

  const getCustomerDetails = async () => {
    try {
      const result = await baseInstance.get(`/customers/${customerId}`);
      if (result.status === 200) {
        setCustomerDetails(result?.data?.data?.customer as CustomerDetailType);
        setOrderDetails(result?.data?.data?.orders as OrdersDetailsType);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
      }
    }
  };
  const getActivities = async () => {
    try {
      const result = await baseInstance.get(`activitylogs/${customerId}`);
      if (result.status === 200) {
        setActivityDetails(result?.data?.data as ActivityDetailsType);
        fetchacData(customerId);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
      }
    }
  };
  const getUpdateFiles = async () => {
    try {
      const result = await baseInstance.get(`/files/customer/${customerId}`);
      if (result.status === 200) {
        setUpdateFileDetails(result?.data?.data?.files as updateFileDetailType);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
      }
    }
  };
  function getCustomerData(data: any) {
    if (data === "" || data === null) {
      return "-";
    }
    if (!data || typeof data === "undefined") {
      return "Loading...";
    }

    return data;
  }
  const addLikesData = async (likeId: string) => {
    try {
      // setIsLoading(true);

      const response = await baseInstance.post(
        `/updates/toggle/${likeId}/like`
      );
      if (response?.status === 200) {
        fetchEditorData(customerId);
        // handleClear();
        // successToastingFunction(response?.data?.message);
        // fetchEditorData(customerId);
        // setImages([]);
        // getAllInvoice();
      }
    } catch (error) {
      errorToastingFunction(error);
    } finally {
      // setIsLoading(() => false);
    }
  };
  const addViewsData = async (updateId: string) => {
    try {
      // setIsLoading(true);
      const response = await baseInstance.patch(
        `/updates/log/${updateId}/view`
      );
      if (response.status === 200) {
        fetchEditorData(customerId);
        // handleClear();
        // successToastingFunction(response?.data?.message);
        // fetchEditorData(customerId);
        // setImages([]);
        // getAllInvoice();
      }
    } catch (error) {
      errorToastingFunction(error);
    } finally {
      // setIsLoading(() => false);
    }
  };

  useEffect(() => {
    getCustomerDetails();
    getActivities();
    getUpdateFiles();
    fetchacData(customerId);
    fetchFileData(customerId);
    fetchCutomerFileData(customerId);
    fetchEditorData(customerId);
  }, []);

  // Like Function
  const likeClick = (likeId: string) => {
    if (likeId) addLikesData(likeId);
    setLike((prev) => !prev);
  };
  // Reply Function
  const ReplyClick = (replyId: string) => {
    setReply((prev) => !prev);
  };
  // coments Function
  const showComments = (commentId: string) => {
    if (commentId) {
      // setComments((prev) => !prev);
      setComments(!comments);
      setCommentID(commentId);
    }
  };
  const [value, setValue] = useState<string>("");
  const [images, setImages] = useState<File[]>([]); // To store the files
  const [isLoading, setIsLoading] = useState<boolean>(false); // To show loading state

  const handleFileUpload = async (files: FileList | null) => {
    if (files) {
      const fileList = Array.from(files);

      // Loop through each file and upload
      for (const file of fileList) {
        const formData = new FormData();
        formData.append("files", file); // Directly append the file (binary)

        try {
          // Upload the file directly as binary data to the backend
          const response = await baseInstance.post("/users/upload", formData);

          // Handle the response from the API
          if (response.status === 200) {
            // If the API successfully handled the file, store it in the state (if needed)
            setImages((prevImages) => [...prevImages, file]); // Store the file object, not the URL
          } else {
            errorToastingFunction("File upload failed.");
          }
        } catch (error) {
          errorToastingFunction("File upload failed.");
        }
      }
    }
  };

  // Open file dialog and handle file selection
  const imageHandler = () => {
    const inputImage = document.createElement("input");
    inputImage.setAttribute("type", "file");
    inputImage.setAttribute(
      "accept",
      "image/*, video/*, .pdf, .xlsx, .doc, .docx"
    );
    inputImage.setAttribute("multiple", "true");
    inputImage.click();

    inputImage.onchange = () => {
      handleFileUpload(inputImage.files); // Handle file upload on file selection
    };
  };
  const handleClear = () => {
    setValue("");
    setImages([]);
  };

  // Handle form submission
  const handleAddData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Only submit if there is text or images
    if (images.length > 0) {
      try {
        setIsLoading(true);
        const formData = new FormData();

        // Append the selected images (files) to the FormData
        images.forEach((image) => formData.append("files", image));

        if (customerId) {
          // Send the files directly (as binary) to the backend without URL conversion
          const response = await baseInstance.post(
            `/files/customer/${customerId}/gallery?flag=ReportFile`,
            formData
          );

          if (response.status === 201) {
            successToastingFunction(response?.data?.message);
            fetchCutomerFileData(customerId);
            handleClear();
          }
        }
      } catch (error) {
        errorToastingFunction(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      errorToastingFunction("Please enter text or upload an image to submit.");
    }
  };
  const PDFPic = PDF.src;
  const XLSXPic = XLSX.src;
  const VIDEOPic = VIDEO.src;
  const WORDPic = WORD.src;
  const companyLogo = Logo.src;
  const getFilenameFromURL = (url: string) => {
    // Splitting the URL by '/' and getting the last part
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename;
  };
  return (
    <div className="px-4 py-0 relative text-[0.8rem] bg-[#f2f6fa]">
      {/* <div className="text-xl font-semibold absolute top-[-50px]">
        Customer Details
      </div> */}
      <div className="text-[1rem] font-semibold absolute top-[-35px] ml-1">
        {getCustomerData(customerDetails?.customerNo)}
        {" - "}
        {getCustomerData(customerDetails?.companyName)}
      </div>

      {/* <div className="mb-4">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}
      {/* Main Customer details section  */}
      <div className="lg:flex gap-1  justify-start">
        <div className="w-full lg:w-[50%] mb-3 lg:mb-0 ">
          <Card className="h-[230px]">
            <CardContent className="p-0">
              <div className="flex justify-end pr-4 pt-2">
                <TooltipCommon text="Edit Customer">
                  <Link href={`/customers/editCustomerDetails/${customerId}`}>
                    <Pencil2Icon className="text-gray-400 hover:text-gray-700 cursor-pointer" />
                  </Link>
                </TooltipCommon>
              </div>

              <div className="text-left overflow-auto">
                <div className="flex gap-3 text-nowrap p-2 justify-evenly">
                  <div className="px-2">
                    {/* Company Name  */}
                    {/* <div className="flex items-center justify-start pb-[10px] mb-[10px]  border-b-[#ddd] border-b ">
                      <Label htmlFor="name" className="text-right font-bold">
                        Company Name :
                      </Label>
                      <p className="mx-2">
                        {getCustomerData(customerDetails?.companyName)}
                      </p>
                    </div> */}
                    {/* Contact Name  */}
                    <div className="flex items-center justify-start pb-[10px] mb-[10px]  border-b-[#ddd] border-b ">
                      <Label htmlFor="name" className="text-right font-bold">
                        Contact Name :
                      </Label>
                      <p className="mx-2">
                        {getCustomerData(customerDetails?.contactName)}
                      </p>
                    </div>
                    {/* Mobile No.  */}
                    <div className="flex items-center justify-start pb-[10px] mb-[10px]  border-b-[#ddd] border-b ">
                      <Label
                        htmlFor="username"
                        className="text-right font-bold"
                      >
                        Mobile No :
                      </Label>
                      <p className="mx-2">
                        {getCustomerData(customerDetails?.mobileNo)}
                      </p>
                    </div>
                    {/* streetNoName*/}
                    <div className="flex items-center justify-start pb-[10px] mb-[10px]  border-b-[#ddd] border-b ">
                      <Label htmlFor="name" className="text-right font-bold">
                        Street No. and Name :
                      </Label>
                      <p className="mx-2">
                        {getCustomerData(customerDetails?.streetNoName)}
                      </p>
                    </div>
                    {/* County*/}
                    <div className="flex items-center justify-start pb-[10px] mb-[10px]  border-b-[#ddd] border-b ">
                      <Label htmlFor="name" className="text-right font-bold">
                        County :
                      </Label>
                      <p
                        className="mx-2 w-[200px] overflow-auto"
                        style={{ textWrap: "nowrap" }}
                      >
                        {getCustomerData(customerDetails?.county)}
                      </p>
                    </div>
                    {/* URL*/}
                    <div className="flex items-center justify-start pb-[1px] border-b-[#ddd]">
                      <Label htmlFor="name" className="text-right font-bold">
                        URL :
                      </Label>
                      <p className="mx-2 text-blue-600">
                        <a
                          href={getCustomerData(customerDetails?.url)}
                          className="hover:text-blue-600 hover:underline"
                          target="_blank"
                        >
                          {getCustomerData(customerDetails?.url)}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="px-2">
                    {/* Customer No  */}
                    {/* <div className="flex items-center justify-start pb-[10px] mb-[10px]  border-b-[#ddd] border-b ">
                      <Label htmlFor="name" className="text-right font-bold">
                        Customer No :
                      </Label>
                      <p className="mx-2 ">
                        {getCustomerData(customerDetails?.customerNo)}
                      </p>
                    </div> */}
                    {/* Email  */}
                    <div className="flex items-center justify-start pb-[10px] mb-[10px]  border-b-[#ddd] border-b ">
                      <Label
                        htmlFor="username"
                        className="text-right font-bold"
                      >
                        Email :
                      </Label>
                      <ScrollArea className="mx-2 overflow-auto text-nowrap">
                        {getCustomerData(customerDetails?.customerEmail)}
                      </ScrollArea>
                    </div>
                    {/* Landline No.  */}
                    <div className="flex items-center justify-start pb-[10px] mb-[10px]  border-b-[#ddd] border-b ">
                      <Label
                        htmlFor="username"
                        className="text-right font-bold"
                      >
                        Landline No :
                      </Label>
                      <p className="mx-2">
                        {getCustomerData(customerDetails?.landlineNo)}
                      </p>
                    </div>
                    {/* Town*/}
                    <div className="flex items-center justify-start pb-[10px] mb-[10px]  border-b-[#ddd] border-b ">
                      <Label htmlFor="name" className="text-right font-bold">
                        Town :
                      </Label>
                      <p className="mx-2">
                        {getCustomerData(customerDetails?.town)}
                      </p>
                    </div>
                    {/* Post Code */}
                    <div className="flex items-center justify-start pb-[10px] mb-[10px]  border-b-[#ddd] border-b ">
                      <Label htmlFor="name" className="text-right font-bold">
                        Postcode :
                      </Label>
                      <p className="mx-2">
                        {getCustomerData(customerDetails?.postcode)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* <ActivitySection
            activityDetails={activityDetails}
            className="w-full "
          /> */}
        </div>
        <div className="w-full border bg-[#fff] lg:w-[50%] update">
          <Tabs
            value={textTab}
            onValueChange={setTextTab}
            defaultValue="updates"
            className="w-full"
          >
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="activity" className="bg-[#fff]">
                Update
              </TabsTrigger>
              <TabsTrigger value="orders" className="bg-[#fff]">
                Orders
              </TabsTrigger>
              <TabsTrigger value="invoices" className="bg-[#fff]">
                Invoices
              </TabsTrigger>
              <TabsTrigger value="updates" className="bg-[#fff]">
                Reports
              </TabsTrigger>

              <TabsTrigger value="files" className="bg-[#fff]">
                Files
              </TabsTrigger>
            </TabsList>
            <TabsContent value="activity">
              <Card className="border-none shadow-none">
                <CardHeader className="p-0"></CardHeader>
                <CardContent className="p-0 space-y-2 px-2  ">
                  <div className="space-y-1 relative ">
                    <QuillEdior
                      productFlowId=""
                      customerId={customerId}
                      indicatorText="post"
                      updateId={""}
                      handleEdit={""}
                      orderId={""}
                      leadId={""}
                      technicalId={""}
                      setOpenQuill={() => {}}
                      setIsOpenReplyModel={() => {}}
                      amendmentId={""}
                      copywriterId={""}
                      websiteContentId={""}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {textTab === "orders" && (
              <div className="w-full">
                <OrderDetailsInCustomer
                  orderData={orderDetails && orderDetails}
                />
              </div>
            )}

            {textTab === "invoices" && (
              <div className="flex flex-col overflow-y-auto bg-white border border-[#e1e8f0] max-h-[180px] min-h-[180px] overflow-scroll mt-2 ml-2">
                {Array.isArray(customerDetails?.vatInvoice) &&
                customerDetails.vatInvoice.length > 0 ? (
                  customerDetails.vatInvoice.map((item, index) => {
                    let fileExtension = "";
                    const fileNameParts = item.split(".");
                    if (fileNameParts.length > 1) {
                      fileExtension = fileNameParts.pop()?.toLowerCase() || "";
                    }
console.log("customerDetails",customerDetails)
                    // Only render PDFs
                    if (fileExtension === "pdf") {
                      return (
                        <div
                          key={index}
                          className="border flex items-center h-24 mx-2 hover:bg-zinc-100 my-1 p-2"
                        >
                          {/* <div className="flex flex-col items-center justify-center w-full"> */}

                          <a
                            className="w-[100px]"
                            href={item}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div className="flex items-center justify-center h-[70px] w-[100px] bg-gray-200 ml-1">
                              <img
                                src={PDFPic} // Use fallback image
                                alt="PDF Preview"
                                className="h-[60px] w-[60px] object-cover"
                              />
                            </div>
                          </a>

                          <div className="m-3 flex flex-col justify-around gap-2 text-[0.8rem]">
                            <div className="font-bold hover:bg-slate-100 px-3">
                              <a
                                href={item}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {getFilenameFromURL(item)}
                              </a>
                            </div>
                            <div className="flex items-center gap-3 ml-3">
                              {/* <span>
                                <TooltipCommon text="Uploaded by user">
                                  <Avatar className="cursor-pointer w-6 h-6">
                                    <AvatarImage
                                      src={UserLogo}
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
                              </span> */}
                              <span>{new Date().toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* </div> */}
                        </div>
                      );
                    }

                    return null; // Skip non-PDF files
                  })
                ) : (
                  <div className="text-center text-gray-600 flex items-center justify-center h-[90px]">
                    No Data Found
                  </div>
                )}
                {/* {customerDetails && customerDetails.length > 0 ? (
  customerDetails.map((item) => {
    if (item.vatInvoice && Array.isArray(item.vatInvoice) && item.vatInvoice.length > 0) {
      console.log('Rendering invoices for:', item);
      return item.vatInvoice.map((invoiceUrl, index) => {
        let fileExtension = "";
        const fileNameParts = invoiceUrl.split(".");
        if (fileNameParts.length > 1) {
          fileExtension = fileNameParts.pop()?.toLowerCase() || "";
        }

        // Only render PDFs
        if (fileExtension === "pdf") {
          const content = (
            <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center justify-center h-[70px] w-[100px] bg-gray-200">
                <img
                  src={PDFPic} // Use fallback image
                  alt="PDF Preview"
                  className="h-[60px] w-[60px] object-cover"
                />
              </div>
            </a>
          );

          return (
            <div
              className="border flex items-center h-24 mx-2 hover:bg-zinc-100 my-1"
              key={invoiceUrl}
            >
              <div className="flex flex-col items-center justify-center w-full">
                <div className="border m-3 flex items-center hover:border-b-zinc-600 hover:shadow-lg">
                  {content}
                </div>

                <div className="m-3 flex flex-col justify-around gap-2 text-[0.8rem]">
                  <div className="font-bold hover:bg-slate-100 px-3 ">
                    <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
                      {getFilenameFromURL(invoiceUrl)}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>
                      <TooltipCommon text="Uploaded by user">
                        <Avatar className="cursor-pointer w-6 h-6">
                          <AvatarImage
                            src={UserLogo}
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
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return null; // Skip non-PDF files
      });
    }

    // If vatInvoice is empty or not available
    return <div>No invoices available</div>;
  })
) : (
  <div className="text-center text-gray-600 flex items-center justify-center h-[90px]">
    No data found!
  </div>
)}
 */}
              </div>
            )}
            {textTab === "updates" && (
              <div className="w-full">
                {/* <UpdateSection
                  editorData={editorData}
                  ReplyClick={ReplyClick}
                  likeClick={likeClick}
                  likeID={like}
                  userId={userId}
                  comments={comments}
                  showComments={showComments}
                  commentID={commentID}
                  customerId={customerId}
                  addViewsData={addViewsData}
                  handleUpdate={handleUpdate}
                /> */}
              </div>
            )}
            {textTab === "files" && (
              <>
                <div className="w-full mt-1 file-1">
                  <UpdateFilesSection fileData={fileData} />

                  <QuillEdior
                    productFlowId=""
                    customerId={customerId}
                    indicatorText="post"
                    updateId={""}
                    handleEdit={""}
                    orderId={""}
                    leadId={""}
                    technicalId={""}
                    setOpenQuill={() => {}}
                    setIsOpenReplyModel={() => {}}
                    amendmentId={""}
                    copywriterId={""}
                    websiteContentId={""}
                    text="file"
                  />
                </div>
              </>
            )}
            {/* <TabsContent value="orders">
              <Card className="border-none shadow-none">
                <CardHeader className="p-0"></CardHeader>
                <CardContent className="p-0 space-y-2 px-2  boxShadow">
                  <QuillEdior
                    productFlowId=""
                    customerId={customerId}
                    indicatorText="post"
                    updateId={""}
                    handleEdit={""}
                    orderId={""}
                    leadId={""}
                    technicalId={""}
                    setOpenQuill={() => {}}
                    setIsOpenReplyModel={() => {}}
                    amendmentId={""}
                    copywriterId={""}
                    websiteContentId={""}
                  />
               
                </CardContent>
              </Card>
            </TabsContent> */}
            {/* <TabsContent value="invoices">
              <Card className="border-none">
                <CardContent className="p-0 space-y-2 px-2 ">
                  <QuillEdior
                    productFlowId=""
                    customerId={customerId}
                    indicatorText="post"
                    updateId={""}
                    handleEdit={""}
                    orderId={""}
                    leadId={""}
                    technicalId={""}
                    setOpenQuill={() => {}}
                    setIsOpenReplyModel={() => {}}
                    amendmentId={""}
                    copywriterId={""}
                    websiteContentId={""}
                    // text="file"
                  />
                </CardContent>
              </Card>
            </TabsContent> */}
            {/* <TabsContent value="files">
              <Card className="border-none shadow-none">
                <CardContent className="p-0 space-y-2 px-2">
                  <QuillEdior
                    productFlowId=""
                    customerId={customerId}
                    indicatorText="post"
                    updateId={""}
                    handleEdit={""}
                    orderId={""}
                    leadId={""}
                    technicalId={""}
                    setOpenQuill={() => {}}
                    setIsOpenReplyModel={() => {}}
                    amendmentId={""}
                    copywriterId={""}
                    websiteContentId={""}
                    text="file"
                  />
                
                </CardContent>
              </Card>
            </TabsContent> */}
            <TabsContent value="updates">
              <Card className="border-none shadow-none">
                <CardContent className="p-0 space-y-2 px-2">
                  {/* <QuillEdior
                    productFlowId=""
                    customerId={customerId}
                    indicatorText="post"
                    updateId={""}
                    handleEdit={""}
                    orderId={""}
                    leadId={""}
                    technicalId={""}
                    setOpenQuill={() => {}}
                    setIsOpenReplyModel={() => {}}
                    amendmentId={""}
                    copywriterId={""}
                    websiteContentId={""}
                    text="file"
                  /> */}
                  <div className="w-full mt-1">
                    <ReportFileSection customerFileData={customerFileData} />

                    <div className="flex justify-end items-center report-btn right-0 absolute">
                      {/* Button Section */}

                      <form onSubmit={handleAddData}>
                        <div className="flex justify-end gap-2 right-0 ">
                          <>
                            <button
                              type="submit"
                              className="cursor-pointer h-[24px] border border-primary bg-primary px-4 text-white transition hover:bg-opacity-90"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader className="mr-2 h-6 w-6 animate-spin text-[#fff]" />
                              ) : (
                                "Update"
                              )}
                            </button>

                            <div
                              onClick={imageHandler}
                              className="w-fit cursor-pointer"
                            >
                              <TooltipCommon text="Add Files">
                                <div className="hover:bg-gray-100 px-2 py-1">
                                  <AddFilesDarkUIconSVG />
                                </div>
                              </TooltipCommon>
                            </div>
                          </>
                        </div>
                        {images && images.length > 0 ? (
                        <div className="report-files">
                          <ul>
                            {images.length > 0 && (
                              <ul>
                                {images.map((file, index) => (
                                  <li key={index}>{file.name}</li>
                                ))}
                              </ul>
                            )}
                          </ul>
                        
                        </div>
                        ) : null}
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="lg gap-1  justify-start">
        {(textTab === "activity" ||
          textTab === "updates" ||
          textTab === "orders" ||
          textTab === "invoices" ||
          textTab === "files") && (
          <div className="w-full">
            <ActivitySection activityDetails={acData} className="w-full" />
          </div>
        )}

        {/* {textTab === "updates" && ( */}
        {/* <div className="w-full">

            <UpdateSection
              editorData={editorData}
              ReplyClick={ReplyClick}
              likeClick={likeClick}
              likeID={like}
              userId={userId}
              comments={comments}
              showComments={showComments}
              commentID={commentID}
              customerId={customerId}
              addViewsData={addViewsData}
              handleUpdate={handleUpdate}
            />
          </div> */}
        {/* )} */}
        {/* {textTab === "orders" && ( */}
        {/* <div className="w-full">
  
            <OrderDetailsInCustomer orderData={orderDetails && orderDetails} />
          </div> */}
        {/* )}  */}

        {/* {textTab === "invoices" && ( */}
        {/* <div className="p-3 flex bg-white w-full h-[70vh] mt-1 boxShadow border border-[#e1e8f0]">
            {Array.isArray(customerDetails?.vatInvoice)
              ? customerDetails?.vatInvoice?.map((item) => {
                  return item ? (
                    <div className="border border-[#e1e8f0] h-[70px] p-2 flex justify-center align-middle items-center">
                      <div>
                        <a
                          href={item ? item : ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={item}
                        >
                          <img
                            //   src={fileIcons[fileType]}
                            src={PDFPic}
                            alt="PDF"
                            className="h-[50px] w-[50px] object-cover"
                          />
                        </a>
                      </div>
                      <div className="">
                        <a
                          href={item ? item : ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={item}
                        >
                          {item}
                        </a>
                      </div>
                    </div>
                  ) : (
                    "No Invoice Found"
                  );
                })
              : "No Data Found"}
          </div> */}
        {/* )}  */}
        {/* {textTab === "files" && ( */}
        {/* <div className="w-full mt-1">
            <UpdateFilesSection updateFileDetails={updateFileDetails} />
          </div> */}
        {/* )}  */}
      </div>
    </div>
  );
};

export default CustomerDetailsContent;
