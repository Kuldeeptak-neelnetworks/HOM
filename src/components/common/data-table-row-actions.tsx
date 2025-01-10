// "use client";

// import {
//   ChatBubbleIcon,
//   DotsHorizontalIcon,
//   DotsVerticalIcon,
//   Pencil2Icon,
//   TrashIcon,
// } from "@radix-ui/react-icons";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuLabel,
// //   DropdownMenuRadioGroup,
// //   DropdownMenuRadioItem,
// //   DropdownMenuSeparator,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import { Row } from "@tanstack/react-table";
// import { Button } from "../ui/button";
// import Link from "next/link";
// import TooltipCommon from "./TooltipCommon";
// import AddLeadDialoge from "../Leads/componments/AddLeadDialoge";

// import { useOrderStore } from "@/Store/OrderStore";
// import { useLeadStore } from "@/Store/LeadStore";
// import { useCustomerStore } from "@/Store/CustomerStore";
// import { useUserStore } from "@/Store/UserStore";

// import DeleteDialoge from "../Orders/components/DeleteDialoge";
// import { useAmendmentStore } from "@/Store/AmendmentStore";
// // import InvoiceDialoge from "../customers/components/InvoiceDialoge";
// // import InvoiceSendMailDialoge from "../Orders/components/InvoiceSendMailDialoge";
// // import GenerateInvoiceDialoge from "../Orders/components/GenerateInvoiceDialoge";
// import PageHeader from "./PageHeader";
// import CustomerDetailsContent from "../customers/components/CustomerDetailsContent";
// // import { Chat } from "../customers/components/Chat";
// // import ChatModel from "../Orders/components/ChatModel";
// import { useTechnicalStore } from "@/Store/TechnicalStore";
// import ChatModel from "../Orders/components/ChatModel";

// interface DataTableRowActionsProps<TData extends { orderType?: any }> {
//   row: Row<TData>;
// }

// export function DataTableRowActions<TData extends { orderType?: any }>({
//   row,
// }: DataTableRowActionsProps<TData>) {
//   // console.log(row.original,"row")
//   let useDetails: any = localStorage?.getItem("user");
//   let userRole = JSON.parse(useDetails)?.role;
//   const { fetchAllOrdersData }: any = useOrderStore();
//   const { fetchAllLeadData }: any = useLeadStore();
//   const { fetchAllCustomerData }: any = useCustomerStore();
//   const { fetchAmendmentData }: any = useAmendmentStore();
//   const { fetchTechnicalData }: any = useTechnicalStore();
//   const { fetchUsersData }: any = useUserStore();

//   // Conditional Rendering
//   const renderShowMoreModal = (row: any) => {
//     if (row?.original) {
//       if (Object.keys(row?.original).some((item) => item === "password")) {
//         return (
//           <Link href={`/users/userDetails/${row?.original?._id}`}>
//             <TooltipCommon text="Show More">
//               <Button className="bg-transparent hover:bg-transparent">
//                 <DotsHorizontalIcon className="h-6 w-6 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//               </Button>
//             </TooltipCommon>
//           </Link>
//         );
//       }

//       if (Object.keys(row?.original).some((item) => item === "customerNo")) {
//         return (
//           <Link href={`/customers/customerDetails/${row?.original?._id}`}>
//             <TooltipCommon text="Show More">
//               <Button className="bg-transparent hover:bg-transparent">
//                 <DotsHorizontalIcon className="h-6 w-6 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//               </Button>
//             </TooltipCommon>
//           </Link>
//         );
//       }

//       if (Object.keys(row?.original).some((item) => item === "lead_type")) {
//         return (
//           <Link href={`/leads/leadsDetails/${row?.original?._id}`}>
//             <TooltipCommon text="Show More">
//               <Button className="bg-transparent hover:bg-transparent">
//                 <DotsHorizontalIcon className="h-6 w-6 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//               </Button>
//             </TooltipCommon>
//           </Link>
//         );
//       }

