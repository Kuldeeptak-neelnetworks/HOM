"use client";
import React, { useEffect, useMemo, useState } from "react";
import BreadcrumbSection from "../../common/BreadcrumbSection";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/Store/UserStore";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { AxiosError } from "axios";
import { useCustomerStore } from "@/Store/CustomerStore";
import SelectReactSelect from "react-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  BuildingIconSVG,
  LoaderIconSVG,
  MobileIconSVG,
  PhoneIconSVG,
  UserIconSVG,
} from "@/utils/SVGs/SVGs";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
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
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
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
    title: "Orders",
    link: "/orders",
  },
  {
    id: 3,
    title: "Edit Orders",
    link: "",
  },
];
interface OrderData {
  dateOfOrder?: string;
  customer?: {
    customerEmail?: string;
    companyName?: string;
    createdBy: string;
  };
  createdBy?: {
    _id: string;
  };
  buildingAddress?: string;
  orderType?: string;
  orderValue?: number;
  deposit?: number;
  depositMethod?: string;
  numberOfInstallments?: number;
  dateOfFirstDd?: string;
  customerAccountName?: string;
  customerAccountNumber?: string;
  customerSortCode?: string;
  googleEmailRenewCampaign?: string;
  renewalDate2024?: string;
  numberOfKeyPhrase?: string;
  numberOfKeyAreas?: string;
  customerName?: string;
  town?: string;
  county?: string;
  postcode?: string;
  id?: string;
  streetNoName?: string;
  renewalNotes?: string;
  DdMonthly?: number;
  DdChange?: string;
  cashFlow?: string;
  renewalStatus?: string;
  expected2024OrderValue?: string;
  _id: string;
  calculatedDDMonthly: any;
}
const EditOrder = ({}) => {
  const { userData, fetchUsersData, loading }: any = useUserStore();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLeadValid, setIsLeadValid] = useState(false);
  const { fetchAllCustomerData, customerData }: any = useCustomerStore();
  const [userLoading, setUserLoading] = useState(false);
  const [renewalDate, setRenewalDate] = useState<Date | undefined>(undefined);
  const [dateOfFirstDd, setDateOfFirstDd] = useState<Date | undefined>(
    undefined
  );
  // const [dateOfOrder, setDateOfOrder] = useState<Date | undefined>(undefined);
  const { orderId } = useParams();
  const [ddMonthly, setDDmonthly] = useState(0);
  const [percentIncrease, setPercentIncrease] = useState(0);
  const [expectedOrderValue, setExpectedOrderValue] = useState(0);
  const [cashFlow, setCashFlow] = useState(0);

  const [userNameHOM, setUserNameHOM] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userNameHOM");
    const storedRole = localStorage.getItem("userRoleHOM");

    setUserNameHOM(storedUserName);
    setRole(storedRole);
  }, []);

  const handleRenewalDateSelect = (selectedDate: any) => {
    setRenewalDate(selectedDate);
  };
  // const handleDateOfOrderDateSelect = (selectedDate: any) => {
  //   setDateOfOrder(selectedDate);
  // };
  const handleOfFirstDateSelect = (selectedDate: any) => {
    setDateOfFirstDd(selectedDate);
  };
  const formatDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getOrderDetails = async () => {
    try {
      const result = await baseInstance.get(`/orders/${orderId}`);
      if (result.status === 200) {
        const orderData = result?.data?.data;
        setOrderData(orderData);

        const dateFields = ["dateOfOrder", "renewalDate2024", "dateOfFirstDd"];
        dateFields.forEach((field) => {
          const formattedDate = formatDate(orderData[field]);
          const parsedDate = new Date(formattedDate);
          if (!isNaN(parsedDate.getTime())) {
            switch (field) {
              case "dateOfOrder":
                setDateOfOrder(parsedDate);
                break;
              case "renewalDate2024":
                setRenewalDate(parsedDate);
                break;
              case "dateOfFirstDd":
                setDateOfFirstDd(parsedDate);
                break;
              default:
                break;
            }
          } else {
            console.error(
              `Invalid date format for ${field}:`,
              orderData[field]
            );
          }
        });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      dateOfOrder: orderData?.dateOfOrder || "",
      customerEmail: orderData?.customer?.customerEmail || "",
      buildingAddress: orderData?.buildingAddress || "",
      orderType: orderData?.orderType || "",
      orderValue: orderData?.orderValue || "",
      deposit: orderData?.deposit || "",
      depositMethod: orderData?.depositMethod || "",
      numberOfInstallments: orderData?.numberOfInstallments || "",
      dateOfFirstDd: orderData?.dateOfFirstDd || "",
      customerAccountName: orderData?.customerAccountName || "",
      customerAccountNumber: orderData?.customerAccountNumber || "",
      customerSortCode: orderData?.customerSortCode || "",
      googleEmailRenewCampaign: orderData?.googleEmailRenewCampaign || "",
      renewalDate2024: orderData?.renewalDate2024 || "",
      numberOfKeyPhrase: orderData?.numberOfKeyPhrase || "",
      numberOfKeyAreas: orderData?.numberOfKeyAreas || "",
      renewalNotes: orderData?.renewalNotes || "",
      createdBy: orderData?.createdBy?._id || "",
      renewalStatus: orderData?.renewalStatus || "",
      DdMonthly: orderData?.DdMonthly || "",
      cashFlow: orderData?.cashFlow || "",
      expected2024OrderValue: orderData?.expected2024OrderValue || "",
    },

    // validationSchema: () => {
    //   let schema = Yup.object().shape({
    //     customerName: Yup.string(),
    //     createdBy: Yup.string().required("User Required"),
    //     numberOfKeyPhrase: Yup.string(),
    //     numberOfKeyAreas: Yup.string(),
    //     customerEmail: Yup.string().matches(
    //       /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    //       "Invalid email address"
    //     ),
    //   });

    //   if (values.orderType === "New Business") {
    //     schema = schema.shape({
    //       numberOfKeyPhrase: Yup.string().required(
    //         "Number Of Key Phrase Required"
    //       ),
    //       numberOfKeyAreas: Yup.string().required(
    //         "Number Of Key Areas Required"
    //       ),
    //     });
    //   }

    //   return schema;
    // },
    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        setIsLeadValid(() => true);
        const data = {
          createdBy: values.createdBy,
          dateOfOrder: formatDate(dateOfOrder),
          dateOfFirstDd: formatDate(dateOfFirstDd),
          renewalDate2024: formatDate(renewalDate),
          customerEmail: values.customerEmail,
          buildingAddress: values.buildingAddress,
          orderType: values.orderType,
          orderValue: values.orderValue,
          deposit: values.deposit,
          depositMethod: values.depositMethod,
          numberOfInstallments: values.numberOfInstallments,
          customerAccountName: values.customerAccountName,
          customerAccountNumber: values.customerAccountNumber,
          customerSortCode: values.customerSortCode,
          googleEmailRenewCampaign: values.googleEmailRenewCampaign,
          numberOfKeyPhrase: values.numberOfKeyPhrase,
          numberOfKeyAreas: values.numberOfKeyAreas,
          renewalStatus: values.renewalStatus,
          renewalNotes: values.renewalNotes,
          DdMonthly: isNaN(ddMonthly) ? 0 : ddMonthly,
          increase: isNaN(ddMonthly) ? 0 : percentIncrease,
          expected2024OrderValue: isNaN(ddMonthly) ? 0 : expectedOrderValue,
          cashFlow: isNaN(ddMonthly) ? 0 : cashFlow,
        };
        const response = await baseInstance.patch(
          `/orders/update/${orderId}`,
          data
        );

        if (response?.status === 200) {
          successToastingFunction(response?.data?.message);

          setIsLeadValid(() => false);
          getOrderDetails();
          router.push("/orders");
        } else {
          throw new Error("Something went wrong, Please try again later!");
        }
      } catch (error: any) {
        if (error?.response && error?.response?.data) {
          errorToastingFunction(error?.response?.data.message);
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

  useEffect(() => {
    fetchAllCustomerData();
    getOrderDetails();
    fetchUsersData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const calculatedDDMonthly =
      (+orderData?.orderValue! - +orderData?.deposit!) /
      +orderData?.numberOfInstallments!;
    setDDmonthly(+calculatedDDMonthly?.toFixed(2));

    const calculatedPercentIncrease = +orderData?.orderValue! * 0.05;
    setPercentIncrease(+calculatedPercentIncrease?.toFixed(2));

    const calculatedExpectedOrderValue =
      +orderData?.orderValue! + +calculatedPercentIncrease;
    setExpectedOrderValue(+calculatedExpectedOrderValue?.toFixed(2));

    const calculatedCashFlow =
      (+orderData?.deposit! * 100) / +orderData?.orderValue!;
    setCashFlow(+calculatedCashFlow?.toFixed(2));
  }, [orderData]);

  const [dateOfOrder, setDateOfOrder] = useState<Date | undefined>(undefined);
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

  // Generate the years array using the fixed startYear and endYear
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );
  const handleMonthChange = (
    month: string,
    target: "firstDd" | "order" | "renewalDate"
  ) => {
    const monthIndex = months.indexOf(month);

    if (monthIndex === -1) return; 

    if (target === "firstDd") {
      const newDate = dateOfFirstDd
        ? setMonth(dateOfFirstDd, monthIndex)
        : setMonth(new Date(), monthIndex);
      setDateOfFirstDd(newDate);
    } else if (target === "order") {
      const newDate = dateOfOrder
        ? setMonth(dateOfOrder, monthIndex)
        : setMonth(new Date(), monthIndex);
      setDateOfOrder(newDate);
    } else {
      const newDate = renewalDate
        ? setMonth(renewalDate, monthIndex)
        : setMonth(new Date(), monthIndex);
      setRenewalDate(newDate);
    }
  };

  // Handler for year change (for both dates)
  const handleYearChange = (
    year: string,
    target: "firstDd" | "order" | "renewalDate"
  ) => {
    const yearNumber = parseInt(year);
    if (isNaN(yearNumber)) return;

    if (target === "firstDd") {
      const newDate = dateOfFirstDd
        ? setYear(dateOfFirstDd, yearNumber)
        : setYear(new Date(), yearNumber);
      setDateOfFirstDd(newDate);
    } else if (target === "order") {
      const newDate = dateOfOrder
        ? setYear(dateOfOrder, yearNumber)
        : setYear(new Date(), yearNumber);
      setDateOfOrder(newDate);
    } else {
      const newDate = renewalDate
        ? setYear(renewalDate, yearNumber)
        : setYear(new Date(), yearNumber);
      setRenewalDate(newDate);
    }
  };

  // Handle selecting a date for dateOfOrder
  const handleSelectOrder = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDateOfOrder(selectedDate);
    }
  };

  // Handle selecting a date for dateOfFirstDd
  const handleSelectFirstDd = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDateOfFirstDd(selectedDate);
    }
  };
  const handleSelectRenewalDate = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setRenewalDate(selectedDate);
    }
  };

  // Current month and year logic for both dates
  const currentMonthOrder = dateOfOrder
    ? getMonth(dateOfOrder)
    : getMonth(new Date());

  const currentYearOrder = dateOfOrder
    ? getYear(dateOfOrder)
    : getYear(new Date());

  const currentMonthFirstDd = dateOfFirstDd
    ? getMonth(dateOfFirstDd)
    : getMonth(new Date());

  const currentYearFirstDd = dateOfFirstDd
    ? getYear(dateOfFirstDd)
    : getYear(new Date());
    

    const currentMonthRenewalDate = renewalDate
    ? getMonth(renewalDate)
    : getMonth(new Date());

  const currentYearRenewalDate= renewalDate
    ? getYear(renewalDate)
    : getYear(new Date());

 
  return (
    <div className="sm:px-4 py-0 relative">
      <div className="text-[1rem] font-semibold absolute top-[-30px]">
        {orderData?.customer?.companyName
          ? orderData?.customer?.companyName
          : "loading..."}
      </div>
      {/* <div className="mb-1">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}
      {/* <div className="mb-1">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}

      <div className="flex justify-center">
        <div className="my-3 text-[0.8rem] hover:bg-gray-300 h-fit px-2 py-1 rounded cursor-pointer hidden text-center sm:block w-fit bg-[#fff] boxShadow">
          <Link href={`/orders`}>Back</Link>
        </div>
        <ScrollArea className="h-[95vh]   sm:px-3 sm:py-3 w-[100%] xl:w-[70vw]">
          <form
            onSubmit={handleSubmit}
            className="border p-6 text-[0.8rem] bg-[#fff] boxShadow"
          >
            <div className="lg:flex gap-5">
              {/* <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-[#29354f] dark:text-white ">
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
                      name="createdBy"
                      closeMenuOnSelect={true}
                      isClearable={true}
                      options={userData?.map(
                        (user: { _id: any; fullName: any }) => ({
                          value: user?._id,
                          label: user?.fullName,
                        })
                      )}
                      onChange={(value) => {
                        formik.setFieldValue(
                          "createdBy",
                          value ? value?.value : null
                        );
                      }}
                      value={
                        formik.values.createdBy
                          ? {
                              value: formik.values.createdBy,
                              label: userData?.find(
                                (user: { _id: string }) =>
                                  user._id === formik.values.createdBy
                              )?.fullName,
                            }
                          : null
                      }
                      className="react-select-custom-styling__container"
                      classNamePrefix="react-select-custom-styling"
                    />
                  )}
                  {formik.touched.createdBy && formik.errors.createdBy ? (
                    <div className="text-red-500">
                      {formik.errors.createdBy}
                    </div>
                  ) : null}
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
                      className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* Date Of Order */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Date Of Order
                </label>
                <div className="relative">
                <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !dateOfOrder && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfOrder ? (
                          format(dateOfOrder,  "yyyy-MM-dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={(month) =>
                            handleMonthChange(month, "order")
                          }
                          value={months[currentMonthOrder]}
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
                          onValueChange={(year) =>
                            handleYearChange(year, "order")
                          }
                          value={currentYearOrder.toString()}
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

                      <Calendar
                        mode="single"
                        selected={dateOfOrder}
                        onSelect={handleSelectOrder}
                        initialFocus
                        month={dateOfOrder}
                        onMonthChange={(date) => setDateOfOrder(date)} 
                      />
                    </PopoverContent>
                  </Popover>
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !dateOfOrder && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfOrder ? (
                          format(dateOfOrder, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={handleMonthChange}
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
                          onValueChange={handleYearChange}
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

                      <Calendar
                        mode="single"
                        selected={dateOfOrder} 
                        onSelect={handleDateOfOrderDateSelect}
                        initialFocus
                        month={dateOfOrder} 
                        onMonthChange={setDateOfOrder} 
                      />
                    </PopoverContent>
                  </Popover> */}
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[100%] justify-start text-left font-normal text-md",
                          !dateOfOrder && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfOrder
                          ? format(dateOfOrder, "yyyy-MM-dd")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        defaultMonth={dateOfOrder}
                        mode="single"
                        selected={dateOfOrder}
                        initialFocus
                        onSelect={handleDateOfOrderDateSelect}
                        className=" border"
                      />
                    </PopoverContent>
                  </Popover> */}
                  {formik.touched.dateOfOrder && formik.errors.dateOfOrder ? (
                    <div className="text-red-500">
                      {formik.errors.dateOfOrder}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              {/*  Customer Email */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Customer Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.customerEmail}
                    placeholder="Enter Your Email"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.customerEmail &&
                  formik.errors.customerEmail ? (
                    <div className="text-red-500">
                      {formik.errors.customerEmail}
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
              {/* Building Name */}
              <div className="mb-3 w-full ">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Property/ Building Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.buildingAddress}
                    id="buildingAddress"
                    name="buildingAddress"
                    placeholder="Enter name building address"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.buildingAddress &&
                  formik.errors.buildingAddress ? (
                    <div className="text-red-500">
                      {formik.errors.buildingAddress}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              {/* Renewal Status */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Renewal Status
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("renewalStatus", value)
                    }
                    // onBlur={formik.handleBlur}
                    value={formik.values.renewalStatus}
                    name="renewalStatus"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Renewal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="Meeting Booked">
                          Meeting Booked
                        </SelectItem>
                        <SelectItem value="Sold">Sold</SelectItem>
                        <SelectItem value="Dropped">Dropped</SelectItem>
                        <SelectItem value="Still to Contact">
                          Still to Contact
                        </SelectItem>
                        <SelectItem value="Hosting Only">
                          Hosting Only
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formik.touched.renewalStatus &&
                  formik.errors.renewalStatus ? (
                    <div className="text-red-500">
                      {formik.errors.renewalStatus}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* Renewal Notes */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Renewal Notes
                </label>
                <div className="relative">
                  <input
                    value={formik.values.renewalNotes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    id="renewalNotes"
                    name="renewalNotes"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.renewalNotes && formik.errors.renewalNotes ? (
                    <div className="text-red-500">
                      {formik.errors.renewalNotes}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              {/* orderType */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Order Type <span style={{ opacity: "0.5" }}> * </span>
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("orderType", value)
                    }
                    // onBlur={formik.handleBlur}
                    value={formik.values.orderType}
                    name="orderType"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="New Business">
                          New Business
                        </SelectItem>
                        <SelectItem value="Renewal">Renewal</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formik.touched.orderType && formik.errors.orderType ? (
                    <div className="text-red-500">
                      {formik.errors.orderType}
                    </div>
                  ) : null}
                </div>
              </div>

              {formik.values.orderType === "New Business" && (
                <>
                  <div className="mb-3 w-full">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Number Of Key Phrase
                      <span style={{ opacity: "0.5" }}> * </span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.numberOfKeyPhrase}
                        id="numberOfKeyPhrase"
                        name="numberOfKeyPhrase"
                        placeholder="Enter name number of key phrase"
                        className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {formik.touched.numberOfKeyPhrase &&
                      formik.errors.numberOfKeyPhrase ? (
                        <div className="text-red-500">
                          {formik.errors.numberOfKeyPhrase}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="mb-3 w-full">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Number Of Key Areas
                      <span style={{ opacity: "0.5" }}> * </span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.numberOfKeyAreas}
                        id="numberOfKeyAreas"
                        name="numberOfKeyAreas"
                        placeholder="Enter name number of key areas"
                        className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {formik.touched.numberOfKeyAreas &&
                      formik.errors.numberOfKeyAreas ? (
                        <div className="text-red-500">
                          {formik.errors.numberOfKeyAreas}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="lg:flex gap-5">
              {/*  Order Value  */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Order Value
                </label>
                <div className="relative">
                  <input
                    type="number"
                    onChange={handleInputChange}
                    // onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.orderValue || ""}
                    id="orderValue"
                    name="orderValue"
                    placeholder="Enter name order value"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.orderValue && formik.errors.orderValue ? (
                    <div className="text-red-500">
                      {formik.errors.orderValue}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* Deposit */}
              <div className="mb-3 w-full ">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Deposit
                </label>
                <div className="relative">
                  <input
                    type="number"
                    onChange={handleInputChange}
                    // onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.deposit || ""}
                    id="deposit"
                    name="deposit"
                    placeholder="Enter deposit value"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.deposit && formik.errors.deposit ? (
                    <div className="text-red-500">{formik.errors.deposit}</div>
                  ) : null}
                </div>
              </div>
              {/* numberOfInstallments */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Number Of Installments
                </label>
                <div className="relative">
                  <input
                    type="number"
                    // onChange={formik.handleChange}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.numberOfInstallments || ""}
                    id="numberOfInstallments"
                    name="numberOfInstallments"
                    placeholder="Enter number of installments"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.numberOfInstallments &&
                  formik.errors.numberOfInstallments ? (
                    <div className="text-red-500">
                      {formik.errors.numberOfInstallments}
                    </div>
                  ) : null}
                </div>
              </div>
              {/*    Deposite Method */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Deposite Method
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("depositMethod", value)
                    }
                    // onBlur={formik.handleBlur}
                    value={formik.values.depositMethod}
                    name="depositMethod"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="Bank Transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                        <SelectItem value="Direct Debit">
                          Direct Debit
                        </SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                        <SelectItem value="Square Card Machine">
                          Square Card Machine
                        </SelectItem>
                        <SelectItem value="SumUp">SumUp</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formik.touched.depositMethod &&
                  formik.errors.depositMethod ? (
                    <div className="text-red-500">
                      {formik.errors.depositMethod}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* CALCULATIONS  */}
            {!loading ? (
              <div className="lg:flex gap-5 text-[0.8rem]">
                <div className="mb-3  bg-gray-200  px-5 py-2  flex gap-10">
                  <div className="flex gap-2">
                    <span className="font-bold ">◼ DD Monthly:</span>
                    <span className="">{isNaN(ddMonthly) ? 0 : ddMonthly}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className=" font-bold">◼ +5% Increase:</span>
                    <span className="">
                      {isNaN(ddMonthly) ? 0 : percentIncrease}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className=" font-bold">
                      ◼ Expected 2024 Order Value:
                    </span>
                    <span className="">
                      {isNaN(ddMonthly) ? 0 : expectedOrderValue}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className=" font-bold">◼ Cash Flow %:</span>
                    <span className="">{isNaN(ddMonthly) ? 0 : cashFlow}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <LoaderIconSVG />
                <span className="px-2">Loading...</span>
              </div>
            )}

            <div className="lg:flex gap-5">
              {/*    Deposite Method */}
              {/* <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Deposite Method
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("depositMethod", value)
                    }
                    // onBlur={formik.handleBlur}
                    value={formik.values.depositMethod}
                    name="depositMethod"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="Bank Transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                        <SelectItem value="Direct Debit">
                          Direct Debit
                        </SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                        <SelectItem value="Square Card Machine">
                          Square Card Machine
                        </SelectItem>
                        <SelectItem value="SumUp">SumUp</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formik.touched.depositMethod &&
                  formik.errors.depositMethod ? (
                    <div className="text-red-500">
                      {formik.errors.depositMethod}
                    </div>
                  ) : null}
                </div>
              </div> */}
              {/* numberOfInstallments */}
              {/* <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Number Of Installments
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    // onChange={formik.handleChange}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.numberOfInstallments || ""}
                    id="numberOfInstallments"
                    name="numberOfInstallments"
                    placeholder="Enter name number of installments"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.numberOfInstallments &&
                  formik.errors.numberOfInstallments ? (
                    <div className="text-red-500">
                      {formik.errors.numberOfInstallments}
                    </div>
                  ) : null}
                </div>
              </div> */}
            </div>
            <div className="lg:flex gap-5">
              {/* dateOfFirstDd */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Date Of First Dd
                </label>
                <div className="relative">
                <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !dateOfFirstDd && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfFirstDd ? (
                          format(dateOfFirstDd,  "yyyy-MM-dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={(month) =>
                            handleMonthChange(month, "firstDd")
                          }
                          value={months[currentMonthFirstDd]}
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
                          onValueChange={(year) =>
                            handleYearChange(year, "firstDd")
                          }
                          value={currentYearFirstDd.toString()}
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

                      <Calendar
                        mode="single"
                        selected={dateOfFirstDd}
                        onSelect={handleSelectFirstDd}
                        initialFocus
                        month={dateOfFirstDd}
                        onMonthChange={(date) => setDateOfFirstDd(date)} 
                      />
                    </PopoverContent>
                  </Popover>
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[100%] justify-start text-left font-normal text-md",
                          !dateOfFirstDd && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfFirstDd
                          ? format(dateOfFirstDd, "yyyy-MM-dd")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        defaultMonth={dateOfFirstDd}
                        mode="single"
                        selected={dateOfFirstDd}
                        initialFocus
                        onSelect={handleOfFirstDateSelect}
                        className=" border"
                      />
                    </PopoverContent>
                  </Popover> */}
                </div>
                {formik.touched.dateOfFirstDd && formik.errors.dateOfFirstDd ? (
                  <div className="text-red-500">
                    {formik.errors.dateOfFirstDd}
                  </div>
                ) : null}
              </div>
              {/* customerAccountName */}

              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Customer Account Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.customerAccountName}
                    id="customerAccountName"
                    name="customerAccountName"
                    placeholder="Enter Your customer account name"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.customerAccountName &&
                  formik.errors.customerAccountName ? (
                    <div className="text-red-500">
                      {formik.errors.customerAccountName}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="lg:flex gap-5">
              {/* customerAccountNumber */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Customer Account Number
                </label>
                <div className="relative">
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.customerAccountNumber}
                    id="customerAccountNumber"
                    name="customerAccountNumber"
                    placeholder="Enter Your Customer Account Number"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.customerAccountNumber &&
                  formik.errors.customerAccountNumber ? (
                    <div className="text-red-500">
                      {formik.errors.customerAccountNumber}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* customerSortCode */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Customer Sort Code
                </label>
                <div className="relative">
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.customerSortCode}
                    id="customerSortCode"
                    name="customerSortCode"
                    placeholder="Enter Your Customer Sort Code"
                    className="w-full  border border-stroke bg-transparent py-2 pl-3 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {formik.touched.customerSortCode &&
                  formik.errors.customerSortCode ? (
                    <div className="text-red-500">
                      {formik.errors.customerSortCode}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="lg:flex gap-5">
              {/* googleEmailRenewCampaign */}
              <div className=" mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Google Email Renew Campaign
                </label>
                <div className="relative">
                  <Select
                    onValueChange={(value: any) =>
                      formik.setFieldValue("googleEmailRenewCampaign", value)
                    }
                    // onBlur={formik.handleBlur}
                    value={formik.values.googleEmailRenewCampaign}
                    name="googleEmailRenewCampaign"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select</SelectLabel>
                        <SelectItem value="Needs to be set up">
                          Needs To Be Set Up
                        </SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {formik.touched.googleEmailRenewCampaign &&
                  formik.errors.googleEmailRenewCampaign ? (
                    <div className="text-red-500">
                      {formik.errors.googleEmailRenewCampaign}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* Customer Signeture */}

              {/* renewalDate2024 */}
              <div className="mb-3 w-full">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Renewal Date 2024
                </label>
                <div className="relative">
                <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[250px] justify-start text-left font-normal",
                          !renewalDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {renewalDate ? (
                          format(renewalDate,  "yyyy-MM-dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="flex justify-between p-2">
                        <Select
                          onValueChange={(month) =>
                            handleMonthChange(month, "renewalDate")
                          }
                          value={months[currentMonthRenewalDate]}
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
                          onValueChange={(year) =>
                            handleYearChange(year, "renewalDate")
                          }
                          value={currentYearRenewalDate.toString()}
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

                      <Calendar
                        mode="single"
                        selected={renewalDate}
                        onSelect={handleSelectRenewalDate}
                        initialFocus
                        month={renewalDate}
                        onMonthChange={(date) => setRenewalDate(date)} 
                      />
                    </PopoverContent>
                  </Popover>
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[100%] justify-start text-left font-normal text-md",
                          !renewalDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {renewalDate
                          ? format(renewalDate, "yyyy-MM-dd")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        defaultMonth={renewalDate}
                        mode="single"
                        selected={renewalDate}
                        initialFocus
                        onSelect={handleRenewalDateSelect}
                        className=" border"
                      />
                    </PopoverContent>
                  </Popover> */}

                  {formik.touched.renewalDate2024 &&
                  formik.errors.renewalDate2024 ? (
                    <div className="text-red-500">
                      {formik.errors.renewalDate2024}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="my-1 ">
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

export default EditOrder;
