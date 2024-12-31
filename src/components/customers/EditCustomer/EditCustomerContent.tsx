"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import BreadcrumbSection from "@/components/common/BreadcrumbSection";
import { LoaderIconSVG, RightArrowIconSVG } from "@/utils/SVGs/SVGs";
import {
  BuildingIconSVG,
  EmailIconSVG,
  MobileIconSVG,
  PhoneIconSVG,
  UserIconSVG,
} from "@/utils/SVGs/SVGs";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useUserStore } from "@/Store/UserStore";
import SelectReactSelect from "react-select";
import Link from "next/link";

const crumbs = [
  {
    id: 1,
    title: "Home",
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Customers",
    link: "/customers",
  },
  {
    id: 3,
    title: "Edit Customer Details",
    link: "",
  },
];

interface CustomerDetailType {
  id: number;
  contactName: string;
  companyName: string;
  customerEmail: string;
  mobileNo: string;
  landlineNo: string;
  customerNo: string;
  gaCode: string;
  htAccess: string;
  liveDate: string;
  newGACode: string;
  ordersRenewals: string;
  postcode: string;
  sitemap: string;
  ssl: string;
  status: string;
  streetNoName: string;
  town: string;
  url: string;
  county: string;
  logo: string;
  vatInvoice: string;
  _id: string;
  createdBy: string;
}

