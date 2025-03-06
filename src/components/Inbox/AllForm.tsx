import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ImageResize } from "quill-image-resize-module-ts";
import QuillMention from "quill-mention";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import TooltipCommon from "@/components/common/TooltipCommon";
import { AddFilesDarkUIconSVG } from "@/utils/SVGs/SVGs";
import { useEditorStore } from "@/Store/EditorStore";
import { useCopywriterStore } from "@/Store/CopywriterStore";
import { editorConfig } from "../common/Editor/config";
import type { QuillEditorProps } from "../common/Editor/types";
import "../../styles/editor.css";
import "../../styles/common.css";
import { useUserStore } from "@/Store/UserStore";
import { atValues } from "../common/Editor/mentions";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import makeAnimated from "react-select/animated";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import SelectReactSelect from "react-select";
import Select2 from "react-select";
import {
  baseInstance,
  errorToastingFunction,
  headerOptions,
  successToastingFunction,
} from "@/common/commonFunctions";
import { CalendarIcon, Loader2 } from "lucide-react";
import { LoaderIconSVG, PhoneIconSVG, UserIconSVG } from "@/utils/SVGs/SVGs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCustomerStore } from "@/Store/CustomerStore";
import { useAmendmentStore } from "@/Store/AmendmentStore";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/Store/NotificationStore";
// Register Quill modules
Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/mention", QuillMention);

const AllForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [value, setValue] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileURLs, setFileURLs] = useState<{ [key: string]: string }>({});
  const [mentionedUserIds, setMentionedUserIds] = useState<string[]>([]);
  const quillRef = useRef<ReactQuill>(null);
  const { fetchNotificationData } = useNotificationStore();
  const router = useRouter();
  const [userLoading, setUserLoading] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { fetchAllCustomerData, customerData }: any = useCustomerStore();
  const { fetchUsersData, userData }: any = useUserStore();
  const { addMultipleForm }: any = useAmendmentStore();
  function formatDate(date: any) {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, "0");
    let day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleDateSelect = (selectedDate: any) => {
    setDate(selectedDate);
  };

  useEffect(() => {
    fetchUsersData();
  }, []);
  useEffect(() => {
    fetchAllCustomerData(1, 20);
  }, []);
  const [isCustomerValid, setIsCustomerValid] = useState(false);

  useEffect(() => {
    fetchAllCustomerData();
  }, []);

  const startYear = getYear(new Date()) - 100;
  const endYear = getYear(new Date()) + 100;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  //  Function to handle month change
  const handleMonthChange = (month: string) => {
    if (date) {
      const newDate = setMonth(date, months.indexOf(month));
      setDate(newDate);
    } else {
      const newDate = setMonth(new Date(), months.indexOf(month));
      setDate(newDate);
    }
  };

  // Function to handle year change
  const handleYearChange = (year: string) => {
    if (date) {
      const newDate = setYear(date, parseInt(year));
      setDate(newDate);
    } else {
      const newDate = setYear(new Date(), parseInt(year));
      setDate(newDate);
    }
  };

  const handleSelectDate = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const currentMonthDate = date ? getMonth(date) : getMonth(new Date());
  const currentYearDate = date ? getYear(date) : getYear(new Date());

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

  useEffect(() => {
    return () => {
      Object.values(fileURLs).forEach((url) => {
        return URL.revokeObjectURL(url);
      });
    };
  }, [fileURLs]);

  const animatedComponents = makeAnimated();
  const [statusValue, setStatusValue] = React.useState("Amendment");

  const contentOptions = [
    { label: "Amendment", value: "Amendment" },
    { label: "Technical Tracker", value: "Technical" },
    // { label: "Product Flow", value: "Product Flow" },
    { label: "Copy Writer Tracker", value: "Copy Writer Tracker" },
    // { label: "New Website Content", value: "New Website Content" },
  ];
  const [dateComplete, setDateComplete] = useState<Date | undefined>(undefined);
  const [datePhase1Instructed, setDatePhase1Instructed] = useState<
    Date | undefined
  >(undefined);
  const [datePhase2Instructed, setDatePhase2Instructed] = useState<
    Date | undefined
  >(undefined);
  const [demoCompletedDate, setDemoCompletedDate] = useState<Date | undefined>(
    undefined
  );
  const [liveDate, setLiveDate] = useState<Date | undefined>(undefined);
  const formik = useFormik({
    initialValues: {
      customer_status: "",
      date_current: "",
      subject: "",
      priority: "",
      generated_by: "",
      customerName: "",
      timeTakenMinutes: "",
      status: "",
      technicalTask: "",
      currentStage: "",
      datePhase1Instructed: "",
      datePhase2Instructed: "",
      demoLink: "",
      demoCompletedDate: "",
      liveDate: "",
      notes: "",
      selectedCustomerId: "",
      liveUrl: "",
      demoUrl: "",
      mentions: [] as string[],
    },

    onSubmit: async (values) => {
      try {
        setUserLoading(() => true);
        setIsUserValid(() => true);
        const subject = values.subject;
        const data = {
          content: value,
          files: updatedUrls || [],
          // mentions: mentionedUserIds || [],
          mentions: values.mentions || [], //
          customer_status: values.customer_status,
          priority: values.priority,
          subject: values.subject || "Amendment",
          // subject:subject,
          live_url: values.liveUrl,
          demo_url: values.demoUrl,
          date_current: formatDate(date),
          // generated_by: values.generated_by,
          customer_name: values.customerName,

          timeTakenMinutes: values.timeTakenMinutes,
          status: values.status,
          technicalTask: values.technicalTask,

          currentStage: values.currentStage,
          datePhase1Instructed: formatDate(datePhase1Instructed),
          datePhase2Instructed: formatDate(datePhase2Instructed),
          demoLink: values.demoLink,
          demoCompletedDate: formatDate(demoCompletedDate),
          liveDate: formatDate(liveDate),
          notes: values.notes,

          dateComplete: formatDate(dateComplete),
        };

        // Send the data as JSON
        await addMultipleForm(data, selectedCustomerId);

        // Fetch updated data after the submission
        fetchNotificationData();
        // const subjectPage = values.subject;
        // if (values.subject === "TechnicalTracker") {
        //   router.push("/technical");
        // } else if (values.subject === "Amendemnet") {
        //   router.push("/amendment");
        // } else if (values.subject === "ProductFlow") {
        //   router.push("/productFlow");
        // } else {
        //   router.push(`/dashboard`);
        // }

        setOpen(false);
        // router.push("/amendment");
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        } else {
          errorToastingFunction("An error occurred");
        }
      } finally {
        setIsUserValid(() => false);
        setUserLoading(() => false);
      }
    },
  });

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
  } = formik;
  const handleStatusChange = (selectedOption: any) => {
    const selectedStatus = selectedOption?.value || "Amendment";
    setStatusValue(selectedStatus);
    if (selectedStatus === "Amendment") {
      formik.setFieldValue("subject", "Amendment");
    } else if (selectedStatus === "Technical") {
      formik.setFieldValue("subject", "TechnicalTracker");
    } else if (selectedStatus === "Product Flow") {
      formik.setFieldValue("subject", "ProductFlow");
    } else if (selectedStatus === "Copy Writer Tracker") {
      formik.setFieldValue("subject", "CopywriterTracker");
    } else {
      formik.setFieldValue("subject", selectedStatus);
    }
  };

  const handleMonthChange2 = (
    month: string,
    target: "phase1" | "phase2" | "demo" | "live"
  ) => {
    const monthIndex = months.indexOf(month);
    if (monthIndex === -1) return;

    const dateMap = {
      phase1: setDatePhase1Instructed,
      phase2: setDatePhase2Instructed,
      demo: setDemoCompletedDate,
      live: setLiveDate,
    };

    const currentDate = {
      phase1: datePhase1Instructed,
      phase2: datePhase2Instructed,
      demo: demoCompletedDate,
      live: liveDate,
    }[target];

    const newDate = currentDate
      ? setMonth(currentDate, monthIndex)
      : setMonth(new Date(), monthIndex);

    dateMap[target](newDate);
  };

  const handleYearChange2 = (
    year: string,
    target: "phase1" | "phase2" | "demo" | "live"
  ) => {
    const yearNumber = parseInt(year);
    if (isNaN(yearNumber)) return;

    const dateMap = {
      phase1: setDatePhase1Instructed,
      phase2: setDatePhase2Instructed,
      demo: setDemoCompletedDate,
      live: setLiveDate,
    };

    const currentDate = {
      phase1: datePhase1Instructed,
      phase2: datePhase2Instructed,
      demo: demoCompletedDate,
      live: liveDate,
    }[target];

    const newDate = currentDate
      ? setYear(currentDate, yearNumber)
      : setYear(new Date(), yearNumber);

    dateMap[target](newDate);
  };
  const getCurrentMonthAndYear = (date: Date | undefined) => ({
    month: date ? getMonth(date) : getMonth(new Date()),
    year: date ? getYear(date) : getYear(new Date()),
  });
  const { month: currentMonthPhase1, year: currentYearPhase1 } =
    getCurrentMonthAndYear(datePhase1Instructed);
  const { month: currentMonthPhase2, year: currentYearPhase2 } =
    getCurrentMonthAndYear(datePhase2Instructed);
  const { month: currentMonthDemo, year: currentYearDemo } =
    getCurrentMonthAndYear(demoCompletedDate);
  const { month: currentMonthLive, year: currentYearLive } =
    getCurrentMonthAndYear(liveDate);

  const handlePhase1Instructed = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDatePhase1Instructed(selectedDate);
    }
  };

  const handlePhase2Instructed = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDatePhase2Instructed(selectedDate);
    }
  };

  const handleDemoCompletedDate = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDemoCompletedDate(selectedDate);
    }
  };

  const handleLiveDate = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setLiveDate(selectedDate);
    }
  };

  const handleComplateDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDateComplete(selectedDate);
    }
  };

  const currentMonth = dateComplete
    ? getMonth(dateComplete)
    : getMonth(new Date());
  const currentYear = dateComplete
    ? getYear(dateComplete)
    : getYear(new Date());
  return (
    <>
      <div className="w-[644px] px-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Select Type
        </label>
        <Select2
          className="text-[0.8rem] boxShadow"
          closeMenuOnSelect={true}
          components={animatedComponents}
          options={contentOptions}
          value={contentOptions.find((option) => option.value === statusValue)}
          onChange={handleStatusChange}
          placeholder="Select a Types"
        />
      </div>
      {statusValue === "Amendment" && (
        <ScrollArea className="h-[30rem] px-3 py-3">
          <form
            onSubmit={handleSubmit}
            className="border p-6 text-[0.8rem] bg-[#fff]"
          >
            <div className="mb-3 mt-1">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Select Company <span style={{ opacity: "0.5" }}> * </span>
              </label>
              <div className="relative">
                {!customerData?.customers ? (
                  <div className="flex justify-start">
                    <LoaderIconSVG />
                    <span className="px-2">Loading...</span>
                  </div>
                ) : (
                  <SelectReactSelect
                    closeMenuOnSelect={true}
                    isClearable={true}
                    options={customerData.customers.map((customer: any) => ({
                      value: customer._id,
                      label: customer.companyName,
                    }))}
                    onChange={(selectedOption: { value: any } | null) => {
                      setSelectedCustomerId(
                        selectedOption ? selectedOption.value : null
                      );
                    }}
                    placeholder="Select a Company"
                  />
                )}
                {/* )}  */}
              </div>
            </div>

            <div className="mb-3 w-full">
              <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white ">
                Assigned To
              </label>
              <div className="relative">
                {!userLoading && userData?.length === 0 ? (
                  <div className="flex justify-start">
                    <LoaderIconSVG />
                    <span className="px-2">Loading...</span>
                  </div>
                ) : (
                  <SelectReactSelect
                    name="mentions"
                    isMulti
                    closeMenuOnSelect={false}
                    isClearable={true}
                    options={userData?.map(
                      (user: { _id: any; fullName: any }) => ({
                        value: user?._id,
                        label: user?.fullName,
                      })
                    )}
                    onChange={(selectedOptions) => {
                      formik.setFieldValue(
                        "mentions",
                        selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : []
                      );
                    }}
                    value={
                      formik.values.mentions
                        ? userData
                            .filter((user: { _id: string }) =>
                              formik.values.mentions.includes(user._id)
                            )
                            .map((user: { _id: any; fullName: any }) => ({
                              value: user._id,
                              label: user.fullName,
                            }))
                        : []
                    }
                  />
                )}
              </div>
            </div>

            {/* Current Date  */}
            {/* <div className="mb-3">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Current Date
              </label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[250px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date && date.toISOString() !== "1970-01-01T00:00:00.000Z"
                        ? format(date, "dd-MM-yyyy")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0">
                    <div className="flex justify-between p-2">
                      <Select
                        onValueChange={(month) => handleMonthChange(month)}
                        value={months[currentMonthDate]}
                      >
                        <SelectTrigger className="w-[110px] pointer-events-auto">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        onValueChange={(year) => handleYearChange(year)}
                        value={currentYearDate.toString()}
                      >
                        <SelectTrigger className="w-[110px] pointer-events-auto">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="calendar-container">
                      <Calendar
                        className={cn(" pointer-events-auto")}
                        mode="single"
                        selected={date}
                        onSelect={handleSelectDate}
                        initialFocus
                        month={date}
                        onMonthChange={(date) => setDate(date)}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div> */}
            {/*   Priority */}
            <div className="mb-3">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Priority
              </label>
              <div className="relative">
                <Select
                  onValueChange={(value: any) =>
                    formik.setFieldValue("priority", value)
                  }
                  // onBlur={formik.handleBlur}
                  value={formik.values.priority}
                  name="priority"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select</SelectLabel>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {touched.priority && errors.priority ? (
                  <div className="text-red-500">{errors.priority}</div>
                ) : null}
              </div>
            </div>
            <div className="lg:flex gap-5">
              <div className="mb-3  w-[50%]">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Customer Status
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("customer_status", value)
                    }
                    // onBlur={formik.handleBlur}
                    value={formik.values.customer_status}
                    // id="userRoles"
                    name="customer_status"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Customer Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="Live Site">Live Site</SelectItem>
                        <SelectItem value="Demo Link">Demo Link</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {touched.customer_status && errors.customer_status ? (
                    <div className="text-red-500">{errors.customer_status}</div>
                  ) : null}
                </div>
              </div>
              {formik.values.customer_status === "Live Site" && (
                <>
                  <div className="mb-3  w-[50%]">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      live Url
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.liveUrl}
                        id="liveUrl"
                        name="liveUrl"
                        placeholder="Enter Url "
                        className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                </>
              )}
              {formik.values.customer_status === "Demo Link" && (
                <>
                  <div className="mb-3  w-[50%]">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Demo Url
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.demoUrl}
                        id="demoUrl"
                        name="demoUrl"
                        placeholder="Enter Url"
                        className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mb-3">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Update
              </label>
              <div className="relative">
                <div>
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
                </div>
                <div className="flex justify-end gap-2 items-center update-btn">
                  <div onClick={imageHandler} className="w-fit cursor-pointer">
                    <TooltipCommon text="Add Files">
                      <div className="hover:bg-gray-100 px-2 py-1">
                        <AddFilesDarkUIconSVG />
                      </div>
                    </TooltipCommon>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <Button
                type="submit"
                value="Sign In"
                className="cursor-pointer border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90"
              >
                {isUserValid ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      )}

      {statusValue === "Technical" && (
        <ScrollArea className="h-[30rem] px-3 py-3">
          <form
            onSubmit={handleSubmit}
            className="border p-6 text-[0.8rem] bg-[#fff]"
          >
            <div className="mb-3 mt-1">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Select Company <span style={{ opacity: "0.5" }}> * </span>
              </label>
              <div className="relative">
                {!customerData?.customers ? (
                  <div className="flex justify-start">
                    <LoaderIconSVG />
                    <span className="px-2">Loading...</span>
                  </div>
                ) : (
                  <SelectReactSelect
                    // className="text-[0.8rem] p-0 m-0 h-2"
                    closeMenuOnSelect={true}
                    isClearable={true}
                    options={customerData.customers.map((customer: any) => ({
                      value: customer._id,
                      label: customer.companyName,
                    }))}
                    onChange={(selectedOption: { value: any } | null) => {
                      setSelectedCustomerId(
                        selectedOption ? selectedOption.value : null
                      );
                    }}
                    placeholder="Select a Company"
                  />
                )}
                {/* )}  */}
              </div>
            </div>
            <div className="mb-3 w-full">
              <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white ">
                Assigned To
              </label>
              <div className="relative">
                {!userLoading && userData?.length === 0 ? (
                  <div className="flex justify-start">
                    <LoaderIconSVG />
                    <span className="px-2">Loading...</span>
                  </div>
                ) : (
                  <SelectReactSelect
                    name="mentions"
                    isMulti
                    closeMenuOnSelect={false}
                    isClearable={true}
                    options={userData?.map(
                      (user: { _id: any; fullName: any }) => ({
                        value: user?._id,
                        label: user?.fullName,
                      })
                    )}
                    onChange={(selectedOptions) => {
                      formik.setFieldValue(
                        "mentions",
                        selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : []
                      );
                    }}
                    value={
                      formik.values.mentions
                        ? userData
                            .filter((user: { _id: string }) =>
                              formik.values.mentions.includes(user._id)
                            )
                            .map((user: { _id: any; fullName: any }) => ({
                              value: user._id,
                              label: user.fullName,
                            }))
                        : []
                    }
                  />
                )}
              </div>
            </div>

            {/* timeTakenMinutes */}
            <div className="mb-3 w-full">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Time Taken Minutes
              </label>
              <div className="relative">
                <input
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.timeTakenMinutes}
                  id="timeTakenMinutes"
                  name="timeTakenMinutes"
                  placeholder="Enter time taken minutes"
                  className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            {/* <div className="mb-3">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Type
              </label>
              <div className="relative">
                <Select
                  onValueChange={(value: any) =>
                    formik.setFieldValue("subject", value)
                  }
                  // onBlur={formik.handleBlur}
                  // value={formik.values.subject}
                  value={"Technical"} 
                  name="subject"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select</SelectLabel>
                      <SelectItem value="Technical">
                        Technical Tracker
                      </SelectItem>
                    
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {touched.subject && errors.subject ? (
                  <div className="text-red-500">{errors.subject}</div>
                ) : null}
              </div>
            </div> */}
            {/* priority */}
            <div className="mb-3">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Priority
              </label>
              <div className="relative">
                <Select
                  onValueChange={(value: any) =>
                    formik.setFieldValue("priority", value)
                  }
                  value={formik.values.priority}
                  name="priority"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select</SelectLabel>
                      <SelectItem value="1 Day SLA">1 Day SLA</SelectItem>
                      <SelectItem value="2 Day SLA">2 Day SLA</SelectItem>
                      <SelectItem value="3 Day SLA">3 Day SLA</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* status */}
            <div className="mb-3">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Status
              </label>
              <div className="relative">
                <Select
                  onValueChange={(value: any) =>
                    formik.setFieldValue("status", value)
                  }
                  value={formik.values.status}
                  name="status"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select</SelectLabel>
                      <SelectItem value="In Process">In Process</SelectItem>
                      <SelectItem value="Complete">Complete</SelectItem>
                      <SelectItem value="In Query">In Query</SelectItem>
                      <SelectItem value="Back With Repo">
                        Back With Repo
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {touched.status && errors.status ? (
                  <div className="text-red-500">{errors.status}</div>
                ) : null}
              </div>
            </div>

            <div className="mb-3">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Technical Task
              </label>
              <div className="relative">
                <Select
                  onValueChange={(value: any) =>
                    formik.setFieldValue("technicalTask", value)
                  }
                  value={formik.values.technicalTask}
                  name="technicalTask"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select</SelectLabel>
                      <SelectItem value="GSUITE Setup">GSUITE Setup</SelectItem>
                      <SelectItem value="Email Backup">Email Backup</SelectItem>
                      <SelectItem value="Domain/Email Forward">
                        Domain/Email Forward
                      </SelectItem>
                      <SelectItem value="Email Setup Call">
                        Email Setup Call
                      </SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                      <SelectItem value="Server Setup">Server Setup</SelectItem>
                      <SelectItem value="Website Down">Website Down</SelectItem>
                      <SelectItem value="Hosting Setup">
                        Hosting Setup
                      </SelectItem>
                      <SelectItem value="Issue With Emails">
                        Issue With Emails
                      </SelectItem>
                      <SelectItem value="Suspension/Termination">
                        Suspension/Termination
                      </SelectItem>
                      <SelectItem value="SSL Issue">SSL Issue</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-3">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Update
              </label>
              <div className="relative">
                <div>
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
                </div>
                <div className="flex justify-end gap-2 items-center update-btn">
                  <div onClick={imageHandler} className="w-fit cursor-pointer">
                    <TooltipCommon text="Add Files">
                      <div className="hover:bg-gray-100 px-2 py-1">
                        <AddFilesDarkUIconSVG />
                      </div>
                    </TooltipCommon>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <Button
                type="submit"
                value=""
                className="cursor-pointer  border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90"
              >
                {isCustomerValid ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      )}

      {statusValue === "Product Flow" && (
        <ScrollArea className="h-[30rem] px-3 py-3">
          <form
            onSubmit={handleSubmit}
            className="border p-6 text-[0.8rem] bg-[#fff]  boxShadow"
          >
            <div className="lg:flex gap-5">
              <div className="mb-3  w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Select Company <span style={{ opacity: "0.5" }}> * </span>
                </label>
                <div className="relative">
                  {!customerData?.customers ? (
                    <div className="flex justify-start">
                      <LoaderIconSVG />
                      <span className="px-2">Loading...</span>
                    </div>
                  ) : (
                    <SelectReactSelect
                      closeMenuOnSelect={true}
                      isClearable={true}
                      options={customerData.customers.map((customer: any) => ({
                        value: customer._id,
                        label: customer.companyName,
                      }))}
                      onChange={(selectedOption: { value: string } | null) => {
                        const customerId = selectedOption
                          ? selectedOption.value
                          : "";
                        setSelectedCustomerId(customerId);
                        formik.setFieldValue("selectedCustomerId", customerId);
                      }}
                      placeholder="Select a Company"
                    />
                  )}
                  {formik.touched.selectedCustomerId &&
                  formik.errors.selectedCustomerId ? (
                    <div className="text-red-500">
                      {formik.errors.selectedCustomerId}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Current Stage
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("currentStage", value)
                    }
                    value={formik.values.currentStage}
                    name="currentStage"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a current stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="Copywriter">Copywriter</SelectItem>
                        <SelectItem value="Upload">Upload</SelectItem>
                        <SelectItem value="Awaiting Domain">
                          Awaiting Domain
                        </SelectItem>
                        <SelectItem value="In Query">In Query</SelectItem>
                        <SelectItem value="AWR Cloud/Search Console">
                          AWR Cloud/Search Console
                        </SelectItem>
                        <SelectItem value="All Content Added">
                          All Content Added
                        </SelectItem>
                        <SelectItem value="QC Changes">QC Changes</SelectItem>
                        <SelectItem value="QC">QC</SelectItem>
                        <SelectItem value="Quality Control">
                          Quality Control
                        </SelectItem>
                        <SelectItem value="Waiting on Area Pages">
                          Waiting on Area Pages
                        </SelectItem>
                        <SelectItem value="Upload Query">
                          Upload Query
                        </SelectItem>
                        <SelectItem value="Complete">Complete</SelectItem>
                        <SelectItem value="Design Stage 1">
                          Design Stage 1
                        </SelectItem>
                        <SelectItem value="Design Stage 2">
                          Design Stage 2
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mb-3 w-full">
              <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white ">
                Assigned To
              </label>
              <div className="relative">
                {!userLoading && userData?.length === 0 ? (
                  <div className="flex justify-start">
                    <LoaderIconSVG />
                    <span className="px-2">Loading...</span>
                  </div>
                ) : (
                  <SelectReactSelect
                    name="mentions"
                    isMulti
                    closeMenuOnSelect={false}
                    isClearable={true}
                    options={userData?.map(
                      (user: { _id: any; fullName: any }) => ({
                        value: user?._id,
                        label: user?.fullName,
                      })
                    )}
                    onChange={(selectedOptions) => {
                      formik.setFieldValue(
                        "mentions",
                        selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : []
                      );
                    }}
                    value={
                      formik.values.mentions
                        ? userData
                            .filter((user: { _id: string }) =>
                              formik.values.mentions.includes(user._id)
                            )
                            .map((user: { _id: any; fullName: any }) => ({
                              value: user._id,
                              label: user.fullName,
                            }))
                        : []
                    }
                  />
                )}
              </div>
            </div>

            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Date Phase 1 Instructed
                </label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !datePhase1Instructed && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {datePhase1Instructed ? (
                          format(datePhase1Instructed, "dd-MM-yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={(month) =>
                            handleMonthChange2(month, "phase1")
                          }
                          value={months[currentMonthPhase1]}
                        >
                          <SelectTrigger className="w-[110px] pointer-events-auto">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          onValueChange={(year) =>
                            handleYearChange2(year, "phase1")
                          }
                          value={currentYearPhase1.toString()}
                        >
                          <SelectTrigger className="w-[110px] pointer-events-auto">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="calendar-container">
                        <Calendar
                          className="pointer-events-auto"
                          mode="single"
                          selected={datePhase1Instructed}
                          onSelect={handlePhase1Instructed}
                          initialFocus
                          month={datePhase1Instructed}
                          onMonthChange={(date) =>
                            setDatePhase1Instructed(date)
                          }
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Date Phase 2 Instructed
                </label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !datePhase2Instructed && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {datePhase2Instructed ? (
                          format(datePhase2Instructed, "dd-MM-yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={(month) =>
                            handleMonthChange2(month, "phase2")
                          }
                          value={months[currentMonthPhase2]}
                        >
                          <SelectTrigger className="w-[110px] pointer-events-auto">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          onValueChange={(year) =>
                            handleYearChange2(year, "phase2")
                          }
                          value={currentYearPhase2.toString()}
                        >
                          <SelectTrigger className="w-[110px] pointer-events-auto">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="calendar-container">
                        <Calendar
                          className="pointer-events-auto"
                          mode="single"
                          selected={datePhase2Instructed}
                          onSelect={handlePhase2Instructed}
                          initialFocus
                          month={datePhase2Instructed}
                          onMonthChange={(date) =>
                            setDatePhase2Instructed(date)
                          }
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Demo Completed Date
                </label>

                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !demoCompletedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {demoCompletedDate ? (
                          format(demoCompletedDate, "dd-MM-yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={(month) =>
                            handleMonthChange2(month, "demo")
                          }
                          value={months[currentMonthDemo]}
                        >
                          <SelectTrigger className="w-[110px] pointer-events-auto">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          onValueChange={(year) =>
                            handleYearChange2(year, "demo")
                          }
                          value={currentYearDemo.toString()}
                        >
                          <SelectTrigger className="w-[110px] pointer-events-auto">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="calendar-container">
                        <Calendar
                          className="pointer-events-auto"
                          mode="single"
                          selected={demoCompletedDate}
                          onSelect={handleDemoCompletedDate}
                          initialFocus
                          month={demoCompletedDate}
                          onMonthChange={(date) => setDemoCompletedDate(date)}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Live Date
                </label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !liveDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {liveDate ? (
                          format(liveDate, "dd-MM-yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={(month) =>
                            handleMonthChange2(month, "live")
                          }
                          value={months[currentMonthLive]}
                        >
                          <SelectTrigger className="w-[110px] pointer-events-auto">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          onValueChange={(year) =>
                            handleYearChange2(year, "live")
                          }
                          value={currentYearLive.toString()}
                        >
                          <SelectTrigger className="w-[110px] pointer-events-auto">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="calendar-container">
                        <Calendar
                          className="pointer-events-auto"
                          mode="single"
                          selected={liveDate}
                          onSelect={handleLiveDate}
                          initialFocus
                          month={liveDate}
                          onMonthChange={(date) => setLiveDate(date)}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Notes
                </label>
                <div className="relative">
                  <textarea
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.notes}
                    id="notes"
                    name="notes"
                    rows={4}
                    minLength={4}
                    placeholder="Enter notes"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Demo Link
                </label>
                <div className="relative">
                  <input
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.demoLink}
                    id="demoLink"
                    name="demoLink"
                    placeholder="Enter demo link"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Update
              </label>
              <div className="relative">
                <div>
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
                </div>
                <div className="flex justify-end gap-2 items-center update-btn">
                  <div onClick={imageHandler} className="w-fit cursor-pointer">
                    <TooltipCommon text="Add Files">
                      <div className="hover:bg-gray-100 px-2 py-1">
                        <AddFilesDarkUIconSVG />
                      </div>
                    </TooltipCommon>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <Button
                type="submit"
                value="Sign In"
                className="cursor-pointer border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90"
              >
                {isUserValid ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      )}

      {statusValue === "Copy Writer Tracker" && (
        <ScrollArea className="h-[30rem] px-3 py-3">
          <form
            onSubmit={handleSubmit}
            className="border p-6 text-[0.8rem] bg-[#fff]"
          >
            <div className="mb-3 mt-1">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Select Company <span style={{ opacity: "0.5" }}> * </span>
              </label>
              <div className="relative">
                {!customerData?.customers ? (
                  <div className="flex justify-start">
                    <LoaderIconSVG />
                    <span className="px-2">Loading...</span>
                  </div>
                ) : (
                  <SelectReactSelect
                    closeMenuOnSelect={true}
                    isClearable={true}
                    options={customerData.customers.map((customer: any) => ({
                      value: customer._id,
                      label: customer.companyName,
                    }))}
                    onChange={(selectedOption: { value: string } | null) => {
                      const customerId = selectedOption
                        ? selectedOption.value
                        : "";
                      setSelectedCustomerId(customerId);
                      formik.setFieldValue("selectedCustomerId", customerId);
                    }}
                    placeholder="Select a Company"
                  />
                )}
                {formik.touched.selectedCustomerId &&
                formik.errors.selectedCustomerId ? (
                  <div className="text-red-500">
                    {formik.errors.selectedCustomerId}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mb-3 w-full">
              <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white ">
                Assigned To
              </label>
              <div className="relative">
                {!userLoading && userData?.length === 0 ? (
                  <div className="flex justify-start">
                    <LoaderIconSVG />
                    <span className="px-2">Loading...</span>
                  </div>
                ) : (
                  <SelectReactSelect
                    name="mentions"
                    isMulti
                    closeMenuOnSelect={false}
                    isClearable={true}
                    options={userData?.map(
                      (user: { _id: any; fullName: any }) => ({
                        value: user?._id,
                        label: user?.fullName,
                      })
                    )}
                    onChange={(selectedOptions) => {
                      formik.setFieldValue(
                        "mentions",
                        selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : []
                      );
                    }}
                    value={
                      formik.values.mentions
                        ? userData
                            .filter((user: { _id: string }) =>
                              formik.values.mentions.includes(user._id)
                            )
                            .map((user: { _id: any; fullName: any }) => ({
                              value: user._id,
                              label: user.fullName,
                            }))
                        : []
                    }
                  />
                )}
              </div>
            </div>

            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Status
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("status", value)
                    }
                    value={formik.values.status}
                    name="status"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="Homepage In Process">
                          Homepage In Process
                        </SelectItem>
                        <SelectItem value="Rework">Rework</SelectItem>
                        <SelectItem value="Additional Pages in Process">
                          Additional Pages in Process
                        </SelectItem>
                        <SelectItem value="Homepage Complete">
                          Homepage Complete
                        </SelectItem>

                        <SelectItem value="Remaining Pages in Process">
                          Remaining Pages in Process
                        </SelectItem>
                        <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                        <SelectItem value="In Query">In Query</SelectItem>
                        <SelectItem value="Held for Critical">
                          Held for Critical
                        </SelectItem>
                        <SelectItem value="Waiting on Info">
                          Waiting on Info
                        </SelectItem>
                        <SelectItem value="COMPLETED REWORK">
                          COMPLETED REWORK
                        </SelectItem>
                        <SelectItem value="Area Pages Remaining">
                          Area Pages Remaining
                        </SelectItem>
                        <SelectItem value="Blog pages">Blog pages</SelectItem>
                        <SelectItem value="Extra Pages">Extra Pages</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Completed Date
                </label>

                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !dateComplete && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateComplete &&
                        dateComplete.toISOString() !==
                          "1970-01-01T00:00:00.000Z"
                          ? format(dateComplete, "dd-MM-yyyy")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={(month) => handleMonthChange(month)}
                          value={months[currentMonth]}
                        >
                          <SelectTrigger className="w-[110px] pointer-events-auto">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          onValueChange={(year) => handleYearChange(year)}
                          value={currentYear.toString()}
                        >
                          <SelectTrigger className="w-[110px] pointer-events-auto">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="calendar-container">
                        <Calendar
                          className="pointer-events-auto"
                          mode="single"
                          selected={dateComplete}
                          onSelect={handleComplateDateSelect}
                          initialFocus
                          month={dateComplete}
                          onMonthChange={(date) => setDateComplete(date)}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Update
              </label>
              <div className="relative">
                <div>
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
                </div>
                <div className="flex justify-end gap-2 items-center update-btn">
                  <div onClick={imageHandler} className="w-fit cursor-pointer">
                    <TooltipCommon text="Add Files">
                      <div className="hover:bg-gray-100 px-2 py-1">
                        <AddFilesDarkUIconSVG />
                      </div>
                    </TooltipCommon>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <Button
                type="submit"
                value="Sign In"
                className="cursor-pointer border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90"
              >
                {isUserValid ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      )}
    </>
  );
};

export default AllForm;