//       if (Object.keys(row?.original).some((item) => item === "orderType")) {
//         return (
//           <Link href={`/orders/orderDetails/${row?.original?._id}`}>
//             <TooltipCommon text="Show More">
//               <Button className="bg-transparent hover:bg-transparent">
//                 <DotsHorizontalIcon className="h-6 w-6 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//               </Button>
//             </TooltipCommon>
//           </Link>
//         );
//       }
//     }
//     return null;
//   };
//   const renderEditModal = (row: any) => {
//     if (row?.original) {
//       if (Object.keys(row?.original).some((item) => item === "password")) {
//         return (
//           <Link href={`/users/editUserDetails/${row?.original?._id}`}>
//             <TooltipCommon text="Edit User">
//               <Button className="bg-transparent hover:bg-transparent">
//                 <Pencil2Icon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//               </Button>
//             </TooltipCommon>
//           </Link>
//         );
//       }
//       if (Object.keys(row?.original).some((item) => item === "lead_type")) {
//         return (
//           <Link href={`/leads/editLead/${row?.original?._id}`}>
//             <TooltipCommon text="Edit Lead">
//               <Button className="bg-transparent hover:bg-transparent">
//                 <Pencil2Icon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//               </Button>
//             </TooltipCommon>
//           </Link>
//         );
//       }
//       if (Object.keys(row?.original).some((item) => item === "customerNo")) {
//         return (
//           <Link href={`/customers/editCustomerDetails/${row?.original?._id}`}>
//             <TooltipCommon text="Edit Customer">
//               <Button className="bg-transparent hover:bg-transparent">
//                 <Pencil2Icon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//               </Button>
//             </TooltipCommon>
//           </Link>
//         );
//       }
//       if (Object.keys(row?.original).some((item) => item === "orderType")) {
//         return (
//           <Link href={`/orders/editOrder/${row?.original?._id}`}>
//             <TooltipCommon text="Edit Order">
//               <Button className="bg-transparent hover:bg-transparent">
//                 <Pencil2Icon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//               </Button>
//             </TooltipCommon>
//           </Link>
//         );
//       }
//       if (
//         Object.keys(row?.original).some((item) => item === "customer_status")
//       ) {
//         return (
//           <Link href={`/amendment/editAmendmentDetails/${row?.original?._id}`}>
//             <TooltipCommon text="Edit Amendment">
//               <Button className="bg-transparent hover:bg-transparent">
//                 <Pencil2Icon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//               </Button>
//             </TooltipCommon>
//           </Link>
//         );
//       }

//       if (Object.keys(row?.original).some((item) => item === "technicalTask")) {
//         return (
//           <Link href={`/technical/editTechnicalDetails/${row?.original?._id}`}>
//             <TooltipCommon text="Edit Technical">
//               <Button className="bg-transparent hover:bg-transparent">
//                 <Pencil2Icon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
//               </Button>
//             </TooltipCommon>
//           </Link>
//         );
//       }
//     }
//     return null;
//   };

//   const renderDeleteModel = (row: any) => {
//     if (row?.original) {
//       if (Object.keys(row?.original).some((item) => item === "orderType")) {
//         return (
//           <TooltipCommon text="Delete Order">
//             <Button className="bg-transparent hover:bg-transparent">
//               <DeleteDialoge
//                 id={row.original._id}
//                 entity="orders"
//                 fetchAllFunction={fetchAllOrdersData}
//               />
//             </Button>
//           </TooltipCommon>
//         );
//       }
//       if (Object.keys(row?.original).some((item) => item === "lead_type")) {
//         return (
//           <TooltipCommon text="Delete Leads">
//             <Button className="bg-transparent hover:bg-transparent">
//               <DeleteDialoge
//                 id={row.original._id}
//                 entity="leads"
//                 fetchAllFunction={fetchAllLeadData}
//               />
//             </Button>
//           </TooltipCommon>
//         );
//       }
//       if (Object.keys(row?.original).some((item) => item === "customerNo")) {
//         return (
//           <TooltipCommon text="Delete Customer">
//             <Button className="bg-transparent hover:bg-transparent">
//               <DeleteDialoge
//                 id={row.original._id}
//                 entity="customers"
//                 fetchAllFunction={fetchAllCustomerData}
//               />
//             </Button>
//           </TooltipCommon>
//         );
//       }
//       if (Object.keys(row?.original).some((item) => item === "password")) {
//         return (
//           <TooltipCommon text="Delete User">
//             <Button className="bg-transparent hover:bg-transparent">
//               <DeleteDialoge
//                 id={row.original._id}
//                 entity="users"
//                 fetchAllFunction={fetchUsersData}
//               />
//             </Button>
//           </TooltipCommon>
//         );
//       }
//       if (
//         Object.keys(row?.original).some((item) => item === "customer_status")
//       ) {
//         return (
//           <TooltipCommon text="Delete Amendment">
//             <Button className="bg-transparent hover:bg-transparent">
//               <DeleteDialoge
//                 id={row.original._id}
//                 entity="amendments"
//                 fetchAllFunction={fetchAmendmentData}
//               />
//             </Button>
//           </TooltipCommon>
//         );
//       }
//       if (Object.keys(row?.original).some((item) => item === "technicalTask")) {
//         return (
//           <TooltipCommon text="Delete Technical Tracker">
//             <Button className="bg-transparent hover:bg-transparent">
//               <DeleteDialoge
//                 id={row.original._id}
//                 entity="technicaltracker"
//                 fetchAllFunction={fetchTechnicalData}
//               />
//             </Button>
//           </TooltipCommon>
//         );
//       }

