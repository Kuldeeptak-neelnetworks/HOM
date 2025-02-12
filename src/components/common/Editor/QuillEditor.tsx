import React, { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ImageResize } from "quill-image-resize-module-ts";
import QuillMention from "quill-mention";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TooltipCommon from "@/components/common/TooltipCommon";
import { AddFilesDarkUIconSVG } from "@/utils/SVGs/SVGs";
import {
  baseInstance,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { useEditorStore } from "@/Store/EditorStore";
import { useCopywriterStore } from "@/Store/CopywriterStore";
import { editorConfig } from "./config";
import type { QuillEditorProps } from "./types";
import "../../../styles/common.css";
import "../../../styles/editor.css";
import { useUserStore } from "@/Store/UserStore";
import { atValues } from "./mentions";

// Register Quill modules
Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/mention", QuillMention);

const QuillEditor: React.FC<QuillEditorProps> = ({
  customerId,
  setIsOpenReplyModel,
  setOpenQuill,
  updateId,
  productFlowId,
  orderId,
  technicalId,
  leadId,
  indicatorText,
  amendmentId,
  copywriterId,
  websiteContentId,
}) => {
  const [value, setValue] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileURLs, setFileURLs] = useState<{ [key: string]: string }>({});
  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);
  const quillRef = useRef<ReactQuill>(null);

  const { fetchCopywriterData } = useCopywriterStore();
  const {
    fetchEditorData,
    fetchacData,
    fetchLeadsEditorData,
    fetchOrderEditorData,
    fetchTechnicalUpdateData,
    fetchAmendmentUpdateData,
    fetchProductFlowUpdateData,
    fetchWebsiteContentUpdateData,
    fetchCopywriterUpdateData,
  } = useEditorStore();
  const { fetchUsersData, userData, loading } = useUserStore();

  useEffect(() => {
    fetchUsersData();
  }, []);

  useEffect(() => {
    userData?.forEach((item: any) => {
      if (!atValues.some((value) => value.id === item._id)) {
        // Check if the 'id' already exists in 'atValues'
        atValues.push({
          id: item?._id, // Use 'userId' if that's the field in userData
          value: item?.fullName, // Use 'username' if that's the field in userData
          avatar: item?.avatar,
        });
      }
    });
  }, [userData]);

  // Configure Quill options
  const options = {
    ...editorConfig,
    modules: {
      ...editorConfig.modules,
      imageResize: {
        ...editorConfig?.modules?.imageResize,
        parchment: Quill.import("parchment"),
      },
    },
  };

  const handleClear = () => {
    setValue("");
    setImages([]);
  };

  const handleChanges = (value: string, editor: any) => {
    setValue(() =>
      editor.getText().trim() === "" && value === "" ? "" : value
    );
  };

  // const handleFileUpload = (files: FileList | null) => {
  //   if (files) {
  //     const fileList = Array.from(files);
  //     setImages((prevImages) => [...prevImages, ...fileList]);

  //     fileList.forEach((file) => {
  //       if (file.type.startsWith("image/")) {
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           const img = `<img src="${reader.result}" alt="${file.name}" />`;
  //           setValue((prevValue) => prevValue + img + "</br>");
  //         };
  //         reader.readAsDataURL(file);
  //       } else {
  //         const url = URL.createObjectURL(file);
  //         setFileURLs((prev) => ({ ...prev, [file.name]: url }));
  //         const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${file.name}</a>`;
  //         setValue((prevValue) => prevValue + link + "</br>");
  //       }
  //     });
  //   }
  // };

  // const handleFileUpload = async (files: FileList | null) => {
  //   if (files) {
  //     const fileList = Array.from(files);
  //     console.log("fileList", fileList);

  //     // setImages((prevImages) => [...prevImages, ...fileList]);

  //     for (const file of fileList) {
  //       if (!file.type.startsWith("image/")) {
  //         setImages((prevImages) => [...prevImages, ...fileList]);
  //       }
  //     }
  //     for (const file of fileList) {
  //       if (file.type.startsWith("image/")) {
  //         const formData = new FormData();
  //         formData.append("files", file);

  //         try {
  //           const response = await baseInstance.post("/users/upload", formData); // Adjust the endpoint as needed
  //           const imageUrl = response?.data?.data?.fileUrl; // Assume the response contains the URL
  //           console.log("imageUrlimageUrl", imageUrl);
  //           const imgTag = `<img src="${imageUrl}" alt="${file.name}" />`;
  //           setValue((prevValue) => prevValue + imgTag + "</br>");
  //           setImages((prevImages) => [...prevImages, imageUrl]);
  //         } catch (error) {
  //           errorToastingFunction("Image upload failed.");
  //         }
  //       } else {
  //         console.log("file", file);
  //         const url = URL.createObjectURL(file);
  //         setFileURLs((prev) => ({ ...prev, [file.name]: url }));
  //         const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${file.name}</a>`;
  //         setValue((prevValue) => prevValue + link + "</br>");
  //       }
  //     }
  //   }
  // };
  const handleFileUpload = async (files: FileList | null) => {
    if (files) {
      const fileList = Array.from(files);

      // setImages((prevImages) => [...prevImages, ...fileList]);

      for (const file of fileList) {
        if (file.type.startsWith("image/")) {
          const formData = new FormData();
          formData.append("files", file);

          try {
            const response = await baseInstance.post("/users/upload", formData); // Adjust the endpoint as needed
            const imageUrl = response?.data?.data?.fileUrls; // Assume the response contains the URL
            const imgTag = `<img src="${imageUrl}" alt="${file.name}" />`;
            setValue((prevValue) => prevValue + imgTag + "</br>");
            setImages((prevImages) => [...prevImages, imageUrl]);
          } catch (error) {
            errorToastingFunction("Image upload failed.");
          }
        } else {
          // const url = URL.createObjectURL(file);
          // setFileURLs((prev) => ({ ...prev, [file.name]: url }));
          // const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${file.name}</a>`;
          // setValue((prevValue) => prevValue + link + "</br>");
          const formData = new FormData();
          formData.append("files", file);

          try {
            const response = await baseInstance.post("/users/upload", formData); // Adjust the endpoint as needed
            const fileUrl = response?.data?.data?.fileUrls; // Assume the response contains the URL
            const fileTag = `<a href="${fileUrl}" target="_blank" rel="noopener noreferrer">${file.name}</a>`;
            setValue((prevValue) => prevValue + fileTag + "</br>");
            setImages((prevImages) => [...prevImages, fileUrl]);
          } catch (error) {
            errorToastingFunction("Image upload failed.");
          }
        }
      }
    }
  };

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
      handleFileUpload(inputImage.files);
    };
  };

  // Function to extract mentioned user IDs from Quill editor content
  const extractMentionedUserIds = (editor: any) => {
    const mentions: string[] = [];
    // Get all mentions from the editor
    // editor.getContents().ops.forEach((op: any) => {
    //   if (op.insert && op.insert["@"]) {
    //     mentions.push(op.insert["@"].id); // Assuming the mentioned user ID is stored in the '@' object
    //   }
    // });

    editor.getContents().ops.forEach((op: any) => {
      if (op?.insert?.mention?.id) {
        mentions.push(op?.insert?.mention?.id);
      }
    });
    return mentions;
  };

  // Function to update mentioned user IDs in state
  const updateMentionedUserIds = () => {
    const editor = quillRef.current?.getEditor();
    const extractedIds = extractMentionedUserIds(editor);
    setMentionedUserIds(extractedIds);
  };

  // Use a regular expression to match URLs
  const urlRegex = /https?:\/\/[^\s"']+/g;

  // Extract all URLs into an array
  const updatedUrls = value?.match(urlRegex) || [];

  const handleAddData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((value !== "" && value !== "<p><br></p>") || images.length > 0) {
      try {
        setIsLoading(true);
        const formData = new FormData();

        formData.append("content", value);

        updatedUrls?.forEach((image) => formData.append("files[]", image));

        mentionedUserIds.forEach((mentionId) =>
          formData.append("mentions", mentionId)
        );

        const requests = [];

        if (indicatorText === "post") {
          requests.push(
            orderId && baseInstance.post(`/updates/order/${orderId}`, formData),
            productFlowId &&
              baseInstance.post(
                `/updates/productflow/${productFlowId}`,
                formData
              ),
            customerId &&
              baseInstance.post(`/updates/customer/${customerId}`, formData),
            leadId && baseInstance.post(`/updates/lead/${leadId}`, formData),
            technicalId &&
              baseInstance.post(
                `/updates/technicaltracker/${technicalId}`,
                formData
              ),
            copywriterId &&
              baseInstance.post(
                `/updates/copywritertracker/${copywriterId}`,
                formData
              ),
            websiteContentId &&
              baseInstance.post(
                `/updates/newwebsitecontent/${websiteContentId}`,
                formData
              ),
            amendmentId &&
              baseInstance.post(`/updates/amendment/${amendmentId}`, formData)
          );
        }

        if (indicatorText === "reply") {
          requests.push(
            baseInstance.post(`/updates/update/reply/${updateId}`, formData)
          );
        }

        // const responses = await Promise.all(requests.filter(Boolean));
        // responses.forEach((response: any) => {
        //   if (response.status === 201) {
        //     successToastingFunction(response?.data?.message);
        //     fetchEditorData(customerId);
        //     fetchOrderEditorData(orderId);
        //     fetchLeadsEditorData(leadId);
        //     fetchTechnicalUpdateData(technicalId);
        //     fetchCopywriterUpdateData(copywriterId);
        //     fetchAmendmentUpdateData(amendmentId);
        //     fetchProductFlowUpdateData(productFlowId);
        //     fetchWebsiteContentUpdateData(websiteContentId);
        //     setIsOpenReplyModel(false);
        //     setOpenQuill(false);
        //     handleClear();
        //   }
        // });

        const responses = await Promise.all(requests.filter(Boolean));

        // Helper function to handle type checking and function calls
        const callIfValidString = (
          id: string | undefined | string[],
          fn: (id: string) => void,
          idName: string
        ) => {
          if (typeof id === "string") {
            fn(id);
          } else {
            console.error(`Invalid ${idName}:`, id);
          }
        };

        responses.forEach((response: any) => {
          if (response.status === 201) {
            successToastingFunction(response?.data?.message);

            // Use the helper function to reduce repetition
            callIfValidString(customerId, fetchEditorData, "customerId");
            callIfValidString(customerId, fetchacData, "customerId");
            
            callIfValidString(orderId, fetchOrderEditorData, "orderId");
            callIfValidString(leadId, fetchLeadsEditorData, "leadId");
            callIfValidString(
              technicalId,
              fetchTechnicalUpdateData,
              "technicalId"
            );
            callIfValidString(
              copywriterId,
              fetchCopywriterUpdateData,
              "copywriterId"
            );
            callIfValidString(
              amendmentId,
              fetchAmendmentUpdateData,
              "amendmentId"
            );
            callIfValidString(
              productFlowId,
              fetchProductFlowUpdateData,
              "productFlowId"
            );
            callIfValidString(
              websiteContentId,
              fetchWebsiteContentUpdateData,
              "websiteContentId"
            );

            setIsOpenReplyModel(false);
            setOpenQuill(false);
            handleClear();
          }
        });
      } catch (error) {
        errorToastingFunction(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      errorToastingFunction("Please enter text or upload an image to submit.");
    }
  };

  useEffect(() => {
    return () => {
      Object.values(fileURLs).forEach((url) => {
        return URL.revokeObjectURL(url);
      });
    };
  }, [fileURLs]);

  return (
    <form onSubmit={handleAddData} className="flex gap-1 mb-1 flex-col">
      <div>
      {/* {text !== "file" && ( */}
        <ReactQuill
          ref={quillRef}
          theme={options.theme}
          modules={options.modules}
          value={value}
          onChange={(value, _, __, editor) => {
            handleChanges(value, editor);
          }}
          onChangeSelection={updateMentionedUserIds} 
          placeholder={options.placeholder}
        />
  {/* //  )}  */}
      </div>
      {/* */}
      <div className="flex justify-start gap-2 items-center absolute bottom-1 right-0 ">
        <Button
          type="submit"
          className="cursor-pointer h-[24px] border border-primary bg-primary px-4 text-white transition hover:bg-opacity-90"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#fff]" />
          ) : indicatorText === "reply" ? (
            "Reply"
          ) : (
            "Update"
          )}
        </Button>

        <div onClick={imageHandler} className="w-fit cursor-pointer">
          <TooltipCommon text="Add Files">
            <div className="hover:bg-gray-100 px-2 py-1">
              <AddFilesDarkUIconSVG />
            </div>
          </TooltipCommon>
        </div>
      </div>
      {/* { text === "file" && (
  <>

      <div className="mt-4">
        <h3>Uploaded Files:</h3>
        {images}
      
      </div>


    <div className="flex justify-start gap-2 items-center">
      <Button
        type="submit"
        className="cursor-pointer h-[24px] border border-primary bg-primary px-4 text-white transition hover:bg-opacity-90"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#fff]" />
        ) : indicatorText === "reply" ? (
          "Reply"
        ) : (
          "Update"
        )}
      </Button>

      
      <div onClick={imageHandler} className="w-fit cursor-pointer">
        <TooltipCommon text="Add Files">
          <div className="hover:bg-gray-100 px-2 py-1">
         
            <AddFilesDarkUIconSVG />
          </div>
        </TooltipCommon>
      </div>
    </div>


 
  </>
)} */}

    </form>
  );
};

export default QuillEditor;
