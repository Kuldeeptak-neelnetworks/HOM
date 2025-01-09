// "use client";
import BreadcrumbSection from "@/components/common/BreadcrumbSection";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
// import QuillEdior from "./QuillEditor";
import QuillEdior from "../../common/Editor/QuillEditor";
import { useEditorStore } from "@/Store/EditorStore";
import UpdateSection from "./UpdateSection";
import UpdateFilesSection from "../../common/Editor/UpdateFilesSection";
import { EditCustomerIconSVG } from "@/utils/SVGs/SVGs";
import { Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import TooltipCommon from "@/components/common/TooltipCommon";
import PDF from "../../../asset/images/pdf.png";
import OrderDetailsInCustomer from "./OrderDetailsInCustomer";
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

const CustomerDetailsContent = ({ handleUpdate }: any) => {
  const { customerId } = useParams();
  const { fetchEditorData, editorData, loading }: any = useEditorStore();
  const [customerDetails, setCustomerDetails] =
    React.useState<CustomerDetailType | null>(null);
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

  console.log("orderDetails", orderDetails);

  useEffect(() => {
    getCustomerDetails();
    getUpdateFiles();
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
      <div className="lg:flex gap-1  justify-start ">
        <div className="w-full lg:w-[40vw] mb-3 lg:mb-0 ">
          <Card className="h-full">
            <CardContent className="p-0">
              <div className="flex justify-end pr-4 pt-2">
                <TooltipCommon text="Edit Customer">
                  <Link href={`/customers/editCustomerDetails/${customerId}`}>
                    <Pencil2Icon className="text-gray-400 hover:text-gray-700 cursor-pointer" />
                  </Link>
                </TooltipCommon>
              </div>

              <div className="rounded-md text-left overflow-auto">
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
        </div>
        <div className="w-full border rounded-md bg-[#fff] ">
          <Tabs defaultValue="updates" className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="updates" className="bg-[#fff]">
                Reports
              </TabsTrigger>
              <TabsTrigger value="files" className="bg-[#fff]">
                Files
              </TabsTrigger>
              <TabsTrigger value="invoices" className="bg-[#fff]">
                Invoices
              </TabsTrigger>
            </TabsList>
            <TabsContent value="updates">
              <Card className="border-none shadow-none">
                <CardHeader className="p-0">
                  {/* <CardTitle>Updates</CardTitle> */}
                </CardHeader>
                <CardContent className="p-0 space-y-2 px-2">
                  <div className="space-y-1 relative">
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
            <TabsContent value="files">
              <Card className="border-none">
                <CardContent
                  className="space-y-2 px-2 p-0"
                  style={{
                    maxHeight: "180px",
                    overflow: "scroll",
                  }}
                >
                  <UpdateFilesSection updateFileDetails={updateFileDetails} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="invoices">
              <Card className="border-none">
                <CardHeader className="p-0">
                  {/* <CardTitle>Invoices</CardTitle> */}
                </CardHeader>
                <CardContent
                  className="space-y-2"
                  style={{ minHeight: "178px" }}
                >
                  <div className="pt-3 flex">
                    {Array.isArray(customerDetails?.vatInvoice)
                      ? customerDetails?.vatInvoice?.map((item) => {
                          return item ? (
                            // <a
                            //   className="bg-gray-50 p-3 hover:bg-slate-100 rounded-md"
                            //   href={item ? item : ""}
                            //   target="_blank"
                            //   key={item}
                            // >
                            //   {item ? "Show Invoice" : ""}
                            // </a>
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
                                className="h-[50px] w-[50px] object-cover rounded"
                              />
                            </a>
                          ) : (
                            "No Invoice Found"
                          );
                        })
                      : "No Data Found"}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="flex">
        <OrderDetailsInCustomer orderData={orderDetails && orderDetails} />
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
      </div>
    </div>
  );
};

export default CustomerDetailsContent;
