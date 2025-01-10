"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import BreadcrumbSection from "@/components/common/BreadcrumbSection";
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
import TimezoneSelect, { type ITimezone } from "react-timezone-select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  baseInstance,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { AxiosError } from "axios";

const crumbs = [
  {
    id: 1,
    title: "Home",
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Users",
    link: "/users",
  },
  {
    id: 3,
    title: "Edit User Details",
    link: "",
  },
];

interface UserDetailType {
  id: number;
  fullName: string;
  email: string;
  role: string;
  mobileNo: string;
  address: string;
  jobtitle: string;
  timeZone: string;
  avatar: string;
  // password: string;
}

const EditUserContent = () => {
  const router = useRouter();
  const { userId } = useParams();

  const [isUserValid, setIsUserValid] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetailType | null>(null);
  const [userPreview, setUserPreview] = useState<string>("");
  const [userPic, setUserPic] = useState<string>("");
  const [selectedTimezone, setSelectedTimezone] = useState<ITimezone | any>({
    label: "",
    value: "",
  });

  useEffect(() => {
    if (userDetails?.avatar) {
      setUserPreview(userDetails?.avatar);
    }
  }, [userDetails]);

  const handleAvtarChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserPic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPreview(reader.result as string);
        formik.setFieldValue("avatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAbbreviation = (timezone: string): string | null => {
    if (timezone.includes("GMT")) {
      return "gmt";
    } else if (timezone.includes("IST")) {
      return "ist";
    } else if (timezone.includes("CET")) {
      return "cet";
    } else if (timezone.includes("EST")) {
      return "est";
    } else if (timezone.includes("CST")) {
      return "cst";
    } else if (timezone.includes("MST")) {
      return "mst";
    } else if (timezone.includes("PST")) {
      return "pst";
    } else {
      return null;
    }
  };

  const getUserDetails = async () => {
    try {
      const result = await baseInstance.get(`/users/${userId}`);
      if (result.status === 200) {
        const userData = result?.data?.data as UserDetailType;
        setUserDetails(userData);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    if (userDetails?.timeZone) {
      setSelectedTimezone({
        label: userDetails.timeZone,
        value: userDetails.timeZone, // Adjust as per your TimezoneSelect component requirements
      });
    }
  }, [userDetails]);

  useEffect(() => {
    getUserDetails();
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: userDetails?.fullName || "",
      email: userDetails?.email || "",
      role: userDetails?.role || "",
      mobileNo: userDetails?.mobileNo || "",
      address: userDetails?.address || "",
      jobtitle: userDetails?.jobtitle || "",
      timeZone: userDetails?.timeZone || "",
      avatar: userDetails?.avatar || "",
      // password: userDetails?.password ? "********" : "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(2, "Must be 2 characters or more")
        .required("Name Required"),
      // password: Yup.string()
      //   .min(8, "Must be 8 characters or more")
      //   .max(20, "Not More than 20 Characters")
      //   .required("Password Required"),
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email address"
        )
        .required("Email Required"),
      role: Yup.string().required("User Role Required"),
      // timeZone: Yup.string().required("Time Zone Required"),
      // mobileNo: Yup.string()
      //   .required("Contact No. Required")
      //   .matches(/^[0-9]{10}$/, "Must be a 10-digit number"),
      jobtitle: Yup.string().required("Job title Required"),
      // address: Yup.string().required("Address Required"),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsUserValid(() => true);
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("email", values.email);
        formData.append("role", values.role);
        formData.append("mobileNo", values.mobileNo);
        formData.append("address", values.address);
        formData.append("jobtitle", values.jobtitle);
        formData.append("timeZone", values.timeZone);
        // formData.append("password", values.password);

        // if (values.timeZone) {
        //   const abbreviation = getAbbreviation(values.timeZone);
        //   if (abbreviation) {
        //     formData.append("timeZone", abbreviation);
        //   }
        // }
        if (userPic) {
          formData.append("avatar", userPic);
        }

        const response = await baseInstance.patch(
          `/users/update/${userId}`,
          formData
        );

        if (response?.status === 200) {
          successToastingFunction(response?.data?.message);
          setIsUserValid(() => false);
          getUserDetails();
          router.push("/users");
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
        setIsUserValid(() => false);
      }
    },
  });
  // const handleTimezoneChange = (value: ITimezone | null) => {
  //   setSelectedTimezone(value || { label: "", value: "" });
  //   formik.setFieldValue("timeZone", value ? value.value : null);
  // };

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    touched,
    errors,
    setFieldTouched,
  } = formik;
  return (
    <div className="px-4 py-0 relative">
      <div className="text-xl font-semibold absolute top-[-40px]">
        {userDetails?.fullName ? userDetails?.fullName : "loading..."}
      </div>
      {/* <div className="mb-4">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}
      <div className=" flex gap-5 justify-center ">
        <ScrollArea className="h-[80vh]   sm:px-3 sm:py-3 w-[100%] xl:w-[56vw]">
          <form
            onSubmit={handleSubmit}
            className="border p-6 text-[0.8rem] bg-[#fff] boxShadow"
          >
            <div className="lg:flex gap-5">
              {/* full Name  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white ">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.fullName}
                    placeholder="Name"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.fullName && errors.fullName ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {errors.fullName}
                    </div>
                  ) : null}

                  <span className="absolute right-4 top-2">
                    <UserIconSVG />
                  </span>
                </div>
              </div>
              {/* Email  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    placeholder="Enter Your Email"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.email && errors.email ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {errors.email}
                    </div>
                  ) : null}

                  <span className="absolute right-4 top-[0.6rem]">
                    <EmailIconSVG />
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              {/* Password  */}
              {/* <div className="mb-5 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    id="password"
                    name="password"
                    placeholder="Enter Your Password"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3  pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.password && errors.password ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {errors.password}
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
                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                          fill=""
                        />
                        <path
                          d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div> */}
              {/* Role  */}
              <div className="mb-5 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
                  Role
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("role", value)
                    }
                    // onBlur={formik.handleBlur}
                    value={formik.values.role}
                    // id="userRoles"
                    name="role"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="salesman">Sales Person</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {touched.role && errors.role ? (
                    <div className="text-red-500">{errors.role}</div>
                  ) : null}
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
                    className="w-full  border border-stroke bg-transparent py-2 pl-3  pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {/* {touched.mobileNo && errors.mobileNo ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {errors.mobileNo}
                    </div>
                  ) : null} */}

                  <span className="absolute right-4 top-2">
                    <MobileIconSVG />
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              {/* TimeZone  */}
              <div className="mb-5 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
                  Time Zone
                </label>
                <div className="relative">
                  <TimezoneSelect
                    className="w-full  border border-stroke bg-transparent  text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={selectedTimezone}
                    name="timeZone"
                    id="timeZone"
                    onChange={(value) => {
                      setSelectedTimezone({
                        label: value.label,
                        value: value.value,
                      });
                      formik.setFieldValue("timeZone", value.label);
                      setFieldTouched("timeZone", true);
                    }}
                    onBlur={handleBlur}
                  />
                  {touched.timeZone && errors.timeZone ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {errors.timeZone}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* jobtitle */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
                  Job Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="jobtitle"
                    name="jobtitle"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.jobtitle}
                    placeholder="Job Title"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.jobtitle && errors.jobtitle ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {errors.jobtitle}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              {/* Address */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
                  Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address}
                    placeholder="Enter Address"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3  pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {touched.address && errors.address ? (
                    <div className="text-red-500 text-[0.8rem] pl-2">
                      {errors.address}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Avatar */}
            <div className="mb-3">
              <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white">
                Avatar
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleAvtarChange}
                  id="avatar"
                  name="avatar"
                  placeholder="choose your Avatar"
                  className="w-full  border border-stroke bg-transparent py-2 pl-3  pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {userPreview && (
                  <div className="mt-2">
                    <img
                      src={userPreview}
                      alt="Avatar Preview"
                      className="h-[80px] w-[80px] object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="my-6 ">
              <Button
                type="submit"
                className="lg:w-[6vw] w-full cursor-pointer  border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 text-md"
              >
                {isUserValid ? (
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

export default EditUserContent;
