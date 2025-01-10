"use client";

import BreadcrumbSection from "@/components/common/BreadcrumbSection";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import moment from "moment";
import {
  baseInstance,
  errorToastingFunction,
  headerOptions,
  successToastingFunction,
} from "@/common/commonFunctions";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import EventComponentBox from "./EventComponentBox";
import { AddAppointmentDialoge } from "./AddAppointmentDialoge";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppointmentSection from "./AppointmentSection";

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
    title: "Lead Details",
    link: "",
  },
];

interface LeadDetailType {
  contactPerson: string;
  contactName: string;
  customerName: string;
  representativeName: string;
  customer_id: any;
  generated_by: any;
  mobileNo: string;
  landlineNumber: string;
  mobileNumber: string;
  currentWebsite: string;
  lead_type: string;
  outcome: string;
}

const LeadDetailsContent = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const router = useRouter();

  const [leadDetails, setLeadDetails] = React.useState<LeadDetailType | null>(
    null
  );

  const [appointments, setAppointments] = useState([]);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showEventBox, setShowEventBox] = useState(false);
  const [openDropDownBox, setOpenDropDownBox] = useState<boolean>(false);

  const openDropDown = (e: any) => {
    if (e) {
      setIsUserValid(() => true);
      setOpen(true);
      setOpenDropDownBox(true);
      getAppointmentsAtSelectedDate(e);
    } else {
      setOpen(true);
      setOpenDropDownBox(true);
      getAppointmentsAtSelectedDate(e);
    }
  };

  const [open, setOpen] = useState<boolean>(false);
  const [isUserValid, setIsUserValid] = useState(false);

  //   const data = useMemo(() => customerData, [customerData]);
  //   const columns = useMemo(() => columns2, [columns2]);

  const getLeadDetails = async () => {
    try {
      const result = await baseInstance.get(`/leads/${leadId}`);
      if (result.status === 200) {
        setLeadDetails(result?.data?.data);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        errorToastingFunction(error?.response?.data?.message);
        // logOutFunction(error?.response?.data?.message);
        router.push("/auth/login");
      }
    }
  };
  const getAppointmentsAtSelectedDate = async (e: any) => {
    try {
      const originalDate = new Date(e);
      const formattedDate = moment(originalDate).format("YYYY-MM-DD");

      const result = await baseInstance.get(
        `/leads/lead/appointments/${leadId}?date=${formattedDate}`
      );
      if (result.status === 200) {
        setAppointments(result?.data?.data);
        // getAppointmentsAtSelectedDate(date);
        // if (result?.data?.message === "Appointment not found") {
        //   errorToastingFunction(result?.data?.message);
        // } else {
        //   successToastingFunction(result?.data?.message);
        // }
      } else {
        setAppointments([]);
      }
    } catch (error: any) {
      errorToastingFunction(error?.response?.data?.message);
      // logOutFunction(error?.response?.data?.message);
      // router.push("/auth/login");
    } finally {
      setIsUserValid(() => false);
    }
  };

  useEffect(() => {
    getLeadDetails();
    if (date !== undefined) {
      getAppointmentsAtSelectedDate(date);
    }
  }, [leadId, date]);

  function getLeadData(data: any) {
    if (data === "") {
      return "N/A";
    }
    if (!data || typeof data === "undefined") {
      return "Loading...";
    }

    return data;
  }

  // Table Instance
  //   const tableInstance = useReactTable({
  //     data,
  //     columns,
  //     state: {
  //       sorting,
  //       columnVisibility,
  //       rowSelection,
  //       globalFilter: filtering,
  //       columnFilters,
  //     },
  //     onGlobalFilterChange: setFiltering,
  //     enableRowSelection: true,
  //     onRowSelectionChange: setRowSelection,
  //     onSortingChange: setSorting,
  //     onColumnFiltersChange: setColumnFilters,
  //     onColumnVisibilityChange: setColumnVisibility,
  //     getCoreRowModel: getCoreRowModel(),
  //     getFilteredRowModel: getFilteredRowModel(),
  //     getPaginationRowModel: getPaginationRowModel(),
  //     getSortedRowModel: getSortedRowModel(),
  //     getFacetedRowModel: getFacetedRowModel(),
  //     getFacetedUniqueValues: getFacetedUniqueValues(),
  //   });
  return (
    <div className="sm:px-4 py-0 relative">
      <div className="text-[1rem] font-semibold absolute top-[-35px]">
        {getLeadData(leadDetails?.customerName)}
      </div>
      {/* <div className="mb-1">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}
      <AppointmentSection leadId={leadId} />
      {/* <div className="flex justify-end my-3">
        <AddAppointmentDialoge
          leadId={leadId}
          date={date ? date.toISOString() : ""}
          getAppointmentsAtSelectedDate={() =>
            getAppointmentsAtSelectedDate(date)
          }
        />
      </div> */}

      <div className="flex flex-col md:flex-row ">
        {/* <div className="md:w-[45%] w-full"></div> */}
        {/* <div className="md:w-[66.5%] w-full"> */}
        <div className="md:w-[100%] w-full boxShadow">
          <Card className="h-[100%] ">
            <CardHeader>
              <CardTitle>Your Lead</CardTitle>
              <CardDescription>Details Of existing Lead</CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-0">
              <ScrollArea className="h-[38vh]  px-3 py-3">
                <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                  <Label htmlFor="name" className="text-right font-bold">
                    Contact Person :
                  </Label>
                  <p className="mx-2">
                    {leadDetails?.contactPerson || "Loading..."}
                  </p>
                </div>

                <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                  <Label htmlFor="name" className="text-right font-bold">
                    Company Name :
                  </Label>
                  <p className="mx-2">
                    {getLeadData(leadDetails?.customerName)}
                  </p>
                </div>

                <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                  <Label htmlFor="mobileNo" className="text-right font-bold">
                    Mobile No. :
                  </Label>
                  <p className="mx-2">
                    {getLeadData(leadDetails?.mobileNumber)}
                  </p>
                </div>

                <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                  <Label htmlFor="mobileNo" className="text-right font-bold">
                    Landline Number :
                  </Label>
                  <p className="mx-2">
                    {getLeadData(leadDetails?.landlineNumber)}
                  </p>
                </div>

                <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                  <Label htmlFor="mobileNo" className="text-right font-bold">
                    Current Website :
                  </Label>
                  <p className="mx-2">
                    <a
                      href={getLeadData(leadDetails?.currentWebsite)}
                      target="_blank"
                      className="text-blue-500 cursor-pointer hover:text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </p>
                </div>

                <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                  <Label htmlFor="mobileNo" className="text-right font-bold">
                    OutCome :
                  </Label>
                  <p className="mx-2">{getLeadData(leadDetails?.outcome)}</p>
                </div>

                <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                  <Label htmlFor="mobileNo" className="text-right font-bold">
                    Lead Type :
                  </Label>
                  <p className="mx-2">{getLeadData(leadDetails?.lead_type)}</p>
                </div>
                {/* Represantative Name*/}
                <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b text-[0.8rem]">
                  <Label htmlFor="username" className="text-right font-bold">
                    Represantative Name :
                  </Label>
                  <p className="mx-2">
                    {getLeadData(leadDetails?.generated_by?.fullName)}
                  </p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        {/* <div
          className="flex gap-4 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(e) => {
              setDate(e);
            }}
            className=" border"
            onDayClick={(e) => {
              openDropDown(e);
            }}
          />
        </div> */}
        <div className="flex flex-col gap-4">
          {/* <div>
            <AddAppointmentDialoge
              leadId={leadId}
              date={date ? date.toISOString() : ""}
              getAppointmentsAtSelectedDate={() =>
                getAppointmentsAtSelectedDate(date)
              }
            />
          </div> */}
        </div>
      </div>
      {/* <div>
        <EventComponentBox
          date={date}
          leadId={leadId}
          setShowEventBox={setShowEventBox}
          appointments={appointments}
          isUserValid={isUserValid}
          getAppointmentsAtSelectedDate={getAppointmentsAtSelectedDate}
        />
      </div> */}
    </div>
  );
};

export default LeadDetailsContent;
