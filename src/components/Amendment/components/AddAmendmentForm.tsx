// "use client";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import styles from "../../../styles/test.module.css";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { format } from "date-fns";
// import SelectReactSelect from "react-select";
// import {
//   baseInstance,
//   errorToastingFunction,
//   headerOptions,
//   successToastingFunction,
// } from "@/common/commonFunctions";
// import { CalendarIcon, Loader2 } from "lucide-react";
// import { LoaderIconSVG, PhoneIconSVG, UserIconSVG } from "@/utils/SVGs/SVGs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import TimezoneSelect from "react-timezone-select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { Calendar } from "@/components/ui/calendar";
// import { useUserStore } from "@/Store/UserStore";
// import { useCustomerStore } from "@/Store/CustomerStore";
// import { useAmendmentStore } from "@/Store/AmendmentStore";

// interface AddAmendmentFormProps {
//   setOpen: (newValue: boolean | ((prevCount: boolean) => boolean)) => void;
//   getAllAmendment: any;
// }

// type User = {
//   fullName: string;
//   email: string;
//   password: string;
//   userRoles: any;
//   contact_no: string | number;
//   address: string | number;
//   avatar: string | [];
// };

// interface ITimezone {
//   label: string;
//   value: string;
// }

// const AddAmendmentForm: React.FC<AddAmendmentFormProps> = ({
//   getAllAmendment,
//   setOpen,
// }: any) => {
//   const [userLoading, setUserLoading] = useState(false);
//   const [isUserValid, setIsUserValid] = useState(false);
//   const [selectedCustomerId, setSelectedCustomerId] = useState("");
//   const [date, setDate] = useState<Date | undefined>(new Date());
//   const { fetchAllCustomerData, customerData }: any = useCustomerStore();
//   const { fetchUsersData, userData }: any = useUserStore();
//   const { addAmendmentData, amendmentData, fetchAmendmentData }: any =
//     useAmendmentStore();

//   // Function to format date to "yyyy-mm-dd"
//   function formatDate(date: any) {
//     const d = new Date(date);
//     const year = d.getFullYear();
//     let month = (d.getMonth() + 1).toString().padStart(2, "0"); // Adding leading zero if needed
//     let day = d.getDate().toString().padStart(2, "0"); // Adding leading zero if needed
//     return `${year}-${month}-${day}`;
//   }

//   const handleDateSelect = (selectedDate: any) => {
//     setDate(selectedDate);
//   };

//   useEffect(() => {
//     fetchUsersData();
//     fetchAllCustomerData();
//   }, []);

//   const formik = useFormik({
//     initialValues: {
//       customer_status: "",
//       date_current: "",
//       status: "",
//       priority: "",
//       generated_by: "",
//       customerName: "",
//     },
//     // validationSchema: Yup.object({
//     //   customer_status: Yup.string().required("Customer Status Required"),
//     //   date_current: Yup.string().required("Current Date Required"),
//     //   status: Yup.string().required("Status Required"),
//     //   priority: Yup.string().required("Priority Required"),
//     //   generated_by: Yup.string().required("User Required"),
//     // }),

//     onSubmit: async (values) => {
//       try {
//         setUserLoading(() => true);
//         setIsUserValid(() => true);

//         const data = {
//           generated_by: values.generated_by,
//           customer_status: values.customer_status,
//           priority: values.priority,
//           status: values.status,
//           date_current: formatDate(date),
//         };

//         await addAmendmentData(data, selectedCustomerId);
//         fetchAmendmentData();
//         setOpen(false);
//       } catch (error: any) {
//         if (error?.response && error?.response?.data) {
//           errorToastingFunction(error?.response?.data.message);
//         } else {
//           errorToastingFunction(error?.response?.data.message);
//         }
//       } finally {
//         setIsUserValid(() => false);
//         setUserLoading(() => false);
//       }
//     },
//   });

//   const {
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     values,
//     touched,
//     errors,
//     setFieldValue,
//     setFieldTouched,
//   } = formik;

//   useEffect(() => {
//     fetchAllCustomerData();
//   }, []);

