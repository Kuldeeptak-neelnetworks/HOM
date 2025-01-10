"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import SelectReactSelect from "react-select";
import {
  baseInstance,
  errorToastingFunction,
  headerOptions,
  successToastingFunction,
} from "@/common/commonFunctions";
import { CalendarIcon, Loader2 } from "lucide-react";
import { LoaderIconSVG, PhoneIconSVG, UserIconSVG } from "@/utils/SVGs/SVGs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserStore } from "@/Store/UserStore";
import { useCustomerStore } from "@/Store/CustomerStore";
import { useTechnicalStore } from "@/Store/TechnicalStore";

interface AddTechnicalFormProps {
  setOpen: (newValue: boolean | ((prevCount: boolean) => boolean)) => void;
  getAllTechnical: any;
}

const AddTechnicalForm: React.FC<AddTechnicalFormProps> = ({
  getAllTechnical,
  setOpen,
}: any) => {
  const [customerLoading, setCustomerLoading] = useState(false);
  const [isCustomerValid, setIsCustomerValid] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const { fetchAllCustomerData, customerData }: any = useCustomerStore();
  const { fetchUsersData, userData }: any = useUserStore();
  const { addTechnicalData, technicalData, fetchTechnicalData }: any =
    useTechnicalStore();

  useEffect(() => {
    fetchUsersData();
    fetchAllCustomerData();
  }, []);

  const formik = useFormik({
    initialValues: {
      timeTakenMinutes: "",
      status: "",
      priority: "",
      technicalTask: "",
    },
    // validationSchema: Yup.object({
    //   customer_status: Yup.string().required("Customer Status Required"),
    //   date_current: Yup.string().required("Current Date Required"),
    //   status: Yup.string().required("Status Required"),
    //   priority: Yup.string().required("Priority Required"),
    //   generated_by: Yup.string().required("User Required"),
    // }),

    onSubmit: async (values) => {
      try {
        setCustomerLoading(() => true);
        setIsCustomerValid(() => true);

        const data = {
          timeTakenMinutes: values.timeTakenMinutes,
          status: values.status,
          priority: values.priority,
          technicalTask: values.technicalTask,
        };

        setOpen(false);
        await addTechnicalData(data, selectedCustomerId);
        fetchTechnicalData();
        setOpen(false);
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        } else {
          errorToastingFunction(error?.response?.data.message);
        }
      } finally {
        setIsCustomerValid(() => false);
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

  return (
    <ScrollArea className="h-[23rem]   px-3 py-3">
      <form onSubmit={handleSubmit} className="text-[0.8rem]">
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
                // className="text-[0.8rem] p-0 m-0 h-2"
                closeMenuOnSelect={true}
                isClearable={true}
                options={customerData.customers.map((customer: any) => ({
                  value: customer._id,
                  label: customer.companyName,
                }))}
                onChange={(selectedOption: { value: any } | null) => {
                  setSelectedCustomerId(
                    selectedOption ? selectedOption.value : null
                  );
                }}
                placeholder="Select a Company"
              />
            )}
            {/* )}  */}
          </div>
        </div>
        {/* timeTakenMinutes */}
        <div className="mb-3 w-full">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Time Taken Minutes
          </label>
          <div className="relative">
            <input
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.timeTakenMinutes}
              id="timeTakenMinutes"
              name="timeTakenMinutes"
              placeholder="Enter time taken minutes"
              className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>

        {/* priority */}
        <div className="mb-3">
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
        <div className="mb-3">
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
                  <SelectItem value="Back With Repo">Back With Repo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {touched.status && errors.status ? (
              <div className="text-red-500">{errors.status}</div>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
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
                  <SelectItem value="Hosting Setup">Hosting Setup</SelectItem>
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

        <div className="mb-3">
          <Button
            type="submit"
            value=""
            className="cursor-pointer  border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90"
          >
            {isCustomerValid ? (
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

export default AddTechnicalForm;
