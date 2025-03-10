"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  LinkIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
import { useEditorStore } from "@/Store/EditorStore";
import { baseInstance, errorToastingFunction } from "@/common/commonFunctions";
import { AxiosError } from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import QuillEditor from "./QuillEditor";
import UpdateFilesSection from "./UpdateFilesSection";
import UpdateWebsiteContent from "@/components/WebsiteContent/components/UpdateWebsiteContent";
import UpdateCopywriter from "@/components/CopywriterTracker/components/UpdateCopywriter";
import UpdateProductFlow from "@/components/ProductFlow/components/UpdateProductFlow";
import UpdateAmendment from "@/components/Amendment/components/UpdateAmendment";
import UpdateTechnical from "@/components/TechnicalTracker/components/UpdateTechnical";
import UpdateOrder from "@/components/Orders/components/UpdateOrder";
import UpdateLead from "@/components/Leads/components/UpdateLead";
import PDF from "../../../asset/images/pdf.png";
import { PlusCircleIcon } from "lucide-react";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import UpdateSection from "@/components/customers/components/UpdateSection";
import UpdateUser from "@/components/Users/components/UpdateUser";
const PDFPic = PDF.src;

interface TeamMember {
  name: string;
  email: string;
  href: string;
  imageUrl: string;
}

interface updateFileDetailType {
  id: number;
  createdAt: string;
  fileUrl: string;
  itemId: string;
  itemType: string;
  source: string;
}

