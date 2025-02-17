"use Client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import styles from "../../../styles/test.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios, { AxiosError } from "axios";
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
  baseInstance,
  errorToastingFunction,
  headerOptions,
  successToastingFunction,
} from "@/common/commonFunctions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Dispatch, SetStateAction } from "react";

import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { PhoneIconSVG, UserIconSVG } from "@/utils/SVGs/SVGs";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";


type EditAppointmentFormProps = {
  // getAppointmentsAtSelectedDate: () => void;
  // date: string;
};

interface FormData {
  title: string;
  content: string;
  date: string;
  time: string;
  lead: string;
}

const EditAppointmentForm: React.FC<
  EditAppointmentFormProps
> = ({}: // getAppointmentsAtSelectedDate,
// date,
any) => {
  const { appointmentId, leadId } = useParams();
  const [appointmentDetail, setAppointmentDetail] = useState<FormData | null>(
    null
  );
  const [isUserValid, setIsUserValid] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(
    undefined
  );

  const router = useRouter();

  const formatDateForUI = (date: any) => {
    return moment.utc(date).format("YYYY-MM-DD");
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getAppointmentDetail = async () => {
    try {
      const result = await baseInstance.get(
        `/leads/appointments/${appointmentId}`
      );

      if (result.status === 200) {
        const appointmentDetail = result?.data?.data;
        setAppointmentDetail(appointmentDetail);
        const dateFields = ["date"];

        dateFields.forEach((field) => {
          const dateString = appointmentDetail[field];
          const formattedDate = formatDateForUI(dateString);
          const parsedDate = new Date(formattedDate);
          if (!isNaN(parsedDate.getTime())) {
            switch (field) {
              case "date":
                setAppointmentDate(parsedDate);
                break;
              default:
                break;
            }
          } else {
            console.error(`Invalid date format for ${field}:`, dateString);
          }
        });
      } else {
        alert("Something went Wrong !!");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    getAppointmentDetail();
  }, [appointmentId]);

  const goToLeadsDetails = () => {
    router.push(`/leads/leadsDetails/${leadId}`);
  };

  const formik = useFormik<FormData>({
    initialValues: {
      title: appointmentDetail?.title || "",
      content: appointmentDetail?.content || "",

      date: appointmentDetail?.date || "",
      time: appointmentDetail?.time || "",
      lead: appointmentDetail?.lead || "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, "Must be 3 characters or more")
        .required("Title Required"),
      date: Yup.string().required("Date Required"),
      time: Yup.string().required("Time Required"),
      content: Yup.string().required("Description Required"),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsUserValid(() => true);
        const formData = {
          title: values.title,
          content: values.content,
          time: values.time,
          date: formatDate(appointmentDate),
        };

        const response = await baseInstance.patch(
          `/leads/appointments/${appointmentId}`,
          formData
        );

        if (response?.status === 200) {
          successToastingFunction(response?.data?.message);
          setIsUserValid(() => false);
          goToLeadsDetails();
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

  const handleAppointmentDate = (selectedDate: any) => {
    setAppointmentDate(selectedDate);
  };



  
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
              if (appointmentDate) {
                const newDate = setMonth(appointmentDate, months.indexOf(month));
                setAppointmentDate(newDate);
              } else {
                const newDate = setMonth(new Date(), months.indexOf(month));
                setAppointmentDate(newDate);
              }
            };
          
            // Function to handle year change
            const handleYearChange = (year: string) => {
              if (appointmentDate) {
                const newDate = setYear(appointmentDate, parseInt(year));
                setAppointmentDate(newDate);
              } else {
                const newDate = setYear(new Date(), parseInt(year));
                setAppointmentDate(newDate);
              }
            };
          
            const handleDateSelect = (selectedDate: Date | undefined) => {
              if (selectedDate) {
                setAppointmentDate(selectedDate);
              }
            };
      
       
          
            const currentMonth = appointmentDate
              ? getMonth(appointmentDate)
              : getMonth(new Date());
            const currentYear = appointmentDate
              ? getYear(appointmentDate)
              : getYear(new Date());
  return (
    <>
      <div className="text-[1rem] font-semibold absolute sm:top-[10px] top-[60px] px-2">
        Edit Appointment Details
      </div>

      <div className="px-4 py-0 relative flex justify-center text-[0.8rem] pt-12">
        <div
          className="p-2 w-fit h-fit mx-5  cursor-pointer hover:bg-slate-200 hidden sm:block bg-[#fff] boxShadow"
          onClick={goToLeadsDetails}
        >
          Back
        </div>
        <div className="flex justify-center md:w-[55vw] w-full border  bg-[#fff] boxShadow">
          <div className="w-full p-3">
            <form
              onSubmit={handleSubmit}
              className=" overflow-y-auto text-[0.8rem] "
            >
              <ScrollArea className=" px-3 py-3">
                {/* Title   */}
                <div className="mb-3">
                  <label className="mb-2.5 block  text-black font-[600]  dark:text-white">
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
                      className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {touched.title && errors.title ? (
                      <div className="text-red-500">{errors.title}</div>
                    ) : null}
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
                      className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary "
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

                {/*  Appointment Date  */}
                <div className="mb-3">
                  <label className="mb-2.5 block text-black font-[600] dark:text-white">
                  Appointment Date
                  </label>
                  <div className="relative">
                  <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[250px] justify-start text-left font-normal",
                    !appointmentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {appointmentDate && appointmentDate.toISOString() !== "1970-01-01T00:00:00.000Z"
                    ? format(appointmentDate, "yyyy-MM-dd")
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
                    selected={appointmentDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    month={appointmentDate}
                    onMonthChange={(date) => setAppointmentDate(date)}
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
                            !appointmentDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {appointmentDate
                            ? format(appointmentDate, "yyyy-MM-dd")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50">
                      <div className="calendar-container">
                        <Calendar
                          mode="single"
                          selected={appointmentDate}
                          initialFocus
                          onSelect={handleAppointmentDate}
                          className=" border"
                          defaultMonth={appointmentDate}
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
                  <label className="mb-2.5 block text-black font-[600] dark:text-white">
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
                  </div>
                </div>

                {/* Message  */}
                <div className="mb-3">
                  <label className="mb-2.5 block text-black font-[600] dark:text-white">
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
                      className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {touched.content && errors.content ? (
                      <div className="text-red-500">{errors.content}</div>
                    ) : null}
                  </div>
                </div>

                {/* button  */}
                <div className="mb-3">
                  <Button
                    type="submit"
                    value="Sign In"
                    className="cursor-pointer  border border-primary bg-primary py-1 text-white transition hover:bg-opacity-90"
                  >
                    {isUserValid ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </ScrollArea>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAppointmentForm;
