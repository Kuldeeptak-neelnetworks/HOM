"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import styles from "../../../styles/test.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import SelectReactSelect from "react-select";
import { errorToastingFunction } from "@/common/commonFunctions";
import { CalendarIcon, Loader2 } from "lucide-react";
import { LoaderIconSVG } from "@/utils/SVGs/SVGs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useUserStore } from "@/Store/UserStore";
import { useCustomerStore } from "@/Store/CustomerStore";
import { useCopywriterStore } from "@/Store/CopywriterStore";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
const AddCopywriterForm = ({}: any) => {
  const router = useRouter();
  const [customerLoading, setCustomerLoading] = useState(false);
  const [isCopywriterValid, setIsCopywriterValid] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [dateComplete, setDateComplete] = useState<Date | undefined>(undefined);

  const { fetchAllCustomerData, customerData }: any = useCustomerStore();
  const { addCopywriterData, fetchCopywriterData }: any = useCopywriterStore();

  useEffect(() => {
    fetchAllCustomerData();
  }, []);

  function formatDate(date: any) {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, "0");
    let day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const formik = useFormik({
    initialValues: {
      status: "",
      dateComplete: "",
      selectedCustomerId: "",
    },
    validationSchema: () => {
      let schema = Yup.object().shape({
        selectedCustomerId: Yup.string().required("Company Name Required"),
      });

      return schema;
    },

    onSubmit: async (values) => {
      try {
        setCustomerLoading(() => true);
        setIsCopywriterValid(() => true);

        const data = {
          status: values.status,

          dateComplete: formatDate(dateComplete),
        };

        await addCopywriterData(data, selectedCustomerId);
        fetchCopywriterData();

        router.push("/copywriter");
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        } else {
          errorToastingFunction(error?.response?.data.message);
        }
      } finally {
        setIsCopywriterValid(() => false);
        setCustomerLoading(() => false);
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
    <div className="p-4 relative">
      <div className="text-[1rem] font-semibold absolute top-[-50px]">
        Add Copywriter Tracker
      </div>

      <div className="flex justify-center">
        <ScrollArea className="h-[80vh]  px-3 py-3 w-[100%] xl:w-[56vw]">
          <form
            onSubmit={handleSubmit}
            className="border p-6 text-[0.8rem] bg-[#fff]"
          >
            <div className="mb-3 mt-3">
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
            </div>

            <div className="my-6 ">
              <Button
                type="submit"
                className="lg:w-[6vw] cursor-pointer border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 text-md"
              >
                {isCopywriterValid ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AddCopywriterForm;
