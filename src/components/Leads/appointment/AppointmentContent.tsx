"use client";

import React, { useEffect, Fragment, useState } from "react";

import { useRouter } from "next/navigation";
import BreadcrumbSection from "../../common/BreadcrumbSection";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import InteractionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { EventSourceInput } from "@fullcalendar/core/index.js";
import { DialogTitle } from "@radix-ui/react-dialog";

// Crumbs Array
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
    title: "Appointment",
    link: "/leads/appointments",
  },
];

interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
}

const AppointmentContent: React.FC = () => {
  //   const { fetchAllLeadData, fetchMyLeadData, leadData, loading }: any =
  //     useLeadStore();
  //   console.log("leadData", leadData);

  const [events, setEvents] = useState([
    { title: "event 1", id: "1" },
    { title: "event 2", id: "2" },
    { title: "event 3", id: "3" },
    { title: "event 4", id: "4" },
    { title: "event 5", id: "5" },
  ]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: "",
    allDay: false,
    id: 0,
  });

  useEffect(() => {
    // if (typeof window !== "undefined") {
    let draggableEl = document.getElementById("draggable-el");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let title = eventEl.getAttribute("title");
          let id = eventEl.getAttribute("data");
          let start = eventEl.getAttribute("start");
          return { title, id, start };
        },
      });
    }
    // }
  }, []);

  function handleDateClick(arg: { date: Date; allDay: boolean }) {
    setNewEvent({
      ...newEvent,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime(),
    });
    setShowModal(true);
  }
  // console.log("newEventnewEvent", newEvent);

  // function addEvent(data: DropArg) {
  //   console.log("datadata", data);
  //   const event = {
  //     ...newEvent,
  //     start: data.date.toISOString(),
  //     title: data.draggedEl.innerText,
  //     allDay: data.allDay,
  //     id: new Date().getTime(),
  //   };
  //   setAllEvents([...allEvents, event]);
  // }

  function handleEventModal(data: { event: { id: string } }) {
    // console.log("data", data.event?._def?.title);
    setShowDetailsModal(true);
    // setShowDeleteModal(true);
    setIdToDelete(Number(data.event.id));
  }

  function handleDelete() {
    setAllEvents(
      allEvents.filter((event) => Number(event.id) !== Number(idToDelete))
    );
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  function handleCloseModal() {
    setShowDetailsModal(false);
    // setNewEvent({
    //   title: "",
    //   start: "",
    //   allDay: false,
    //   id: 0,
    // });
    // setShowDeleteModal(false);
    // setIdToDelete(null);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      title: e.target.value,
    });
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAllEvents([...allEvents, newEvent]);
    setShowModal(false);
    setNewEvent({
      title: "",
      start: "",
      allDay: false,
      id: 0,
    });
  }

  return (
    // <div className="p-4 relative">
    //   <div className="text-xl font-bold absolute top-[-65px]">Appointment</div>
    //   <div className="mb-1">
    //     <BreadcrumbSection crumbs={crumbs} />
    //   </div>
    //   <div className="">
    //     <Fullcalendar
    //       plugins={[dayGridPlugin, timeGridPlugin, InteractionPlugin]}
    //       initialView={"dayGridMonth"}
    //       headerToolbar={{
    //         start: "today prev,next",
    //         center: "title",
    //         end: "dayGridMonth,timeGridWeek,timeGridDay",
    //       }}
    //       events={[
    //         { title: "event 1", date: "2024-05-01" },
    //         { title: "event 2", date: "2024-05-02" },
    //       ]}
    //       nowIndicator={true}
    //       editable={true}
    //       droppable={true}
    //       selectable={true}
    //       selectMirror={true}
    //     />
    //   </div>
    // </div>
    <>
      {/* <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-xl text-gray-700">Calendar</h1>
      </nav> */}

      <main className="flex flex-col items-center justify-between px-8 py-0">
        <div className="grid grid-cols-8 w-full">
          <div className="col-span-8">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              initialView={"dayGridMonth"}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                end: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              // events={allEvents as EventSourceInput}
              events={[
                {
                  title: "Meeting With Nikola",
                  date: "2024-06-01",
                  color: "red",
                },
                {
                  title: "Meeting With Jez",
                  date: "2024-06-01",
                  color: "green",
                },
                {
                  title: "Meeting With Kuldeep",
                  date: "2024-06-05",
                  color: "orange",
                  textColor: "black",
                },
                {
                  title: "Meeting With Sanjana",
                  date: "2024-06-07",
                  color: "purple",
                  textColor: "white",
                },
              ]}
              nowIndicator={true}
              editable={true}
              droppable={false}
              selectable={true}
              selectMirror={true}
              // dateClick={handleDateClick}
              height={"80vh"}
              // drop={(data) => addEvent(data)}
              eventClick={(data) => handleEventModal(data)}
            />
          </div>
        </div>

        <Transition show={showDeleteModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={setShowDeleteModal}
          >
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <DialogPanel
                    className="relative transform overflow-hidden
                   bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                  >
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div
                          className="mx-auto flex h-12 w-12 flex-shrink-0 items-center 
                      justify-center bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                        >
                          <ExclamationTriangleIcon
                            className="h-6 w-6 text-red-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <h3 className="text-base font-semibold leading-6 text-gray-900">
                            Delete Event
                          </h3>
                          <div className="mt-2">
                            <p className="text-[0.8rem] text-gray-500">
                              Are you sure you want to delete this event?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center bg-red-600 px-3 py-2 text-[0.8rem] 
                      font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center bg-white px-3 py-2 text-[0.8rem] font-semibold text-gray-900 
                      shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Transition show={showDetailsModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={setShowDetailsModal}
          >
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <DialogPanel
                    className="relative transform overflow-hidden
                   bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                  >
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        {/* <div
                          className="mx-auto flex h-12 w-12 flex-shrink-0 items-center 
                      justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10"
                        >
                          <ExclamationTriangleIcon
                            className="h-6 w-6 text-blue-600"
                            aria-hidden="true"
                          />
                        </div> */}
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <h3 className="text-base font-semibold leading-6 text-gray-900">
                            Event Name
                          </h3>
                          <div className="mt-2">
                            <p className="text-[0.8rem] text-gray-500">
                              This is Description of Existing Event.
                            </p>
                            <p className="text-[0.8rem] text-gray-500">
                              This Event Added By : Nikola
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      {/* <button
                        type="button"
                        className="inline-flex w-full justify-center  bg-red-600 px-3 py-2 text-[0.8rem] 
                      font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={handleDelete}
                      >
                        Delete
                      </button> */}
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center  bg-white px-3 py-2 text-[0.8rem] font-semibold text-gray-900 
                      shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleCloseModal}
                      >
                        Close
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Transition show={showModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowModal}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <DialogPanel className="relative transform overflow-hidden  bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div>
                      <div
                        className="mx-auto flex h-12 w-12 items-center justify-center
                       bg-green-100"
                      >
                        <CheckIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="font-bold text-xl text-center mt-2">
                        Add Event
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <form action="submit" onSubmit={handleSubmit}>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="title"
                              className="block w-full px-3 border-0 py-1.5 text-gray-900 
                            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                            focus:ring-2 
                            focus:ring-inset focus:ring-[#29354f] 
                            sm:text-[0.8rem] sm:leading-6"
                              value={newEvent.title}
                              onChange={(e) => handleChange(e)}
                              placeholder="Title"
                            />
                          </div>
                          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                            <button
                              type="submit"
                              className="inline-flex w-full justify-center bg-[#29354f] px-3 py-2 text-[0.8rem] font-semibold text-white shadow-sm hover:bg-[#29354f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29354f] sm:col-start-2 disabled:opacity-25"
                              disabled={newEvent.title === ""}
                            >
                              Create
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center bg-white px-3 py-2 text-[0.8rem] font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                              onClick={handleCloseModal}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </main>
    </>
  );
};

export default AppointmentContent;
