"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { FileTextIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";

const InvoiceDialoge = ({ id, Invoice }: any) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <FileTextIcon className="h-[1.55rem] w-[1.75rem] p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[1000px] ">
        <div></div>
        {Invoice?.startsWith("https://high-oaks-media-team.monday.com") ? (
          <>
            <p className="bg-[#29354f] text-white p-5 flex justify-center text-lg ">
              No invoices have been generated yet. Please generate an invoice.
            </p>
          </>
        ) : (
          <iframe
            src={Invoice}
            title={`Invoice`}
            className="w-full h-[70vh] border-none"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialoge;

// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import { FileTextIcon } from "@radix-ui/react-icons";

// const InvoiceDialoge = ({ id, Invoice }: any) => {
//   const [open, setOpen] = useState<boolean>(false);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger>
//         <FileTextIcon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[1000px]">
//         <div></div>
//         <iframe src={Invoice} title={`Invoice`} width="100%" height="700px" />
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default InvoiceDialoge;
