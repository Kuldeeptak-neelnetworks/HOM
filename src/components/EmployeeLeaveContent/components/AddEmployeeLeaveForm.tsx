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
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  baseInstance,
  errorToastingFunction,
  formatDateYYYYMMDD,
  successToastingFunction,
} from "@/common/commonFunctions";
import { PhoneIconSVG, UserIconSVG } from "@/utils/SVGs/SVGs";
import { ScrollArea } from "@/components/ui/scroll-area";
import TimezoneSelect from "react-timezone-select";
import { useUserStore } from "@/Store/UserStore";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useEmployeeLeaveStore } from "@/Store/EmployeeLeaveStore";

interface UserData {
  fullName?: string;
  avatar?: string;
  mobileNo?: string;
  address?: string;
  role?: string;
}

const AddEmployeeLeaveForm: React.FC = () => {
  const {
    fetchEmployeeLeaveData,
    EmployeeLeaveData,
    addEmployeeLeaveData,
  }: any = useEmployeeLeaveStore();
  const router = useRouter();
  const [isUserValid, setIsUserValid] = useState(false);
  let userDataString: any =
    typeof window !== "undefined" ? localStorage?.getItem("user") : null;
  const userData2 = JSON.parse(userDataString);
  const userId = userData2?._id;

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [userDetails, setUserDetails] = useState<UserData | null>(null);

  const handleStartDate = (selectedDate: any) => {
    setStartDate(selectedDate);
  };
  const handleEndDate = (selectedDate: any) => {
    setEndDate(selectedDate);
  };
  const handleReturnDate = (selectedDate: any) => {
    setReturnDate(selectedDate);
  };

  const fetchUserData = async () => {
    try {
      const response = await baseInstance.get(`/users/${userId}`);
      if (response.status === 200) {
        setUserDetails(response.data.data as UserData);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
        router.push("/auth/login");
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const formik = useFormik({
    initialValues: {
      returnDate: "",
      leaveReason: "",
      startDate: "",
      endDate: "",
      leaveType: "",
    },
    validationSchema: Yup.object({
      leaveReason: Yup.string()
        .min(5, "Must be 5 characters or more")
        .required("leaveReason Required"),
      leaveType: Yup.string().required("Name Required"),
    }),

    onSubmit: async (values) => {
      try {
        setIsUserValid(() => true);

        const data = {
          leaveType: values.leaveType,
          leaveReason: values.leaveReason,
          startDate: formatDateYYYYMMDD(startDate),
          endDate: formatDateYYYYMMDD(endDate),
          returnDate: formatDateYYYYMMDD(returnDate),
        };

        const isSuccess = await addEmployeeLeaveData(data);
        if (isSuccess) {
          router.push("/employeeLeaveManagement"); // Navigate only if the data was successfully added
        }
      } catch (error: any) {
        console.log("Unexpected error", error);
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
    <ScrollArea className=" w-[100%] xl:w-[56vw]  p-7 my-5 border boxShadow bg-[#fff]">
      <form onSubmit={handleSubmit} className="text-[0.8rem] ">
        <div className="mb-3 lg:flex gap-3">
          {/* Rep Name  */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Rep Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="repName"
                name="repName"
                value={userDetails?.fullName || ""}
                placeholder="Rep Name"
                readOnly
                disabled
                className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />

              <span className="absolute right-4 top-2">
                <UserIconSVG cssClass={styles.commonText} />
              </span>
            </div>
          </div>

          {/* Leave Type */}
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Leave Type
            </label>
            <div className="relative">
              <Select
                onValueChange={(value: any) =>
                  formik.setFieldValue("leaveType", value)
                }
                // onBlur={formik.handleBlur}
                value={formik.values.leaveType}
                // id="userRoles"
                name="leaveType"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a leave Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select</SelectLabel>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Vacation">Vacation</SelectItem>
                    <SelectItem value="Personal Leave">
                      Personal Leave
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {touched.leaveType && errors.leaveType ? (
                <div className="text-red-500">{errors.leaveType}</div>
              ) : null}
            </div>
          </div>
        </div>
        {/* Dates on Holiday */}
        <div className="mb-3 lg:flex gap-3">
          <div className="mb-3 w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Start Date
            </label>
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[100%] justify-start text-left font-normal text-md",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "yyyy-MM-dd")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    initialFocus
                    onSelect={handleStartDate}
                    className="border"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="mb-3 w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              End Date
            </label>
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[100%] justify-start text-left font-normal text-md",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "yyyy-MM-dd")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    initialFocus
                    onSelect={handleEndDate}
                    className=" border"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="mb-3 w-full">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Date you will return to office *
          </label>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[100%] justify-start text-left font-normal text-md",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? (
                    format(returnDate, "yyyy-MM-dd")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  initialFocus
                  onSelect={handleReturnDate}
                  className=" border"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="mb-3">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Leave Reason
          </label>
          <div className="relative">
            <textarea
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.leaveReason}
              id="leaveReason"
              name="leaveReason"
              placeholder="Enter Your leave Reason"
              className="w-full border border-stroke bg-transparent py-2 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {touched.leaveReason && errors.leaveReason ? (
              <div className="text-red-500">{errors.leaveReason}</div>
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
  );
};

export default AddEmployeeLeaveForm;