//       return null;
//     }
//   };

//   const renderInvoiceSendMailModel = (row: any) => {
//     if (row?.original && row?.original) {
//       if (Object.keys(row?.original).some((item) => item === "orderType")) {
//         return (
//           <TooltipCommon text="Send Mail">
//             <Button className="bg-transparent hover:bg-transparent">
//               {/* <InvoiceSendMailDialoge
//                 id={row.original._id}
//                 customerEmail={row.original.customer?.customerEmail}
//               /> */}
//             </Button>
//           </TooltipCommon>
//         );
//       }

//       return null;
//     }
//   };

//   const renderGenerateInvoice = (row: any) => {
//     if (row?.original && row?.original) {
//       if (Object.keys(row?.original).some((item) => item === "orderType")) {
//         return (
//           <TooltipCommon text="Generate Invoice">
//             <Button className="bg-transparent hover:bg-transparent">
//               {/* <GenerateInvoiceDialoge
//                 id={row.original._id}
//                 orderNo={row.original.orderNo}
//               /> */}
//             </Button>
//           </TooltipCommon>
//         );
//       }
//     }
//     return null;
//   };

//   const renderPreviewInvoiceModel = (row: any) => {
//     if (row?.original?.vatInvoice && row?.original?.vatInvoice) {
//       if (Object.keys(row?.original).some((item) => item === "orderType")) {
//         return (
//           <TooltipCommon text="Preview Invoice">
//             <Button className="bg-transparent hover:bg-transparent">
//               {/* <InvoiceDialoge
//                 id={row.original._id}
//                 Invoice={row.original.vatInvoice}
//               /> */}
//             </Button>
//           </TooltipCommon>
//         );
//       }
//     }
//     return null;
//   };

//   const renderChat = (row: any) => {
//     if (row?.original && row?.original) {
//       if (Object.keys(row?.original).some((item) => item === "lead_type")) {
//         return (
//           <TooltipCommon text="chat">
//             <Button className="bg-transparent hover:bg-transparent">
//               <ChatModel
//                 id={row.original._id}
//                 length={row.original.updates.length}
//               />

//               <ChatBubbleIcon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-white " />
//             </Button>
//           </TooltipCommon>
//         );
//       }
//     }

//     return null;
//   };

//   return (
//     <div className="flex">
//       {Object.keys(row?.original).some(
//         (item) => item === "orderType"
//       ) ? null : (
//         <>
//           {renderShowMoreModal(row)}
//           {renderEditModal(row)}
//           {renderDeleteModel(row)}
//           {/* {renderChat(row)} */}
//         </>
//       )}

//       {renderInvoiceSendMailModel(row)}

//       {/* {renderPreviewInvoiceModel(row) } */}
//       {renderPreviewInvoiceModel(row) ? (
//         renderPreviewInvoiceModel(row)
//       ) : (
//         <div className="" style={{ width: "56px" }}></div>
//       )}

//       {renderGenerateInvoice(row)}

//       <div>
//         {Object.keys(row?.original).some((item) => item === "orderType") && (
//           <DropdownMenu modal={false}>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
//               >
//                 <DotsVerticalIcon className="h-4 w-4" />
//                 <span className="sr-only">Open menu</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-[190px]">
//               {/* Show More Dialoge  */}
//               <DropdownMenuItem
//                 className="cursor-pointer"
//                 onSelect={(e) => {
//                   e.preventDefault();
//                 }}
//               >
//                 {renderShowMoreModal(row)} Show More
//                 {/* <Button className="w-[90px]">Show More</Button> */}
//               </DropdownMenuItem>

