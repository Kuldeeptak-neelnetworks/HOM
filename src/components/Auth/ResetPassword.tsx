"use client";
import {
  baseInstance,
  errorToastingFunction,
  getUserToken,
  successToastingFunction,
} from "@/common/commonFunctions";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import Logo from "../../asset/images/logo.png";
import { Button } from "@/components/ui/button";
import { EyeIcon, Loader2 } from "lucide-react";
import Forgetpass from "../../asset/images/forgetpass.png";
import Employees from "../../asset/images/employees.png";
import "../../styles/common.css";
import { EyeClosedIcon } from "@radix-ui/react-icons";

// Defined Type of state
type User = {
  password: string;
  confirmPassword: string;
};

const ForgetPasswordPic = Forgetpass.src;

const LogoPic = Logo.src;

interface ResetPasswordProps {
  resetToken: string | string[];
}

const EmployeesPic = Employees.src;

const ResetPassword: React.FC<ResetPasswordProps> = ({ resetToken }) => {
  // Default States
  const [user, setUser] = useState<User>({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const router = useRouter();
  const [isUserValid, setIsUserValid] = useState(false);

  //OncChnage handler function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prev) => {
      const newState = { ...prev, [id]: value };
      return newState;
    });
  };

  // Login Api Calling function
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      const result = await baseInstance.patch(
        `users/reset-password/?token=${resetToken}`,
        user
      );
      setUser({ password: "", confirmPassword: "" });
      if (result.status === 200) {
        successToastingFunction(result.data.message);
        router.push("/auth/login");
      } else {
        throw new Error("Something went wrong, Please try again later!");
      }
    } catch (error: any) {
      if (
        error?.response &&
        error?.response?.data &&
        error?.response?.data?.message
      ) {
        errorToastingFunction(error?.response?.data?.message);
      } else {
        errorToastingFunction(error?.response?.data.error);
      }
    } finally {
      setIsUserValid(() => false);
    }
  };

  // Validation before api Calling
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user.password) {
      setIsUserValid(() => true);
      handleResetPassword(e);
    } else {
      handleResetPassword(e);
    }
  };

  //   const token = getUserToken();

  //   useEffect(() => {
  //     if (token) {
  //       redirect("/dashboard"); // Redirect to home if not authenticated
  //     }
  //   }, [token]);

  return (
    <section className="w-[100%] h-[100vh] ">
      <div className="flex create-account justify-center h-[100%] backgroundSignIn items-center">
        <div className="hidden lg:block h-[47rem]">
          <img
            src={EmployeesPic}
            alt="EmployeesPic"
            className="h-[100%]"
            style={{
              width: "100%",
              borderRadius: "26px 0px 0px 26px",
              boxShadow: "0 5px 25px 0 rgba(50,50,93,.25)",
            }}
          />
        </div>
        <div
          className="h-[47rem] bg-white backgroundLogin flex justify-center items-center flex-col px-[2.50rem] lg:px-[3.50rem] lg:ml-[-23px]"
          style={{
            borderRadius: "26px 26px 26px 26px",
            boxShadow: "0 5px 25px 0 rgba(50,50,93,.25)",
          }}
        >
          <div className="text-[24px] lh-[29.43px] font-[700] text-center my-5 tracking-[0.3rem]">
            Reset Password
          </div>
          <form
            className="flex flex-col gap-5 relative mb-3 mt-[85px]"
            onSubmit={handleSubmit}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              id="password"
              name="password"
              onChange={(e) => handleChange(e)}
              className=" border-b border-b-gray-300 outline-none py-4 w-[502.4px] bg-transparent px-3"
            />
            <span className="absolute right-4 top-2 hover:bg-gray-100  ">
              {showPassword ? (
                <div onClick={togglePassword} className="cursor-pointer p-1">
                  <EyeIcon className="bottom-10 right-0 text-gray-400 h-5" />
                </div>
              ) : (
                <div onClick={togglePassword} className="cursor-pointer p-2">
                  <EyeClosedIcon className="bottom-10 right-1 text-gray-400" />
                </div>
              )}
            </span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              onChange={(e) => handleChange(e)}
              className=" border-b border-b-gray-300 outline-none py-4 w-[502.4px] bg-transparent px-3"
            />
            <span className="absolute right-4 top-24 hover:bg-gray-100  ">
              {showPassword ? (
                <div onClick={togglePassword} className="cursor-pointer p-1">
                  <EyeIcon className=" bottom-10 right-0 text-gray-400 h-5" />
                </div>
              ) : (
                <div onClick={togglePassword} className="cursor-pointer p-2">
                  <EyeClosedIcon className="bottom-10 right-1 text-gray-400" />
                </div>
              )}
            </span>

            <div className="mt-20 ">
              <Button
                type="submit"
                className="bg-[#569C45] rounded-[8px] w-[502px] h-[48px] p-[10px] text-white font-[700] tracking-[0.1rem]"
              >
                {isUserValid ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <span className="text-[1rem]">Submit</span>
                )}
              </Button>
            </div>
          </form>
          <div className="my-4 items-start ">
            <Link href="/auth/login" className="">
              <span className="text-gray-400 mx-3">Go back to login page</span>
            </Link>
            {/* <span className="text-gray-400 mx-3">Back To Login?</span>
            <Link href="/auth/login" className="text-primary px-3 ">
              <span className="text-[#569C45] hover:text-[#3d6931]">
                Click Here
              </span>
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
