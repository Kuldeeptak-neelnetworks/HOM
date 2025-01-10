"use client";
import { useState } from "react";
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
  successToastingFunction,
} from "@/common/commonFunctions";
import { Loader2 } from "lucide-react";
import { PhoneIconSVG, UserIconSVG } from "@/utils/SVGs/SVGs";
import { ScrollArea } from "@/components/ui/scroll-area";
import TimezoneSelect from "react-timezone-select";
import { useUserStore } from "@/Store/UserStore";
import { useRouter } from "next/navigation";

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

const AddUserForm: React.FC = () => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [isUserValid, setIsUserValid] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoPic, setLogoPic] = useState<File | null>(null);
  const { fetchUsersData, userData, loading } = useUserStore();
  // const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>(
  //   Intl.DateTimeFormat().resolvedOptions().timeZone
  // );
  // const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>("");

  const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>({
    label: "",
    value: "",
  });

  const handleLogoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
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

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      role: "",
      mobileNo: "",
      address: "",
      jobtitle: "",
      timeZone: "",
      avatar: null,
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(2, "Must be 2 characters or more")
        .required("Name Required"),
      password: Yup.string()
        .min(8, "Must be 8 characters or more")
        .max(20, "Not More than 20 Characters")
        .required("Password Required"),
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

    onSubmit: async (values) => {
      try {
        setIsUserValid(() => true);
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("role", values.role);
        formData.append("mobileNo", `0${values.mobileNo}`);
        formData.append("jobtitle", values.jobtitle);
        formData.append("timeZone", values.timeZone);
        formData.append("address", values.address);

        // if (values.timeZone) {
        //   const abbreviation = getAbbreviation(values.timeZone);
        //   if (abbreviation) {
        //     formData.append("timeZone", abbreviation);
        //   }
        // }

        if (logoPic) {
          formData.append("avatar", logoPic);
        }

        const response = await baseInstance.post("/users", formData);

        if (response?.status === 201) {
          successToastingFunction(response?.data?.message);
          setIsUserValid(() => false);
          fetchUsersData();
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

  return (
    <ScrollArea className="w-[60%]   p-7 my-5 border boxShadow bg-[#fff]">
      <form onSubmit={handleSubmit} className="text-[0.8rem] ">
        <div className="mb-3 flex gap-3">
          {/* Name  */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
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
                className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.fullName && errors.fullName ? (
                <div className="text-red-500">{errors.fullName}</div>
              ) : null}

              <span className="absolute right-4 top-2">
                <UserIconSVG cssClass={styles.commonText} />
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
                id="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="Enter Your Email"
                className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.email && errors.email ? (
                <div className="text-red-500">{errors.email}</div>
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

        <div className="mb-3 flex gap-3">
          {/* Password  */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
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
                placeholder="6+ Characters, 1 Capital letter"
                className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.password && errors.password ? (
                <div className="text-red-500">{errors.password}</div>
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
          </div>
          {/* User Role */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              User Role
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
        </div>
        {/* TimeZone  */}
        <div className="mb-3 ">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Time Zone
          </label>
          <div className="relative">
            <TimezoneSelect
              className="w-full  border border-stroke bg-transparent  text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              value={selectedTimezone.value}
              name="timeZone"
              id="timeZone"
              onChange={(value) => {
                setSelectedTimezone({ label: value.label, value: value.value });
                formik.setFieldValue("timeZone", value.label);
                setFieldTouched("timeZone", true);
              }}
              onBlur={handleBlur}
            />
            {touched.timeZone && errors.timeZone ? (
              <div className="text-red-500">{errors.timeZone}</div>
            ) : null}
          </div>
        </div>

        <div className="mb-5 flex gap-3">
          {/* Contact */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Contact
            </label>
            <div className="relative">
              <input
                type="tel"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobileNo}
                id="mobileNo"
                name="mobileNo"
                placeholder="Enter Your Number"
                className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {formik.touched.mobileNo && formik.errors.mobileNo ? (
                <div className="text-red-500">{formik.errors.mobileNo}</div>
              ) : null}

              <span className="absolute right-4 top-2">
                <PhoneIconSVG />
              </span>
            </div>
          </div>
          {/* Job Title */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Job Title
            </label>
            <div className="relative">
              <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.jobtitle}
                id="jobtitle"
                name="jobtitle"
                placeholder="Enter Job Title"
                className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {touched.jobtitle && errors.jobtitle ? (
                <div className="text-red-500">{errors.jobtitle}</div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Address  */}
        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Address
          </label>
          <div className="relative">
            <textarea
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.address}
              id="address"
              name="address"
              placeholder="Enter Your Address"
              className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {touched.address && errors.address ? (
              <div className="text-red-500">{errors.address}</div>
            ) : null}
          </div>
        </div>
        {/* Avatar  */}
        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Profile Picture
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              // value={formik.values.profilePic}
              // onChange={(e: any) => {
              //   setProfilePicture(e.target.files[0]);
              // }}
              onChange={handleLogoChange}
              id="avatar"
              name="avatar"
              placeholder="choose your file"
              className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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

        <div className="mb-3">
          <Button
            type="submit"
            value="Sign In"
            className="cursor-pointer  border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90"
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
  );
};

export default AddUserForm;