//               {/* Edit Dialoge  */}

//               <DropdownMenuItem
//                 className="cursor-pointer"
//                 onSelect={(e) => {
//                   e.preventDefault();
//                 }}
//               >
//                 {renderEditModal(row)} Edit
//               </DropdownMenuItem>
//               {/* Delete Dialoge */}
//               <DropdownMenuItem
//                 className="cursor-pointer"
//                 onSelect={(e) => {
//                   e.preventDefault();
//                 }}
//               >
//                 {renderDeleteModel(row)} Delete
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import {
  ChatBubbleIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import Link from "next/link";
import TooltipCommon from "./TooltipCommon";
import AddLeadDialoge from "../Leads/components/AddLeadDialoge";

import { useOrderStore } from "@/Store/OrderStore";
import { useLeadStore } from "@/Store/LeadStore";
import { useCustomerStore } from "@/Store/CustomerStore";
import { useUserStore } from "@/Store/UserStore";

import DeleteDialoge from "../Orders/components/DeleteDialoge";
import { useAmendmentStore } from "@/Store/AmendmentStore";
// import InvoiceDialoge from "../customers/components/InvoiceDialoge";
import InvoiceDialoge from "../Orders/components/InvoiceDialoge";
import InvoiceSendMailDialoge from "../Orders/components/InvoiceSendMailDialoge";
import GenerateInvoiceDialoge from "../Orders/components/GenerateInvoiceDialoge";
import PageHeader from "./PageHeader";
import CustomerDetailsContent from "../customers/components/CustomerDetailsContent";
// import { Chat } from "../customers/components/Chat";
// import ChatModel from "../Orders/components/ChatModel";
import { useTechnicalStore } from "@/Store/TechnicalStore";
import { useProductflowStore } from "@/Store/ProductFlowStore";
import { useCopywriterStore } from "@/Store/CopywriterStore";
import { useWebsiteContentStore } from "@/Store/WebsiteContentStore";
import { useEmployeeLeaveStore } from "@/Store/EmployeeLeaveStore";

interface DataTableRowActionsProps<TData extends { orderType?: any }> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends { orderType?: any }>({
  row,
}: DataTableRowActionsProps<TData>) {
  // console.log(row.original,"row")
  let userDataString: any =
    typeof window !== "undefined" ? localStorage?.getItem("user") : null;
  const userData2 = JSON.parse(userDataString);
  const userRole = userData2?.role;

  const { fetchAllOrdersData }: any = useOrderStore();
  const { fetchAllLeadData }: any = useLeadStore();
  const { fetchAllCustomerData }: any = useCustomerStore();
  const { fetchAmendmentData }: any = useAmendmentStore();
  const { fetchTechnicalData }: any = useTechnicalStore();
  const { fetchProductFlowData }: any = useProductflowStore();
  const { fetchUsersData }: any = useUserStore();
  const { fetchCopywriterData }: any = useCopywriterStore();
  const { fetchWebsiteContentData }: any = useWebsiteContentStore();
  const { fetchEmployeeLeaveData }: any = useEmployeeLeaveStore();

  // Conditional Rendering
  const renderShowMoreModal = (row: any) => {
    if (row?.original) {
      if (Object.keys(row?.original).some((item) => item === "password")) {
        return (
          <Link href={`/users/userDetails/${row?.original?._id}`}>
            <TooltipCommon text="Show More">
              <Button className="bg-transparent hover:bg-transparent">
                <DotsHorizontalIcon className="h-5 w-6 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
              </Button>
            </TooltipCommon>
          </Link>
        );
      }

      if (Object.keys(row?.original).some((item) => item === "customerNo")) {
        return (
          <Link href={`/customers/customerDetails/${row?.original?._id}`}>
            <TooltipCommon text="Amendments">
              <Button className="bg-transparent hover:bg-transparent">
                <DotsHorizontalIcon className="h-5 w-6 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
              </Button>
            </TooltipCommon>
          </Link>
        );
      }

      if (Object.keys(row?.original).some((item) => item === "lead_type")) {
        return (
          <Link href={`/leads/leadsDetails/${row?.original?._id}`}>
            <TooltipCommon text="Show More">
              <Button className="bg-transparent hover:bg-transparent">
                <DotsHorizontalIcon className="h-5 w-6 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
              </Button>
            </TooltipCommon>
          </Link>
        );
      }

      if (Object.keys(row?.original).some((item) => item === "orderType")) {
        return (
          <Link href={`/orders/orderDetails/${row?.original?._id}`}>
            {/* <TooltipCommon text="Show More"> */}
            <Button className="bg-transparent hover:bg-transparent">
              <DotsHorizontalIcon className="h-6 w-6 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
              <span className="text-black pl-4">Show More</span>
            </Button>
            {/* </TooltipCommon> */}
          </Link>
        );
      }
    }
    return null;
  };
  const renderEditModal = (row: any) => {
    if (row?.original) {
      if (Object.keys(row?.original).some((item) => item === "password")) {
        return (
          <Link href={`/users/editUserDetails/${row?.original?._id}`}>
            <TooltipCommon text="Edit User">
              <Button className="bg-transparent hover:bg-transparent">
                <Pencil2Icon className="h-6 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
              </Button>
            </TooltipCommon>
          </Link>
        );
      }
      if (
        Object.keys(row?.original).some((item) => item === "demoCompletedDate")
      ) {
        return (
          <Link href={`/productFlow/editProductFlow/${row?.original?._id}`}>
            <TooltipCommon text="Edit Product Flow">
              <Button className="bg-transparent hover:bg-transparent">
                <Pencil2Icon className="h-6 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
              </Button>
            </TooltipCommon>
          </Link>
        );
      }

      if (Object.keys(row?.original).some((item) => item === "lead_type")) {
        return (
          <Link href={`/leads/editLead/${row?.original?._id}`}>
            <TooltipCommon text="Edit Lead">
              <Button className="bg-transparent hover:bg-transparent">
                <Pencil2Icon className="h-6 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
              </Button>
            </TooltipCommon>
          </Link>
        );
      }
      // if (Object.keys(row?.original).some((item) => item === "customerNo")) {
      //   return (
      //     <Link href={`/customers/editCustomerDetails/${row?.original?._id}`}>
      //       <TooltipCommon text="Edit Customer">
      //         <Button className="bg-transparent hover:bg-transparent">
      //           <Pencil2Icon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
      //         </Button>
      //       </TooltipCommon>
      //     </Link>
      //   );
      // }
      if (Object.keys(row?.original).some((item) => item === "orderType")) {
        return (
          <Link href={`/orders/editOrder/${row?.original?._id}`}>
            {/* <TooltipCommon text="Edit Order"> */}
            <Button className="bg-transparent hover:bg-transparent">
              <Pencil2Icon className="h-6 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
              <span className="text-black pl-4">Edit</span>
            </Button>
            {/* </TooltipCommon> */}
          </Link>
        );
      }
      if (
        Object.keys(row?.original).some((item) => item === "customer_status")
      ) {
        return (
          <Link href={`/amendment/editAmendmentDetails/${row?.original?._id}`}>
            <TooltipCommon text="Edit Amendment">
              <Button className="bg-transparent hover:bg-transparent">
                <Pencil2Icon className="h-6 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
              </Button>
            </TooltipCommon>
          </Link>
        );
      }

      if (Object.keys(row?.original).some((item) => item === "technicalTask")) {
        return (
          <Link href={`/technical/editTechnicalDetails/${row?.original?._id}`}>
            <TooltipCommon text="Edit Technical">
              <Button className="bg-transparent hover:bg-transparent">
                <Pencil2Icon className="h-6 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
              </Button>
            </TooltipCommon>
          </Link>
        );
      }
      if (Object.keys(row?.original).some((item) => item === "dateComplete")) {
        return (
          <Link href={`/copywriter/editCopywriter/${row?.original?._id}`}>
            <TooltipCommon text="Edit Copywriter">
              <Button className="bg-transparent hover:bg-transparent">
                <Pencil2Icon className="h-6 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
              </Button>
            </TooltipCommon>
          </Link>
        );
      }
      if (Object.keys(row?.original).some((item) => item === "blogToBeAdded")) {
        return (
          <Link
            href={`/websiteContent/editWebsiteContent/${row?.original?._id}`}
          >
            <TooltipCommon text="Edit New Website Content">
              <Button className="bg-transparent hover:bg-transparent">
                <Pencil2Icon className="h-6 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
              </Button>
            </TooltipCommon>
          </Link>
        );
      }

      if (userRole === "admin") {
        if (Object.keys(row?.original).some((item) => item === "leaveType")) {
          return (
            <Link
              href={`/employeeLeaveManagement/editEmployeeLeave/${row?.original?._id}`}
            >
              <TooltipCommon text="Edit Employee Leave">
                <Button className="bg-transparent hover:bg-transparent">
                  <Pencil2Icon className="h-6 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
                </Button>
              </TooltipCommon>
            </Link>
          );
        }
      }
    }
    return null;
  };

  const renderDeleteModel = (row: any) => {
    if (row?.original) {
      if (Object.keys(row?.original).some((item) => item === "orderType")) {
        return (
          // <TooltipCommon text="Delete Order">
          <Button className="bg-transparent hover:bg-transparent">
            <DeleteDialoge
              id={row.original._id}
              entity="orders"
              fetchAllFunction={fetchAllOrdersData}
              deleteText="Delete"
            />
            {/* <span className="text-black pl-2">Delete</span> */}
          </Button>
          // </TooltipCommon>
        );
      }
      if (Object.keys(row?.original).some((item) => item === "lead_type")) {
        return (
          <TooltipCommon text="Delete Leads">
            <Button className="bg-transparent hover:bg-transparent">
              <DeleteDialoge
                id={row.original._id}
                entity="leads"
                fetchAllFunction={fetchAllLeadData}
                deleteText=""
              />
            </Button>
          </TooltipCommon>
        );
      }
      if (Object.keys(row?.original).some((item) => item === "customerNo")) {
        return (
          <TooltipCommon text="Delete Customer">
            <Button className="bg-transparent hover:bg-transparent">
              <DeleteDialoge
                id={row.original._id}
                entity="customers"
                fetchAllFunction={fetchAllCustomerData}
                deleteText=""
              />
            </Button>
          </TooltipCommon>
        );
      }
      if (Object.keys(row?.original).some((item) => item === "password")) {
        return (
          <TooltipCommon text="Delete User">
            <Button className="bg-transparent hover:bg-transparent">
              <DeleteDialoge
                id={row.original._id}
                entity="users"
                fetchAllFunction={fetchUsersData}
                deleteText=""
              />
            </Button>
          </TooltipCommon>
        );
      }
      if (
        Object.keys(row?.original).some((item) => item === "customer_status")
      ) {
        return (
          <TooltipCommon text="Delete Amendment">
            <Button className="bg-transparent hover:bg-transparent">
              <DeleteDialoge
                id={row.original._id}
                entity="amendments"
                fetchAllFunction={fetchAmendmentData}
                deleteText=""
              />
            </Button>
          </TooltipCommon>
        );
      }
      if (Object.keys(row?.original).some((item) => item === "technicalTask")) {
        return (
          <TooltipCommon text="Delete Technical Tracker">
            <Button className="bg-transparent hover:bg-transparent">
              <DeleteDialoge
                id={row.original._id}
                entity="technicaltrackers"
                fetchAllFunction={fetchTechnicalData}
                deleteText=""
              />
            </Button>
          </TooltipCommon>
        );
      }
      if (
        Object.keys(row?.original).some((item) => item === "demoCompletedDate")
      ) {
        return (
          <TooltipCommon text="Delete Product Flow">
            <Button className="bg-transparent hover:bg-transparent">
              <DeleteDialoge
                id={row.original._id}
                entity="productFlows"
                fetchAllFunction={fetchProductFlowData}
                deleteText=""
              />
            </Button>
          </TooltipCommon>
        );
      }
      if (Object.keys(row?.original).some((item) => item === "dateComplete")) {
        return (
          <TooltipCommon text="Delete Copywriter">
            <Button className="bg-transparent hover:bg-transparent">
              <DeleteDialoge
                id={row.original._id}
                entity="copywritertrackers"
                fetchAllFunction={fetchCopywriterData}
                deleteText=""
              />
            </Button>
          </TooltipCommon>
        );
      }
      if (Object.keys(row?.original).some((item) => item === "blogToBeAdded")) {
        return (
          <TooltipCommon text="Delete website Content">
            <Button className="bg-transparent hover:bg-transparent">
              <DeleteDialoge
                id={row.original._id}
                entity="newwebsite"
                fetchAllFunction={fetchWebsiteContentData}
                deleteText=""
              />
            </Button>
          </TooltipCommon>
        );
      }

      if (userRole === "admin") {
        if (Object.keys(row?.original).some((item) => item === "leaveType")) {
          return (
            <TooltipCommon text="Delete Employee Leave">
              <Button className="bg-transparent hover:bg-transparent">
                <DeleteDialoge
                  id={row.original._id}
                  entity="leaves"
                  fetchAllFunction={fetchEmployeeLeaveData}
                  deleteText=""
                />
              </Button>
            </TooltipCommon>
          );
        }
      }

      return null;
    }
  };

  const renderInvoiceSendMailModel = (row: any) => {
    if (row?.original && row?.original) {
      if (Object.keys(row?.original).some((item) => item === "orderType")) {
        return (
          <TooltipCommon text="Send Mail">
            <Button className="bg-transparent hover:bg-transparent">
              <InvoiceSendMailDialoge
                id={row.original._id}
                customerEmail={row.original.customer?.customerEmail}
                dateOfOrder={row?.original?.dateOfOrder}
              />
            </Button>
          </TooltipCommon>
        );
      }

      return null;
    }
  };

  const renderGenerateInvoice = (row: any) => {
    if (row?.original && row?.original) {
      if (Object.keys(row?.original).some((item) => item === "orderType")) {
        return (
          <TooltipCommon text="Generate Invoice">
            <Button className="bg-transparent hover:bg-transparent">
              <GenerateInvoiceDialoge
                id={row.original._id}
                orderNo={row?.original?.orderNo}
                dateOfOrder={row?.original?.dateOfOrder}
              />
            </Button>
          </TooltipCommon>
        );
      }
    }
    return null;
  };

  const renderPreviewInvoiceModel = (row: any) => {
    if (row?.original?.vatInvoice && row?.original?.vatInvoice) {
      if (Object.keys(row?.original).some((item) => item === "orderType")) {
        return (
          <TooltipCommon text="Preview Invoice">
            <Button className="bg-transparent hover:bg-transparent">
              <InvoiceDialoge
                id={row.original._id}
                Invoice={row.original.vatInvoice}
              />
            </Button>
          </TooltipCommon>
        );
      }
    }
    return null;
  };

  //   const renderChat = (row: any) => {
  //   if (row?.original && row?.original) {
  //     if (Object.keys(row?.original).some((item) => item === "orderType")) {
  //       return (
  //         <TooltipCommon text="chat">
  //           <Button className="bg-transparent hover:bg-transparent">
  //            <ChatModel id={row.original._id} length={row.original.updates.length}/>

  //             {/* <ChatBubbleIcon className="h-7 w-7 p-1 hover:bg-[#29354f] text-black hover:text-white " /> */}
  //           </Button>
  //         </TooltipCommon>
  //       );
  //     }
  //   }

  //   return null;
  // };

  return (
    <div className="flex items-center">
      {Object.keys(row?.original).some(
        (item) => item === "orderType"
      ) ? null : (
        <>
          {renderShowMoreModal(row)}
          {renderEditModal(row)}
          {renderDeleteModel(row)}
        </>
      )}

      {renderInvoiceSendMailModel(row)}

      {renderPreviewInvoiceModel(row) ? (
        renderPreviewInvoiceModel(row)
      ) : Object.keys(row?.original).some((item) => item === "orderType") ? (
        <div className="mx-[27px]">-</div>
      ) : null}

      {renderGenerateInvoice(row)}

      <div>
        {Object.keys(row?.original).some((item) => item === "orderType") && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsVerticalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[190px]">
              {/* Show More Dialoge  */}
              <DropdownMenuItem
                className="cursor-pointer py-0"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                {renderShowMoreModal(row)}
              </DropdownMenuItem>
              {/* Edit Dialoge  */}
              <DropdownMenuItem
                className="cursor-pointer py-0"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                {renderEditModal(row)}
              </DropdownMenuItem>
              {/* Delete Dialoge */}
              <DropdownMenuItem
                className="cursor-pointer py-0"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                {renderDeleteModel(row)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
