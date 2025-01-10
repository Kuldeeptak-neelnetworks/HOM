"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../../ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import EventComponentBox from "./EventComponentBox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LeadsShowMoreDialoge({ row }: any) {
  const [date, setDate] = useState<Date | undefined>(new Date("2024-04-08"));
  const [showEventBox, setShowEventBox] = useState(false);

  const openEventModelFunction = () => {
    setShowEventBox(true);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-[100%]">Show More</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle>Leads's Details</DialogTitle>
          <DialogDescription>Leads's Details are :</DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          {/* Details Section  */}
          <div className="">
            <Card className="w-[360px] h-[100%]">
              <CardHeader>
                <CardTitle>Your Lead</CardTitle>
                <CardDescription>Details Of existing Lead</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Contact Name  */}
                <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b">
                  <Label htmlFor="name" className="text-right font-bold">
                    Customer Name :
                  </Label>
                  <p className="mx-2">{row?.original?.customerName}</p>
                </div>
                {/* Company Name  */}
                <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b">
                  <Label htmlFor="name" className="text-right font-bold">
                    Company Name :
                  </Label>
                  <p className="mx-2">{row?.original?.company_name}</p>
                </div>
                {/* Email  */}
                <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b">
                  <Label htmlFor="username" className="text-right font-bold">
                    Represantative Name :
                  </Label>
                  <p className="mx-2">{row?.original?.rep_name}</p>
                </div>
                {/* Address  */}
                {row?.original?.address ? (
                  <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b">
                    <Label htmlFor="username" className="text-right font-bold">
                      Address :
                    </Label>
                    <p className="mx-2">{row?.original?.address}</p>
                  </div>
                ) : (
                  ""
                )}
              </CardContent>
            </Card>
            {/* ==================================== */}
          </div>
          <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className=" border"
              onDayClick={() => openEventModelFunction()}
            />
            {showEventBox ? (
              <EventComponentBox setShowEventBox={setShowEventBox} />
            ) : (
              ""
            )}
          </div>
        </div>
        {/* <DialogFooter>
          <Button type="submit">Close</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
