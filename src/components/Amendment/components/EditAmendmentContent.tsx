"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import BreadcrumbSection from "@/components/common/BreadcrumbSection";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import {
  BuildingIconSVG,
  EmailIconSVG,
  MobileIconSVG,
  PhoneIconSVG,
  UserIconSVG,
} from "@/utils/SVGs/SVGs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  baseInstance,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { AxiosError } from "axios";
import { formatDate } from "date-fns";

const crumbs = [
  {
    id: 1,
    title: "Home",
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Amendment",
    link: "/amendment",
  },
  {
    id: 3,
    title: "Edit Amendment Details",
    link: "",
  },
];

interface AmendmentDetailType {
  id: number;
  customer_status: string;
  date_current: string;
  status: string;
  priority: string;
  generated_by: string;
  customerName: string;
  date_complete: string;
  customer: {
    companyName: string;
  };
}

const EditAmendmentContent = () => {
  const router = useRouter();
  const { amendmentId } = useParams();

  const [isAmendmentValid, setIsAmendmentValid] = useState(false);

  const [date, setDate] = useState<Date | undefined>();
  const [completeDate, setComplateDate] = useState<Date | undefined>();
  const [amendmentDetails, setAmendmentDetails] =
    useState<AmendmentDetailType | null>(null);
  const [userPreview, setUserPreview] = useState<string>("");
  const [userPic, setUserPic] = useState<string>("");
  //   const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>({
  //     label: "",
  //     value: "",
  //   });

  const getAmendmentDetails = async () => {
    try {
      const result = await baseInstance.get(`/amendments/${amendmentId}`);
      if (result.status === 200) {
        const amendmentDetailss = result?.data?.data as AmendmentDetailType;
        setAmendmentDetails(amendmentDetailss);
        if (amendmentDetailss?.date_current) {
          const formattedCurrentDate = formatDate(
            amendmentDetailss.date_current
          );
          const parsedDate = new Date(formattedCurrentDate);

          if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate);
          } else {
            console.error(
              "Invalid date format:",
              amendmentDetailss.date_current
            );
          }
        }
        if (
          amendmentDetailss?.date_complete !== null ||
          amendmentDetailss?.date_complete !== "" ||
          amendmentDetailss?.date_complete !== undefined
        ) {
          const formattedCompleteDate = formatDate(
            amendmentDetailss.date_complete
          );
          const parsedCompleteDate = new Date(formattedCompleteDate);
          if (!isNaN(parsedCompleteDate.getTime())) {
            setComplateDate(parsedCompleteDate);
          } else {
            console.error(
              "Invalid date format:",
              amendmentDetailss.date_complete
            );
          }
        } else {
          console.error(
            "Invalid date format:",
            amendmentDetailss.date_complete
          );
        }
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
      }
    }
  };

  function formatDate(date: any) {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, "0"); // Adding leading zero if needed
    let day = d.getDate().toString().padStart(2, "0"); // Adding leading zero if needed
    return `${year}-${month}-${day}`;
  }

  // const handleDateSelect = (selectedDate: any) => {
  //   setDate(selectedDate);
  // };
  // const handleComplateDateSelect = (selectedDate: any) => {
  //   setComplateDate(selectedDate);
  // };

  useEffect(() => {
    getAmendmentDetails();
  }, []);

  const formik = useFormik({
    initialValues: {
      customer_status: amendmentDetails?.customer_status || "",
      date_current: amendmentDetails?.date_current || "",
      date_complete: amendmentDetails?.date_complete || "",
      status: amendmentDetails?.status || "",
      priority: amendmentDetails?.priority || "",
      generated_by: amendmentDetails?.generated_by || "",
      customerName: amendmentDetails?.customerName || "",
    },
    // validationSchema: Yup.object({
    //   fullName: Yup.string()
    //     .min(3, "Must be 3 characters or more")
    //     .max(15, "Not More than 15 Characters")
    //     .required("Name Required"),
    //   password: Yup.string()
    //     .min(8, "Must be 8 characters or more")
    //     .max(20, "Not More than 20 Characters")
    //     .required("Password Required"),
    //   email: Yup.string()
    //     .matches(
    //       /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    //       "Invalid email address"
    //     )
    //     .required("Email Required"),
    //   role: Yup.string().required("User Role Required"),
    //   // timeZone: Yup.string().required("Time Zone Required"),
    //   mobileNo: Yup.string()
    //     .required("Contact No. Required")
    //     .matches(/^[0-9]{10}$/, "Must be a 10-digit number"),
    //   jobtitle: Yup.string().required("Job title Required"),
    //   address: Yup.string().required("Address Required"),
    // }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsAmendmentValid(() => true);
        const data = {
          generated_by: values.generated_by,
          customer_status: values.customer_status,
          priority: values.priority,
          status: values.status,
          date_current: formatDate(date),
          date_complete: formatDate(completeDate),
        };

        const response = await baseInstance.patch(
          `/amendments/${amendmentId}`,
          data
        );

        if (response?.status === 200) {
          successToastingFunction(response?.data?.message);
          setIsAmendmentValid(() => false);
          router.push("/amendment");
        } else {
          alert("Something went Wrong !!");
        }
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        } else {
          errorToastingFunction(error?.response?.data.message);
        }
      } finally {
        setIsAmendmentValid(() => false);
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
    setFieldTouched,
  } = formik;
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

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  const handleComplateDateSelect = (selectedDate: any) => {
    if (selectedDate) {
    setComplateDate(selectedDate);
    }
  };

  const currentMonth = date ? getMonth(date) : getMonth(new Date());
  const currentYear = date ? getYear(date) : getYear(new Date());
  const currentMonthCompleteDate = completeDate ? getMonth(completeDate) : getMonth(new Date());
  const currentYearCompleteDate = completeDate ? getYear(completeDate) : getYear(new Date());

  const handleMonthChange = (
    month: string,
    target: "date" | "completeDate" 
  ) => {
    const monthIndex = months.indexOf(month);

    if (monthIndex === -1) return;

    if (target === "date") {
      const newDate = date
        ? setMonth(date, monthIndex)
        : setMonth(new Date(), monthIndex);
      setDate(newDate);
    } else if (target === "completeDate") {
      const newDate = completeDate
        ? setMonth(completeDate, monthIndex)
        : setMonth(new Date(), monthIndex);
      setComplateDate(newDate);
    }
  };

  // Handler for year change (for both dates)
  const handleYearChange = (year: string, target: "date" | "completeDate") => {
    const yearNumber = parseInt(year);
    if (isNaN(yearNumber)) return;

    if (target === "date") {
      const newDate = date
        ? setYear(date, yearNumber)
        : setYear(new Date(), yearNumber);
      setDate(newDate);
    } else if (target === "completeDate") {
      const newDate = completeDate
        ? setYear(completeDate, yearNumber)
        : setYear(new Date(), yearNumber);
      setComplateDate(newDate);
    }
  };
  return (
    <div className="px-4 py-0  relative text-[0.8rem]">
      <div className="text-[1rem] font-semibold absolute top-[-35px] text-wrap">
        {amendmentDetails?.customer?.companyName
          ? amendmentDetails?.customer?.companyName
          : "loading..."}
      </div>
      {/* <div className="mb-4">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}
      <div className=" flex gap-5 justify-center ">
        <ScrollArea className="h-[80vh]  sm:px-3 sm:py-3 w-[100%] xl:w-[56vw]">
          <form
            onSubmit={handleSubmit}
            className="border p-6 bg-[#fff] boxShadow"
          >
            <div className="lg:flex gap-5">
              {/* Current Date */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                        {date ? (
                          format(date, "yyyy-MM-dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={(month) =>
                            handleMonthChange(month, "date")
                          }
                          value={months[currentMonth]}
                        >
                          <SelectTrigger className="w-[110px]">
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
                            handleYearChange(year, "date")
                          }
                          value={currentYear.toString()}
                        >
                          <SelectTrigger className="w-[110px]">
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

                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                        month={date}
                        onMonthChange={(date) => setDate(date)}
                      />
                    </PopoverContent>
                  </Popover>
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[100%] justify-start text-left font-normal text-md",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "yyyy-MM-dd") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        initialFocus
                        onSelect={handleDateSelect}
                        className=" border"
                      />
                    </PopoverContent>
                  </Popover> */}
                </div>
              </div>
              {/* Complete Date */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
                  Complete Date
                </label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !completeDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {completeDate &&
                        completeDate.toISOString() !==
                          "1970-01-01T00:00:00.000Z"
                          ? format(completeDate, "yyyy-MM-dd")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={(month) =>
                            handleMonthChange(month, "completeDate")
                          }
                          value={months[currentMonthCompleteDate]}
                        >
                          <SelectTrigger className="w-[110px]">
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
                            handleYearChange(year, "completeDate")
                          }
                          value={currentYearCompleteDate.toString()}
                        >
                          <SelectTrigger className="w-[110px]">
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
                   

                      <Calendar
                        mode="single"
                        selected={completeDate}
                        onSelect={handleComplateDateSelect}
                        initialFocus
                        month={completeDate}
                        onMonthChange={(date) => setComplateDate(date)}
                      />
                    </PopoverContent>
                  </Popover>
                
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              {/* Status  */}
              <div className="mb-5 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                      <SelectValue placeholder="Select a Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="In Query">In Query</SelectItem>
                        <SelectItem value="Complete">Complete</SelectItem>
                        <SelectItem value="In Process">In Process</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {touched.status && errors.status ? (
                    <div className="text-red-500">{errors.status}</div>
                  ) : null}
                </div>
              </div>
              {/*  priority */}
              <div className="mb-5 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                      <SelectValue placeholder="Select a Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {touched.priority && errors.priority ? (
                    <div className="text-red-500">{errors.priority}</div>
                  ) : null}
                </div>
              </div>
            </div>
            {/*  Customer Status */}
            <div className="mb-5 w-full">
              <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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

            <div className="my-6 ">
              <Button
                type="submit"
                className="lg:w-[6vw] w-full cursor-pointer border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 text-md"
              >
                {isAmendmentValid ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </div>
    </div>
  );
};

export default EditAmendmentContent;
