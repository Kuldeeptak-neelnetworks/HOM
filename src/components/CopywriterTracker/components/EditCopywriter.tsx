"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
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
import { useCopywriterStore } from "@/Store/CopywriterStore";
import Link from "next/link";

interface CopywriterDetailType {
  id: number;
  customer: any;
  status: string;
  dateComplete: string;
}

const EditCopywriter = () => {
  const router = useRouter();
  const [copywriter, setCopywriter] = useState<CopywriterDetailType | null>(
    null
  );
  const [isCopywriterValid, setIsCopywriterValid] = useState(false);
  const [dateComplete, setDateComplete] = useState<Date | undefined>(undefined);
  const { copywriterData, fetchCopywriterData }: any = useCopywriterStore();
  const { copywriterId } = useParams();
  const formatDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getCopywriterDetails = async () => {
    try {
      const result = await baseInstance.get(
        `/copywritertrackers/${copywriterId}`
      );
      if (result.status === 200) {
        const copywriterData = result.data.data;
        setCopywriter(copywriterData);

        const dateFields = ["dateComplete"];

        dateFields.forEach((field) => {
          const dateString = copywriterData[field];
          const formattedDate = formatDate(dateString);
          const parsedDate = new Date(formattedDate);

          if (!isNaN(parsedDate.getTime())) {
            switch (field) {
              case "dateComplete":
                setDateComplete(parsedDate);
                break;
              default:
                break;
            }
          } else {
            console.error(`Invalid date format for ${field}:`, dateString);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching copywriter details:", error);
      if (error instanceof AxiosError) {
        errorToastingFunction(error.response?.data?.message);
      }
    }
  };
  useEffect(() => {
    fetchCopywriterData();
    getCopywriterDetails();
  }, []);

  const formik = useFormik({
    initialValues: {
      dateComplete: copywriter?.dateComplete || "",
      status: copywriter?.status || "",
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        setIsCopywriterValid(() => true);
        const data = {
          status: values.status,
          dateComplete: formatDate(dateComplete),
        };
        const response = await baseInstance.patch(
          `/copywritertrackers/${copywriterId}`,
          data
        );
        if (response?.status === 200) {
          successToastingFunction(response?.data?.message);
          setIsCopywriterValid(() => false);
          getCopywriterDetails();
          router.push("/copywriter");
          // setOpen(false);
        } else {
          throw new Error("Something went wrong, Please try again later!");
        }
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        }
      } finally {
        setIsCopywriterValid(() => false);
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
  // Function to handle month change
  const handleMonthChange = (month: string) => {
    if (dateComplete) {
      const newDate = setMonth(dateComplete, months.indexOf(month));
      setDateComplete(newDate);
    } else {
      const newDate = setMonth(new Date(), months.indexOf(month));
      setDateComplete(newDate);
    }
  };

  // Function to handle year change
  const handleYearChange = (year: string) => {
    if (dateComplete) {
      const newDate = setYear(dateComplete, parseInt(year));
      setDateComplete(newDate);
    } else {
      const newDate = setYear(new Date(), parseInt(year));
      setDateComplete(newDate);
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
    <div className="p-4 relative text-[0.8rem]">
      <div className="text-[1rem] font-semibold absolute top-[-50px] ">
        {copywriter?.customer?.companyName
          ? copywriter?.customer?.companyName
          : "loading..."}
      </div>

      <div className=" flex gap-5 justify-center">
        <div className="my-3 text-[0.8rem] bg-[#fff] hover:bg-gray-300 h-fit px-2 py-1 cursor-pointer hidden text-center sm:block w-fit boxShadow">
          <Link href={`/copywriter`}>Back</Link>
        </div>
        <ScrollArea className="h-[80vh]  sm:px-3 sm:py-3 w-[100%] xl:w-[56vw]">
          <form
            onSubmit={handleSubmit}
            className="border p-6 bg-[#fff] boxShadow "
          >
            <div className="mb-5 w-full">
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

            <div className="mb-5 w-full">
              <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                      dateComplete.toISOString() !== "1970-01-01T00:00:00.000Z"
                        ? format(dateComplete, "yyyy-MM-dd")
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

            <div className="my-6 ">
              <Button
                type="submit"
                className="lg:w-[6vw] cursor-pointer border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 text-md"
              >
                {isCopywriterValid ? (
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

export default EditCopywriter;
