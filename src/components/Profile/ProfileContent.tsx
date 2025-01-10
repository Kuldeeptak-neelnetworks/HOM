"use client";
import React, { useEffect, useMemo, useState } from "react";
import BreadcrumbSection from "../common/BreadcrumbSection";
import { DataTable } from "../common/data-table";
import { columns as cols } from "./components/columns";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/Store/UserStore";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import * as Yup from "yup";

const crumbs = [
  {
    id: 1,
    title: "Home",
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Profile",
    link: "/Profile",
  },
];
interface UserData {
  fullName?: string;
  avatar?: string;
  mobileNo?: string;
  address?: string;
  role?: string;
}

const ProfileContent = () => {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDetails, setUserDatails] = useState<UserData | null>(null);
  const [isUserValid, setIsUserValid] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoPic, setLogoPic] = useState<File | null>(null);
  const router = useRouter();
  let userDataString: any =
    typeof window !== "undefined" ? localStorage?.getItem("user") : null;
  const userData2 = JSON.parse(userDataString);
  const userId = userData2?._id;

  const fetchUserData = async () => {
    try {
      const response = await baseInstance.get(`/users/${userId}`);
      if (response.status === 200) {
        setUserData(response.data.data as UserData);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
        router.push("/auth/login");
      }
    }
  };

  console.log("userData", userData);

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

  useEffect(() => {
    fetchUserData();
  }, []);

  // useEffect(() => {
  //   let data = localStorage.getItem("user");
  //   if (data) {
  //     localStorage?.removeItem("user");
  //     localStorage?.setItem("user", JSON.stringify(userDetails));
  //   }
  // }, [userDetails]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      avatar: "",
      mobileNo: "",
      address: "",
      role: "",
    },

    onSubmit: async (values) => {
      try {
        setIsUserValid(() => true);

        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("mobileNo", values.mobileNo);
        formData.append("address", values.address);
        if (logoPic) {
          formData.append("avatar", logoPic);
        }

        const response = await baseInstance.patch(
          "/users/update-account",
          formData,
          {}
        );

        if (response?.status === 200) {
          successToastingFunction(response?.data?.message);
          fetchUserData();
          setIsUserValid(() => false);
          router.push("/dashboard");
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
    setUserData((prevUserData) => ({
      ...prevUserData,
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
    if (userData?.avatar) {
      setLogoPreview(userData?.avatar);
    }
  }, [userData]);

  useEffect(() => {
    formik.setValues({
      ...formik.values,
      fullName: userData?.fullName || "",
      avatar: userData?.avatar || "",
      mobileNo: userData?.mobileNo || "",
      address: userData?.address || "",
    });
  }, [userData]);

  return (
    <div className="p-4 relative text-[0.8rem]">
      <div className="text-xl font-semibold absolute top-[-35px]">Profile</div>
      {/* <div className="mb-1">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}

      <div className="flex justify-center">
        <div className="sm:max-w-[775px] w-full">
          <ScrollArea className="h-[44rem]  px-3 py-3">
            <form className="mt-5" onSubmit={handleSubmit}>
              <div className="mb-3">
                {/* {logoPreview ? (
                  <div className="mt-2 flex justify-center lg:justify-start">
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="w-44 h-60 "
                    />
                  </div>
                ) : (
                  <div className="mt-2 flex justify-center lg:justify-start">
                    <img
                      className="w-52 h-60 "
                      src="https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg"
                      alt="user photo"
                    />
                  </div>
                )} */}
                {logoPreview ? (
                  <div className="mt-2 flex justify-center lg:justify-start">
                    <img
                      src={logoPreview}
                      alt="Avatar Preview"
                      className="w-44 h-60 "
                    />
                  </div>
                ) : (
                  <div className="mt-2 flex justify-center lg:justify-start">
                    <img
                      className="w-44 h-60 "
                      src="https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg"
                      alt="user photo"
                    />
                  </div>
                )}
                <label className="mb-2.5 mt-4  block font-medium text-black dark:text-white">
                  Profile Picture
                </label>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleLogoChange}
                    id="avatar"
                    name="avatar"
                    placeholder="choose your file"
                    className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Full Name
                </label>

                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={userData?.fullName || ""}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  User Role
                </label>

                <div className="relative">
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={
                      userData?.role === "admin" ? "Admin" : userData?.role
                    }
                    readOnly
                    disabled
                    className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="number"
                    onChange={handleInputChange}
                    value={userData?.mobileNo || ""}
                    id="mobileNo"
                    name="mobileNo"
                    className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    // value={userData.address}
                    value={userData?.address || ""}
                    id="address"
                    name="address"
                    className="w-full  border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-3">
                <Button
                  type="submit"
                  className="cursor-pointer  border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 w-[6rem]"
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
    </div>
  );
};

export default ProfileContent;
