"use client";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  baseInstance,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { useEditorStore } from "@/Store/EditorStore";
import { Button } from "@/components/ui/button";
import { AddFilesDarkUIconSVG, AddFilesUIconSVG } from "@/utils/SVGs/SVGs";
import { Loader2 } from "lucide-react";
import { ImageResize } from "quill-image-resize-module-ts";
import TooltipCommon from "@/components/common/TooltipCommon";
import { useCopywriterStore } from "@/Store/CopywriterStore";
import "../../../styles/common.css";
Quill.register("modules/imageResize", ImageResize);

interface QuillEditorProps {
  customerId: string | string[];
  updateId: string | string[];
  indicatorText: string | string[];
  handleEdit: string | string[];
  orderId: string | string[];
  productFlowId: string | string[];
  leadId: string | string[];
  technicalId: string | string[];
  copywriterId: string | string[];
  amendmentId: string | string[];
  websiteContentId: string | string[];

  setIsOpenReplyModel: Dispatch<SetStateAction<boolean>>;
  setOpenQuill: Dispatch<SetStateAction<boolean>>;
}
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
  handleEdit,
  handlesave,
  editContent,
}: any) => {
  const [value, setValue] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileURLs, setFileURLs] = useState<{ [key: string]: string }>({});
  const [buttonColor, setButtonColor] = useState<boolean>(false);
  const { fetchCopywriterData }: any = useCopywriterStore();
  const {
    fetchEditorData,
    fetchLeadsEditorData,
    fetchOrderEditorData,
    fetchTechnicalUpdateData,
    fetchAmendmentUpdateData,
    fetchProductFlowUpdateData,
    fetchWebsiteContentUpdateData,
    orderEditorData,
    fetchCopywriterUpdateData,
    editorData,
    addReplyData,
    addUpdateData,
    loading,
  }: any = useEditorStore();

  const handleClear = () => {
    setValue("");
  };

  const handleChanges = (value: string, editorData: any) => {
    setValue(() =>
      editorData.getText().trim() === "" && value === "" ? "" : value
    );
  };

  const handleAddData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((value !== "" && value !== "<p><br></p>") || images.length > 0) {
      try {
        setIsLoading(true);
        const formData = new FormData();

        formData.append("content", value);
        images.forEach((image) => formData.append("files", image));

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

        const responses = await Promise.all(requests.filter(Boolean));
        responses.forEach((response) => {
          if (response.status === 201) {
            successToastingFunction(response?.data?.message);
            fetchEditorData(customerId);
            fetchOrderEditorData(orderId);
            fetchLeadsEditorData(leadId);
            fetchTechnicalUpdateData(technicalId);
            fetchCopywriterUpdateData(copywriterId);
            fetchAmendmentUpdateData(amendmentId);
            fetchProductFlowUpdateData(productFlowId);
            fetchWebsiteContentUpdateData(websiteContentId);
            setIsOpenReplyModel(false);
            setOpenQuill(false);
            handleClear();
            setImages([]);
            setValue("");
          }

          fetchEditorData(customerId);
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
  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileList = Array.from(files);
      setImages((prevImages) => [...prevImages, ...fileList]);

      fileList.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const img = `<img src="${reader.result}" alt="${file.name}" style="width: 100px; height: 100px;"  />`;
            setValue((prevValue) => prevValue + img + `</br>`);
          };
          reader.readAsDataURL(file);
        } else {
          const url = URL.createObjectURL(file);
          setFileURLs((prev) => ({ ...prev, [file.name]: url }));
          const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${file.name}</a>`;
          setValue((prevValue) => prevValue + link + `</br>`);
        }
      });
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

    inputImage.onchange = (e) => {
      handleFileUpload(inputImage.files);
    };
  };

  useEffect(() => {
    return () => {
      Object.values(fileURLs).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileURLs]);

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    [{ size: ["small", false, "large", "huge"] }],
    // ["image"],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    // [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ color: [] }, { background: [] }],
    // [{ font: [] }],
    [{ align: [] }],
  ];

  // const options = {
  //   debug: "info",
  //   modules: {
  //     toolbar: toolbarOptions,
  //     imageResize: {
  //       parchment: Quill.import("parchment"),
  //       modules: ["Resize", "DisplaySize"],
  //     },
  //   },
  //   placeholder: "Compose an epic...",
  //   theme: "snow",
  // };
  const options = {
    debug: "info",
    modules: {
      toolbar: toolbarOptions,
      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize"],
      },
    },
    placeholder: "Compose a message...",
    theme: "snow",
  };

  return (
    <>
      <form onSubmit={handleAddData} className="flex gap-1 mb-1 flex-col ">
        <div className="">
          <ReactQuill
            placeholder={options.placeholder}
            theme={options.theme}
            modules={options.modules}
            value={value}
            onChange={(value, _, __, editor) => {
              handleChanges(value, editor);
            }}
          />
        </div>
        <div className="flex justify-start gap-2 items-center">
          <Button
            type="submit"
            className="cursor-pointer h-[24px] rounded-md border border-primary bg-primary px-4 text-white transition hover:bg-opacity-90"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#fff]" />
            ) : indicatorText === "reply" ? (
              "Reply"
            ) : (
              "Update"
            )}
          </Button>

          <div onClick={imageHandler} className="w-fit cursor-pointer ">
            <TooltipCommon text="Add Files">
              <div className="hover:bg-gray-100 px-2 py-1 rounded-md">
                <AddFilesDarkUIconSVG />
              </div>
            </TooltipCommon>
          </div>
        </div>
      </form>
    </>
  );
};

export default QuillEditor;

// +++++++++++++++++++++++++++
// +++++++++++++++++++++++++++

// "use client";
// import React, {
//   Dispatch,
//   SetStateAction,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import ReactQuill, { Quill } from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import {
//   baseInstance,
//   errorToastingFunction,
//   successToastingFunction,
// } from "@/common/commonFunctions";
// import { useEditorStore } from "@/Store/EditorStore";
// import { Button } from "@/components/ui/button";
// import { AddFilesDarkUIconSVG, AddFilesUIconSVG } from "@/utils/SVGs/SVGs";
// import { Loader2 } from "lucide-react";
// import TooltipCommon from "@/components/common/TooltipCommon";
// import { useCopywriterStore } from "@/Store/CopywriterStore";
// import "../../../styles/common.css";
// import { Mention } from "quill-mention";
// import "quill-mention/dist/quill.mention.css";
// import { ImageResize } from "quill-image-resize-module-ts";
// import "quill-mention/autoregister";

// Quill.register("modules/mention", Mention);
// Quill.register("modules/imageResize", ImageResize);
// interface QuillEditorProps {
//   customerId: string | string[];
//   updateId: string | string[];
//   indicatorText: string | string[];
//   handleEdit: string | string[];
//   orderId: string | string[];
//   productFlowId: string | string[];
//   leadId: string | string[];
//   technicalId: string | string[];
//   copywriterId: string | string[];
//   amendmentId: string | string[];
//   websiteContentId: string | string[];

//   setIsOpenReplyModel: Dispatch<SetStateAction<boolean>>;
//   setOpenQuill: Dispatch<SetStateAction<boolean>>;
// }

// interface User {
//   id: number;
//   name: string;
// }
// const QuillEditor: React.FC<QuillEditorProps> = ({
//   customerId,
//   setIsOpenReplyModel,
//   setOpenQuill,
//   updateId,
//   productFlowId,
//   orderId,
//   technicalId,
//   leadId,
//   indicatorText,
//   amendmentId,
//   copywriterId,
//   websiteContentId,
//   handleEdit,
//   handlesave,
//   editContent,
// }: any) => {
//   const [value, setValue] = useState<string>("");
//   const [updatedValue, setUpdatedValue] = useState<string>("");
//   const [images, setImages] = useState<File[]>([]);
//   const [userIds, setUserIds] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [fileURLs, setFileURLs] = useState<{ [key: string]: string }>({});
//   const [buttonColor, setButtonColor] = useState<boolean>(false);
//   const { fetchCopywriterData }: any = useCopywriterStore();
//   const {
//     fetchEditorData,
//     fetchLeadsEditorData,
//     fetchOrderEditorData,
//     fetchTechnicalUpdateData,
//     fetchAmendmentUpdateData,
//     fetchProductFlowUpdateData,
//     fetchWebsiteContentUpdateData,
//     orderEditorData,
//     fetchCopywriterUpdateData,
//     editorData,
//     addReplyData,
//     addUpdateData,
//     loading,
//   }: any = useEditorStore();

//   const handleClear = () => {
//     setValue("");
//   };

//   // const users = ["Alice", "Bob", "Charlie", "David"];
//   const users = [
//     { id: 1, name: "Alice" },
//     { id: 2, name: "Bob" },
//     { id: 3, name: "Charlie" },
//     { id: 4, name: "David" },
//   ];

//   // const handleChanges = (value: string, editorData: any) => {
//   //   console.log("value", value);
//   //   console.log("editorData", editorData.getText().trim());
//   //   setValue(() =>
//   //     editorData.getText().trim() === "" && value === "" ? "" : value
//   //   );
//   // };

//   // const handleChanges = (newValue: string, editorData: any) => {
//   //   console.log("value", newValue);
//   //   console.log("editorData", editorData.getText().trim());
//   //   setValue(() =>
//   //     editorData.getText().trim() === "" && newValue === "" ? "" : newValue
//   //   );
//   //   console.log("newValue", newValue.endsWith("@"));
//   //   console.log("newValue", newValue.endsWith("@"));

//   //   if (newValue.endsWith("@")) {
//   //     setShowDropdown(true);
//   //   } else {
//   //     setShowDropdown(false);
//   //   }
//   // };
//   console.log("updatedValue", updatedValue);
//   console.log("value", value);

//   const handleChanges = (newValue: any, editorData: any) => {
//     console.log("editorData", editorData.getText().trim());

//     setValue(() =>
//       editorData.getText().trim() === "" && newValue === "" ? "" : newValue
//     );

//     const atIndex = newValue.lastIndexOf("@");
//     if (atIndex !== -1) {
//       const query = newValue.substring(atIndex + 1); // Get text after last "@"
//       setFilteredUsers(
//         users.filter((user) =>
//           user?.name?.toLowerCase().includes(query.toLowerCase())
//         )
//       );
//       setShowDropdown(query.length > 0); // Show dropdown if there's text after "@"
//     } else {
//       setShowDropdown(false);
//     }
//   };

//   const handleUserSelect = (username: any) => {
//     console.log("v", username);
//     const atIndex = value.lastIndexOf("@");
//     const updatedNameValue =
//       value.substring(0, atIndex) + `<p > ${username?.name}</p>` + " ";
//     const updatedIdValue =
//       value.substring(0, atIndex) + "@" + username?.id + " " + "</p>";
//     console.log("updatedNameValue", updatedNameValue);
//     console.log("lastData", value.substring(0, atIndex));
//     console.log("updatedIdValue", updatedIdValue);
//     setValue(updatedNameValue);
//     setUpdatedValue(updatedIdValue);
//     setShowDropdown(false);
//   };

//   const handleAddData = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if ((value !== "" && value !== "<p><br></p>") || images.length > 0) {
//       try {
//         setIsLoading(true);
//         const formData = new FormData();

//         formData.append("content", updatedValue);
//         images.forEach((image) => formData.append("files", image));

//         const requests = [];

//         if (indicatorText === "post") {
//           requests.push(
//             orderId && baseInstance.post(`/updates/order/${orderId}`, formData),
//             productFlowId &&
//               baseInstance.post(
//                 `/updates/productflow/${productFlowId}`,
//                 formData
//               ),
//             customerId &&
//               baseInstance.post(`/updates/customer/${customerId}`, formData),
//             leadId && baseInstance.post(`/updates/lead/${leadId}`, formData),
//             technicalId &&
//               baseInstance.post(
//                 `/updates/technicaltracker/${technicalId}`,
//                 formData
//               ),
//             copywriterId &&
//               baseInstance.post(
//                 `/updates/copywritertracker/${copywriterId}`,
//                 formData
//               ),

//             websiteContentId &&
//               baseInstance.post(
//                 `/updates/newwebsitecontent/${websiteContentId}`,
//                 formData
//               ),
//             amendmentId &&
//               baseInstance.post(`/updates/amendment/${amendmentId}`, formData)
//           );
//         }

//         if (indicatorText === "reply") {
//           requests.push(
//             baseInstance.post(`/updates/update/reply/${updateId}`, formData)
//           );
//         }

//         const responses = await Promise.all(requests.filter(Boolean));
//         responses.forEach((response) => {
//           if (response.status === 201) {
//             successToastingFunction(response?.data?.message);
//             fetchEditorData(customerId);
//             fetchOrderEditorData(orderId);
//             fetchLeadsEditorData(leadId);
//             fetchTechnicalUpdateData(technicalId);
//             fetchCopywriterUpdateData(copywriterId);
//             fetchAmendmentUpdateData(amendmentId);
//             fetchProductFlowUpdateData(productFlowId);
//             fetchWebsiteContentUpdateData(websiteContentId);
//             setIsOpenReplyModel(false);
//             setOpenQuill(false);
//             handleClear();
//             setImages([]);
//             setValue("");
//             setUpdatedValue("");
//           }

//           fetchEditorData(customerId);
//         });
//       } catch (error) {
//         errorToastingFunction(error);
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       errorToastingFunction("Please enter text or upload an image to submit.");
//     }
//   };
//   const handleFileUpload = (files: FileList | null) => {
//     if (files) {
//       const fileList = Array.from(files);
//       setImages((prevImages) => [...prevImages, ...fileList]);

//       fileList.forEach((file) => {
//         if (file.type.startsWith("image/")) {
//           const reader = new FileReader();
//           reader.onloadend = () => {
//             const img = `<img src="${reader.result}" alt="${file.name}" />`;
//             setValue((prevValue) => prevValue + img + `</br>`);
//           };
//           reader.readAsDataURL(file);
//         } else {
//           const url = URL.createObjectURL(file);
//           setFileURLs((prev) => ({ ...prev, [file.name]: url }));
//           const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${file.name}</a>`;
//           setValue((prevValue) => prevValue + link + `</br>`);
//         }
//       });
//     }
//   };

//   const imageHandler = () => {
//     const inputImage = document.createElement("input");
//     inputImage.setAttribute("type", "file");
//     inputImage.setAttribute(
//       "accept",
//       "image/, video/, .pdf, .xlsx, .doc, .docx"
//     );
//     inputImage.setAttribute("multiple", "true");
//     inputImage.click();

//     inputImage.onchange = (e) => {
//       handleFileUpload(inputImage.files);
//     };
//   };

//   useEffect(() => {
//     return () => {
//       Object.values(fileURLs).forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [fileURLs]);

//   const toolbarOptions = [
//     ["bold", "italic", "underline", "strike"],
//     [{ size: ["small", false, "large", "huge"] }],
//     // ["image"],
//     [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
//     // [{ script: "sub" }, { script: "super" }],
//     [{ indent: "-1" }, { indent: "+1" }],
//     [{ direction: "rtl" }],
//     [{ color: [] }, { background: [] }],
//     // [{ font: [] }],
//     [{ align: [] }],
//     ["mention"],
//   ];

//   // const mentionOptions = {
//   //   allowedChars: /^[A-Za-z\s]*$/,
//   //   mentionDenotationChars: ["@"],
//   //   source: (searchTerm, renderItem) => {
//   //     const mentions = [
//   //       { id: 1, value: "Alice" },
//   //       { id: 2, value: "Bob" },
//   //       { id: 3, value: "Charlie" },
//   //     ];
//   //     const matches = mentions.filter((item) =>
//   //       item.value.toLowerCase().includes(searchTerm.toLowerCase())
//   //     );
//   //     renderItem(matches, searchTerm);
//   //   },
//   // };

//   // console.log("Quill: ", Quill);

//   // const options = {
//   //   debug: "info",
//   //   modules: {
//   //     toolbar: toolbarOptions,
//   //     imageResize: {
//   //       parchment: Quill.import("parchment"),
//   //       modules: ["Resize", "DisplaySize"],
//   //     },
//   //   },
//   //   placeholder: "Compose an epic...",
//   //   theme: "snow",
//   // };
//   // const options = {
//   //   debug: "info",
//   //   modules: {
//   //     toolbar: toolbarOptions,
//   //     imageResize: {
//   //       parchment: Quill.import("parchment"),
//   //       modules: ["Resize", "DisplaySize"],
//   //     },
//   //   },
//   //   placeholder: "Compose an epic...",
//   //   theme: "snow",
//   // };

//   const options = {
//     debug: "info",
//     modules: {
//       toolbar: toolbarOptions,
//       // mention: mentionOptions,
//       imageResize: {
//         parchment: Quill.import("parchment"),
//         modules: ["Resize", "DisplaySize"],
//       },
//     },
//     placeholder: "Compose an epic...",
//     theme: "snow",
//   };

//   return (
//     <>
//       <form onSubmit={handleAddData} className="flex gap-1 mb-1 flex-col ">
//         <div className="">
//           {/* <ReactQuill
//             placeholder={options.placeholder}
//             theme={options.theme}
//             modules={options.modules}
//             value={value}
//             onChange={(value, , _, editor) => {
//               handleChanges(value, editor);
//             }}
//           /> */}
//           <ReactQuill
//             placeholder={options.placeholder}
//             theme={options.theme}
//             modules={options.modules}
//             value={value}
//             onChange={(value, delta, source, editor) => {
//               return handleChanges(value, editor);
//             }}
//           />
//         </div>
//         {showDropdown && (
//           <div className="border bg-white absolute z-1">
//             {users.map((user) => (
//               <div
//                 key={user?.id}
//                 onClick={() => handleUserSelect(user)}
//                 className="p-[8px] hover:bg-[#f0f0f0]"
//                 style={{ cursor: "pointer" }}
//               >
//                 {user?.name}
//               </div>
//             ))}
//           </div>
//         )}
//         <div className="flex justify-start gap-2 items-center">
//           <Button
//             type="submit"
//             className="cursor-pointer h-[24px] rounded-md border border-primary bg-primary px-4 text-white transition hover:bg-opacity-90"
//           >
//             {isLoading ? (
//               <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#fff]" />
//             ) : indicatorText === "reply" ? (
//               "Reply"
//             ) : (
//               "Update"
//             )}
//           </Button>

//           <div onClick={imageHandler} className="w-fit cursor-pointer ">
//             <TooltipCommon text="Add Files">
//               <div className="hover:bg-gray-100 px-2 py-1 rounded-md">
//                 <AddFilesDarkUIconSVG />
//               </div>
//             </TooltipCommon>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// };

// export default QuillEditor;

// =======================================
// =======================================
// =======================================
// =======================================
// =======================================

// import React, { useState } from "react";
// import ReactQuill, { Quill } from "react-quill";
// import { Mention } from "quill-mention";
// import "react-quill/dist/quill.snow.css";
// // import "./App.css";

// Quill.register("modules/mentions", Mention);

// const QuillEditor = (props: any) => {
//   const [html, setHtml] = useState("");
//   return (
//     <div className="quill-wrapper">
//       <ReactQuill
//         theme={"snow"}
//         onChange={setHtml}
//         value={html}
//         modules={QuillEditor.modules}
//         formats={QuillEditor.formats}
//         bounds={".quill-wrapper"}
//         placeholder={"Type something"}
//       />
//     </div>
//   );
// };

// const mentionModule = {
//   mentionDenotationChars: ["@"],
//   source: (searchTerm: any, renderList: any, mentionChar: any) => {
//     renderList(
//       [
//         { id: 1, value: "alpha" },
//         { id: 2, value: "beta" },
//       ].filter((v) => v.value.includes(searchTerm)),
//       searchTerm
//     );
//   },
// };

// /*
//  * Quill modules to attach to editor
//  * See https://quilljs.com/docs/modules/ for complete options
//  */

// QuillEditor.modules = {
//   toolbar: [
//     [{ header: "1" }, { header: "2" }, { font: [] }],
//     [{ size: [] }],
//     ["bold", "italic", "underline", "strike", "blockquote"],
//     [
//       { list: "ordered" },
//       { list: "bullet" },
//       { indent: "-1" },
//       { indent: "+1" },
//     ],
//     ["link", "image", "video"],
//     ["clean"],
//   ],
//   clipboard: {
//     // toggle to add extra line breaks when pasting HTML:
//     matchVisual: false,
//   },
//   mention: mentionModule,
// };

// /*
//  * Quill editor formats
//  * See https://quilljs.com/docs/formats/
//  */

// QuillEditor.formats = [
//   "header",
//   "font",
//   "size",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "blockquote",
//   "list",
//   "bullet",
//   "indent",
//   "link",
//   "image",
//   "video",
//   "mention",
// ];

// export default QuillEditor;
