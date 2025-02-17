"use Client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import styles from "../../../styles/test.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseURL } from "@/utils/constants/apiConstants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  baseInstance,
  errorToastingFunction,
  headerOptions,
  successToastingFunction,
} from "@/common/commonFunctions";
import { Calendar } from "@/components/ui/calendar";
import { Dispatch, SetStateAction } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { PhoneIconSVG, UserIconSVG } from "@/utils/SVGs/SVGs";

import { ScrollArea } from "@/components/ui/scroll-area";
import moment from "moment";
import { useRouter } from "next/navigation";
import "../../../styles/common.css";

// type AddAppointmentFormProps = {
//   leadId: string;
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   getAppointmentsAtSelectedDate: () => void;
// };
type AddAppointmentFormProps = {
  leadId: string;
};

type User = {
  fullName: string;
  email: string;
  password: string;
  userRoles: any;
  contact_no: string | number;
  address: string | number;
  avatar: string | [];
};

const AddAppointmentForm: React.FC<AddAppointmentFormProps> = ({
  leadId,
}: any) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const router = useRouter();
  const [isUserValid, setIsUserValid] = useState(false);
  const [value, setValue] = useState();
  console.log("valueeeee", value);

  function formatDate(date: any) {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, "0"); // Adding leading zero if needed
    let day = d.getDate().toString().padStart(2, "0"); // Adding leading zero if needed
    return `${year}-${month}-${day}`;
  }

  // const getAppointmentsAtSelectedDate = async () => {
  //   try {
  //     //   const originalDate = new Date(e);
  //     //   const formattedDate = moment(originalDate).format("YYYY-MM-DD");

  //     //   const result = await baseInstance.get(
  //     //     `/leads/lead/appointments/${leadId}?date=${formattedDate}`
  //     //   );
  //     const result = await baseInstance.get(
  //       `/leads/appointments/lead?lead_id=${leadId}`
  //     );
  //     if (result.status === 200) {
  //       setAppointments(result?.data?.data);
  //       // getAppointmentsAtSelectedDate(date);
  //       // if (result?.data?.message === "Appointment not found") {
  //       //   errorToastingFunction(result?.data?.message);
  //       // } else {
  //       //   successToastingFunction(result?.data?.message);
  //       // }
  //     } else {
  //       setAppointments([]);
  //     }
  //   } catch (error: any) {
  //     errorToastingFunction(error?.response?.data?.message);
  //     // logOutFunction(error?.response?.data?.message);
  //     // router.push("/auth/login");
  //   } finally {
  //     //   setIsUserValid(() => false);
  //   }
  // };

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      date: "",
      time: "",
      lead: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "Must be 3 characters or more")
        .required("Title Required"),
      // date: Yup.string().required("Date Required"),
      time: Yup.string().required("Time Required"),
      content: Yup.string().required("Description Required"),
    }),

    onSubmit: async (values) => {
      // console.log("value", values);
      try {
        setIsUserValid(() => true);
        const formData = {
          title: values.title,
          content: values.content,
          time: values.time,
          date: formatDate(date),
          // date: values.date,
        };

        // console.log("formData", formData);

        const response = await baseInstance.post(
          `/leads/appointments/${leadId}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response?.status === 201) {
          successToastingFunction(response?.data?.message);
          setIsUserValid(() => false);
          router.push(`/leads/leadsDetails/${leadId}`);
          // setOpen(false);
          // getAppointmentsAtSelectedDate();
        } else {
          alert("Something went Wrong !!");
        }
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data?.message);
        } else {
          errorToastingFunction(error?.response?.data.error);
        }
      } finally {
        setIsUserValid(() => false);
      }
    },
  });

  const { handleChange, handleBlur, handleSubmit, values, touched, errors } =
    formik;

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
  // Function to handle month change
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

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const currentMonth = date ? getMonth(date) : getMonth(new Date());
  const currentYear = date ? getYear(date) : getYear(new Date());

  return (
    <form onSubmit={handleSubmit} className="overflow-y-auto text-[0.8rem]">
      <div className="px-3 py-3">
        {/* Name   */}
        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Appointment Title
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              placeholder="Title"
              className=" border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {touched.title && errors.title ? (
              <div className="text-red-500">{errors.title}</div>
            ) : null}

            {/* <span className="absolute right-4 top-2">
            <UserIconSVG cssClass={styles.commonText} />
          </span> */}
          </div>
        </div>

        {/*  Date  */}
        {/* <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Appointment Date
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary "
              id="date"
              name="date"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.date}
            />
            {touched.date && errors.date ? (
              <div className="text-red-500">{errors.date}</div>
            ) : null}
          </div>
        </div> */}

        {/*  Date  */}
        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
          Appointment Date
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
                    ? format(date, "yyyy-MM-dd")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0">
                <div className="flex justify-between p-2">
                  <Select
                    onValueChange={(month) => handleMonthChange(month)}
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
                    onValueChange={(year) => handleYearChange(year)}
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
                <div className="calendar-container">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    month={date}
                    onMonthChange={(date) => setDate(date)}
                  />
                </div>
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
                  {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                      <div className="calendar-container">
                <Calendar
                  mode="single"
                  selected={date}
                  initialFocus
                  onSelect={handleDateSelect}
                  className=" border"
                />
                </div>
              </PopoverContent>
            </Popover> */}
            {touched.date && errors.date ? (
              <div className="text-red-500">{errors.date}</div>
            ) : null}
          </div>
        </div>

        {/*  Time  */}
        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Appointment Time
          </label>
          <div className="relative">
            <div>
              <input
                type="time"
                className=" border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary "
                id="time"
                name="time"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.time}
              />
            </div>
            {touched.time && errors.time ? (
              <div className="text-red-500">{errors.time}</div>
            ) : null}

            {/* <span className="absolute right-4 top-2">
            <UserIconSVG cssClass={styles.commonText} />
          </span> */}
          </div>
        </div>

        {/* <div className="mb-3">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker", "TimePicker"]}>
              <TimePicker
                label="Select time"
                value={value}
                onChange={(newValue: any) => setValue(newValue)}
                className="text-[0.7rem] box-content"
              />
            </DemoContainer>
          </LocalizationProvider>
        </div> */}

        {/* Message  */}
        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Appointment Description
          </label>
          <div className="relative">
            <textarea
              id="content"
              name="content"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.content}
              placeholder="Write Here"
              className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {touched.content && errors.content ? (
              <div className="text-red-500">{errors.content}</div>
            ) : null}

            {/* <span className="absolute right-4 top-2">
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.5">
                <path
                  d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                  fill=""
                />
              </g>
            </svg>
          </span> */}
          </div>
        </div>

        {/* button  */}
        <div className="mb-3">
          <Button
            type="submit"
            value="Sign In"
            className="cursor-pointer border border-primary bg-primary py-1 text-white transition hover:bg-opacity-90"
          >
            {isUserValid ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddAppointmentForm;