//   return (
//     <ScrollArea className="h-[23rem] px-3 py-3">
//       <form onSubmit={handleSubmit} className="text-[0.8rem]">
//         <div className="mb-3 mt-3">
//           <label className="mb-2.5 block font-medium text-black dark:text-white">
//             Select Company <span style={{ opacity: "0.5" }}> * </span>
//           </label>
//           <div className="relative">
//             {!customerData?.customers ? (
//               <div className="flex justify-start">
//                 <LoaderIconSVG />
//                 <span className="px-2">Loading...</span>
//               </div>
//             ) : (
//               <SelectReactSelect
//                 closeMenuOnSelect={true}
//                 isClearable={true}
//                 options={customerData.customers.map((customer: any) => ({
//                   value: customer._id,
//                   label: customer.companyName,
//                 }))}
//                 onChange={(selectedOption: { value: any } | null) => {
//                   setSelectedCustomerId(
//                     selectedOption ? selectedOption.value : null
//                   );
//                 }}
//                 placeholder="Select a Company"
//               />
//             )}
//             {/* )}  */}
//           </div>
//         </div>
//         {/* Generated By  */}
//         <div className="mb-3 w-full">
//           <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white ">
//             Generated By
//           </label>
//           <div className="relative">
//             {!userLoading && userData?.length === 0 ? (
//               <div className="flex justify-start">
//                 <LoaderIconSVG />
//                 <span className="px-2">Loading...</span>
//               </div>
//             ) : (
//               <SelectReactSelect
//                 name="generated_by"
//                 closeMenuOnSelect={true}
//                 isClearable={true}
//                 options={userData?.map((user: { _id: any; fullName: any }) => ({
//                   value: user?._id,
//                   label: user?.fullName,
//                 }))}
//                 onChange={(value) => {
//                   formik.setFieldValue(
//                     "generated_by",
//                     value ? value?.value : null
//                   );
//                 }}
//                 value={
//                   formik.values.generated_by
//                     ? {
//                         value: formik.values.generated_by,
//                         label: userData?.find(
//                           (user: { _id: string }) =>
//                             user._id === formik.values.generated_by
//                         )?.fullName,
//                       }
//                     : null
//                 }
//               />
//             )}
//             {formik.touched.generated_by && formik.errors.generated_by ? (
//               <div className="text-red-500">{formik.errors.generated_by}</div>
//             ) : null}
//           </div>
//         </div>
//         {/* Current Date  */}
//         <div className="mb-3">
//           <label className="mb-2.5 block font-medium text-black dark:text-white">
//             Current Date
//           </label>
//           <div className="relative">
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant={"outline"}
//                   className={cn(
//                     "w-[100%] justify-start text-left font-normal text-md",
//                     !date && "text-muted-foreground"
//                   )}
//                 >
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0">
//               <div className="calendar-container">
//                 <Calendar
//                   mode="single"
//                   selected={date}
//                   initialFocus
//                   onSelect={handleDateSelect}
//                   className="border"
//                 />
//                 </div>
//               </PopoverContent>
//             </Popover>
//           </div>
//         </div>
//         {/*  Customer Status */}
//         <div className="mb-3">
//           <label className="mb-2.5 block font-medium text-black dark:text-white">
//             Customer Status
//           </label>
//           <div className="relative">
//             <Select
//               onValueChange={(value: any) =>
//                 formik.setFieldValue("customer_status", value)
//               }
//               // onBlur={formik.handleBlur}
//               value={formik.values.customer_status}
//               // id="userRoles"
//               name="customer_status"
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Customer Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Select</SelectLabel>
//                   <SelectItem value="Live Site">Live Site</SelectItem>
//                   <SelectItem value="Demo Link">Demo Link</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//             {touched.customer_status && errors.customer_status ? (
//               <div className="text-red-500">{errors.customer_status}</div>
//             ) : null}
//           </div>
//         </div>
//         {/*   Status */}
//         <div className="mb-3">
//           <label className="mb-2.5 block font-medium text-black dark:text-white">
//             Status
//           </label>
//           <div className="relative">
//             <Select
//               onValueChange={(value: any) =>
//                 formik.setFieldValue("status", value)
//               }
//               // onBlur={formik.handleBlur}
//               value={formik.values.status}
//               name="status"
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Select</SelectLabel>
//                   <SelectItem value="In Query">In Query</SelectItem>
//                   <SelectItem value="Complete">Complete</SelectItem>
//                   <SelectItem value="In Process">In Process</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//             {touched.status && errors.status ? (
//               <div className="text-red-500">{errors.status}</div>
//             ) : null}
//           </div>
//         </div>
//         {/*   Priority */}
//         <div className="mb-3">
//           <label className="mb-2.5 block font-medium text-black dark:text-white">
//             Priority
//           </label>
//           <div className="relative">
//             <Select
//               onValueChange={(value: any) =>
//                 formik.setFieldValue("priority", value)
//               }
//               // onBlur={formik.handleBlur}
//               value={formik.values.priority}
//               name="priority"
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a Priority" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Select</SelectLabel>
//                   <SelectItem value="Critical">Critical</SelectItem>
//                   <SelectItem value="Low">Low</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//             {touched.priority && errors.priority ? (
//               <div className="text-red-500">{errors.priority}</div>
//             ) : null}
//           </div>
//         </div>

