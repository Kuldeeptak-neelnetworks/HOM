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
import { format } from "date-fns";
import SelectReactSelect from "react-select";
import { errorToastingFunction } from "@/common/commonFunctions";
import { CalendarIcon, Loader2 } from "lucide-react";
import { LoaderIconSVG, PhoneIconSVG, UserIconSVG } from "@/utils/SVGs/SVGs";
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
import { useProductflowStore } from "@/Store/ProductFlowStore";

const AddProductFlowForm = ({}: any) => {
  const router = useRouter();
  const [customerLoading, setCustomerLoading] = useState(false);
  const [isProductFlowValid, setIsProductFlowValid] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
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
  const { fetchAllCustomerData, customerData }: any = useCustomerStore();
  const { fetchUsersData }: any = useUserStore();
  const { addProductFlowData, fetchProductFlowData }: any =
    useProductflowStore();

  useEffect(() => {
    fetchUsersData();
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
      currentStage: "",
      datePhase1Instructed: "",
      datePhase2Instructed: "",
      demoLink: "",
      demoCompletedDate: "",
      liveDate: "",
      notes: "",
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

        await addProductFlowData(data, selectedCustomerId);
        fetchProductFlowData();

        router.push("/productFlow");
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        } else {
          errorToastingFunction(error?.response?.data.message);
        }
      } finally {
        setIsProductFlowValid(() => false);
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
  const handleLiveDate = (selectedDate: any) => {
    setLiveDate(selectedDate);
  };
  const handlePhase1Instructed = (selectedDate: any) => {
    setDatePhase1Instructed(selectedDate);
  };
  const handlePhase2Instructed = (selectedDate: any) => {
    setDatePhase2Instructed(selectedDate);
  };
  const handleDemoCompletedDate = (selectedDate: any) => {
    setDemoCompletedDate(selectedDate);
  };

  return (
    <div className="p-4 relative">
      <div className="text-[1rem] font-semibold absolute top-[-50px]">
        Add Product Flow
      </div>

      <div className="flex justify-center">
        <ScrollArea className="h-[80vh] rounded-md  px-3 py-3 w-[100%] xl:w-[56vw] ">
          <form
            onSubmit={handleSubmit}
            className="border p-6 text-[0.8rem] bg-[#fff] rounded-md boxShadow"
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
                          "w-[100%] justify-start text-left font-normal text-md",
                          !datePhase1Instructed && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {datePhase1Instructed ? (
                          format(datePhase1Instructed, "yyyy-MM-dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={datePhase1Instructed}
                        initialFocus
                        onSelect={handlePhase1Instructed}
                        className="rounded-md border"
                      />
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
                          "w-[100%] justify-start text-left font-normal text-md",
                          !datePhase2Instructed && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {datePhase2Instructed ? (
                          format(datePhase2Instructed, "yyyy-MM-dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={datePhase2Instructed}
                        initialFocus
                        onSelect={handlePhase2Instructed}
                        className="rounded-md border"
                      />
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
                          "w-[100%] justify-start text-left font-normal text-md",
                          !demoCompletedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {demoCompletedDate ? (
                          format(demoCompletedDate, "yyyy-MM-dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={demoCompletedDate}
                        initialFocus
                        onSelect={handleDemoCompletedDate}
                        className="rounded-md border"
                      />
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
                          "w-[100%] justify-start text-left font-normal text-md",
                          !liveDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {liveDate ? (
                          format(liveDate, "yyyy-MM-dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={liveDate}
                        initialFocus
                        onSelect={handleLiveDate}
                        className="rounded-md border"
                      />
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
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="my-6 ">
              <Button
                type="submit"
                className="lg:w-[6vw] cursor-pointer rounded-md border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 text-md"
              >
                {isProductFlowValid ? (
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

export default AddProductFlowForm;
