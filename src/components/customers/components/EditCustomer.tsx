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
import {
  baseInstance,
  errorToastingFunction,
  headerOptions,
  successToastingFunction,
} from "@/common/commonFunctions";
import * as Yup from "yup";

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
    title: "Edit Customer",
    link: "",
  },
];
interface CustomerData {
  companyName?: string;
  contactName?: string;
  phoneNo?: string;
  mobileNo?: string;
  address?: string;
  email?: string;
}
const EditCustomer = ({}) => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [isUserValid, setIsUserValid] = useState(false);
  const { customerId } = useParams();

  const getCustomerDetails = async () => {
    try {
      const result = await baseInstance.get(`/customers/${customerId}`);
      if (result.status === 200) {
        setCustomerData(result?.data?.data?.customer);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    getCustomerDetails();
  }, []);

  const formik = useFormik({
    initialValues: {
      companyName: "",
      contactName: "",
      mobileNo: "",
      phoneNo: "",
      email: "",
      address: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email address"
        )
        .required("Email Required"),
      mobileNo: Yup.string()
        .required("Mobile No. Required")
        .matches(/^[0-9]{10}$/, "Must be a 10-digit number"),
      phoneNo: Yup.string()
        .required("Landline No. Required")
        .matches(/^[0-9]{10}$/, "Must be a 10-digit number"),
    }),

    onSubmit: async (values) => {
      try {
        setIsUserValid(() => true);

        const data = {
          companyName: values.companyName,
          contactName: values.contactName,
          email: values.email,
          phoneNo: values.phoneNo,
          mobileNo: values.mobileNo,
          address: values.address,
        };
        const response = await baseInstance.patch(
          `/customers/update/${customerId}`,
          data
        );

        if (response?.status === 200) {
          successToastingFunction(response?.data?.message);
          getCustomerDetails();
          setIsUserValid(() => false);
        } else {
          throw new Error("Something went wrong, Please try again later!");
        }
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
        } else {
          errorToastingFunction(error?.response?.data.message);
        }
      } finally {
        setIsUserValid(() => false);
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    touched,
    errors,
    setFieldValue,
  } = formik;

  useEffect(() => {
    formik.setValues({
      ...formik.values,
      companyName: customerData?.companyName || "",
      contactName: customerData?.contactName || "",
      mobileNo: customerData?.mobileNo || "",
      phoneNo: customerData?.phoneNo || "",
      address: customerData?.address || "",
      email: customerData?.email || "",
    });
  }, [customerData]);

  return (
    <div className="p-4 ">
      <div className="text-2xl font-semibold absolute top-[-65px]">Profile</div>
      {/* <div className="mb-1">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}

      <div className="flex justify-center">
        <form
          className=" mt-5 "
          style={{ width: "37%" }}
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Name
            </label>

            <div className="relative">
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={customerData?.contactName || ""}
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Company Name
            </label>

            <div className="relative">
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={customerData?.companyName || ""}
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Email
            </label>
            <div className="relative">
              <input
                type="text"
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                value={customerData?.email || ""}
                id="email"
                name="email"
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="mb-3">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Mobile Number
            </label>
            <div className="relative">
              <input
                type="number"
                onChange={handleInputChange}
                value={customerData?.mobileNo || ""}
                id="mobileNo"
                name="mobileNo"
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            {formik.touched.mobileNo && formik.errors.mobileNo ? (
              <div className="text-red-500">{formik.errors.mobileNo}</div>
            ) : null}
          </div>
          <div className="mb-3">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="number"
                onChange={handleInputChange}
                value={customerData?.phoneNo || ""}
                id="phoneNo"
                name="phoneNo"
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            {formik.touched.phoneNo && formik.errors.phoneNo ? (
              <div className="text-red-500">{formik.errors.phoneNo}</div>
            ) : null}
          </div>

          <div className="mb-3">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Address
            </label>
            {/* <div className="relative">
              <textarea
                type="text"
                onChange={handleInputChange}
                onBlur={formik.handleBlur}
                value={customerData?.address || ""}
                id="address"
                name="address"
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div> */}
          </div>

          <div className="mb-3">
            <Button className="w-full cursor-pointer border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90">
              {isUserValid ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;