//         <div className="mb-3">
//           <Button
//             type="submit"
//             value="Sign In"
//             className="cursor-pointer border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90"
//           >
//             {isUserValid ? (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             ) : (
//               "Submit"
//             )}
//           </Button>
//         </div>
//       </form>
//     </ScrollArea>
//   );
// };

// export default AddAmendmentForm;


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
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
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
import TimezoneSelect from "react-timezone-select";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useUserStore } from "@/Store/UserStore";
import { useCustomerStore } from "@/Store/CustomerStore";
import { useAmendmentStore } from "@/Store/AmendmentStore";

interface AddAmendmentFormProps {
  setOpen: (newValue: boolean | ((prevCount: boolean) => boolean)) => void;
  getAllAmendment: any;
}

type User = {
  fullName: string;
  email: string;
  password: string;
  userRoles: any;
  contact_no: string | number;
  address: string | number;
  avatar: string | [];
};

interface ITimezone {
  label: string;
  value: string;
}

const AddAmendmentForm = ({}: any) => {
  const router = useRouter();
  const [userLoading, setUserLoading] = useState(false);
  const [isUserValid, setIsUserValid] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { fetchAllCustomerData, customerData }: any = useCustomerStore();
  const { fetchUsersData, userData }: any = useUserStore();
  const { addAmendmentData, amendmentData, fetchAmendmentData }: any =
    useAmendmentStore();

  // Function to format date to "yyyy-mm-dd"
  function formatDate(date: any) {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, "0"); // Adding leading zero if needed
    let day = d.getDate().toString().padStart(2, "0"); // Adding leading zero if needed
    return `${year}-${month}-${day}`;
  }

  const handleDateSelect = (selectedDate: any) => {
    setDate(selectedDate);
  };

  useEffect(() => {
    fetchUsersData();
    fetchAllCustomerData();
  }, []);

  const formik = useFormik({
    initialValues: {
      customer_status: "",
      date_current: "",
      status: "",
      priority: "",
      generated_by: "",
      customerName: "",
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
        setUserLoading(() => true);
        setIsUserValid(() => true);

        const data = {
          generated_by: values.generated_by,
          customer_status: values.customer_status,
          priority: values.priority,
          status: values.status,
          date_current: formatDate(date),
        };

        await addAmendmentData(data, selectedCustomerId);
        fetchAmendmentData();
        // setOpen(false);
        router.push("/amendment");
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        } else {
          errorToastingFunction(error?.response?.data.message);
        }
      } finally {
        setIsUserValid(() => false);
        setUserLoading(() => false);
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

  //  Function to handle month change
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

  const handleSelectDate = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);

    }
  };

  const currentMonthDate = date ? getMonth(date) : getMonth(new Date());
  const currentYearDate = date ? getYear(date) : getYear(new Date());

  return (
    <div className="p-4 relative">
    <div className="text-[1rem] font-semibold absolute top-[-50px]">
      Add New Amendment
    </div>

    <div className="flex justify-center">
      <ScrollArea className="h-[80vh]  px-3 py-3 w-[100%] xl:w-[56vw]">
      <form onSubmit={handleSubmit}    className="border p-6 text-[0.8rem] bg-[#fff]">
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
        {/* Generated By  */}
        <div className="mb-3 w-full">
          <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white ">
            Generated By
          </label>
          <div className="relative">
            {!userLoading && userData?.length === 0 ? (
              <div className="flex justify-start">
                <LoaderIconSVG />
                <span className="px-2">Loading...</span>
              </div>
            ) : (
              <SelectReactSelect
                name="generated_by"
                closeMenuOnSelect={true}
                isClearable={true}
                options={userData?.map((user: { _id: any; fullName: any }) => ({
                  value: user?._id,
                  label: user?.fullName,
                }))}
                onChange={(value) => {
                  formik.setFieldValue(
                    "generated_by",
                    value ? value?.value : null
                  );
                }}
                value={
                  formik.values.generated_by
                    ? {
                        value: formik.values.generated_by,
                        label: userData?.find(
                          (user: { _id: string }) =>
                            user._id === formik.values.generated_by
                        )?.fullName,
                      }
                    : null
                }
              />
            )}
            {formik.touched.generated_by && formik.errors.generated_by ? (
              <div className="text-red-500">{formik.errors.generated_by}</div>
            ) : null}
          </div>
        </div>
        {/* Current Date  */}
        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Current Date
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
                                  {date &&
                                  date.toISOString() !== "1970-01-01T00:00:00.000Z"
                                    ? format(date, "yyyy-MM-dd")
                                    : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
            
                              <PopoverContent className="w-auto p-0">
                                <div className="flex justify-between p-2">
                                  <Select
                                    onValueChange={(month) => handleMonthChange(month)}
                                    value={months[currentMonthDate]}
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
                                    value={currentYearDate.toString()}
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
                                  onSelect={handleSelectDate}
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
              <PopoverContent className="w-auto p-0">
              <div className="calendar-container">
                <Calendar
                  mode="single"
                  selected={date}
                  initialFocus
                  onSelect={handleDateSelect}
                  className="border"
                />
                </div>
              </PopoverContent>
            </Popover> */}
          </div>
        </div>
        {/*  Customer Status */}
        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Customer Status
          </label>
          <div className="relative">
            <Select
              onValueChange={(value: any) =>
                formik.setFieldValue("customer_status", value)
              }
              // onBlur={formik.handleBlur}
              value={formik.values.customer_status}
              // id="userRoles"
              name="customer_status"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Customer Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select</SelectLabel>
                  <SelectItem value="Live Site">Live Site</SelectItem>
                  <SelectItem value="Demo Link">Demo Link</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {touched.customer_status && errors.customer_status ? (
              <div className="text-red-500">{errors.customer_status}</div>
            ) : null}
          </div>
        </div>
        {/*   Status */}
        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Status
          </label>
          <div className="relative">
            <Select
              onValueChange={(value: any) =>
                formik.setFieldValue("status", value)
              }
              // onBlur={formik.handleBlur}
              value={formik.values.status}
              name="status"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select</SelectLabel>
                  <SelectItem value="In Query">In Query</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="In Process">In Process</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {touched.status && errors.status ? (
              <div className="text-red-500">{errors.status}</div>
            ) : null}
          </div>
        </div>
        {/*   Priority */}
        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Priority
          </label>
          <div className="relative">
            <Select
              onValueChange={(value: any) =>
                formik.setFieldValue("priority", value)
              }
              // onBlur={formik.handleBlur}
              value={formik.values.priority}
              name="priority"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select</SelectLabel>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {touched.priority && errors.priority ? (
              <div className="text-red-500">{errors.priority}</div>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          <Button
            type="submit"
            value="Sign In"
            className="cursor-pointer border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90"
          >
            {isUserValid ? (
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

export default AddAmendmentForm;





// "use client";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import styles from "../../../styles/test.module.css";
// import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import SelectReactSelect from "react-select";
// import {
//   baseInstance,
//   errorToastingFunction,
//   headerOptions,
//   successToastingFunction,
// } from "@/common/commonFunctions";
// import { CalendarIcon, Loader2 } from "lucide-react";
// import { LoaderIconSVG, PhoneIconSVG, UserIconSVG } from "@/utils/SVGs/SVGs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import TimezoneSelect from "react-timezone-select";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { Calendar } from "@/components/ui/calendar";
// import { useUserStore } from "@/Store/UserStore";
// import { useCustomerStore } from "@/Store/CustomerStore";
// import { useAmendmentStore } from "@/Store/AmendmentStore";

// interface AddAmendmentFormProps {
//   setOpen: (newValue: boolean | ((prevCount: boolean) => boolean)) => void;
//   getAllAmendment: any;
// }

// type User = {
//   fullName: string;
//   email: string;
//   password: string;
//   userRoles: any;
//   contact_no: string | number;
//   address: string | number;
//   avatar: string | [];
// };

// interface ITimezone {
//   label: string;
//   value: string;
// }

// // const AddAmendmentForm: React.FC<AddAmendmentFormProps> = ({
// //   // getAllAmendment,
// //   setOpen,
// // }: any) => {
//   const AddAmendmentForm = ({}: any) => {
//   const [userLoading, setUserLoading] = useState(false);
//   const [isUserValid, setIsUserValid] = useState(false);
//   const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
//   const [selectedCustomerId, setSelectedCustomerId] = useState("");
//   const [date, setDate] = useState<Date | undefined>(new Date());
//   const { fetchAllCustomerData, customerData }: any = useCustomerStore();
//   const { fetchUsersData, userData }: any = useUserStore();
//   const { addAmendmentData, amendmentData, fetchAmendmentData }: any =
//     useAmendmentStore();

//   // Function to format date to "yyyy-mm-dd"
//   function formatDate(date: any) {
//     const d = new Date(date);
//     const year = d.getFullYear();
//     let month = (d.getMonth() + 1).toString().padStart(2, "0"); // Adding leading zero if needed
//     let day = d.getDate().toString().padStart(2, "0"); // Adding leading zero if needed
//     return `${year}-${month}-${day}`;
//   }

//   useEffect(() => {
//     fetchUsersData();
//     fetchAllCustomerData();
//   }, []);

//   const formik = useFormik({
//     initialValues: {
//       customer_status: "",
//       date_current: "",
//       status: "",
//       priority: "",
//       generated_by: "",
//       customerName: "",
//     },
//     // validationSchema: Yup.object({
//     //   customer_status: Yup.string().required("Customer Status Required"),
//     //   date_current: Yup.string().required("Current Date Required"),
//     //   status: Yup.string().required("Status Required"),
//     //   priority: Yup.string().required("Priority Required"),
//     //   generated_by: Yup.string().required("User Required"),
//     // }),

//     onSubmit: async (values) => {
//       try {
//         setUserLoading(() => true);
//         setIsUserValid(() => true);

//         const data = {
//           generated_by: values.generated_by,
//           customer_status: values.customer_status,
//           priority: values.priority,
//           status: values.status,
//           date_current: formatDate(date),
//         };

//         await addAmendmentData(data, selectedCustomerId);
//         fetchAmendmentData();
//         setOpen(false);
//       } catch (error: any) {
//         if (error?.response && error?.response?.data) {
//           errorToastingFunction(error?.response?.data.message);
//         } else {
//           errorToastingFunction(error?.response?.data.message);
//         }
//       } finally {
//         setIsUserValid(() => false);
//         setUserLoading(() => false);
//       }
//     },
//   });

//   const {
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     values,
//     touched,
//     errors,
//     setFieldValue,
//     setFieldTouched,
//   } = formik;

//   useEffect(() => {
//     fetchAllCustomerData();
//   }, []);

//   const startYear = getYear(new Date()) - 100;
//   const endYear = getYear(new Date()) + 100;

//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const years = Array.from(
//     { length: endYear - startYear + 1 },
//     (_, i) => startYear + i
//   );

//   //  Function to handle month change
//   const handleMonthChange = (month: string) => {
//     if (date) {
//       const newDate = setMonth(date, months.indexOf(month));
//       setDate(newDate);
//     } else {
//       const newDate = setMonth(new Date(), months.indexOf(month));
//       setDate(newDate);
//     }
//   };

//   // Function to handle year change
//   const handleYearChange = (year: string) => {
//     if (date) {
//       const newDate = setYear(date, parseInt(year));
//       setDate(newDate);
//     } else {
//       const newDate = setYear(new Date(), parseInt(year));
//       setDate(newDate);
//     }
//   };

//   const handleSelectDate = (selectedDate: Date | undefined) => {
//     if (selectedDate) {
//       setDate(selectedDate);
//       setPopoverOpen(false);
//     }
//   };

//   const currentMonthDate = date ? getMonth(date) : getMonth(new Date());
//   const currentYearDate = date ? getYear(date) : getYear(new Date());
//   const togglePopover = () => {
//     setPopoverOpen((prev) => !prev); // Toggle the popover open/close
//   };
//   return (
//     <ScrollArea className="h-[23rem] px-3 py-3">
//       <form onSubmit={handleSubmit} className="text-[0.8rem]">
//         <div className="mb-3 mt-3">
//           <label className="mb-2.5 block font-medium text-black dark:text-white">
//             Select Company <span style={{ opacity: "0.5" }}> * </span>
//           </label>
//           <div className="relative">
//             {!customerData?.customers ? (
//               <div className="flex justify-start">
//                 <LoaderIconSVG />
//                 <span className="px-2">Loading...</span>
//               </div>
//             ) : (
//               <SelectReactSelect
//                 closeMenuOnSelect={true}
//                 isClearable={true}
//                 options={customerData.customers.map((customer: any) => ({
//                   value: customer._id,
//                   label: customer.companyName,
//                 }))}
//                 onChange={(selectedOption: { value: any } | null) => {
//                   setSelectedCustomerId(
//                     selectedOption ? selectedOption.value : null
//                   );
//                 }}
//                 placeholder="Select a Company"
//               />
//             )}
//             {/* )}  */}
//           </div>
//         </div>
//         {/* Generated By  */}
//         <div className="mb-3 w-full">
//           <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white ">
//             Generated By
//           </label>
//           <div className="relative">
//             {!userLoading && userData?.length === 0 ? (
//               <div className="flex justify-start">
//                 <LoaderIconSVG />
//                 <span className="px-2">Loading...</span>
//               </div>
//             ) : (
//               <SelectReactSelect
//                 name="generated_by"
//                 closeMenuOnSelect={true}
//                 isClearable={true}
//                 options={userData?.map((user: { _id: any; fullName: any }) => ({
//                   value: user?._id,
//                   label: user?.fullName,
//                 }))}
//                 onChange={(value) => {
//                   formik.setFieldValue(
//                     "generated_by",
//                     value ? value?.value : null
//                   );
//                 }}
//                 value={
//                   formik.values.generated_by
//                     ? {
//                         value: formik.values.generated_by,
//                         label: userData?.find(
//                           (user: { _id: string }) =>
//                             user._id === formik.values.generated_by
//                         )?.fullName,
//                       }
//                     : null
//                 }
//               />
//             )}
//             {formik.touched.generated_by && formik.errors.generated_by ? (
//               <div className="text-red-500">{formik.errors.generated_by}</div>
//             ) : null}
//           </div>
//         </div>
//         {/* Current Date  */}
//         <div className="mb-3">
//           <label className="mb-2.5 block font-medium text-black dark:text-white">
//             Current Date
//           </label>
//           <div className="relative">
//           <Popover open={popoverOpen} onOpenChange={setPopoverOpen}> 
//   {/* Removed `onOpenChange` from PopoverTrigger */}
//   <PopoverTrigger asChild>
//     <Button
//       variant={"outline"}
//       className={cn(
//         "w-[250px] justify-start text-left font-normal",
//         !date && "text-muted-foreground"
//       )}
//       onClick={togglePopover} // Still toggle when the button is clicked
//     >
//       <CalendarIcon className="mr-2 h-4 w-4" />
//       {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
//     </Button>
//   </PopoverTrigger>
  
//   <PopoverContent className="w-auto p-0">
//     <div className="flex justify-between p-2">
//       <Select
//         onValueChange={(month) => handleMonthChange(month)}
//         value={months[currentMonthDate]}
//       >
//         <SelectTrigger className="w-[110px]">
//           <SelectValue placeholder="Month" />
//         </SelectTrigger>
//         <SelectContent>
//           {months.map((month) => (
//             <SelectItem key={month} value={month}>
//               {month}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       <Select
//         onValueChange={(year) => handleYearChange(year)}
//         value={currentYearDate.toString()}
//       >
//         <SelectTrigger className="w-[110px]">
//           <SelectValue placeholder="Year" />
//         </SelectTrigger>
//         <SelectContent>
//           {years.map((year) => (
//             <SelectItem key={year} value={year.toString()}>
//               {year}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>

//     <Calendar
//       mode="single"
//       selected={date}
//       onSelect={handleSelectDate} // Select a date without closing the popover
//       initialFocus
//       month={date}
//       onMonthChange={(date) => setDate(date)} // Keep the date month consistent
//     />
//   </PopoverContent>
// </Popover>
//             {/* <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant={"outline"}
//                   className={cn(
//                     "w-[100%] justify-start text-left font-normal text-md",
//                     !date && "text-muted-foreground"
//                   )}
//                 >
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0">
//                 <Calendar
//                   mode="single"
//                   selected={date}
//                   initialFocus
//                   onSelect={handleDateSelect}
//                   className="border"
//                 />
//               </PopoverContent>
//             </Popover> */}
//           </div>
//         </div>
//         {/*  Customer Status */}
//         <div className="mb-3">
//           <label className="mb-2.5 block font-medium text-black dark:text-white">
//             Customer Status
//           </label>
//           <div className="relative">
//             <Select
//               onValueChange={(value: any) =>
//                 formik.setFieldValue("customer_status", value)
//               }
//               // onBlur={formik.handleBlur}
//               value={formik.values.customer_status}
//               // id="userRoles"
//               name="customer_status"
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Customer Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Select</SelectLabel>
//                   <SelectItem value="Live Site">Live Site</SelectItem>
//                   <SelectItem value="Demo Link">Demo Link</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//             {touched.customer_status && errors.customer_status ? (
//               <div className="text-red-500">{errors.customer_status}</div>
//             ) : null}
//           </div>
//         </div>
//         {/*   Status */}
//         <div className="mb-3">
//           <label className="mb-2.5 block font-medium text-black dark:text-white">
//             Status
//           </label>
//           <div className="relative">
//             <Select
//               onValueChange={(value: any) =>
//                 formik.setFieldValue("status", value)
//               }
//               // onBlur={formik.handleBlur}
//               value={formik.values.status}
//               name="status"
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Select</SelectLabel>
//                   <SelectItem value="In Query">In Query</SelectItem>
//                   <SelectItem value="Complete">Complete</SelectItem>
//                   <SelectItem value="In Process">In Process</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//             {touched.status && errors.status ? (
//               <div className="text-red-500">{errors.status}</div>
//             ) : null}
//           </div>
//         </div>
//         {/*   Priority */}
//         <div className="mb-3">
//           <label className="mb-2.5 block font-medium text-black dark:text-white">
//             Priority
//           </label>
//           <div className="relative">
//             <Select
//               onValueChange={(value: any) =>
//                 formik.setFieldValue("priority", value)
//               }
//               // onBlur={formik.handleBlur}
//               value={formik.values.priority}
//               name="priority"
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a Priority" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Select</SelectLabel>
//                   <SelectItem value="Critical">Critical</SelectItem>
//                   <SelectItem value="Low">Low</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//             {touched.priority && errors.priority ? (
//               <div className="text-red-500">{errors.priority}</div>
//             ) : null}
//           </div>
//         </div>

//         <div className="mb-3">
//           <Button
//             type="submit"
//             value="Sign In"
//             className="cursor-pointer border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90"
//           >
//             {isUserValid ? (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             ) : (
//               "Submit"
//             )}
//           </Button>
//         </div>
//       </form>
//     </ScrollArea>
//   );
// };

// export default AddAmendmentForm;

