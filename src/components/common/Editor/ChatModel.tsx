"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Loader2, PlusCircleIcon } from "lucide-react";
import User from "../../../asset/images/user.png";
import {
  ChatBubbleIcon,
  Cross1Icon,
  DotsHorizontalIcon,
  DrawingPinIcon,
  Pencil2Icon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuillEdior from "@/components/common/Editor/QuillEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditorStore } from "@/Store/EditorStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdateOrder from "../../Orders/components/UpdateOrder";
import UpdateLead from "../../Leads/components/UpdateLead";
import UpdateTechnical from "../../TechnicalTracker/components/UpdateTechnical";
import { baseInstance, errorToastingFunction } from "@/common/commonFunctions";
import { useUserStore } from "@/Store/UserStore";
import { AxiosError } from "axios";
import UpdateFilesSection from "@/components/common/Editor/UpdateFilesSection";
import UpdateAmendment from "@/components/Amendment/components/UpdateAmendment";
import UpdateProductFlow from "../../ProductFlow/components/UpdateProductFlow";
import UpdateCopywriter from "@/components/CopywriterTracker/components/UpdateCopywriter";
import { useCopywriterStore } from "@/Store/CopywriterStore";
import UpdateWebsiteContent from "@/components/WebsiteContent/components/UpdateWebsiteContent";
import PDF from "../../../asset/images/pdf.png";
const PDFPic = PDF.src;
interface updateFileDetailType {
  id: number;
  createdAt: string;
  fileUrl: string;
  itemId: string;
  itemType: string;
  source: string;
}
const ChatModel = ({
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
}: any) => {
  const [open, setOpen] = useState<boolean>(false);
  const UserPic = User.src;
  const {
    fetchOrderEditorData,
    orderEditorData,
    technicalUpdateData,
    fetchLeadsEditorData,
    fetchAmendmentUpdateData,
    leadsEditorData,
    amendmentUpdateData,
    fetchTechnicalUpdateData,
    fetchCopywriterUpdateData,
    fetchProductFlowUpdateData,
    fetchWebsiteContentUpdateData,
    copywriterUpdateData,
  }: any = useEditorStore();

  const [openQuill, setOpenQuill] = useState(false);
  const handleOpenQuillEditor = () => {
    setOpenQuill((prevOpen) => !prevOpen);
  };

  const [updateFileDetails, setUpdateFileDetails] = React.useState<
    updateFileDetailType[]
  >([]);

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
    } catch (error) {
      if (error instanceof AxiosError) {
        errorToastingFunction(
          error.response?.data?.message || "An error occurred"
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  useEffect(() => {
    if (
      open &&
      (orderId ||
        leadId ||
        technicalId ||
        amendmentId ||
        productFlowId ||
        websiteContentId ||
        copywriterId)
    ) {
      fetchLeadsEditorData(leadId);
      fetchOrderEditorData(orderId);
      fetchTechnicalUpdateData(technicalId);
      fetchAmendmentUpdateData(amendmentId);
      fetchCopywriterUpdateData(copywriterId);
      fetchProductFlowUpdateData(productFlowId);
      fetchWebsiteContentUpdateData(websiteContentId);

      getUpdateFiles();
    }
  }, [
    open,
    orderId,
    leadId,
    technicalId,
    amendmentId,
    copywriterId,
    websiteContentId,
    productFlowId,
  ]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="relative" style={{ paddingTop: "6px" }}>
          {length === 0 ? (
            <PlusCircleIcon className="h-[1.35rem] w-[1.35rem] p-1 text-black  cursor-pointer" />
          ) : (
            <>
              <ChatBubbleIcon className="h-[1.35rem] w-[1.55rem] p-1 text-black cursor-pointer" />
              <div className="absolute top-2 bg-green-500 text-white rounded-full w-[0.9rem] h-[0.9rem] flex items-center justify-center cursor-pointer text-[9px] font-semibold">
                {length ? length : ""}
              </div>
            </>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className=" sm:max-w-[1300px] ">
        <div className="p-8">
          <CardTitle>{customerName}</CardTitle>
          <div className="w-full mt-2">
            <Tabs defaultValue="updates" className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="updates" className="bg-[#fff]">
                  Updates
                </TabsTrigger>
                <TabsTrigger value="files" className="bg-[#fff]">
                  Files
                </TabsTrigger>
                <TabsTrigger value="invoices" className="bg-[#fff]">
                  Invoices
                </TabsTrigger>
              </TabsList>
              <TabsContent value="updates">
                <Card>
                  <CardContent className="space-y-2 max-h-[42vh] overflow-auto">
                    <p
                      className="w-full text-gray-500 border cursor-pointer border-stroke bg-transparent text-[0.8rem] my-3 py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onClick={handleOpenQuillEditor}
                    >
                      Click here to write something...
                    </p>
                    {openQuill && (
                      <div className="space-y-1">
                        <QuillEdior  text={""}
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
                        />
                      </div>
                    )}

                    <ScrollArea className="h-[34vh] overflow-auto ">
                      <UpdateLead leadId={leadId} />
                      <UpdateOrder orderId={orderId} />
                      <UpdateTechnical technicalId={technicalId} />
                      <UpdateAmendment amendmentId={amendmentId} />
                      <UpdateProductFlow productFlowId={productFlowId} />
                      <UpdateCopywriter copywriterId={copywriterId} />
                      <UpdateWebsiteContent
                        websiteContentId={websiteContentId}
                      />
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="files">
                <Card>
                  <CardContent className="space-y-2">
                    <UpdateFilesSection
                      updateFileDetails={updateFileDetails}
                      getUpdateFiles={getUpdateFiles}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="invoices">
                <Card>
                  <CardContent
                    className="overflow-y-auto mt-4 flex items-center"
                    style={{ maxHeight: "500px" }}
                  >
                    {updateFileDetails.length > 0
                      ? updateFileDetails.map((file, index) => (
                          <div key={index} className="">
                            {/* <a
                              className="bg-gray-50 p-3 hover:bg-slate-100 rounded block"
                              href={file?.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Show Invoice
                            </a> */}
                            <a
                              href={file?.fileUrl ? file?.fileUrl : ""}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={file?.fileUrl}
                            >
                              <img
                                //   src={fileIcons[fileType]}
                                src={PDFPic}
                                alt="PDF"
                                className="h-[50px] w-[50px] object-cover rounded"
                              />
                            </a>
                          </div>
                        ))
                      : "No Data Found!"}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModel;
