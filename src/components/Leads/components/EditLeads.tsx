"use client";

import React, { useEffect, useMemo, useState } from "react";
import BreadcrumbSection from "../../common/BreadcrumbSection";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import { useCustomerStore } from "@/Store/CustomerStore";
import {
  BuildingIconSVG,
  MobileIconSVG,
  PhoneIconSVG,
  UserIconSVG,
} from "@/utils/SVGs/SVGs";
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
import * as Yup from "yup";
import { ScrollArea } from "@/components/ui/scroll-area";

const crumbs = [
  {
    id: 1,
    title: "Home",
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Leads",
    link: "/leads",
  },
  {
    id: 3,
    title: "Edit Lead",
    link: "",
  },
];
interface LeadData {
  lead_type?: string;
  existing_website?: string;
  outcome?: string;
  orderforced?: string;
  notes?: string;
  companyName?: string;
  contactPerson?: string;
  emailAddress?: string;
  currentWebsite?: string;
  orderForecast?: string;
  customerName?: string;
  landlineNumber?: string;
  mobileNumber?: string;
  customer_id?: {
    status?: string;
    companyName?: string;
    town?: string;
    county?: string;
    postcode?: string;
  };

  id?: string;
}
const EditLeads = ({}) => {
  const router = useRouter();
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [isLeadValid, setIsLeadValid] = useState(false);
  const { fetchAllCustomerData, customerData }: any = useCustomerStore();

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

  const { leadId } = useParams();
  const getCustomerDetails = async () => {
    try {
      const result = await baseInstance.get(`/leads/${leadId}`);
      if (result.status === 200) {
        setLeadData(result?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching lead data:", error);
    }
  };
  useEffect(() => {
    fetchAllCustomerData();
    getCustomerDetails();
  }, []);

  const formik = useFormik({
    initialValues: {
      companyName: leadData?.companyName || "",
      lead_type: leadData?.lead_type || "",
      currentWebsite: leadData?.currentWebsite || "",
      outcome: leadData?.outcome || "",
      orderForecast: leadData?.orderForecast || "",
      notes: leadData?.notes || "",
      contactPerson: leadData?.contactPerson || "",
      emailAddress: leadData?.emailAddress || "",
      customerName: leadData?.customerName || "",
      landlineNumber: leadData?.landlineNumber || "",
      mobileNumber: leadData?.mobileNumber || "",
      status: leadData?.customer_id?.status || "",
      town: leadData?.customer_id?.town || "",
      county: leadData?.customer_id?.county || "",
      postcode: leadData?.customer_id?.postcode || "",
      id: "",
    },
    validationSchema: () => {
      let schema = Yup.object().shape({
        lead_type: Yup.string().required("Lead type Required"),
        outcome: Yup.string().required("Outcome Required"),
        customerName: Yup.string().required("Customer Name Required"),
        contactPerson: Yup.string().required("Contact Name Required"),
        emailAddress: Yup.string()
          .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Invalid email address"
          )
          .required("Email Required"),

        status: Yup.string(),
        town: Yup.string(),
        county: Yup.string(),
        postcode: Yup.string(),
        currentWebsite: Yup.string().matches(
          /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
          "Enter correct url!"
        ),
      });

      if (formik.values.outcome === "SOLD") {
        schema = schema.shape({
          status: Yup.string(),
          town: Yup.string(),
          county: Yup.string(),
          postcode: Yup.string(),
        });
      }

      return schema;
    },
    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        setIsLeadValid(() => true);

        const data = {
          lead_type: values.lead_type,
          currentWebsite: values.currentWebsite,
          outcome: values.outcome,
          orderForecast: values.orderForecast,
          notes: values.notes,
          contactPerson: values.contactPerson,
          emailAddress: values.emailAddress,
          customerName: values.customerName,
          landlineNumber: values.landlineNumber,
          mobileNumber: values.mobileNumber,
          status: values.status,
          town: values.town,
          county: values.county,
          postcode: values.postcode,
        };

        const response = await baseInstance.patch(
          `/leads/update/${leadId}`,
          data
        );

        if (response?.status === 200) {
          successToastingFunction(response?.data?.message);
          setIsLeadValid(() => false);
          getCustomerDetails();
          router.push("/leads");
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
        setIsLeadValid(() => false);
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
    <div className="px-4 py-0 relative text-[0.8rem]">
      <div className="text-[1rem] font-semibold absolute top-[-35px]">
        {leadData?.customerName
          ? leadData?.customerName
          : leadData?.customer_id?.companyName
          ? leadData?.customer_id?.companyName
          : "loading....."}
      </div>
      {/* <div className="mb-1">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}

      <div className="flex justify-center">
        <ScrollArea className="h-[80vh]   px-3 py-3 w-[100%] xl:w-[56vw]">
          <form
            onSubmit={handleSubmit}
            className="border p-6 bg-[#fff] boxShadow"
          >
            <div className="lg:flex gap-5">
              {/* contact Person  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Contact Person <span style={{ opacity: "0.5" }}> * </span>
                </label>
                <div className="relative">
                  <input
                    required
                    value={values.contactPerson}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.contactPerson &&
                  formik.errors.contactPerson ? (
                    <div className="text-red-500">
                      {formik.errors.contactPerson}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* Lead Type  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Lead Type <span style={{ opacity: "0.5" }}> * </span>
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
                        <SelectItem value="Promate Client">
                          Promate Client
                        </SelectItem>
                        <SelectItem value="Renewal">Renewal</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formik.touched.lead_type && formik.errors.lead_type ? (
                    <div className="text-red-500">
                      {formik.errors.lead_type}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* OutCome */}
            <div className="mb-3">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Outcome <span style={{ opacity: "0.5" }}> * </span>
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
                      <SelectItem value="Not Interseted">
                        Not Interseted
                      </SelectItem>
                      <SelectItem value="Old Client">Old Client</SelectItem>
                      <SelectItem value="SOLD">Sold</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formik.touched.outcome && formik.errors.outcome ? (
                  <div className="text-red-500">{formik.errors.outcome}</div>
                ) : null}
              </div>
            </div>
            {/*  Status*/}
            {values.outcome === "SOLD" && (
              <>
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
                      // onBlur={formik.handleBlur}
                      value={values.status}
                      name="status"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a lead type" />
                      </SelectTrigger>
                      <SelectContent>
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
                  </div>
                </div>

                <div className="mb-3">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Town
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={values.town}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id="town"
                      name="town"
                      className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                {/* Country */}
                <div className="mb-3">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    County
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={values.county}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id="county"
                      name="county"
                      className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                {/*  Postcode */}
                <div className="mb-3">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Post Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={values.postcode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id="postcode"
                      name="postcode"
                      className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="lg:flex gap-5">
              {/* Current website */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Current website
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={values.currentWebsite}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id="currentWebsite"
                    name="currentWebsite"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.currentWebsite &&
                  formik.errors.currentWebsite ? (
                    <div className="text-red-500">
                      {formik.errors.currentWebsite}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* Email Address */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email Address <span style={{ opacity: "0.5" }}>*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.emailAddress}
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.emailAddress && formik.errors.emailAddress ? (
                    <div className="text-red-500">
                      {formik.errors.emailAddress}
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
              {/* Mobile No. */}
              <div className="mb-3 w-full">
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
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
                    <div className="text-red-500">
                      {formik.errors.mobileNumber}
                    </div>
                  ) : null}

                  <span className="absolute right-4 top-2">
                    <MobileIconSVG />
                  </span>
                </div>
              </div>
              {/* Landline No. */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Landline No.
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    onBlur={handleBlur}
                    value={values.landlineNumber}
                    onChange={handleChange}
                    id="landlineNumber"
                    name="landlineNumber"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.landlineNumber &&
                  formik.errors.landlineNumber ? (
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
            {/* Order Forecast */}
            <div className="mb-3">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Order Forecast
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={values.orderForecast}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="orderForecast"
                  name="orderForecast"
                  className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {formik.touched.orderForecast && formik.errors.orderForecast ? (
                  <div className="text-red-500">
                    {formik.errors.orderForecast}
                  </div>
                ) : null}
              </div>
            </div>
            {/* Notes */}
            <div className="mb-3">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Notes
              </label>
              <div className="relative">
                <textarea
                  value={values.notes}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  rows={4}
                  id="notes"
                  name="notes"
                  minLength={4}
                  className="w-full resize-none   border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {formik.touched.notes && formik.errors.notes ? (
                  <div className="text-red-500">{formik.errors.notes}</div>
                ) : null}
              </div>
            </div>
            {/* button  */}
            <div className="my-6 ">
              <Button
                type="submit"
                // value="Sign In"
                className="lg:w-[6vw] w-full cursor-pointer  border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 text-md"
              >
                {isLeadValid ? (
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

export default EditLeads;
