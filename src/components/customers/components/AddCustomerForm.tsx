"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import styles from "../../../styles/test.module.css";
import { useFormik } from "formik";
import { cn } from "@/lib/utils";
import * as Yup from "yup";
import { ScrollArea } from "@/components/ui/scroll-area";
import "../../../../src/styles/common.css";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import {
  baseInstance,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  BuildingIconSVG,
  MobileIconSVG,
  PhoneIconSVG,
  UserIconSVG,
} from "@/utils/SVGs/SVGs";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { LoaderIconSVG } from "@/utils/SVGs/SVGs";
import { useUserStore } from "@/Store/UserStore";
import { useCustomerStore } from "@/Store/CustomerStore";
// interface AddCustomerFormProps {
//   setOpen: (newValue: boolean | ((prevCount: boolean) => boolean)) => void;
//   getMyCustomerData: () => void;
// }

interface FormData {
  contactName: string;
  companyName: string;
  customerEmail: string;
  mobileNo: string;
  landlineNo: string;
  streetNoName: string;
  town: string;
  county: string;
  postcode: string;
  url: string;
  ssl: string;
  sitemap: string;
  htAccess: string;
  gaCode: string;
  newGACode: string;
  ordersRenewals: string;
  status: string;
  liveDate: string;
  logo: string | File;
  vatInvoice: string;
  createdBy: string;
  selectedUserId: string;
}

