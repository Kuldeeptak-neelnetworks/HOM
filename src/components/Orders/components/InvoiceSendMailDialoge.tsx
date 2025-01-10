// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import { FileTextIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
// import ReactQuill from "react-quill";
// import CreatableSelect from "react-select/creatable";
// import "react-quill/dist/quill.snow.css";
// import { Button } from "@/components/ui/button";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import {
//   baseInstance,
//   errorToastingFunction,
//   headerOptions,
//   successToastingFunction,
// } from "@/common/commonFunctions";
// import { useOrderStore } from "@/Store/OrderStore";
// import { Loader2 } from "lucide-react";

// const InvoiceSendMailDialoge = ({ id, customerEmail }: any) => {
//   const [open, setOpen] = useState<boolean>(false);
//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, 4, 5, 6, false] }],
//       ["bold", "italic", "underline", "blockquote"],
//       [
//         { list: "ordered" },
//         { list: "bullet" },
//         { indent: "-1" },
//         { indent: "+1" },
//       ],
//       ["link"],
//     ],
//   };

//   const [mailDetails, setMailDetails] = useState({
//     to: customerEmail || "",
//     subject: "",
//   });

//   const [emailBody, setEmailBody] = useState("");
//   const { fetchAllOrdersData } = useOrderStore();

//   const [isMail, setIsMail] = useState(false);
//   const formik = useFormik({
//     initialValues: {
//       to: "",
//       subject: "",
//       message: "",
//     },

//     validationSchema: Yup.object().shape({
//       email: Yup.string()
//         .email("Invalid email address")
//         .required("Email is required"),
//       to: Yup.string().required("To field is required"),
//       subject: Yup.string().trim().required("Subject is required"),
//       message: Yup.string().required("Message is required"),
//     }),

//     onSubmit: async (values) => {
//       try {
//         setIsMail(() => true);

//         const data = {
//           to: mailDetails.to,
//           subject: mailDetails.subject,
//           message: emailBody,
//         };

//         const response = await baseInstance.post(
//           `/orders/send-invoice/${id}`,
//           data
//         );

//         if (response?.status === 200) {
//           fetchAllOrdersData();
//           successToastingFunction(response?.data?.message);
//           setIsMail(() => false);
//         }
//       } catch (error: any) {
//         if (error?.response && error?.response?.data) {
//           errorToastingFunction(error?.response?.data.message);
//         } else {
//           errorToastingFunction(error?.response?.data.message);
//         }
//       } finally {
//         setIsMail(() => false);
//       }
//     },
//   });
//   const {
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     values,
//     touched,
//     errors,
//     setFieldValue,
//   } = formik;

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       {/* Button Section  */}
//       <DialogTrigger>
//         <FileTextIcon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//       </DialogTrigger>
//       {/* form Section  */}
//       <DialogContent className="sm:max-w-[600px]">
//         <div className="flex justify-center text-xl">
//           <FileTextIcon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />{" "}
//           Mail Invoice
//         </div>
//         <div className="border-t border-gray-200"></div>
//         <form onSubmit={handleSubmit} className=" ">
//           <div className="mb-3 mt-3">
//             <label
//               className="mb-2.5 block font-medium text-black dark:text-white"
//               htmlFor="from"
//             >
//               From:
//             </label>

//             <div className="relative">
//               <input
//                 id="from"
//                 name="from"
//                 type="email"
//                 value="info@highoaksmedia.co.uk"
//                 disabled
//                 className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//               />
//             </div>
//           </div>

//           <div className="mb-3 ">
//             <label
//               className="mb-2.5 block font-medium text-black dark:text-white "
//               htmlFor="to"
//             >
//               To:
//             </label>
//             <CreatableSelect
//               className="react-select-custom-styling__container"
//               classNamePrefix="react-select-custom-styling"
//               isClearable={true}
//               isSearchable={true}
//               name="to"
//               styles={{
//                 control: (provided) => ({
//                   ...provided,
//                   paddingLeft: "0.3rem",
//                 }),
//               }}
//               options={
//                 customerEmail
//                   ? [{ value: customerEmail, label: customerEmail }]
//                   : []
//               }
//               value={
//                 mailDetails.to
//                   ? { value: mailDetails.to, label: mailDetails.to }
//                   : null
//               }
//               onChange={(option) =>
//                 setMailDetails((prevState) => ({
//                   ...prevState,
//                   to: option ? option.value : "",
//                 }))
//               }
//               placeholder="Select or add new email"
//             />
//           </div>

//           <div className="mb-3">
//             <label
//               htmlFor="subject"
//               className="mb-2.5 block font-medium text-black dark:text-white"
//             >
//               Subject:
//             </label>
//             <div className="relative">
//               <input
//                 id="subject"
//                 name="subject"
//                 placeholder="Subject"
//                 value={mailDetails.subject}
//                 onChange={(e) =>
//                   setMailDetails((prev) => ({
//                     ...prev,
//                     subject: e.target.value,
//                   }))
//                 }
//                 required
//                 className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//               />
//             </div>
//           </div>

