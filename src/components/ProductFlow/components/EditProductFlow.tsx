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
import { useTechnicalStore } from "@/Store/TechnicalStore";
import { useProductflowStore } from "@/Store/ProductFlowStore";
import Link from "next/link";

interface ProductFlowDetailType {
  id: number;
  customer: any;
  currentStage: string;
  datePhase1Instructed: string;
  datePhase2Instructed: string;
  demoLink: string;
  demoCompletedDate: string;
  liveDate: string;
  notes: string;
}

const EditProductFlow = () => {
  const router = useRouter();
  const [productFlow, setProductFlow] = useState<ProductFlowDetailType | null>(
    null
  );
  const [isProductFlowValid, setIsProductFlowValid] = useState(false);
  const [demoCompletedDate, setDemoCompletedDate] = useState<Date | undefined>(
    undefined
  );
  const [datePhase1Instructed, setDatePhase1Instructed] = useState<
    Date | undefined
  >(undefined);
  const [datePhase2Instructed, setDatePhase2Instructed] = useState<
    Date | undefined
  >(undefined);

  const [liveDate, setLiveDate] = useState<Date | undefined>(undefined);
  const { productFlowData, fetchProductFlowData }: any = useProductflowStore();
  const { productFlowId } = useParams();
  const formatDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getProductFlowDetails = async () => {
    try {
      const result = await baseInstance.get(`/productFlows/${productFlowId}`);
      if (result.status === 200) {
        const productFlowData = result?.data?.data?.productFlow;
        setProductFlow(productFlowData);

        const dateFields = [
          "datePhase1Instructed",
          "datePhase2Instructed",
          "demoCompletedDate",
          "liveDate",
        ];
        dateFields.forEach((field) => {
          const formattedDate = formatDate(productFlowData[field]);
          const parsedDate = new Date(formattedDate);
          if (!isNaN(parsedDate.getTime())) {
            switch (field) {
              case "datePhase1Instructed":
                setDatePhase1Instructed(parsedDate);
                break;
              case "datePhase2Instructed":
                setDatePhase2Instructed(parsedDate);
                break;
              case "demoCompletedDate":
                setDemoCompletedDate(parsedDate);
                break;
              case "liveDate":
                setLiveDate(parsedDate);
                break;
              default:
                break;
            }
          } else {
            console.error(
              `Invalid date format for ${field}:`,
              productFlowData[field]
            );
          }
        });
      }
    } catch (error) {
      console.error("Error fetching product flow details:", error);
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
      }
    }
  };
  useEffect(() => {
    fetchProductFlowData();
    getProductFlowDetails();
  }, []);

  const formik = useFormik({
    initialValues: {
      currentStage: productFlow?.currentStage || "",
      datePhase1Instructed: productFlow?.datePhase1Instructed || "",
      datePhase2Instructed: productFlow?.datePhase2Instructed || "",
      demoLink: productFlow?.demoLink || "",
      demoCompletedDate: productFlow?.demoCompletedDate || "",
      liveDate: productFlow?.liveDate || "",
      notes: productFlow?.notes || "",
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        setIsProductFlowValid(() => true);

        const data = {
          currentStage: values.currentStage,
          datePhase1Instructed: formatDate(datePhase1Instructed),
          datePhase2Instructed: formatDate(datePhase2Instructed),
          demoLink: values.demoLink,
          demoCompletedDate: formatDate(demoCompletedDate),
          liveDate: formatDate(liveDate),
          notes: values.notes,
        };

        const response = await baseInstance.patch(
          `/productFlows/${productFlowId}`,
          data
        );

        if (response?.status === 200) {
          successToastingFunction(response?.data?.message);
          setIsProductFlowValid(() => false);
          getProductFlowDetails();
          router.push("/productFlow");
          // setOpen(false);
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
        setIsProductFlowValid(() => false);
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
  // const handleLiveDate = (selectedDate: any) => {
  //   setLiveDate(selectedDate);
  // };
  // const handlePhase1Instructed = (selectedDate: any) => {
  //   setDatePhase1Instructed(selectedDate);
  // };
  // const handlePhase2Instructed = (selectedDate: any) => {
  //   setDatePhase2Instructed(selectedDate);
  // };
  // const handleDemoCompletedDate = (selectedDate: any) => {
  //   setDemoCompletedDate(selectedDate);
  // };
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
  
    // Generate the years array using the fixed startYear and endYear
    const years = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );
    const handleMonthChange = (month: string, target: "phase1" | "phase2" | "demo" | "live") => {
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
    
      const newDate = currentDate ? setMonth(currentDate, monthIndex) : setMonth(new Date(), monthIndex);
    
      dateMap[target](newDate);
    };
   const handleYearChange = (year: string, target: "phase1" | "phase2" | "demo" | "live") => {
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
    
      const newDate = currentDate ? setYear(currentDate, yearNumber) : setYear(new Date(), yearNumber);
      
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
  return (
    <div className="p-4 relative text-[0.8rem]">
      <div className="text-[1rem] font-semibold absolute top-[-50px] ">
        {productFlow?.customer?.companyName
          ? productFlow?.customer?.companyName
          : "loading..."}
      </div>

      <div className=" flex gap-5 justify-center">
        <div className="my-3 text-[0.8rem] bg-[#fff] hover:bg-gray-300 h-fit px-2 py-1 rounded cursor-pointer hidden text-center sm:block w-fit boxShadow ">
          <Link href={`/productFlow`}>Back</Link>
        </div>
        <ScrollArea className="h-[80vh]   sm:px-3 sm:py-3 w-[100%] xl:w-[56vw]">
          <form
            onSubmit={handleSubmit}
            className="border p-6 bg-[#fff]  boxShadow"
          >
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
                            handleMonthChange(month, "phase1")
                          }
                          value={months[currentMonthPhase1]}
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
                            handleYearChange(year, "phase1")
                          }
                          value={currentYearPhase1.toString()}
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
                        selected={datePhase1Instructed}
                        onSelect={handlePhase1Instructed}
                        initialFocus
                        month={datePhase1Instructed}
                        onMonthChange={(date) => setDatePhase1Instructed(date)}
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
                            handleMonthChange(month, "phase2")
                          }
                          value={months[currentMonthPhase2]}
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
                            handleYearChange(year, "phase2")
                          }
                          value={currentYearPhase2.toString()}
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
                        selected={datePhase2Instructed}
                        onSelect={handlePhase2Instructed}
                        initialFocus
                        month={datePhase2Instructed}
                        onMonthChange={(date) => setDatePhase2Instructed(date)}
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
                            handleMonthChange(month, "demo")
                          }
                          value={months[currentMonthDemo]}
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
                            handleYearChange(year, "demo")
                          }
                          value={currentYearDemo.toString()}
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
                            handleMonthChange(month, "live")
                          }
                          value={months[currentMonthLive]}
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
                            handleYearChange(year, "live")
                          }
                          value={currentYearLive.toString()}
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
              <div className="mb-5 w-full">
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
                  {/* {touched.managedBy && errors.managedBy ? (
              <div className="text-red-500">{errors.managedBy}</div>
            ) : null} */}
                </div>
              </div>
              <div className="mb-5 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Notes
                </label>
                <div className="relative">
                  <input
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formik.values.notes}
                    id="notes"
                    name="notes"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="my-6 ">
              <Button
                type="submit"
                className="lg:w-[6vw] cursor-pointer  border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 text-md"
              >
                {isProductFlowValid ? (
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

export default EditProductFlow;