const EditCustomerContent = () => {
  const router = useRouter();
  const { customerId } = useParams();
  const [isCustomerValid, setIsCustomerValid] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const { fetchUsersData, userData }: any = useUserStore();
  const [customerDetails, setCustomerDetails] =
    React.useState<CustomerDetailType | null>(null);

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoPic, setLogoPic] = useState<string>("");

  const [userNameHOM, setUserNameHOM] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userNameHOM");
    const storedRole = localStorage.getItem("userRoleHOM");

    setUserNameHOM(storedUserName);
    setRole(storedRole);
  }, []);

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

  useEffect(() => {
    if (customerDetails?.logo) {
      setLogoPreview(customerDetails.logo);
    }
  }, [customerDetails]);

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

  const formatDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getCustomerDetails = async () => {
    try {
      const result = await baseInstance.get(`/customers/${customerId}`);
      if (result.status === 200) {
        const customerData = result?.data?.data?.customer as CustomerDetailType;
        setCustomerDetails(customerData);
        if (customerData?.liveDate) {
          const formattedLiveDate = formatDate(customerData.liveDate);
          const parsedDate = new Date(formattedLiveDate);
          if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate);
          } else {
            console.error("Invalid date format:", customerData.liveDate);
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
      }
    }
  };

  const [date, setDate] = useState<Date | undefined>();

  const handleDateSelect = (selectedDate: any) => {
    setDate(selectedDate);
  };

  // Function to format date to "yyyy-mm-dd"
  function formatedDate(date: any) {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, "0");
    let day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    getCustomerDetails();
    fetchUsersData();
  }, []);

  const formik = useFormik({
    initialValues: {
      contactName: customerDetails?.contactName || "",
      companyName: customerDetails?.companyName || "",
      customerEmail: customerDetails?.customerEmail || "",
      mobileNo: customerDetails?.mobileNo || "",
      landlineNo: customerDetails?.landlineNo || "",
      streetNoName: customerDetails?.streetNoName || "",
      town: customerDetails?.town || "",
      county: customerDetails?.county || "",
      postcode: customerDetails?.postcode || "",
      url: customerDetails?.url || "",
      ssl: customerDetails?.ssl || "",
      sitemap: customerDetails?.sitemap || "",
      htAccess: customerDetails?.htAccess || "",
      gaCode: customerDetails?.gaCode || "",
      newGACode: customerDetails?.newGACode || "",
      ordersRenewals: customerDetails?.ordersRenewals || "",
      status: customerDetails?.status || "",
      liveDate: customerDetails?.liveDate || "",
      logo: customerDetails?.logo || "",
      vatInvoice: customerDetails?.vatInvoice || "",
      createdBy: customerDetails?.createdBy || "",
      id: customerDetails?.id || "",
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
      // mobileNo: Yup.string().matches(
      //   /^[0-9]{10}$|^[0-9]{12}$/,
      //   "Must be a 10 or 12-digit number"
      // ),
      // landlineNo: Yup.string().matches(
      //   /^[0-9]{10}$|^[0-9]{12}$/,
      //   "Must be a 10 or 12-digit number"
      // ),

      // mobileNo: Yup.string().matches(
      //   /^\+?\d{1,3}?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      //   "Invalid phone number format"
      // ),
      // landlineNo: Yup.string().matches(
      //   /^\+?\d{1,3}?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      //   "Invalid phone number format"
      // ),
      // town: Yup.string(),
      // county: Yup.string(),
      // postcode: Yup.string(),
      // status: Yup.string(),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsCustomerValid(() => true);
        const formData = new FormData();
        formData.append("contactName", values.contactName);
        formData.append("companyName", values.companyName);
        formData.append("customerEmail", values.customerEmail);
        formData.append("mobileNo", values.mobileNo);
        formData.append("landlineNo", values.landlineNo);
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
        formData.append("ordersRenewals", values.ordersRenewals);
        formData.append("status", values.status);
        formData.append("createdBy", values.createdBy);

        formData.append("liveDate", formatedDate(date));
        if (logoPic) {
          formData.append("logo", logoPic);
        }

        const response = await baseInstance.patch(
          `/customers/update/${customerId}`,
          formData
        );

        if (response?.status === 200) {
          successToastingFunction(response?.data?.message);
          setIsCustomerValid(() => false);
          getCustomerDetails();
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
      }
    },
  });

  const { handleChange, handleBlur, handleSubmit, values, touched, errors } =
    formik;
  return (
    <div className="px-4 py-0 relative">
      <div className="text-[1rem] font-semibold absolute top-[-30px]">
        {customerDetails?.customerNo}
        {" - "}
        {customerDetails?.companyName}
      </div>
      {/* <div className="mb-4">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}
      <div className=" flex gap-5 justify-center rounded-md">
        <div className="my-3 text-[0.8rem] bg-[#fff] hover:bg-gray-300 h-fit w-fit px-2 py-1 rounded-md cursor-pointer hidden text-center sm:block boxShadow ">
          <Link href={`/customers/customerDetails/${customerId}`}>Back</Link>
        </div>
        <ScrollArea className="h-[90vh] rounded-md my-3 sm:my-0 sm:px-3 sm:py-3 w-[100%] xl:w-[70vw] ">
          <form
            onSubmit={handleSubmit}
            className="border p-6 text-[0.8rem] bg-[#fff]  rounded-md boxShadow"
          >
            <div className="lg:flex gap-5">
              {/* Contact Name  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white ">
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
                    placeholder="Name"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.contactName && errors.contactName ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {errors.contactName}
                    </div>
                  ) : null}

                  <span className="absolute right-4 top-2">
                    <UserIconSVG />
                  </span>
                </div>
              </div>
              {/* Company Name  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Company Name"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
            </div>
            <div className="lg:flex gap-5">
              {/* Email  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Enter Your Email"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.customerEmail && errors.customerEmail ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {errors.customerEmail}
                    </div>
                  ) : null}

                  <span className="absolute right-4 top-[0.6rem]">
                    <EmailIconSVG />
                  </span>
                </div>
              </div>
              {/* Mobile No.  */}
              <div className="mb-5 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Enter Your Mobile Number"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
            </div>
            <div className="lg:flex gap-5">
              {/* Landline No.  */}
              <div className="mb-5 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Enter Your Landline Number"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
              {/* Street No. and Name */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Street No. and Names"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.streetNoName && errors.streetNoName ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {errors.streetNoName}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="lg:flex gap-5">
              {/* Town */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Town Name"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.town && errors.town ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {errors.town}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* County */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Enter County"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.county && errors.county ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {errors.county}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* Post Code  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Enter Post Code"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.postcode && errors.postcode ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {errors.postcode}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="lg:flex gap-5">
              {/* URL  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Enter URL"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              {/* Live Date  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
                  Live Date
                </label>
                <div className="relative">
                  {/* <input
                  type="date"
                  id="liveDate"
                  name="liveDate"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formatDate(values.liveDate)}
                  placeholder="Enter Live Date"
                  className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                /> */}

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[100%] justify-start text-left font-normal text-md",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "yyyy-MM-dd") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        defaultMonth={date}
                        mode="single"
                        selected={date}
                        initialFocus
                        onSelect={handleDateSelect}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <div className="lg:flex gap-5">
              {/* SSL  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Enter SSL"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              {/* SiteMap  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Enter Site Map"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="lg:flex gap-5">
              {/* HT Access  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Enter HT Access"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              {/* GA Code  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Enter GA Code"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="lg:flex gap-5">
              {/* New GA Code  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
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
                    placeholder="Enter New GA Code"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              {/* Orders/Renewals  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
                  Orders/Renewals
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="ordersRenewals"
                    name="ordersRenewals"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.ordersRenewals}
                    placeholder="Enter Orders/Renewals"
                    className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="lg:flex gap-5">
              {/* Status */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
                  Status
                </label>
                <div className="relative">
                  <Select
                    value={values.status}
                    onValueChange={(value) =>
                      formik.setFieldValue("status", value)
                    }
                    name="status"
                  >
                    <SelectTrigger className="text-black">
                      <SelectValue placeholder="Select a Status" />
                    </SelectTrigger>
                    <SelectContent className="text-black">
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="IN PROCESS">IN PROCESS</SelectItem>
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
                  {formik.touched.status && formik.errors.status ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {formik.errors.status}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* User Name */}
              {/* <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white ">
                  Assigned Users
                </label>

                <div className="relative">
                  {!userLoading && userData?.length === 0 ? (
                    <div role="status" className="flex justify-start">
                      <LoaderIconSVG />
                      <span className="px-2">Loading...</span>
                    </div>
                  ) : (
                    <SelectReactSelect
                      name="createdBy"
                      closeMenuOnSelect={true}
                      isClearable={true}
                      options={userData.map(
                        (user: { _id: any; fullName: any }) => ({
                          value: user._id,
                          label: user.fullName,
                        })
                      )}
                      onChange={(value) => {
                        formik.setFieldValue(
                          "createdBy",
                          value ? value.value : null
                        );
                      }}
                      value={
                        formik.values.createdBy
                          ? {
                              value: formik.values.createdBy,
                              label: userData.find(
                                (user: { _id: string }) =>
                                  user._id === formik.values.createdBy
                              )?.fullName,
                            }
                          : null
                      }
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
                            "createdBy",
                            selectedOption?.value || ""
                          );
                        }}
                        placeholder="Select a User"
                      />
                    )}
                    {formik.touched.createdBy && formik.errors.createdBy ? (
                      <div className="text-red-500">
                        {formik.errors.createdBy}
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
                      className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>
            {/* Logo */}
            <div className="mb-3">
              <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
                Logo
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleLogoChange}
                  id="logo"
                  name="logo"
                  placeholder="choose your Logo"
                  className="w-full rounded-md border border-stroke bg-transparent py-2 pl-3  pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {logoPreview && (
                  <div className="mt-2">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="h-[180px] w-[180px] object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="my-6 ">
              <Button
                type="submit"
                // value="Sign In"
                className="lg:w-[6vw] w-full cursor-pointer rounded-md border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 text-md"
              >
                {isCustomerValid ? (
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

export default EditCustomerContent;
