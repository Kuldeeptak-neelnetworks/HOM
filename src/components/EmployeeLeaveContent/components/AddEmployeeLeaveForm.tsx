"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import styles from "../../../styles/test.module.css";
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  baseInstance,
  errorToastingFunction,
  formatDateYYYYMMDD,
  successToastingFunction,
} from "@/common/commonFunctions";
import { PhoneIconSVG, UserIconSVG } from "@/utils/SVGs/SVGs";
import { ScrollArea } from "@/components/ui/scroll-area";
import TimezoneSelect from "react-timezone-select";
import { useUserStore } from "@/Store/UserStore";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useEmployeeLeaveStore } from "@/Store/EmployeeLeaveStore";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";

interface UserData {
  fullName?: string;
  avatar?: string;
  mobileNo?: string;
  address?: string;
  role?: string;
}

const AddEmployeeLeaveForm: React.FC = () => {
  const {
    fetchEmployeeLeaveData,
    EmployeeLeaveData,
    addEmployeeLeaveData,
  }: any = useEmployeeLeaveStore();
  const router = useRouter();
  const [isUserValid, setIsUserValid] = useState(false);
  let userDataString: any =
    typeof window !== "undefined" ? localStorage?.getItem("user") : null;
  const userData2 = JSON.parse(userDataString);
  const userId = userData2?._id;

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [userDetails, setUserDetails] = useState<UserData | null>(null);

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
    fetchUserData();
  }, []);

  const formik = useFormik({
    initialValues: {
      returnDate: "",
      leaveReason: "",
      startDate: "",
      endDate: "",
      leaveType: "",
    },
    validationSchema: Yup.object({
      leaveReason: Yup.string()
        .min(5, "Must be 5 characters or more")
        .required("leaveReason Required"),
      leaveType: Yup.string().required("Name Required"),
    }),

    onSubmit: async (values) => {
      try {
        setIsUserValid(() => true);

        const data = {
          leaveType: values.leaveType,
          leaveReason: values.leaveReason,
          startDate: formatDateYYYYMMDD(startDate),
          endDate: formatDateYYYYMMDD(endDate),
          returnDate: formatDateYYYYMMDD(returnDate),
        };

        const isSuccess = await addEmployeeLeaveData(data);
        if (isSuccess) {
          router.push("/employeeLeaveManagement"); 
        }
      } catch (error: any) {
        console.log("Unexpected error", error);
      } finally {
        setIsUserValid(() => false);
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
    <ScrollArea className=" w-[100%] xl:w-[56vw]  p-7 my-5 border boxShadow bg-[#fff]">
      <form onSubmit={handleSubmit} className="text-[0.8rem] ">
        <div className="mb-3 lg:flex gap-3">
          {/* Rep Name  */}
          <div className="w-full">
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
                <UserIconSVG cssClass={styles.commonText} />
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
                // onBlur={formik.handleBlur}
                value={formik.values.leaveType}
                // id="userRoles"
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
              {touched.leaveType && errors.leaveType ? (
                <div className="text-red-500">{errors.leaveType}</div>
              ) : null}
            </div>
          </div>
        </div>
        {/* Dates on Holiday */}
        <div className="mb-3 lg:flex gap-3">
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
                    {startDate ? (
                      format(startDate, "dd-MM-yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="flex justify-between p-2">
                    <Select
                      onValueChange={(month) =>
                        handleMonthChange(month, "start")
                      }
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
        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Leave Reason
          </label>
          <div className="relative">
            <textarea
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.leaveReason}
              id="leaveReason"
              name="leaveReason"
              placeholder="Enter Your leave Reason"
              className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {touched.leaveReason && errors.leaveReason ? (
              <div className="text-red-500">{errors.leaveReason}</div>
            ) : null}
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
  );
};

export default AddEmployeeLeaveForm;
