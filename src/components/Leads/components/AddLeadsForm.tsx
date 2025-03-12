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

import {
  baseInstance,
  errorToastingFunction,
  headerOptions,
  successToastingFunction,
} from "@/common/commonFunctions";
import { Loader2 } from "lucide-react";
import {
  BuildingIconSVG,
  MobileIconSVG,
  PhoneIconSVG,
  UserIconSVG,
} from "@/utils/SVGs/SVGs";
import { useCustomerStore } from "@/Store/CustomerStore";
import { useParams, useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactSelect from "react-select";
import { useLeadStore } from "@/Store/LeadStore";
import { AsyncPaginate } from "react-select-async-paginate";

type Customer = {
  id: number;
  contactPerson: string;
  lead_type: string;
  currentWebsite: string;
  outcome: string;
  orderForecast: string;
  notes: string;
  emailAddress: string;
  companyName: string;
};

const AddLeadForm: React.FC = () => {
  const router = useRouter();

  const [isLeadValid, setIsLeadValid] = useState(false);
  const [allCustomers, setAllCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isLead, setIsLead] = useState(false);
  const { fetchAllCustomerData, customerData }: any = useCustomerStore();
  const { fetchAllLeadData }: any = useLeadStore;

  useEffect(() => {
    if (
      customerData === "Invalid refresh token" ||
      customerData === "User not found" ||
      customerData === "Invalid User Access Token" ||
      customerData === "Invalid access token" ||
      customerData === "Unauthorized request: No access or refresh token"
    ) {
      router.push("/auth/login");
    } else {
      setAllCustomers(
        customerData?.customers ? customerData?.customers || [] : []
      );
    }
  }, [customerData, router]);

  const handleRadioChange = () => {
    setIsNewCustomer((prevState) => !prevState);
  };

  const formik = useFormik({
    initialValues: {
      lead_type: "",
      currentWebsite: "",
      outcome: "",
      orderForecast: "",
      notes: "",
      customerName: "",
      emailAddress: "",
      contactPerson: "",
      mobileNumber: "",
      landlineNumber: "",
    },
    validationSchema: Yup.object({
      currentWebsite: Yup.string().matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Enter correct url!"
      ),

      mobileNumber: Yup.string(),
      // customerName: Yup.string().required("Company  Name Required!"),
      landlineNumber: Yup.string(),
      emailAddress: Yup.string().matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address"
      ),
    }),

    onSubmit: async (values) => {
      try {
        setIsLead(() => true);
        const mobileNumber = values.mobileNumber
          ? `0${values.mobileNumber}`
          : "";
        const landlineNumber = values.landlineNumber
          ? `0${values.landlineNumber}`
          : "";
        const data = {
          lead_type: values.lead_type,
          currentWebsite: values.currentWebsite,
          outcome: values.outcome,
          orderForecast: values.orderForecast,
          notes: values.notes,
          contactPerson: values.contactPerson,
          mobileNumber: mobileNumber,
          landlineNumber: landlineNumber,
          emailAddress: values.emailAddress,
          customerName: values.customerName,
        };

        const response = await baseInstance.post(
          `/leads/${selectedCustomerId}`,
          data
        );

        console.log("response", response);

        if (response?.status === 201) {
          successToastingFunction(response?.data?.message);
          setIsLead(() => false);
          // fetchAllLeadData();
          router.push("/leads");
        }
      } catch (error: any) {
        console.log("error", error);
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data?.message);
        } else {
          // alert("Something went wrong while creating the lead.");
          errorToastingFunction(error?.response?.data?.message);
        }
      } finally {
        setIsLead(() => false);
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
  const [fieldFocused, setFieldFocused] = useState(false);

  const handleFocus = (e: { target: { name: any } }) => {
    const fieldName = e.target.name;
    formik.setFieldTouched(fieldName, true, false);
    setFieldFocused(true);
  };

  useEffect(() => {
    fetchAllCustomerData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const [customerOptions, setCustomerOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loadCustomerOptions = async (
    search: any,
    loadedOptions: any,
    { page }: any
  ) => {
    const currentPageNumber = page || currentPage;
    setCurrentPage(currentPageNumber + 1);

    try {
      setLoading(true);

      // Build params dynamically
      const params: Record<string, any> = {
        page: currentPageNumber,
        limit: 20,
        ...(search && { search: search }),
      };

      console.log("params", params);

      const response = await baseInstance.get("/customers", { params });

      const customers = response.data?.data?.customers || [];

      // Transform the response data
      const transformedData = customers.map(
        (customer: { _id: any; companyName: any }) => ({
          value: customer._id,
          label: customer.companyName,
        })
      );

      // Merge options for infinite scroll
      const combinedOptions =
        currentPageNumber === 1
          ? transformedData
          : [...(loadedOptions?.options || []), ...transformedData];

      // Handle pagination flag
      const hasMore = response.data?.data?.hasMore ?? false;

      setCustomerOptions(customers);

      return {
        options: combinedOptions,
        hasMore,
        additional: JSON.stringify({ page: currentPageNumber + 1 }),
      };
    } catch (error) {
      console.error("Error fetching customers:", error);
      return {
        options: [],
        hasMore: false,
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className=" p-7 w-full lg:w-[70%] border my-5 bg-[#fff] boxShadow">
      <form onSubmit={handleSubmit} className="text-[0.8rem] ">
        <div className="mb-2">
          <input
            //  className="custom-checkbox"
            type="checkbox"
            id="option1"
            // value="option1"
            onChange={handleRadioChange}
          />
          <label
            style={{ cursor: "pointer" }}
            htmlFor="option1"
            className="ml-2"
          >
            Not An Existing Customer
          </label>
        </div>
        <div className="mb-3 lg:flex gap-3">
          {isNewCustomer ? (
            <div className="w-full mb-2 lg:mb-0">
              {/* Company Name */}
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Company Name <span style={{ opacity: "0.5" }}> * </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.customerName}
                  id="customerName"
                  name="customerName"
                  placeholder="Enter name"
                  className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          ) : (
            <div className="w-full mb-2 lg:mb-0">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Company Name <span style={{ opacity: "0.5" }}> * </span>
              </label>
              <div className="relative" >

                <AsyncPaginate 
                  className="react-select-custom-styling__container"
                  classNamePrefix="react-select-custom-styling"
                  value={customerOptions}
                  loadOptions={loadCustomerOptions}
                  onChange={(selectedOption: any) => {
                    setCustomerOptions(selectedOption);
                    setSelectedCustomerId(
                      selectedOption ? selectedOption.value : null
                    );
                  }}
                  additional={{ page: 1 }}
                  placeholder="Select Company"
                  debounceTimeout={300}
                  noOptionsMessage={({ inputValue }) =>
                    inputValue
                      ? `No Company found for "${inputValue}"`
                      : "No Company found"
                  }
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? "#007bff" : "white",
                      cursor: "pointer",
   
                      color: state.isSelected ? "white" : "black",
                      ":hover": {
                        backgroundColor: state.isSelected
                          ? "#007bff"
                          : "#f1f3f5",
                      },
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: "black",
                    }),
                   
         
                  }}
                />

                {/* {customerData?.customers?.length > 0 && (
                <Select
                  onValueChange={(value: any) => {
                    setSelectedCustomerId(value);
                  
                  }}
                  name="customerName"
                >
                  <SelectTrigger className="text-black">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent className="text-black">
                    <SelectGroup>
                      <SelectLabel>Select</SelectLabel>
                      {customerData?.customers?.length > 0 &&
                        customerData?.customers?.map((customer: any) => {
                          return (
                            <SelectItem value={"" + customer?._id}>
                              {customer?.companyName}
                            </SelectItem>
                          );
                        })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )} */}
                {/* <AsyncPaginate
                    loadOptions={loadOptions} // Function to load customer options asynchronously
                    closeMenuOnSelect={true} // Close the dropdown when an option is selected
                    isClearable={true} // Make the dropdown clearable
                    isLoading={loading} // Show a loading spinner while options are being loaded
                    additional={{ page }} // Pass the page number to the loadOptions function
                    onChange={(
                      selectedOption: { value: any; label: string } | null
                    ) => {
                      const selectedCustomerId = selectedOption?.value || "";

                      formik.setFieldValue(
                        "selectedCustomerId",
                        selectedCustomerId
                      );
                      setSelectedCustomerId(selectedCustomerId);

                      const selectedCustomer = customerOptions.find(
                        (customer: { _id: any }) =>
                          customer._id === selectedCustomerId
                      );
;
                    }}
                    placeholder="Select a Company"
                  /> */}

                {/* {customerData?.customers?.length > 0 && (
                  <ReactSelect
                    closeMenuOnSelect={true}
                    isClearable={true}
                    options={customerData.customers.map(
                      (customer: { _id: any; companyName: any }) => ({
                        value: customer._id,
                        label: customer.companyName,
                      })
                    )}
                    onChange={(selectedOption) => {
                      formik.setFieldValue(
                        "selectedCustomerId",
                        selectedOption?.value || ""
                      );
                      setSelectedCustomerId(selectedOption?.value || "");
                    }}
                    value={customerData.selectedCustomerId}
                    placeholder="Select a company name"
                  />
                )} */}
              </div>
            </div>
          )}

          {/* contactPerson */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Contact Person
            </label>
            <div className="relative">
              <input
                autoFocus={true}
                onFocus={handleFocus}
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.contactPerson}
                id="contactPerson"
                name="contactPerson"
                placeholder="Enter name"
                className={`w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                  fieldFocused ? "red-border" : ""
                }`}
              />
              {fieldFocused &&
              formik.touched.contactPerson &&
              formik.errors.contactPerson ? (
                <div className="text-red-500">
                  {formik.errors.contactPerson}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mb-3 lg:flex gap-3">
          <div className="w-full mb-2 lg:mb-0">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="emailAddress"
                name="emailAddress"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.emailAddress}
                placeholder="Enter Your Email"
                className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {formik.touched.emailAddress && formik.errors.emailAddress ? (
                <div className="text-red-500">{formik.errors.emailAddress}</div>
              ) : null}

              <span className="absolute right-4 top-2">
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
              </span>
            </div>
          </div>

          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Mobile No.
            </label>
            <div className="relative">
              <input
                type="tel"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.mobileNumber}
                id="mobileNumber"
                name="mobileNumber"
                placeholder="Enter Your Mobile Number"
                className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
                <div className="text-red-500">{formik.errors.mobileNumber}</div>
              ) : null}

              <span className="absolute right-4 top-2">
                <MobileIconSVG />
              </span>
            </div>
          </div>
        </div>

        <div className="mb-3 lg:flex gap-3">
          <div className="w-full mb-2 lg:mb-0">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Current Website
            </label>
            <div className="relative">
              <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.currentWebsite}
                id="currentWebsite"
                name="currentWebsite"
                placeholder="Enter name"
                className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {formik.touched.currentWebsite && formik.errors.currentWebsite ? (
                <div className="text-red-500">
                  {formik.errors.currentWebsite}
                </div>
              ) : null}
            </div>
          </div>
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Landline No.
            </label>
            <div className="relative">
              <input
                type="tel"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.landlineNumber}
                id="landlineNumber"
                name="landlineNumber"
                placeholder="Enter Your Landline Number"
                className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {formik.touched.landlineNumber && formik.errors.landlineNumber ? (
                <div className="text-red-500">
                  {formik.errors.landlineNumber}
                </div>
              ) : null}
              <span className="absolute right-4 top-2">
                <PhoneIconSVG />
              </span>
            </div>
          </div>
        </div>

        <div className="">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Lead Type
            {/* <span style={{ opacity: "0.5" }}> * </span> */}
          </label>
          <div className="relative">
            <Select
              onValueChange={(value: any) =>
                formik.setFieldValue("lead_type", value)
              }
              // onBlur={formik.handleBlur}
              value={formik.values.lead_type}
              name="lead_type"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a lead type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select</SelectLabel>
                  <SelectItem value="Referal">Referal</SelectItem>
                  <SelectItem value="Cold call">Cold call</SelectItem>
                  <SelectItem value="Contact Metting">
                    Contact Metting
                  </SelectItem>
                  <SelectItem value="Old Client">Old Client</SelectItem>
                  <SelectItem value="Promate Client">Promate Client</SelectItem>
                  <SelectItem value="Renewal">Renewal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.lead_type && formik.errors.lead_type ? (
              <div className="text-red-500">{formik.errors.lead_type}</div>
            ) : null}
          </div>
        </div>
        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Outcome
            {/* <span style={{ opacity: "0.5" }}> * </span> */}
          </label>
          <div className="relative">
            <Select
              onValueChange={(value: any) =>
                formik.setFieldValue("outcome", value)
              }
              // onBlur={formik.handleBlur}
              value={formik.values.outcome}
              name="outcome"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select</SelectLabel>
                  <SelectItem value="Appointement Made">
                    Appointement Made
                  </SelectItem>
                  <SelectItem value="Callback">Callback</SelectItem>
                  <SelectItem value="Not Interseted">Not Interseted</SelectItem>
                  <SelectItem value="Old Client">Old Client</SelectItem>
                  <SelectItem value="Arrange an Appointment">
                    Arrange an Appointment
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {formik.touched.outcome && formik.errors.outcome ? (
              <div className="text-red-500">{formik.errors.outcome}</div>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Order Forecast
          </label>
          <div className="relative">
            <input
              type="tel"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.orderForecast}
              id="orderForecast"
              name="orderForecast"
              placeholder="Enter Your order forecast"
              className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {formik.touched.orderForecast && formik.errors.orderForecast ? (
              <div className="text-red-500">{formik.errors.orderForecast}</div>
            ) : null}
          </div>
        </div>
        <div className="mb-3">
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
              minLength={4}
              placeholder="Enter Your notes"
              rows={4}
              className="w-full resize-none  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {formik.touched.notes && formik.errors.notes ? (
              <div className="text-red-500">{formik.errors.notes}</div>
            ) : null}
          </div>
        </div>

        {/* button  */}
        <div className="mb-3">
          <Button
            type="submit"
            className="cursor-pointer  border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90"
          >
            {isLead ? (
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

export default AddLeadForm;