//           <div className="mb-3">
//             <label
//               htmlFor="message"
//               className="mb-2.5 block font-medium text-black dark:text-white"
//             >
//               Message:
//             </label>
//             {/* <div className="relative"> */}{" "}
//             <ReactQuill
//               theme="snow"
//               value={emailBody}
//               onChange={setEmailBody}
//               placeholder="Write a short brief about the invoice..."
//               modules={modules}
//               className="h-32"
//             />
//             {/* </div> */}
//           </div>
//           <div className="h-10"></div>

//           <div className="mb-3 ">
//             <label
//               htmlFor="message"
//               className="mb-2.5 block font-medium text-black dark:text-white"
//             >
//               📁 Invoice Attached
//             </label>
//           </div>

//           <div className="mb-3 flex justify-center ">
//             <Button
//               type="submit"
//               className="cursor-pointer  border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 "
//             >
//               {isMail ? (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               ) : (
//                 "Submit"
//               )}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default InvoiceSendMailDialoge;
"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FileTextIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import ReactQuill from "react-quill";
import CreatableSelect from "react-select/creatable";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  baseInstance,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { useOrderStore } from "@/Store/OrderStore";
import { Loader2 } from "lucide-react";

type Props = {
  id: string;
  customerEmail: string;
  dateOfOrder: string;
};
const InvoiceSendMailDialoge: React.FC<Props> = ({
  id,
  customerEmail,
  dateOfOrder,
}) => {
  const { fetchAllOrdersData } = useOrderStore();
  const [isMail, setIsMail] = useState(false);
  const [open, setOpen] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
    ],
  };

  const formik = useFormik({
    initialValues: {
      to: customerEmail || "",
      subject: "",
      message: "",
    },

    validationSchema: Yup.object().shape({
      to: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email format"
        )
        .required("Email field is required"),

      subject: Yup.string().trim().required("Subject is required"),
      message: Yup.string().required("Message is required"),
    }),

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setIsMail(true);

        const data = {
          to: values.to,
          subject: values.subject,
          message: values.message,
        };

        const response = await baseInstance.post(
          `/orders/send-invoice/${id}`,
          data
        );

        if (response?.status === 200) {
          fetchAllOrdersData(new Date(dateOfOrder).getFullYear());
          successToastingFunction(response?.data?.message);
          resetForm();
          setOpen(false);
        }
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        } else {
          errorToastingFunction("Failed to send invoice. Please try again.");
        }
      } finally {
        setIsMail(false);
        setSubmitting(false);
      }
    },
  });

  const { handleSubmit, handleChange, values, touched, errors, setFieldValue } =
    formik;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <EnvelopeClosedIcon className="h-[1.35rem] w-[1.75rem] p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] text-[0.8rem]">
        <div className="flex justify-center text-xl">
          <FileTextIcon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />{" "}
          Mail Invoice
        </div>
        <div className="border-t border-gray-200"></div>
        <form onSubmit={handleSubmit} className=" ">
          <div className="mb-3 mt-3">
            <label
              className="mb-2.5 block font-medium text-black dark:text-white"
              htmlFor="from"
            >
              From:
            </label>
            <div className="relative">
              <input
                id="from"
                name="from"
                type="email"
                value="info@highoaksmedia.co.uk"
                // value="divya@neelnetworks.com"
                disabled
                className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-3">
            <label
              className="mb-2.5 block font-medium text-black dark:text-white "
              htmlFor="to"
            >
              To:
            </label>
            <CreatableSelect
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
              isClearable={true}
              isSearchable={true}
              name="to"
              value={values.to ? { value: values.to, label: values.to } : null}
              onChange={(option) =>
                setFieldValue("to", option ? option.value : "")
              }
              options={
                customerEmail
                  ? [{ value: customerEmail, label: customerEmail }]
                  : []
              }
              placeholder="Select or add new email"
            />
            {touched.to && errors.to && (
              <div className="text-red-500">{errors.to}</div>
            )}
          </div>

          <div className="mb-3">
            <label
              htmlFor="subject"
              className="mb-2.5 block font-medium text-black dark:text-white"
            >
              Subject:
            </label>
            <input
              id="subject"
              name="subject"
              placeholder="Subject"
              value={values.subject}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {touched.subject && errors.subject && (
              <div className="text-red-500">{errors.subject}</div>
            )}
          </div>

          <div className="mb-3">
            <label
              htmlFor="message"
              className="mb-2.5 block font-medium text-black dark:text-white"
            >
              Message:
            </label>
            <ReactQuill
              theme="snow"
              value={values.message}
              onChange={(value) => setFieldValue("message", value)}
              modules={modules}
              className="h-32"
            />
            {touched.message && errors.message && (
              <div className="text-red-500">{errors.message}</div>
            )}
          </div>

          <div className="h-10"></div>
          <div className="mb-3 ">
            <label
              htmlFor="message"
              className="mb-2.5 block font-medium text-black dark:text-white"
            >
              📁 Invoice Attached
            </label>
          </div>
          <div className="mb-3 flex justify-center ">
            <Button
              type="submit"
              disabled={isMail}
              className={`cursor-pointer  border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 ${
                isMail ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isMail ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceSendMailDialoge;
