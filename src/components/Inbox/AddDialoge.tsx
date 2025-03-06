"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AllForm from "./AllForm";

const AddDialoge = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Button Section */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-[0.8rem] text-white bg-[#29354f] hover:bg-[#fff] hover:text-[#29354f]"
        >
          New Add
        </Button>
      </DialogTrigger>

      {/* Form Section */}
      <DialogContent className="sm:max-w-[700px]">
        {/* <DialogHeader>
          <DialogTitle>New Add</DialogTitle>
        </DialogHeader> */}
        <AllForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddDialoge;
