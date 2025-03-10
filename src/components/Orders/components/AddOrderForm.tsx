"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { LoadOptions } from 'react-select-async-paginate';
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
import {
  baseInstance,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { useCustomerStore } from "@/Store/CustomerStore";

import SignatureCanvas from "react-signature-canvas";

import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserStore } from "@/Store/UserStore";
import SelectReactSelect from "react-select";
import { ValueType } from "tailwindcss/types/config";
import { LoaderIconSVG } from "@/utils/SVGs/SVGs";
import { AsyncPaginate } from "react-select-async-paginate";

interface FormData {
  dateOfOrder: string;
  customerEmail: string;
  buildingAddress: string;
  orderType: string;
  orderValue: string;
  deposit: string;
  depositMethod: string;
  numberOfInstallments: string;
  dateOfFirstDd: string;
  customerAccountName: string;
  customerAccountNumber: string;
  customerSortCode: string;
  googleEmailRenewCampaign: string;
  customerSignature: string;
  renewalDate2024: string;
  numberOfKeyPhrase: string;
  numberOfKeyAreas: string;
  customerName: string;
  town: string;
  county: string;
  postcode: string;
  streetNoName: string;
  createdBy: string;
  selectedUserId: string;
}

const AddOrderForm = ({ fetchAllOrdersData }: any) => {
  const [userNameHOM, setUserNameHOM] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userNameHOM");
    const storedRole = localStorage.getItem("userRoleHOM");

    setUserNameHOM(storedUserName);
    setRole(storedRole);
  }, []);

  const router = useRouter();

  const [userLoading, setUserLoading] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const { userData, fetchUsersData }: any = useUserStore();
  const [isOrder, setOrder] = useState(false);
  const { fetchAllCustomerData, customerData }: any = useCustomerStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [renewalDate, setRenewalDate] = useState<Date | undefined>(undefined);
  const [dateOfFirstDd, setDateOfFirstDd] = useState<Date | undefined>(
    undefined
  );

  const handleRenewalDateSelect = (selectedDate: any) => {
    setRenewalDate(selectedDate);
  };
  const handleDateOfOrderDateSelect = (selectedDate: any) => {
    setDateOfOrder(selectedDate);
  };
  const handleOfFirstDateSelect = (selectedDate: any) => {
    setDateOfFirstDd(selectedDate);
  };

  const signaturePad = useRef<any>(null);

  const [url, setUrl] = useState("");
  const [urlSignature, setUrlSignature] = useState("");

  function formatDate(date: any) {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, "0"); // Adding leading zero if needed
    let day = d.getDate().toString().padStart(2, "0"); // Adding leading zero if needed
    return `${year}-${month}-${day}`;
  }

  const formik = useFormik<FormData>({
    initialValues: {
      dateOfOrder: "",
      customerEmail: "",
      buildingAddress: "",
      orderType: "",
      orderValue: "",
      deposit: "",
      depositMethod: "",
      numberOfInstallments: "",
      dateOfFirstDd: "",
      customerAccountName: "",
      customerAccountNumber: "",
      customerSortCode: "",
      googleEmailRenewCampaign: "",
      customerSignature: "",
      renewalDate2024: "",
      numberOfKeyPhrase: "",
      numberOfKeyAreas: "",
      customerName: "",
      town: "",
      county: "",
      postcode: "",
      streetNoName: "",
      createdBy: "",
      selectedUserId: "",
    },
    // validationSchema: Yup.object({
    //   customer_status: Yup.string().required("Customer Status Required"),
    //   date_current: Yup.string().required("Current Date Required"),
    //   status: Yup.string().required("Status Required"),
    //   priority: Yup.string().required("Priority Required"),
    //   generated_by: Yup.string().required("User Required"),
    // }),
    validationSchema: () => {
      let schema = Yup.object().shape({
        customerName: Yup.string().required("Customer Name Required"),
        customerEmail: Yup.string().matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email address"
        ),

        // dateOfOrder: Yup.string().required("Date Of Order Required"),
        // dateOfOrder: Yup.date().required("Date Of Order Required"),
      });

      if (formik.values.orderType === "New Business") {
        schema = schema.shape({
          numberOfKeyPhrase: Yup.string().required(
            "Number Of Key Phrase Required"
          ),
          numberOfKeyAreas: Yup.string().required(
            "Number Of Key Areas Required"
          ),
        });
      }
      if (role !== "salesman") {
        schema = schema.shape({
          selectedUserId: Yup.string().required("User Name Required"),
        });
      }

      return schema;
    },

    // validationSchema: Yup.object({
    //   customerName: Yup.string().required("Customer Name Required"),
    //   selectedUserId: Yup.string().required("User Name Required"),
    //   customerEmail: Yup.string().matches(
    //     /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    //     "Invalid email address"
    //   ),

    //   if (formik.values.orderType === "New Business") {
    //   numberOfKeyPhrase: Yup.string().required("Number Of Key Phrase Required"),
    //   numberOfKeyAreas: Yup.string().required("Number Of Key Areas Required"),
    //   }

    // }),

    onSubmit: async (values: any) => {
      try {
        // console.log("Form values being submitted:", values);
        setOrder(() => true);
        const formData = new FormData();
        formData.append("customerName", values.customerName);
        formData.append("customerEmail", values.customerEmail);
        formData.append("buildingAddress", values.buildingAddress);
        formData.append("orderType", values.orderType);
        formData.append("orderValue", values.orderValue);
        formData.append("deposit", values.deposit);
        formData.append("depositMethod", values.depositMethod);
        formData.append("numberOfInstallments", values.numberOfInstallments);
        formData.append("customerAccountName", values.customerAccountName);
        formData.append("customerAccountNumber", values.customerAccountNumber);
        formData.append("customerSortCode", values.customerSortCode);
        // formData.append("createdBy", values.selectedUserId?.value);
        formData.append("createdBy", values.selectedUserId);

        formData.append(
          "googleEmailRenewCampaign",
          values.googleEmailRenewCampaign
        );
        formData.append("numberOfKeyPhrase", values.numberOfKeyPhrase);
        formData.append("numberOfKeyAreas", values.numberOfKeyAreas);

        if (dateOfOrder)
          formData.append("dateOfOrder", formatDate(dateOfOrder));
        if (dateOfFirstDd)
          formData.append("dateOfFirstDd", formatDate(dateOfFirstDd));
        if (renewalDate)
          formData.append("renewalDate2024", formatDate(renewalDate));
        if (urlSignature) formData.append("customerSignature", urlSignature);

        const response = await baseInstance.post(
          `/orders/${selectedCustomerId}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response?.status === 201) {
          successToastingFunction(response?.data?.message);
          router.push("/orders");
          setOrder(() => false);
        } else {
          alert("Something went Wrong !!");
        }
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        } else {
          errorToastingFunction(error?.response?.data.message);
        }
      } finally {
        setOrder(() => false);
      }
    },
  });

  useEffect(() => {
    if (role !== "salesman" && role !== "") {
      fetchUsersData();
    }
  }, [role]);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    touched,
    errors,
    setFieldValue,
  } = formik;

  const handleClear = () => {
    if (signaturePad.current) {
      signaturePad.current.clear();
      setUrl("");
    }
  };

  useEffect(() => {
    fetchAllCustomerData();
  }, []);

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
      //  setLoader(false);
      //  setAllCustomers(
      //    customerData?.customers ? customerData?.customers || [] : []
      //  );
    }
  }, [customerData, router]);
  // console.log("customerData", customerData);

  // Function to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteString = atob(base64);
    const byteNumbers = new Array(byteString.length)
      .fill(null)
      .map((_, i) => byteString.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  // Function to upload signature as a file
  const uploadSignature = async () => {
    if (url) {
      // Base64 data from the signature pad
      const base64Data = url && url?.split(",")[1]; // Remove "data:image/png;base64,"
      const blob = base64ToBlob(base64Data, "image/png");

      // Optional: Create a File object if needed
      const file = new File([blob], "signature.png", { type: "image/png" });

      // Send using FormData
      const formData = new FormData();
      formData.append("files", file);

      try {
        const response = await baseInstance.post("/users/upload", formData); // Adjust the endpoint as needed
        const signateUrl = response?.data?.data?.fileUrls[0]; // Assume the response contains the URL

        if (response.status === 200) {
          setUrlSignature(signateUrl && signateUrl);
        } else {
          errorToastingFunction("Upload failed");
        }
      } catch (error) {
        errorToastingFunction("Error uploading Signature");
      }
    }
  };

  useEffect(() => {
    if (url) uploadSignature();
  }, [url]);

  const [dateOfOrder, setDateOfOrder] = useState<Date | undefined>(undefined);
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
    target: "firstDd" | "order" | "renewalDate"
  ) => {
    const monthIndex = months.indexOf(month);

    if (monthIndex === -1) return;

    if (target === "firstDd") {
      const newDate = dateOfFirstDd
        ? setMonth(dateOfFirstDd, monthIndex)
        : setMonth(new Date(), monthIndex);
      setDateOfFirstDd(newDate);
    } else if (target === "order") {
      const newDate = dateOfOrder
        ? setMonth(dateOfOrder, monthIndex)
        : setMonth(new Date(), monthIndex);
      setDateOfOrder(newDate);
    } else {
      const newDate = renewalDate
        ? setMonth(renewalDate, monthIndex)
        : setMonth(new Date(), monthIndex);
      setRenewalDate(newDate);
    }
  };

  // Handler for year change (for both dates)
  const handleYearChange = (
    year: string,
    target: "firstDd" | "order" | "renewalDate"
  ) => {
    const yearNumber = parseInt(year);
    if (isNaN(yearNumber)) return;

    if (target === "firstDd") {
      const newDate = dateOfFirstDd
        ? setYear(dateOfFirstDd, yearNumber)
        : setYear(new Date(), yearNumber);
      setDateOfFirstDd(newDate);
    } else if (target === "order") {
      const newDate = dateOfOrder
        ? setYear(dateOfOrder, yearNumber)
        : setYear(new Date(), yearNumber);
      setDateOfOrder(newDate);
    } else {
      const newDate = renewalDate
        ? setYear(renewalDate, yearNumber)
        : setYear(new Date(), yearNumber);
      setRenewalDate(newDate);
    }
  };

  // Handle selecting a date for dateOfOrder
  const handleSelectOrder = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDateOfOrder(selectedDate);
    }
  };

  // Handle selecting a date for dateOfFirstDd
  const handleSelectFirstDd = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDateOfFirstDd(selectedDate);
    }
  };
  const handleSelectRenewalDate = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setRenewalDate(selectedDate);
    }
  };

  // Current month and year logic for both dates
  const currentMonthOrder = dateOfOrder
    ? getMonth(dateOfOrder)
    : getMonth(new Date());

  const currentYearOrder = dateOfOrder
    ? getYear(dateOfOrder)
    : getYear(new Date());

  const currentMonthFirstDd = dateOfFirstDd
    ? getMonth(dateOfFirstDd)
    : getMonth(new Date());

  const currentYearFirstDd = dateOfFirstDd
    ? getYear(dateOfFirstDd)
    : getYear(new Date());

  const currentMonthRenewalDate = renewalDate
    ? getMonth(renewalDate)
    : getMonth(new Date());

  const currentYearRenewalDate = renewalDate
    ? getYear(renewalDate)
    : getYear(new Date());
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Page state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1); // Set to page 1 when the component mounts
  }, []);
//   interface Customer {
//     _id: string;
//     companyName: string;
//     town: string;
//     county: string;
//     postcode: string;
//     customerEmail: string;
//     streetNoName: string;
//   }
  
//   interface LoadedOptions {
//     options: { value: string; label: string }[];
//   }
//   const [customerOptions, setCustomerOptions] = useState<Customer[]>([]); 
//   // Define the loadOptions function type to match AsyncPaginate expectations
// interface Customer {
//   _id: string;
//   companyName: string;
//   town: string;
//   county: string;
//   postcode: string;
//   customerEmail: string;
//   streetNoName: string;
// }

// // Define LoadedOptions interface
// interface LoadedOptions {
//   options: { value: string; label: string }[];
// }

// // Define LoadOptionsResponse interface for return value
// interface LoadOptionsResponse {
//   options: { value: string; label: string }[];
//   hasMore: boolean;
//   additional: {
//     page: number;
//   };
// }
//   // Define the loadOptions function type to match AsyncPaginate expectations
//   interface Customer {
//     _id: string;
//     companyName: string;
//     town: string;
//     county: string;
//     postcode: string;
//     customerEmail: string;
//     streetNoName: string;
//   }
  
//   // Define LoadedOptions interface
//   interface LoadedOptions {
//     options: { value: string; label: string }[];
//   }
  
//   // Define LoadOptionsResponse interface for return value
//   interface Option {
//     value: string;
//     label: string;
//   }
//   const loadOptions = async (inputValue: string, loadedOptions: Option[], additional: { page: number }) => {
//     setLoading(true); // Set loading state to true
  
//     // Destructure `additional` with a fallback to an empty object and default page value
//     const { page = 1 } = additional || {};  // Default to page 1 if `additional` is undefined
//     setCurrentPage(page); 
  
//     try {
//       // Fetch customer data from the API with pagination parameters
//       const response = await baseInstance.get("/customers", {
//         params: {
//           page: currentPage,
//           limit: 20, // Number of items per page
//         },
//       });
  
//       // Map the API response to the format required for AsyncPaginate
//       const transformedData = response.data?.data?.customers.map((customer: Customer) => ({
//         value: customer._id,
//         label: customer.companyName, // Use company name as the label
//       }));
  
//       // Use the `options` property safely
//       const combinedOptions = currentPage === 1
//         ? transformedData
//         : [...(loadedOptions?.options || []), ...transformedData]; // Fallback to empty array if options is undefined
  
//       // Check if there are more pages available
//       const hasMore = response.data?.data?.hasMore ?? false;
  
//       // Set customer options in state (if needed)
//       setCustomerOptions(response.data?.data?.customers);
  
//       // Return the result in the expected format for AsyncPaginate
//       return {
//         options: combinedOptions,
//         hasMore: hasMore,
//         additional: {
//           page: currentPage + 1, // Increment page for the next request
//         },
//       };
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//       return {
//         options: [], // Return empty options in case of an error
//         hasMore: false, // No more data to load
//       };
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };
  

// const loadOptions: LoadOptions<any, any, { page: number }> = async (
//   inputValue,   // Search term entered by the user
//   loadedOptions,  // Previously loaded options (holds the current set of options)
//   additional  // `additional` is passed here
// ) => {
//   setLoading(true); // Set loading state to true

//   // Destructure `additional` with a fallback to an empty object and default page value
//   const { page = 1 } = additional || {};  // Default to page 1 if `additional` is undefined
//   setCurrentPage(page); 
  
//     try {
//       // Fetch customer data from the API with pagination parameters
//       const response = await baseInstance.get("/customers", {
//         params: {
//           page: currentPage,
//           limit: 20, // Number of items per page
//         },
//       });
  
//       // Map the API response to the format required for AsyncPaginate
//       const transformedData = response.data?.data?.customers.map((customer: Customer) => ({
//         value: customer._id,
//         label: customer.companyName, // Use company name as the label
//       }));
  
//       // Combine the previous options and new options (support infinite scrolling)
//       const combinedOptions =
//         currentPage === 1
//           ? transformedData
//           : [...(loadedOptions?.options || []), ...transformedData];
  
//       // Check if there are more pages available
//       const hasMore = response.data?.data?.hasMore ?? false;
  
//       // Set customer options in state (if needed)
//       setCustomerOptions(response.data?.data?.customers);
  
//       // Return the result in the expected format for AsyncPaginate
//       return {
//         options: combinedOptions,
//         hasMore: hasMore,
//         additional: {
//           page: currentPage + 1, // Increment page for the next request
//         },
//       };
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//       return {
//         options: [], // Return empty options in case of an error
//         hasMore: false, // No more data to load
//       };
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };
  
  
  
  
  // const handleCustomerChange = (newValue: { value: string } | null) => {
  //   const selectedCustomerId = newValue?.value || "";
  
  //   // Find the selected customer in the fetched options
  //   const selectedCustomer = customerOptions.find(
  //     (customer) => customer._id === selectedCustomerId
  //   );
  
  //   if (selectedCustomer) {
  //     formik.setValues({
  //       ...formik.values,
  //       town: selectedCustomer.town || "",
  //       county: selectedCustomer.county || "",
  //       postcode: selectedCustomer.postcode || "",
  //       customerEmail: selectedCustomer.customerEmail || "",
  //       streetNoName: selectedCustomer.streetNoName || "",
  //       customerName: selectedCustomer.companyName || "",
  //     });
  
  //     setSelectedCustomerId(selectedCustomerId);
  //   }
  // };
  

  return (
    <div className="p-4 relative">
      <div className="text-[1rem] font-semibold absolute top-[-30px]">
        Add Order
      </div>

      <div className="flex justify-center">
        <ScrollArea className="h-[91.7vh]   px-3 py-1 w-[100%] xl:w-[75vw]">
          <form
            onSubmit={formik.handleSubmit}
            className="border p-6 text-[0.8rem] bg-[#fff] boxShadow"
          >
            <div className="lg:flex gap-5 tt">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Date Of Order
                </label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !dateOfOrder && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfOrder ? (
                          format(dateOfOrder, "dd-MM-yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={(month) =>
                            handleMonthChange(month, "order")
                          }
                          value={months[currentMonthOrder]}
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
                            handleYearChange(year, "order")
                          }
                          value={currentYearOrder.toString()}
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
                          selected={dateOfOrder}
                          onSelect={handleSelectOrder}
                          initialFocus
                          month={dateOfOrder}
                          onMonthChange={(date) => setDateOfOrder(date)}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>

                  {formik.touched.dateOfOrder && formik.errors.dateOfOrder ? (
                    <div className="text-red-500">
                      {formik.errors.dateOfOrder}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* Customer Name */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Company Name <span style={{ opacity: "0.5" }}> * </span>
                </label>
                <div className="relative">
                  {/* {customerData?.customers?.length > 0 && ( */}
                  {/* <AsyncPaginate
                 loadOptions={loadOptions} // Function to load customer options asynchronously
                 closeMenuOnSelect={true} // Close the dropdown when an option is selected
                 isClearable={true} // Make the dropdown clearable
                 isLoading={loading} // Show a loading spinner while options are being loaded
                 additional={{ page: currentPage }} // Additional parameters (e.g., pagination)
                 onChange={handleCustomerChange} // Pass the page number to the loadOptions function
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

                      formik.setValues({
                        ...formik.values,
                        town: selectedCustomer?.town || "",
                        county: selectedCustomer?.county || "",
                        postcode: selectedCustomer?.postcode || "",
                        customerEmail: selectedCustomer?.customerEmail || "",
                        streetNoName: selectedCustomer?.streetNoName || "",
                        customerName: selectedCustomerId,
                      });
                    }}
                    placeholder="Select a Company"
                  /> */}

                  {/* )} */}
                  {customerData?.customers?.length > 0 && (
                    <SelectReactSelect
                      closeMenuOnSelect={true}
                      isClearable={true}
                      options={customerData.customers.map(
                        (customer: { _id: any; companyName: any }) => ({
                          value: customer._id,
                          label: customer.companyName,
                        })
                      )}
                      onChange={(
                        selectedOption: { value: any; label: string } | null
                      ) => {
                        const selectedCustomerId = selectedOption?.value || "";

                        formik.setFieldValue(
                          "selectedCustomerId",
                          selectedCustomerId
                        );
                        setSelectedCustomerId(selectedCustomerId);

                        const selectedCustomer = customerData.customers.find(
                          (customer: { _id: any }) =>
                            customer._id === selectedCustomerId
                        );

                        formik.setValues({
                          ...formik.values,
                          town: selectedCustomer?.town || "",
                          county: selectedCustomer?.county || "",
                          postcode: selectedCustomer?.postcode || "",
                          customerEmail: selectedCustomer?.customerEmail || "",
                          streetNoName: selectedCustomer?.streetNoName || "",
                          customerName: selectedCustomerId,
                        });
                      }}
                      placeholder="Select a Company"
                    />
                  )}

                  {touched.customerName && errors.customerName ? (
                    <div className="text-red-500">{errors?.customerName}</div>
                  ) : null}

                  {/* <AsyncPaginate
              isClearable={true}
              className="react-select-custom-styling__container"
              classNamePrefix="react-select-custom-styling"
              value={filters.bpoNo}
              loadOptions={LoadClientsBpoOptions}
              onChange={(option) => onFilterChange("bpoNo", option)}
              additional={{
                page: 1,
              }}
              placeholder={`Select Bpo no`}
              debounceTimeout={300}
              noOptionsMessage={({ inputValue }) =>
                inputValue
                  ? `No BPO no found for "${inputValue}"`
                  : "No BPO no found"
              }
              onError={(error) => {
                ReactHotToast("Error loading clients", "error");
                console.error("Async Paginate Error:", error);
              }}
              styles={{
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#007bff"
                    : state.isFocused
                    ? "#e0e0e0"
                    : "white",
                  cursor: "pointer",
                  color: state.isSelected ? "white" : "black",
                  ":hover": {
                    backgroundColor: state.isSelected ? "#0056b3" : "#f1f3f5",
                  },
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "black",
                }),
              }}
            /> */}
                </div>
              </div>
              {/*  Customer Email */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Customer Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.customerEmail}
                    placeholder="Enter Your Email"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.customerEmail &&
                  formik.errors.customerEmail ? (
                    <div className="text-red-500">
                      {formik.errors.customerEmail}
                    </div>
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
            </div>

            <div className="lg:flex gap-5">
              {/* Building Name */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-[600] text-black dark:text-white">
                  Property/ Building Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.buildingAddress}
                    id="buildingAddress"
                    name="buildingAddress"
                    placeholder="Enter name building address"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.buildingAddress &&
                  formik.errors.buildingAddress ? (
                    <div className="text-red-500">
                      {formik.errors.buildingAddress}
                    </div>
                  ) : null}
                </div>
              </div>
              {/*  Street No */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Street No and Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formik.values.streetNoName}
                    // onChange={handleInputChange}

                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="streetNoName"
                    name="streetNoName"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {/* {formik.touched.streetNoName && formik.errors.streetNoName ? (
                <div className="text-red-500">{formik.errors.streetNoName}</div>
              ) : null} */}
                </div>
              </div>
            </div>

            <div className="lg:flex gap-10">
              {/* Town */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Town
                </label>
                <div className="relative">
                  <input
                    value={formik.values.town || ""} // Bind Formik's value
                    type="text"
                    onChange={formik.handleChange} // Handle the change event
                    onBlur={formik.handleBlur} // Handle blur event for validation
                    id="town"
                    name="town"
                    className="w-full border border-stroke bg-transparent py-2 pl-3 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {/* <input
                    value={formik.values.town || ""}
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="town"
                    name="town"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  /> */}

                  {/* {formik.touched.town && formik.errors.town ? (
                <div className="text-red-500">{formik.errors.town}</div>
              ) : null} */}
                </div>
              </div>
              {/* County */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  County
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formik.values.county}
                    // onChange={handleInputChange}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="county"
                    name="county"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {/* {formik.touched.county && formik.errors.county ? (
                <div className="text-red-500">{formik.errors.county}</div>
              ) : null} */}
                </div>
              </div>
              {/*  Postcode */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Post Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formik.values.postcode}
                    // onChange={handleInputChange}

                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="postcode"
                    name="postcode"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {/* {formik.touched.postcode && formik.errors.postcode ? (
                <div className="text-red-500">{formik.errors.postcode}</div>
              ) : null} */}
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5"></div>
            {/* orderType */}
            <div className="lg:flex gap-5">
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Order Type
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("orderType", value)
                    }
                    value={formik.values.orderType}
                    name="orderType"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="New Business">
                          New Business
                        </SelectItem>
                        <SelectItem value="Renewal">Renewal</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formik.touched.orderType && formik.errors.orderType ? (
                    <div className="text-red-500">
                      {formik.errors.orderType}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* Assigned User */}
              {role !== "salesman" ? (
                <div className="mb-3 w-full">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Assigned User
                  </label>
                  <div className="relative">
                    {!userLoading && userData?.length === 0 ? (
                      <div className="flex justify-start">
                        <LoaderIconSVG />
                        <span className="px-2">Loading...</span>
                      </div>
                    ) : (
                      <SelectReactSelect
                        closeMenuOnSelect={true}
                        isClearable={true}
                        options={userData?.map(
                          (user: { _id: any; fullName: any }) => ({
                            value: user._id,
                            label: user.fullName,
                          })
                        )}
                        onChange={(
                          selectedOption: { value: any; label: string } | null
                        ) => {
                          formik.setFieldValue(
                            "selectedUserId",
                            selectedOption?.value || ""
                          );
                        }}
                        placeholder="Select a User"
                      />
                    )}
                    {formik.touched.selectedUserId &&
                    formik.errors.selectedUserId ? (
                      <div className="text-red-500">
                        {formik.errors.selectedUserId}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="mb-3 w-full">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Assigned User
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={userNameHOM || ""}
                      id="assignUser"
                      readOnly
                      placeholder="Enter User Name"
                      className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>
            {/*  Number Of Key Phrase */}
            <div className="lg:flex gap-5">
              {formik.values.orderType === "New Business" && (
                <>
                  {/* Number Of Key Phrase */}
                  <div className="mb-3 w-full">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Number Of Key Phrase
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.numberOfKeyPhrase}
                        id="numberOfKeyPhrase"
                        name="numberOfKeyPhrase"
                        placeholder="Enter name number of key phrase"
                        className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {touched.numberOfKeyPhrase && errors.numberOfKeyPhrase ? (
                        <div className="text-red-500">
                          {errors.numberOfKeyPhrase}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {/* Number Of Key Areas */}
                  <div className="mb-3 w-full">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Number Of Key Areas
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.numberOfKeyAreas}
                        id="numberOfKeyAreas"
                        name="numberOfKeyAreas"
                        placeholder="Enter name number of key areas"
                        className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {touched.numberOfKeyAreas && errors.numberOfKeyAreas ? (
                        <div className="text-red-500">
                          {errors.numberOfKeyAreas}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Order Value */}
            <div className="lg:flex gap-10">
              {/*  Order Value  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Order Value
                </label>
                <div className="relative">
                  <input
                    type="number"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.orderValue}
                    id="orderValue"
                    name="orderValue"
                    placeholder="Enter name order value"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.orderValue && formik.errors.orderValue ? (
                    <div className="text-red-500">
                      {formik.errors.orderValue}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* Deposit */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Deposit
                </label>
                <div className="relative">
                  <input
                    type="number"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.deposit}
                    id="deposit"
                    name="deposit"
                    placeholder="Enter deposit value"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.deposit && formik.errors.deposit ? (
                    <div className="text-red-500">{formik.errors.deposit}</div>
                  ) : null}
                </div>
              </div>
              {/* numberOfInstallments */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Number Of Installments
                </label>
                <div className="relative">
                  <input
                    type="number"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.numberOfInstallments}
                    id="numberOfInstallments"
                    name="numberOfInstallments"
                    placeholder="Enter number of installments"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.numberOfInstallments &&
                  formik.errors.numberOfInstallments ? (
                    <div className="text-red-500">
                      {formik.errors.numberOfInstallments}
                    </div>
                  ) : null}
                </div>
              </div>
              {/*    Deposite Method */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Deposite Method
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("depositMethod", value)
                    }
                    // onBlur={formik.handleBlur}
                    value={formik.values.depositMethod}
                    name="depositMethod"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Deposite Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="Bank Transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                        <SelectItem value="Direct Debit">
                          Direct Debit
                        </SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                        <SelectItem value="Square Card Machine">
                          Square Card Machine
                        </SelectItem>
                        <SelectItem value="SumUp">SumUp</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formik.touched.depositMethod &&
                  formik.errors.depositMethod ? (
                    <div className="text-red-500">
                      {formik.errors.depositMethod}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* customer Account Number */}
            <div className="lg:flex gap-5">
              {/* customerAccountName */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Account Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.customerAccountName}
                    id="customerAccountName"
                    name="customerAccountName"
                    placeholder="Enter Your customer account name"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.customerAccountName &&
                  formik.errors.customerAccountName ? (
                    <div className="text-red-500">
                      {formik.errors.customerAccountName}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* customerAccountNumber */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Account Number
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.customerAccountNumber}
                    id="customerAccountNumber"
                    name="customerAccountNumber"
                    placeholder="Enter Your Customer Account Number"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.customerAccountNumber &&
                  formik.errors.customerAccountNumber ? (
                    <div className="text-red-500">
                      {formik.errors.customerAccountNumber}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* customerSortCode */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Sort Code
                </label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.customerSortCode}
                    id="customerSortCode"
                    name="customerSortCode"
                    placeholder="Enter Your Customer Sort Code"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.customerSortCode &&
                  formik.errors.customerSortCode ? (
                    <div className="text-red-500">
                      {formik.errors.customerSortCode}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              {/* googleEmailRenewCampaign */}
              {/* <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Google Email Renew Campaign
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("googleEmailRenewCampaign", value)
                    }
                    // onBlur={formik.handleBlur}
                    value={formik.values.googleEmailRenewCampaign}
                    name="googleEmailRenewCampaign"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Any One" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="Needs to be set up">
                          Needs To Be Set Up
                        </SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formik.touched.googleEmailRenewCampaign &&
                  formik.errors.googleEmailRenewCampaign ? (
                    <div className="text-red-500">
                      {formik.errors.googleEmailRenewCampaign}
                    </div>
                  ) : null}
                </div>
              </div> */}

              {/* Date Of First Dd */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Date of First Direct Debit
                </label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !dateOfFirstDd && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfFirstDd ? (
                          format(dateOfFirstDd, "dd-MM-yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={(month) =>
                            handleMonthChange(month, "firstDd")
                          }
                          value={months[currentMonthFirstDd]}
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
                            handleYearChange(year, "firstDd")
                          }
                          value={currentYearFirstDd.toString()}
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
                          selected={dateOfFirstDd}
                          onSelect={handleSelectFirstDd}
                          initialFocus
                          month={dateOfFirstDd}
                          onMonthChange={(date) => setDateOfFirstDd(date)}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                {formik.touched.dateOfFirstDd && formik.errors.dateOfFirstDd ? (
                  <div className="text-red-500">
                    {formik.errors.dateOfFirstDd}
                  </div>
                ) : null}
              </div>
              {/* Renewal Date 2024 */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Renewal Date
                </label>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !renewalDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {renewalDate ? (
                          format(renewalDate, "dd-MM-yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="bottom"
                      sideOffset={5}
                      className="w-auto p-0 z-50"
                    >
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={(month) =>
                            handleMonthChange(month, "renewalDate")
                          }
                          value={months[currentMonthRenewalDate]}
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
                            handleYearChange(year, "renewalDate")
                          }
                          value={currentYearRenewalDate.toString()}
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
                          selected={renewalDate}
                          onSelect={handleSelectRenewalDate}
                          initialFocus
                          month={renewalDate}
                          onMonthChange={(date) => setRenewalDate(date)}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>

                  {formik.touched.renewalDate2024 &&
                  formik.errors.renewalDate2024 ? (
                    <div className="text-red-500">
                      {formik.errors.renewalDate2024}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5 ">
              {/* Customer Signature */}
              <div className="mb-3 w-full max-w-md ">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Signature
                </label>

                <div
                  className="relative"
                  style={{ border: "1px solid #e5e7eb", borderRadius: "10px" }}
                >
                  <SignatureCanvas
                    penColor="black"
                    canvasProps={{
                      width: 500,
                      height: 150,
                      className: "max-w-full",
                    }}
                    ref={signaturePad}
                    // onEnd={() => {
                    //   setTimeout(() => {
                    //     setUrl(signaturePad.current.toDataURL());
                    //   }, 100);
                    // }}
                    onEnd={() => {
                      if (signaturePad.current.isEmpty()) {
                        console.log("The signature pad is empty.");
                      } else {
                        setTimeout(() => {
                          const signatureDataUrl =
                            signaturePad.current.toDataURL();
                          setUrl(signatureDataUrl);
                        }, 3000);
                      }
                    }}
                    // onEnd={() => {
                    //   if (!signaturePad.current.isEmpty()) {
                    //     const signatureDataUrl =
                    //       signaturePad.current.toDataURL();
                    //     setUrl(signatureDataUrl); // Store the signature locally
                    //   }
                    // }}
                  />
                  {formik.touched.customerSignature &&
                  formik.errors.customerSignature ? (
                    <div className="text-red-500">
                      {formik.errors.customerSignature}
                    </div>
                  ) : null}
                </div>
              </div>
              {url ? (
                <img
                  src={url ? url : ""}
                  width={250}
                  className="mt-8 bg-gray-100 h-fit"
                />
              ) : (
                ""
              )}
              <button
                onClick={handleClear}
                className="bg-[#f2f2f7] px-4 py-2 rounded h-fit mt-8"
              >
                Clear
              </button>
            </div>

            {/* button  */}
            <div className="my-1 ">
              <Button
                type="submit"
                className="lg:w-[6vw] w-full cursor-pointer  border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 text-md"
              >
                {isOrder ? (
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

export default AddOrderForm;
