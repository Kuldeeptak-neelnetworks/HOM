import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
} from "@heroicons/react/20/solid";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isToday,
  isSameDay,
  isSameMonth,
  isWithinInterval,
} from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";
import { AddAppointmentDialoge } from "./AddAppointmentDialoge";
import {
  baseInstance,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { Cross1Icon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { EditSmallIconSVG } from "@/utils/SVGs/SVGs";
import { DeleteIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteDialoge from "@/components/Orders/components/DeleteDialoge";

const initialMeetings = [
  {
    _id: "sdfsdff56416165fsdf",
    title: "New Appointment",
    content: "This is a message for this appointment",
    date: "August 5th, 2024",
    time: "3:00 PM",
    datetime: "2024-08-05T15:00",
    lead: "sdfsd77777775fsdf",
  },
  // More meetings...
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function AppointmentSection({ leadId }: any) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings, setMeetings] = useState({});
  const [appointments, setAppointments] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null
  );
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const days = eachDayOfInterval({
    start: startOfCurrentMonth,
    end: endOfCurrentMonth,
  });

  const appointmentDeleteFunction = async (id: string) => {
    try {
      const response = await baseInstance.delete(`/leads/appointments/${id}`);

      if (response?.status === 200) {
        successToastingFunction(response?.data?.message);
        // setIsUserValid(() => false);
        setIsDeleteDialogOpen(false);
        getAppointmentsAtSelectedDate();
      } else {
        alert("Something went Wrong !!");
      }
    } catch (error: any) {
      if (error?.response && error?.response?.data) {
        errorToastingFunction(error?.response?.data?.message);
      } else {
        errorToastingFunction(error?.response?.data.error);
      }
    }
  };
  const editAppointmentFunction = (id: string) => {
    router.push(`/leads/leadsDetails/${leadId}/editAppointmentDetails/${id}`);
  };

  //   Filter meetings for the current month
  const filteredMeetings = appointments.filter((appointment: any) => {
    const meetingDate = new Date(formatDateTime(appointment.date));
    return isWithinInterval(meetingDate, {
      start: startOfCurrentMonth,
      end: endOfCurrentMonth,
    });
  });

  // Function to check if there are any meetings on a given date
  const hasMeetingOnDate = (date: any) => {
    return appointments.some((appointment: any) => {
      const appointmentDate = new Date(formatDateTime(appointment.date));
      return isSameDay(date, appointmentDate);
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  function formatDateTime(isoString: any) {
    const date = new Date(isoString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const formatDateForUI = (date: any) => {
    return moment.utc(date).format("YYYY-MM-DD");
  };

  const getAppointmentsAtSelectedDate = async () => {
    try {
      //   const originalDate = new Date(e);
      //   const formattedDate = moment(originalDate).format("YYYY-MM-DD");

      //   const result = await baseInstance.get(
      //     `/leads/lead/appointments/${leadId}?date=${formattedDate}`
      //   );
      const result = await baseInstance.get(
        `/leads/appointments/lead?lead_id=${leadId}`
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
      //   setIsUserValid(() => false);
    }
  };

  useEffect(() => {
    getAppointmentsAtSelectedDate();
  }, [currentDate]);

  const handleDeleteClick = (id: string) => {
    setAppointmentToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      appointmentDeleteFunction(appointmentToDelete);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  };

  const goToAddAppointment = () => {
    router.push(`/leads/leadsDetails/${leadId}/addAppointment`);
  };

  return (
    <div className="mb-2">
      <h2 className="text-base font-semibold mt-2 leading-6 text-gray-900 bg-[#f6fbff]  w-fit px-1 rounded">
        Upcoming Appointments
      </h2>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-3">
        <div className="text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-1 xl:col-start-9">
          <div className="border p-3  boxShadow bg-[#fff]">
            <div className="flex items-center text-gray-900 ">
              <button
                type="button"
                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                onClick={handlePreviousMonth}
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="flex-auto text-[0.8rem] font-semibold">
                {format(currentDate, "MMMM yyyy")}
              </div>
              <button
                type="button"
                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                onClick={handleNextMonth}
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
              <div>S</div>
            </div>
            <div className="isolate mt-2 grid grid-cols-7 gap-px  bg-gray-200 text-[0.8rem] shadow ring-1 ring-gray-200 ">
              {days.map((day) => (
                <button
                  key={day.toISOString()}
                  type="button"
                  className={classNames(
                    "py-1.5 hover:bg-gray-100 focus:z-10",
                    isSameMonth(day, currentDate) ? "bg-white" : "bg-gray-50",
                    hasMeetingOnDate(day) && "bg-yellow-100", // Highlight days with meetings
                    isToday(day) && "font-semibold",
                    isSameDay(day, new Date()) && "text-indigo-600",
                    !isSameDay(day, new Date()) &&
                      isSameMonth(day, currentDate) &&
                      "text-gray-900",
                    !isSameMonth(day, currentDate) && "text-gray-400"
                  )}
                >
                  <time
                    dateTime={format(day, "yyyy-MM-dd")}
                    className={classNames(
                      "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                      isToday(day) && "bg-[#29354f] text-white"
                    )}
                  >
                    {format(day, "d")}
                  </time>
                </button>
              ))}
            </div>
            <Button
              className="mt-8 w-full   px-3 py-2 text-[0.8rem] font-semibold text-white shadow hover:bg-[#29354f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={goToAddAppointment}
            >
              Book an Appointment
            </Button>

            {/* <AddAppointmentDialoge
              leadId={leadId}
              getAppointmentsAtSelectedDate={getAppointmentsAtSelectedDate}
            /> */}
          </div>
        </div>
        <div className="mt-[0.2rem] lg:col-span-7 xl:col-span-8 border  p-2 h-[376px] overflow-y-auto boxShadow bg-[#fff]">
          {filteredMeetings.length === 0 ? (
            <p className="text-center text-gray-500 flex justify-center items-center h-full">
              There are no Appointments scheduled for this month.
            </p>
          ) : (
            <ol className="leading-6 ">
              {filteredMeetings.map((filteredMeeting: any) => (
                <li
                  key={filteredMeeting?._id}
                  className="relative flex space-x-6 py-6 px-3  my-2 border "
                >
                  <div className="flex-auto text-[0.8rem]">
                    <h3 className="pr-10 font-bold text-[1rem] text-gray-900 mb-2">
                      {filteredMeeting.title}
                    </h3>
                    {/* <p className="mt-2 text-gray-500">{appointment.content}</p> */}
                    <div>
                      <span className="font-semibold">Description</span> :
                      <span className="pl-1">{filteredMeeting?.content}</span>
                    </div>
                    {/* <div>
                      <span className="font-semibold">Date</span> :
                    </div> */}
                    <div>
                      <span className="font-semibold">Date</span> :
                      <span className="pl-1">
                        {formatDateForUI(filteredMeeting.date)} at{" "}
                        {filteredMeeting.time}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="bg-transparent border-none h-[30px]"
                        variant="outline"
                      >
                        <DotsHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-30">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="cursor-pointer flex gap-3"
                          onClick={() =>
                            editAppointmentFunction(filteredMeeting?._id)
                          }
                        >
                          <EditSmallIconSVG />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer flex gap-3"
                          // onClick={() =>
                          //   appointmentDeleteFunction(filteredMeeting?._id)
                          // }
                          onClick={() =>
                            handleDeleteClick(filteredMeeting?._id)
                          }
                        >
                          <DeleteIcon className="h-5 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
      {/* Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6  shadow-lg">
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
            <p className="mt-2">
              Are you sure you want to delete this appointment?
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <Button onClick={handleCancelDelete} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} className="bg-red-600">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