const team: TeamMember[] = [
  {
    name: "Tom Cook",
    email: "tom.cook@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Whitney Francis",
    email: "whitney.francis@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Leonard Krasner",
    email: "leonard.krasner@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Floyd Miles",
    email: "floyd.miles@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Emily Selman",
    email: "emily.selman@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

export default function SideDrawer({
  orderId,
  amendmentId,
  length,
  leadId,
  setIsOpenReplyModel,
  customerId,
  productFlowId,
  updateId,
  customerName,
  technicalId,
  copywriterId,
  websiteContentId,
  invoice,userId
}: any) {
  const {
    fetchOrderEditorData,
    orderEditorData,
    technicalUpdateData,
    fetchLeadsEditorData,
    fetchAmendmentUpdateData,fetchUserUpdateData,
    leadsEditorData,
    amendmentUpdateData,
    fetchTechnicalUpdateData,
    fetchCopywriterUpdateData,
    fetchProductFlowUpdateData,
    fetchWebsiteContentUpdateData,
    copywriterUpdateData,fetchEditorData
  }: any = useEditorStore();

  const [open, setOpen] = useState<boolean>(false);
  const openSideDrawer = () => {
    setOpen((prev) => !prev);
  };

  const [updateFileDetails, setUpdateFileDetails] = React.useState<
    updateFileDetailType[]
  >([]);

  const [openQuill, setOpenQuill] = useState(false);
  const handleOpenQuillEditor = () => {
    setOpenQuill((prevOpen) => !prevOpen);
  };

  const getUpdateFiles = async (): Promise<void> => {
    try {
      const requests = [
        orderId && baseInstance.get(`/files/order/${orderId}`),
        leadId && baseInstance.get(`/files/lead/${leadId}`),
        technicalId &&
          baseInstance.get(`/files/technicaltracker/${technicalId}`),
        amendmentId && baseInstance.get(`/files/amendment/${amendmentId}`),
        productFlowId &&
          baseInstance.get(`/files/productflow/${productFlowId}`),
        copywriterId &&
          baseInstance.get(`/files/copywritertracker/${copywriterId}`),

      ].filter(Boolean) as Promise<any>[];

      const responses = await Promise.all(requests);

      const combinedFiles = responses.flatMap(
        (response) => response.data?.data?.files || []
      );

      setUpdateFileDetails(combinedFiles);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        errorToastingFunction(
          error.response?.data?.message || "An error occurred"
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const getInvoiceName = (url: string) => {
    // Use URL object or regex to get the last part of the URL
    const fileName = url?.substring(url?.lastIndexOf("/") + 1); // Extract "invoice_673edc24dac60450788b3a5f.pdf"
    const invoiceName = fileName?.split(".")[0]; // Extract "invoice_673edc24dac60450788b3a5f"
    console.log("invoiceName", invoiceName);
    return invoiceName;
  };

  useEffect(() => {
    if (
      open &&
      (orderId ||
        leadId || customerId||
        technicalId ||
        amendmentId ||
        productFlowId ||
        websiteContentId || userId||
        copywriterId)
    ) {
      fetchLeadsEditorData(leadId);
      fetchOrderEditorData(orderId);
      fetchTechnicalUpdateData(technicalId);
      fetchAmendmentUpdateData(amendmentId);
      fetchUserUpdateData(userId)
      fetchCopywriterUpdateData(copywriterId);
      fetchProductFlowUpdateData(productFlowId);
      fetchWebsiteContentUpdateData(websiteContentId);
      fetchEditorData(customerId)
      

      getUpdateFiles();
    }
  }, [
    open,
    orderId,userId,
    leadId,
    technicalId,
    amendmentId,
    copywriterId,
    websiteContentId,
    productFlowId,
  ]);

  return (
    <>
      <div onClick={openSideDrawer} className="relative">
        {length === 0 ? (
          <PlusCircleIcon className="h-[1.35rem] w-[1.35rem] p-1 text-black  cursor-pointer" />
        ) : (
          <>
            <ChatBubbleIcon className="h-[1.35rem] w-[1.55rem] p-1 text-black cursor-pointer" />
            <div className="absolute top-0 bg-green-500 text-white rounded-full w-[0.9rem] h-[0.9rem] flex items-center justify-center cursor-pointer text-[9px] font-semibold">
              {length ? length : ""}
            </div>
          </>
        )}
      </div>

      <Dialog open={open} onClose={setOpen} className="relative z-20">
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-[2.2rem] right-0 flex max-w-full pl-10 sm:pl-16 ">
              <DialogPanel
                className={`pointer-events-auto w-screen ${
                  open ? "max-w-[60rem]" : "max-w-[0rem]"
                } transform  transition-transform duration-500 ease-in-out `}
              >
                <div className="flex flex-col  bg-white shadow-xl h-[100vh] overflow-scroll">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="bg-gray-50 px-4 sm:px-6">
                      <div className="flex items-start justify-between space-x-3">
                        <div className="flex h-7 items-center">
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="relative text-gray-400 hover:text-gray-500"
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 model-update-btn">
                      <CardTitle>{customerName}</CardTitle>
                      <div className="w-full mt-2">
                        <Tabs defaultValue="updates" className="w-full">
                          <TabsList className="">
                            <TabsTrigger value="updates" className="bg-[#fff]">
                              Updates
                            </TabsTrigger>
                            {/* <TabsTrigger value="files" className="bg-[#fff]">
                              Files
                            </TabsTrigger> */}
                            {/* <TabsTrigger value="invoices" className="bg-[#fff]">
                              Invoices
                            </TabsTrigger> */}
                          </TabsList>
                          <TabsContent value="updates">
                            <Card>
                              <CardContent className="space-y-2  overflow-auto">
                                <p
                                  className="w-full text-gray-500 border cursor-pointer border-stroke bg-transparent text-[0.8rem] my-3 py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                  onClick={handleOpenQuillEditor}
                                >
                                  Click here to write something...
                                </p>
                                {openQuill && (
                                  <div className="space-y-1 ">
                                    
                                    <QuillEditor
                                      amendmentId={amendmentId || ""}
                                      orderId={orderId || ""}
                                      customerId={customerId||""}
                                      indicatorText="post"
                                      technicalId={technicalId || ""}
                                      leadId={leadId || ""}
                                      updateId={updateId || ""}
                                      productFlowId={productFlowId || ""}
                                      handleEdit={""}
                                      setOpenQuill={setOpenQuill}
                                      setIsOpenReplyModel={() => {}}
                                      copywriterId={copywriterId || ""}
                                      websiteContentId={websiteContentId || ""}
                                      quillSize="size"
                                      // text=""
                                    />
                                  </div>
                                )}

                                <ScrollArea className="overflow-auto h-[68vh]">
                                  <UpdateLead leadId={leadId} />
                                  <UpdateOrder orderId={orderId} />
                                  <UpdateTechnical technicalId={technicalId} />
                                  <UpdateAmendment amendmentId={amendmentId} />
                                
                                  <UpdateProductFlow
                                    productFlowId={productFlowId}
                                  />
                                  <UpdateCopywriter
                                    copywriterId={copywriterId}
                                  />
                                  <UpdateWebsiteContent
                                    websiteContentId={websiteContentId}
                                  />
                                   <UpdateUser userId={userId} />
                                  <UpdateSection customerId={customerId}/>
                                </ScrollArea>
                              </CardContent>
                            </Card>
                          </TabsContent>
                          <TabsContent value="files">
                            <Card>
                              <CardContent
                                className="space-y-2 overflow-y-scroll my-2"
                                style={{ height: "75vh" }}
                              >
                                <UpdateFilesSection
                                  updateFileDetails={updateFileDetails}
                                  getUpdateFiles={getUpdateFiles}
                                />
                                {/* <QuillEditor
                                      amendmentId={amendmentId || ""}
                                      orderId={orderId || ""}
                                      customerId={""}
                                      indicatorText="post"
                                      technicalId={technicalId || ""}
                                      leadId={leadId || ""}
                                      updateId={updateId || ""}
                                      productFlowId={productFlowId || ""}
                                      handleEdit={""}
                                      setOpenQuill={setOpenQuill}
                                      setIsOpenReplyModel={() => {}}
                                      copywriterId={copywriterId || ""}
                                      websiteContentId={websiteContentId || ""}
                                      quillSize="size"
                                      // text=""
                                    /> */}
                              </CardContent>
                            </Card>
                          </TabsContent>
                          {/* <TabsContent value="invoices">
                            <Card>
                              <CardContent className="overflow-y-auto mt-4 flex items-center">
                             

                                {invoice && (
                                  <div className="">
                                    <p>{invoice}</p>

                                    <a
                                      href={invoice ? invoice : ""}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title={invoice}
                                    >
                                      <img
                                        //   src={fileIcons[fileType]}
                                        src={PDFPic}
                                        alt="PDF"
                                        className="h-[50px] w-[50px] object-cover rounded"
                                      />
                                    </a>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </TabsContent> */}
                        </Tabs>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
