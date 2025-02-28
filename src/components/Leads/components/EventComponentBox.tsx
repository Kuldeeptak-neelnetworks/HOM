"use client";
import React, { useEffect, useMemo, useState } from "react";
// import moment from "moment";
// import moment from "moment";
import moment from "moment-timezone";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  EditIconSVG,
  EditSmallIconSVG,
  LoaderIconSVG,
} from "@/utils/SVGs/SVGs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DeleteIcon, Router } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  baseInstance,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";

const EventComponentBox = ({
  appointments,
  isUserValid,
  leadId,
  date,
  getAppointmentsAtSelectedDate,
}: any) => {
  const router = useRouter();
  const editAppointmentFunction = (id: string) => {
    router.push(`/leads/leadsDetails/${leadId}/editAppointmentDetails/${id}`);
  };

  const appointmentDeleteFunction = async (id: string) => {
    try {
      const response = await baseInstance.delete(`/leads/appointments/${id}`);

      if (response?.status === 200) {
        successToastingFunction(response?.data?.message);
        // setIsUserValid(() => false);
        getAppointmentsAtSelectedDate(date);
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

  return (
    <div className="overflow-y-auto mt-6 text-[0.8rem]">
      <ScrollArea className="h-[30rem] w-[100%]  border px-3">
        {!isUserValid ? (
          <>
            {appointments && appointments?.length > 0 ? (
              appointments.map((item: any) => {
                const originalDate = new Date(item?.date);
                // const formattedDate = moment(originalDate).format("YYYY-MM-DD");
                // const formattedDate = moment(originalDate)
                //   .tz("Europe/London")
                //   .format("YYYY-MM-DD");
                // const formattedDate = moment(originalDate).format("YYYY-MM-DD");
                const formattedDate = moment(date)
                  .tz(moment.tz.guess())
                  .format("YYYY-MM-DD");
        
                return (
                  <Card
                    key={item._id}
                    className="px-6 py-3 my-4 w-[60%] bg-[#a9b5cf] flex flex-col justify-center"
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="font-bold text-[17px]">
                          {item?.title}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="bg-transparent border-none"
                            variant="outline"
                          >
                            <DotsHorizontalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-30">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              className="cursor-pointer flex gap-3"
                              onClick={() => editAppointmentFunction(item._id)}
                            >
                              <EditSmallIconSVG />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer flex gap-3"
                              onClick={() =>
                                appointmentDeleteFunction(item._id)
                              }
                            >
                              <DeleteIcon className="h-5 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardContent className="mt-2 p-0">
                      <div>
                        <span className="font-bold">Date</span> :
                        <span className="pl-1">{formattedDate}</span>
                      </div>
                      <div>
                        <span className="font-bold">Time</span> :
                        <span className="pl-1">{item?.time}</span>
                      </div>
                      <div>
                        <span className="font-bold">Description</span> :
                        <span className="pl-1">{item?.content}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="px-6 py-4 my-4 w-[60%]">
                <CardContent>
                  <div>No Appointment Data Found</div>
                  {/* <div role="status" className="flex justify-center">
              <LoaderIconSVG />
              <span className="sr-only">Loading...</span>
            </div> */}
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="px-6 py-4 my-4 w-[60%]">
            <CardContent>
              <div className="flex justify-center">
                <LoaderIconSVG />
                <span className="sr-only">Loading...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form> */}
        {/* <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className=""
          onClick={() => setShowEventBox(false)}
        >
          Cancel
        </Button>
      </CardFooter> */}
      </ScrollArea>
    </div>
  );
};

export default EventComponentBox;
