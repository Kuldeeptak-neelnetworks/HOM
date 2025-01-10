"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, Loader2 } from "lucide-react";

import { PlusIcon, FileTextIcon } from "@radix-ui/react-icons";
import {
  successToastingFunction,
  baseInstance,
  errorToastingFunction,
} from "@/common/commonFunctions";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/Store/OrderStore";

const GenerateInvoiceDialoge = ({ id, orderNo, dateOfOrder }: any) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const { fetchAllOrdersData } = useOrderStore();

  const generateInvoice = async () => {
    setIsGeneratingInvoice(() => true);
    try {
      const response = await baseInstance.post(`/orders/${id}/invoice`);
      if (response.status === 200) {
        successToastingFunction(response?.data?.message);
        fetchAllOrdersData(new Date(dateOfOrder).getFullYear());
        setOpen(false);
      }
    } catch (error: any) {
      if (error?.response && error?.response?.data) {
        errorToastingFunction(error?.response?.data.message);
        setIsGeneratingInvoice(false);
      }
    }
  };

  const handleIconClick = () => {
    generateInvoice();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Button Section  */}
      <DialogTrigger>
        <PlusIcon className="h-[1.35rem] w-[1.75rem] p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
      </DialogTrigger>
      {/* form Section  */}
      <DialogContent className="sm:max-w-[500px] text-[0.8rem]">
        <div className="flex justify-center text-xl">
          <FileTextIcon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />{" "}
          Generate Invoice
        </div>
        <div className="border-t border-gray-200"></div>
        <div className="flex justify-center">
          Generate Invoice For {orderNo}?
        </div>
        <div className="flex justify-center">
          <Button
            onClick={handleIconClick}
            className="lg:w-[6vw] w-full cursor-pointer  border border-primary bg-primary px-4 py-1 text-white transition hover:bg-opacity-90 "
          >
            {isGeneratingInvoice ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateInvoiceDialoge;