const AddCustomerForm: React.FC = () => {
  const { fetchAllCustomerData }: any = useCustomerStore();
  const [isCustomerValid, setIsCustomerValid] = useState(false);
  const router = useRouter();
  const [userLoading, setUserLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoPic, setLogoPic] = useState<File | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { fetchUsersData, userData }: any = useUserStore();
  const [userNameHOM, setUserNameHOM] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userNameHOM");
    const storedRole = localStorage.getItem("userRoleHOM");

    setUserNameHOM(storedUserName);
    setRole(storedRole);
  }, []);

 
  useEffect(() => {
    fetchUsersData();
  }, []);

  // Function to format date to "yyyy-mm-dd"
  function formatDate(date: any) {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, "0");
    let day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    fetchUsersData();
  }, []);
  const handleLogoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        formik.setFieldValue("logo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function when Authorization failed
  useEffect(() => {
    if (
      userData === "Invalid refresh token" ||
      userData === "User not found" ||
      userData === "Invalid User Access Token" ||
      userData === "Invalid access token" ||
      userData === "Unauthorized request: No access or refresh token"
    ) {
      router.push("/auth/login");
    } else {
      // setLoader(false);
      // setAllCustomers(
      //   customerData?.customers ? customerData?.customers || [] : []
      // );
    }
  }, [userData, router]);

  const formik = useFormik<FormData>({
    initialValues: {
      contactName: "",
      companyName: "",
      customerEmail: "",
      mobileNo: "",
      landlineNo: "",
      streetNoName: "",
      town: "",
      county: "",
      postcode: "",
      url: "",
      ssl: "",
      sitemap: "",
      htAccess: "",
      gaCode: "",
      newGACode: "",
      ordersRenewals: "",
      status: "",
      liveDate: "",
      logo: "",
      vatInvoice: "",
      createdBy: "",
      selectedUserId: "",
    },
    validationSchema: Yup.object({
      contactName: Yup.string().min(2, "Must be 2 characters or more"),
      companyName: Yup.string()
        .min(3, "Must be 3 characters or more")
        .required("Company Name Required"),
      customerEmail: Yup.string().matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address"
      ),
    }),

    onSubmit: async (values) => {
      try {
        setUserLoading(() => true);
        setIsCustomerValid(() => true);
        const formData = new FormData();
        const mobileNo = values.mobileNo ? `0${values.mobileNo}` : "";
        const landlineNo = values.landlineNo ? `0${values.landlineNo}` : "";
        formData.append("contactName", values.contactName);
        formData.append("createdBy", values.selectedUserId || "");
        formData.append("companyName", values.companyName);
        formData.append("customerEmail", values.customerEmail);
        formData.append("mobileNo", mobileNo);
        formData.append("landlineNo", landlineNo);
        formData.append("streetNoName", values.streetNoName);
        formData.append("town", values.town);
        formData.append("county", values.county);
        formData.append("postcode", values.postcode);
        formData.append("url", values.url);
        formData.append("ssl", values.ssl);
        formData.append("sitemap", values.sitemap);
        formData.append("htAccess", values.htAccess);
        formData.append("gaCode", values.gaCode);
        formData.append("newGACode", values.newGACode);
        formData.append("status", values.status);
        if (date) formData.append("liveDate", formatDate(date));
        if (logoPic) formData.append("logo", logoPic);

        const response = await baseInstance.post("/customers", formData);

        if (response?.status === 201) {
          successToastingFunction(response?.data?.message);
          setIsCustomerValid(() => false);
          setUserLoading(() => false);
          // getMyCustomerData();
          fetchAllCustomerData();
          router.push("/customers");
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
        setIsCustomerValid(() => false);
        setUserLoading(() => false);
      }
    },
  });
  const { handleChange, handleBlur, handleSubmit, values, touched, errors } =
    formik;



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
    
      const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
          setDate(selectedDate);
        }
      };

  
      const currentMonth = date
        ? getMonth(date)
        : getMonth(new Date());
      const currentYear = date
        ? getYear(date)
        : getYear(new Date());

  return (
    <ScrollArea className=" p-7 w-full lg:w-[70%] border my-5 h-[90vh] bg-[#fff] boxShadow">
      <form onSubmit={handleSubmit} className="text-[0.8rem] bg-[#fff]">
        <div className="mb-3 lg:flex gap-3">
          {/* User List */}
          {/* <div className="w-full mb-2 lg:mb-0">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Assigned User
            </label>
            <div className="relative">
              {!userLoading && userData.length === 0 ? (
                <div className="flex justify-start">
                  <LoaderIconSVG />
                  <span className="px-2">Loading...</span>
                </div>
              ) : (
                <SelectReactSelect
                  closeMenuOnSelect={true}
                  isClearable={true}
                  options={userData.map(
                    (user: { _id: any; fullName: any }) => ({
                      value: user._id,
                      label: user.fullName,
                    })
                  )}
                  onChange={(selectedOption: any) => {
                    formik.setFieldValue(
                      "selectedUserId",
                      selectedOption ? selectedOption.value : ""
                    );
                  }}
                  placeholder="Select a User"
                  className="text-[0.8rem] border-gray-300"
                  classNamePrefix="react-select-custom-styling text-[0.8rem] border-gray-300"
                />
              )}
            </div>
          </div> */}
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
                  className="w-full border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          )}
          {/* Contact Name  */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Contact Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="contactName"
                name="contactName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.contactName}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.contactName && errors.contactName ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.contactName}
                </div>
              ) : null}

              <span className="absolute right-4 top-2">
                <UserIconSVG cssClass={styles.commonText} />
              </span>
            </div>
          </div>
        </div>

        <div className="mb-3 lg:flex gap-3">
          {/* Company Name  */}
          <div className="w-full mb-2 lg:mb-0">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="companyName"
                name="companyName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.companyName}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.companyName && errors.companyName ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.companyName}
                </div>
              ) : null}

              <span className="absolute right-4 top-2">
                <BuildingIconSVG />
              </span>
            </div>
          </div>
          {/* Email  */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.customerEmail}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.customerEmail && errors.customerEmail ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.customerEmail}
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

        <div className="mb-3 lg:flex gap-3">
          {/* Mobile No.  */}
          <div className="w-full mb-2 lg:mb-0">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Mobile No.
            </label>
            <div className="relative">
              <input
                type="tel"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.mobileNo}
                id="mobileNo"
                name="mobileNo"
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.mobileNo && errors.mobileNo ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.mobileNo}
                </div>
              ) : null}

              <span className="absolute right-4 top-2">
                <MobileIconSVG />
              </span>
            </div>
          </div>

          {/* Landline No.  */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Landline No. (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.landlineNo}
                id="landlineNo"
                name="landlineNo"
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.landlineNo && errors.landlineNo ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.landlineNo}
                </div>
              ) : null}

              <span className="absolute right-4 top-2">
                <PhoneIconSVG />
              </span>
            </div>
          </div>
        </div>

        <div className="mb-3 lg:flex gap-3">
          {/* Street No. and Name */}
          <div className="w-full mb-2 lg:mb-0">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Street No. and Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="streetNoName"
                name="streetNoName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.streetNoName}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.streetNoName && errors.streetNoName ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.streetNoName}
                </div>
              ) : null}
            </div>
          </div>
          {/* Town */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Town
            </label>
            <div className="relative">
              <input
                type="text"
                id="town"
                name="town"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.town}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.town && errors.town ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.town}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mb-3 lg:flex gap-3">
          {/* County */}
          <div className="w-full mb-2 lg:mb-0">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              County
            </label>
            <div className="relative">
              <input
                type="text"
                id="county"
                name="county"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.county}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.county && errors.county ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.county}
                </div>
              ) : null}
            </div>
          </div>
          {/* Post Code  */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Post Code
            </label>
            <div className="relative">
              <input
                type="text"
                id="postcode"
                name="postcode"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.postcode}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.postcode && errors.postcode ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.postcode}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mb-3 lg:flex gap-3">
          {/* URL  */}
          <div className="w-full mb-2 lg:mb-0">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              URL
            </label>
            <div className="relative">
              <input
                type="text"
                id="url"
                name="url"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.url}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
          {/* SSL  */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              SSL
            </label>
            <div className="relative">
              <input
                type="text"
                id="ssl"
                name="ssl"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.ssl}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="mb-3 lg:flex gap-3">
          {/* SiteMap  */}
          <div className="w-full mb-2 lg:mb-0">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Site Map
            </label>
            <div className="relative">
              <input
                type="text"
                id="sitemap"
                name="sitemap"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sitemap}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.sitemap && errors.sitemap ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.sitemap}
                </div>
              ) : null}
            </div>
          </div>
          {/* HT Access  */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              HT Access
            </label>
            <div className="relative">
              <input
                type="text"
                id="htAccess"
                name="htAccess"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.htAccess}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.htAccess && errors.htAccess ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.htAccess}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mb-3 lg:flex gap-3">
          {/* GA Code  */}
          <div className="w-full mb-2 lg:mb-0">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              GA Code
            </label>
            <div className="relative">
              <input
                type="text"
                id="gaCode"
                name="gaCode"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.gaCode}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.gaCode && errors.gaCode ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.gaCode}
                </div>
              ) : null}
            </div>
          </div>
          {/* New GA Code  */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              New GA Code
            </label>
            <div className="relative">
              <input
                type="text"
                id="newGACode"
                name="newGACode"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.newGACode}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.newGACode && errors.newGACode ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.newGACode}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mb-3 lg:flex gap-3">
          {/* Status */}
          <div className="w-full mb-2 lg:mb-0">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Status
            </label>
            <div className="relative">
              <Select
                onValueChange={(value: any) => {
                  formik.setFieldValue("status", value);
                }}
                name="status"
              >
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select a Status" />
                </SelectTrigger>
                <SelectContent className="text-black">
                  <SelectGroup>
                    <SelectLabel>SELECT</SelectLabel>
                    <SelectItem aria-selected="true" value="IN PROCESS">
                      IN PROCESS
                    </SelectItem>
                    <SelectItem value="LIVE">LIVE</SelectItem>
                    <SelectItem value="SITE TAKEN DOWN">
                      SITE TAKEN DOWN
                    </SelectItem>
                    <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                    <SelectItem value="UPLOAD">UPLOAD</SelectItem>
                    <SelectItem value="WILL GET CANCELLED">
                      WILL GET CANCELLED
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {touched.status && errors.status ? (
                <div className="text-red-500 text-[0.8rem] pl-2">
                  {errors.status}
                </div>
              ) : null}
            </div>
          </div>
          {/* Logo */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Logo
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                // onChange={(e: any) => {
                //   setLogoPic(e.target.files[0]);
                // }}
                onChange={handleLogoChange}
                id="logo"
                name="logo"
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {logoPreview && (
                <div className="mt-2">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-[180px] w-[180px] object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Date  */}
        <div className="w-full">
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
                                  selected={date}
                                  onSelect={handleDateSelect}
                                  
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
                <Calendar
                  mode="single"
                  selected={date}
                  initialFocus
                  onSelect={handleDateSelect}
                  className=" border"
                />
              </PopoverContent>
            </Popover> */}
          </div>
        </div>

        <div className="mb-3 mt-3">
          <Button
            type="submit"
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

export default AddCustomerForm;
