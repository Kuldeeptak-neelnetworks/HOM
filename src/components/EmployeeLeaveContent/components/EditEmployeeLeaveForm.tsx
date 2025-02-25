"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import BreadcrumbSection from "@/components/common/BreadcrumbSection";

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
import { useTechnicalStore } from "@/Store/TechnicalStore";
import { useProductflowStore } from "@/Store/ProductFlowStore";
import Link from "next/link";
import { useEmployeeLeaveStore } from "@/Store/EmployeeLeaveStore";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";

interface UserData {
  fullName?: string;
  avatar?: string;
  mobileNo?: string;
  address?: string;
  role?: string;
}
interface EmployeeLeaveDetailType {
  _id: string;
  returnDate: string;
  leaveReason: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  managerResponse: string;
  managerComments: string;
  employeeId: {
    fullName: string;
  };
}

const EditEmployeeLeaveForm = () => {
  const router = useRouter();
  const [fetchedEmployeeData, setFetchedEmployeeData] =
    useState<EmployeeLeaveDetailType | null>(null);
  let userDataString: any =
    typeof window !== "undefined" ? localStorage?.getItem("user") : null;
  const userData2 = JSON.parse(userDataString);
  const userId = userData2?._id;

  const [isEmployeeLeaveValid, setIsEmployeeLeaveValid] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [userDetails, setUserDetails] = useState<UserData | null>(null);

  const {
    fetchEmployeeLeaveData,
    EmployeeLeaveData,
    addEmployeeLeaveData,
  }: any = useEmployeeLeaveStore();
  const { employeeLeaveId } = useParams();



  const formatDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getEmployeeLeaveDetails = async () => {
    try {
      const result = await baseInstance.get(`/leaves/${employeeLeaveId}`);
      if (result.status === 200) {
        const empLeaveData = result?.data?.data;
        setFetchedEmployeeData(empLeaveData);

        const dateFields = ["startDate", "endDate", "returnDate"];
        dateFields.forEach((field) => {
          const formattedDate = formatDate(empLeaveData[field]);
          const parsedDate = new Date(formattedDate);

          if (!isNaN(parsedDate.getTime())) {
            switch (field) {
              case "startDate":
                setStartDate(parsedDate);
                break;
              case "endDate":
                setEndDate(parsedDate);
                break;
              case "returnDate":
                setReturnDate(parsedDate);
                break;

              default:
                break;
            }
          } else {
            console.error(
              `Invalid date format for ${field}:`,
              EmployeeLeaveData[field]
            );
          }
        });
      }
    } catch (error) {
      console.error("Error fetching Employee Leave details:", error);
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || "An unexpected error occurred.";
        errorToastingFunction(message);
      }
    }
  };
  const fetchUserData = async () => {
    try {
      const response = await baseInstance.get(`/users/${userId}`);
      if (response.status === 200) {
        setUserDetails(response.data.data as UserData);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
        router.push("/auth/login");
      }
    }
  };

  useEffect(() => {
    fetchEmployeeLeaveData();
    getEmployeeLeaveDetails();
    fetchUserData();
  }, []);

  const formik = useFormik({
    initialValues: {
      repName: userDetails?.fullName,
      returnDate: fetchedEmployeeData?.returnDate || "",
      leaveReason: fetchedEmployeeData?.leaveReason || "",
      startDate: fetchedEmployeeData?.startDate || "",
      endDate: fetchedEmployeeData?.endDate || "",
      leaveType: fetchedEmployeeData?.leaveType || "",
      managerResponse: fetchedEmployeeData?.managerResponse || "",
      managerComments: fetchedEmployeeData?.managerComments || "",
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        setIsEmployeeLeaveValid(() => true);

        const data = {
          managerResponse: values.managerResponse,
          managerComments: values.managerComments,
        };

        const response = await baseInstance.put(
          `/leaves/${employeeLeaveId}`,
          data
        );

        if (response?.status === 200) {
          successToastingFunction(response?.data?.message);

          setIsEmployeeLeaveValid(() => false);
          getEmployeeLeaveDetails();
          router.push("/employeeLeaveManagement");
        } else {
          throw new Error("Something went wrong, Please try again later!");
        }
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        } else {
          // errorToastingFunction(error?.response?.data.message);
        }
      } finally {
        setIsEmployeeLeaveValid(() => false);
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
  const handleMonthChange = (
    month: string,
    target: "start" | "end" | "returnDate"
  ) => {
    const monthIndex = months.indexOf(month);

    if (monthIndex === -1) return;

    const currentDate =
      {
        start: startDate,
        end: endDate,
        returnDate: returnDate,
      }[target] || new Date();

    const newDate = setMonth(currentDate, monthIndex);

    if (target === "start") {
      setStartDate(newDate);
    } else if (target === "end") {
      setEndDate(newDate);
    } else if (target === "returnDate") {
      setReturnDate(newDate);
    }
  };
  const handleYearChange = (
    year: string,
    target: "start" | "end" | "returnDate"
  ) => {
    const yearNumber = parseInt(year);

    if (isNaN(yearNumber)) return;

    const currentDate =
      {
        start: startDate,
        end: endDate,
        returnDate: returnDate,
      }[target] || new Date();

    const newDate = setYear(currentDate, yearNumber);

    if (target === "start") {
      setStartDate(newDate);
    } else if (target === "end") {
      setEndDate(newDate);
    } else if (target === "returnDate") {
      setReturnDate(newDate);
    }
  };
  const currentMonthStart = startDate
    ? getMonth(startDate)
    : getMonth(new Date());
  const currentYearStart = startDate ? getYear(startDate) : getYear(new Date());
  const currentYearReturnDate = returnDate
    ? getYear(returnDate)
    : getYear(new Date());
  const currentMonthReturnDate = returnDate
    ? getMonth(returnDate)
    : getMonth(new Date());
  const currentMonthEnd = endDate ? getMonth(endDate) : getMonth(new Date());
  const currentYearEnd = endDate ? getYear(endDate) : getYear(new Date());

  const handleStartDate = (selectedDate: Date | undefined) => {
    setStartDate(selectedDate);
  };
  const handleEndDate = (selectedDate: Date | undefined) => {
    setEndDate(selectedDate);
  };
  const handleReturnDate = (selectedDate: Date | undefined) => {
    setReturnDate(selectedDate);
  };
  return (
    <div className="p-4 relative text-[0.8rem]">
      <div className="text-[1rem] font-semibold absolute top-[-50px] ">
        {fetchedEmployeeData?.employeeId?.fullName
          ? fetchedEmployeeData?.employeeId?.fullName
          : "loading..."}
      </div>

      <div className=" flex gap-5 justify-center">
        <div className="my-3 text-[0.8rem] bg-[#fff] hover:bg-gray-300 h-fit px-2 py-1 cursor-pointer hidden text-center sm:block w-fit boxShadow ">
          <Link href={`/employeeLeaveManagement`}>Back</Link>
        </div>
        <ScrollArea className="h-[80vh]  sm:px-3 sm:py-3 w-[100%] xl:w-[56vw]">
          <form
            onSubmit={handleSubmit}
            className="border p-6 bg-[#fff] boxShadow"
          >
            <div className="lg:flex gap-5">
              {/* Rep Name  */}
              <div className="mb-5 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Rep Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="repName"
                    name="repName"
                    value={userDetails?.fullName || ""}
                    placeholder="Rep Name"
                    readOnly
                    disabled
                    className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />

                  <span className="absolute right-4 top-2">
                    {/* <UserIconSVG cssClass={styles.commonText} /> */}
                  </span>
                </div>
              </div>
              {/* Leave Type */}
              <div className="w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Leave Type
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("leaveType", value)
                    }
                    disabled
                    // onBlur={formik.handleBlur}
                    value={formik.values.leaveType}
                    name="leaveType"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a leave Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                        <SelectItem value="Vacation">Vacation</SelectItem>
                        <SelectItem value="Personal Leave">
                          Personal Leave
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="lg:flex gap-5">
              {/* start Date  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Start Date
                </label>
                <div className="relative">
                <Popover>
  <PopoverTrigger asChild>
    <Button
      variant={"outline"}
      className={cn(
        "w-[250px] justify-start text-left font-normal",
        !startDate && "text-muted-foreground"
      )}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {startDate ? format(startDate, "yyyy-MM-dd") : <span>Pick a date</span>}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <div className="flex justify-between p-2">
      <Select
        onValueChange={(month) => handleMonthChange(month, "start")}
        value={months[currentMonthStart]}
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
        onValueChange={(year) => handleYearChange(year, "start")}
        value={currentYearStart.toString()}
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
    <div className="calendar-container">
    <Calendar
      mode="single"
      selected={startDate}
      onSelect={handleStartDate}
      initialFocus
      month={startDate}
      onMonthChange={(date) => setStartDate(date)}
    />
    </div>
  </PopoverContent>
</Popover>

                </div>
              </div>
              {/* End Date  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  End Date
                </label>
                <div className="relative">
                <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[250px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "dd-MM-yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="flex justify-between p-2">
                    <Select
                      onValueChange={(month) => handleMonthChange(month, "end")}
                      value={months[currentMonthEnd]}
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
                      onValueChange={(year) => handleYearChange(year, "end")}
                      value={currentYearEnd.toString()}
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
                  <div className="calendar-container">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDate}
                    initialFocus
                    month={endDate}
                    onMonthChange={(date) => setEndDate(date)}
                  />
                  </div>
                </PopoverContent>
              </Popover>
                </div>
              </div>
            </div>
            <div className="lg:flex gap-5">
              {/* Return Date  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Date you will return to office *
                </label>
                <div className="relative">
                <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[250px] justify-start text-left font-normal",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? (
                    format(returnDate, "dd-MM-yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="flex justify-between p-2">
                  <Select
                    onValueChange={(month) =>
                      handleMonthChange(month, "returnDate")
                    }
                    value={months[currentMonthReturnDate]}
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
                      handleYearChange(year, "returnDate")
                    }
                    value={currentYearReturnDate.toString()}
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
                <div className="calendar-container">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={handleReturnDate}
                  initialFocus
                  month={returnDate}
                  onMonthChange={(date) => setReturnDate(date)}
                />
                </div>
              </PopoverContent>
            </Popover>
                </div>
              </div>
              {/* Leave Reason */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Leave Reason
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={values.leaveReason}
                    id="leaveReason"
                    name="leaveReason"
                    readOnly
                    disabled
                    placeholder="Enter Your leave Reason"
                    className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />

                  {touched.leaveReason && errors.leaveReason ? (
                    <div className="text-red-500">{errors.leaveReason}</div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* Manager Response */}
            <div className="lg:flex gap-5">
              <div className="mb-5 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Manager Response
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("managerResponse", value)
                    }
                    value={formik.values.managerResponse}
                    name="managerResponse"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Response" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {/* {touched.managedBy && errors.managedBy ? (
              <div className="text-red-500">{errors.managedBy}</div>
            ) : null} */}
                </div>
              </div>
            </div>
            {/* Manager Comment */}
            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Manager Comment
                </label>
                <div className="relative">
                  <textarea
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.managerComments}
                    id="managerComments"
                    name="managerComments"
                    placeholder="Enter comment"
                    className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="my-6 ">
              <Button
                type="submit"
                className="lg:w-[6vw] cursor-pointer border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 text-md"
              >
                {isEmployeeLeaveValid ? (
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

export default EditEmployeeLeaveForm;
