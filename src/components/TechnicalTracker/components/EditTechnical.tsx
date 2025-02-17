"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
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
import { useTechnicalStore } from "@/Store/TechnicalStore";

interface TechnicalDetailType {
  id: number;
  customerName: any;
  dateComplete: string;
  technicalTask: string;
  status: string;
  priority: string;
  timeTakenMinutes: string;
  customer: {
    companyName: string;
  };
}

const EditTechnical = () => {
  const router = useRouter();
  const [technical, setTechnical] = useState<TechnicalDetailType | null>(null);
  const [isTechnicalValid, setIsTechnicalValid] = useState(false);

  const { technicalData, fetchTechnicalData }: any = useTechnicalStore();
  const { technicalId } = useParams();
  const formatDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [completeDate, setComplateDate] = useState<Date | undefined>();
  const handleCompleteDateSelect = (selectedDate: any) => {
    setComplateDate(selectedDate);
  };

  const getTechnicalDetails = async () => {
    try {
      const result = await baseInstance.get(
        `/technicaltrackers/${technicalId}`
      );
      if (result.status === 200) {
        const technicalData = result?.data?.data?.tracker;
        setTechnical(technicalData);
        const formattedCompleteDate = formatDate(technicalData.dateComplete);
        const parsedCompleteDate = new Date(formattedCompleteDate);
        if (!isNaN(parsedCompleteDate.getTime())) {
          setComplateDate(parsedCompleteDate);
        } else {
          console.error("Invalid date format:", technicalData.dateComplete);
        }
      }
    } catch (error) {
      console.error("Error fetching lead data:", error);
    }
  };
  useEffect(() => {
    // fetchAllCustomerData();
    fetchTechnicalData();
    getTechnicalDetails();
  }, []);

  const formik = useFormik({
    initialValues: {
      timeTakenMinutes: technical?.timeTakenMinutes || "",
      status: technical?.status || "",
      priority: technical?.priority || "",
      technicalTask: technical?.technicalTask || "",
      dateComplete: technical?.dateComplete || "",
    },

    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        setIsTechnicalValid(() => true);
        const data = {
          timeTakenMinutes: values.timeTakenMinutes,
          status: values.status,
          priority: values.priority,
          technicalTask: values.technicalTask,
          dateComplete: formatDate(completeDate),
        };

        const response = await baseInstance.patch(
          `/technicaltrackers/${technicalId}`,
          data
        );

        if (response?.status === 200) {
          successToastingFunction(response?.data?.message);
          setIsTechnicalValid(() => false);
          getTechnicalDetails();
          router.push("/technical");
          // setOpen(false);
        } else {
          throw new Error("Something went wrong, Please try again later!");
        }
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        }
      } finally {
        setIsTechnicalValid(() => false);
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

  return (
    <div className="p-4 relative text-[0.8rem]">
      <div className="text-[1rem] font-semibold absolute top-[-35px] text-wrap">
        {technical?.customer?.companyName
          ? technical?.customer?.companyName
          : "loading..."}
      </div>
      <div className=" flex gap-5 justify-center">
        <ScrollArea className="h-[80vh]   sm:px-3 sm:py-3 w-[100%] xl:w-[56vw]">
          <form
            onSubmit={handleSubmit}
            className="border p-6 bg-[#fff]  boxShadow"
          >
            {/* timeTakenMinutes */}
            <div className="lg:flex gap-5">
              <div className="mb-5 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Time Taken Minutes
                </label>
                <div className="relative">
                  <input
                    type="number"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formik.values.timeTakenMinutes}
                    id="timeTakenMinutes"
                    name="timeTakenMinutes"
                    placeholder="Enter time taken minutes"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-5 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
                  Date Completed
                </label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[100%] justify-start text-left font-normal text-md",
                          !completeDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {completeDate
                          ? format(completeDate, "yyyy-MM-dd")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <div className="calendar-container">
                      <Calendar
                        defaultMonth={completeDate}
                        mode="single"
                        selected={completeDate}
                        initialFocus
                        onSelect={handleCompleteDateSelect}
                        className=" border"
                      />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* priority */}
            <div className="lg:flex gap-5">
              <div className="mb-5 w-full">
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
            </div>
            <div className="mb-5 w-full">
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
            <div className="my-6 ">
              <Button
                type="submit"
                className="lg:w-[6vw] w-full cursor-pointer  border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 text-md"
              >
                {isTechnicalValid ? (
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

export default EditTechnical;
