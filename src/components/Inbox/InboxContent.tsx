import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import User from "../../asset/images/user.png";
import { timeAgo } from "@/common/commonFunctions";
import { useNotificationStore } from "@/Store/NotificationStore";
import {
  Select as Selector,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddDialoge from "./AddDialoge";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
// import { columns } from "./components/columns";
// import { DataTable } from "../common/data-table";
import { DataTable } from "../common/data-table";
import { columns } from "./columns";
import SideDrawer from "../common/Editor/SideDrawer";
import DeleteDialoge from "../Orders/components/DeleteDialoge";

const UserPic = User.src;

const InboxContent: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const router = useRouter();

  const [notificationTriggered, setNotificationTriggered] = useState(false);

  const {
    fetchNotificationData,
    notificationData,
    fetchSingleNotificationData,
    notificationSingleData,
    fetchSingleReadNotificationData,
    notificationReadData,
    loading,
  } = useNotificationStore();

  const singleNotificationfecthHandler = async (notificationId: string) => {
    await fetchSingleNotificationData(notificationId);
    await fetchSingleReadNotificationData(notificationId);
    setNotificationTriggered(true);
  };

  // useEffect(() => {
  //   if (notificationTriggered) {
  //     if (
  //       notificationSingleData &&
  //       Object.keys(notificationSingleData).length > 0
  //     ) {
  //       const itemType = notificationSingleData?.itemType;

  //       const queryData = { id: notificationSingleData?.item };
  //       const queryString = new URLSearchParams(queryData).toString();
  //       const idValue = queryString.split("=")[1];

  //       if (itemType === "Amendment") {
  //         router.push(`/amendment?id=${notificationSingleData?.item}`);
  //         // router.push(`/amendment`);
  //       } else if (itemType === "Customer") {
  //         router.push(`/customers`);
  //         router.push(`/customers?id=${notificationSingleData?.item}`);
  //       } else if (itemType === "Order") {
  //         router.push(`/orders`);
  //       } else if (itemType === "Lead") {
  //         router.push(`/leads`);
  //       } else if (itemType === "NewWebsiteContent") {
  //         router.push(`/websiteContent`);
  //       } else if (itemType === "CopywriterTracker") {
  //         router.push(`/copywriter`);
  //       } else if (itemType === "TechnicalTracker") {
  //         router.push(`/technical`);
  //       } else if (itemType === "ProductFlow") {
  //         router.push(`/productFlow`);
  //       }
  //     }

  //     setNotificationTriggered(false);
  //   }
  // }, [notificationTriggered, notificationSingleData]);

  useEffect(() => {
    fetchNotificationData();
  }, [notificationReadData]);
  useEffect(() => {
    fetchNotificationData();
  }, []);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    if (
      notificationData === "Invalid refresh token" ||
      notificationData === "User not found" ||
      notificationData === "Invalid User Access Token" ||
      notificationData === "Invalid access token" ||
      notificationData === "Unauthorized request: No access or refresh token"
    ) {
      router.push("/auth/login");
    } else {
    setLoader(false);
    setNotificationList(
      notificationData?.notifications
        ? notificationData.notifications || []
        : []
    );
    }
  }, [notificationData, router]);
  const searchParams = useSearchParams();
  const queryParams = searchParams.get("id");
  const pathname = usePathname();
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialLimit = Number(searchParams.get("limit")) || 20;
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const onPageChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", newPage.toString());
    params.set("limit", newLimit.toString());

    router.push(`${pathname}?${params.toString()}`);
  };
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [notificationList, setNotificationList] = useState<any>([]);
  const data = useMemo(() => notificationList, [notificationList]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );




  const tableInstance = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter: filtering,
      columnFilters,
    },
    onGlobalFilterChange: setFiltering,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <div className="md:flex justify-center sm:justify-end my-2 px-4">
        <AddDialoge />
      </div>
      {/* <div className="px-4 py-0 relative">
        <DataTable
        
          text=""
          queryParams={queryParams ? queryParams : ""}
          columns={columns}
          tableInstance={tableInstance}
          loading={loading}
        />
      </div> */}
      <div className="px-4 py-0 relative">
        <Table className="shadow-md rounded-lg border border-gray-300 ">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-sm font-semibold text-white py-3">
                Assigned By
              </TableHead>
              <TableHead className="text-sm font-semibold text-white py-3">
                Message
              </TableHead>
              <TableHead className="text-sm font-semibold text-white py-3 ">
                Update
              </TableHead>
              <TableHead className="text-sm font-semibold text-white py-3">
   
                Time
              </TableHead>
              <TableHead className="text-sm font-semibold text-white py-3 text-right">
                Delete
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {notificationData?.notifications?.length > 0 ? (
              notificationData.notifications.map((notification: any) => (
                <TableRow
                  key={notification._id}
                  onClick={() =>
                    singleNotificationfecthHandler(notification?._id)
                  }
                  className={`${
                    notification?.isRead
                      ? "bg-white text-gray-700 hover:bg-gray-50"
                      : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                  } transition-all duration-300 ease-in-out cursor-pointer`}
                >
                  <TableCell className="font-semibold text-sm text-gray-800 py-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="cursor-pointer rounded-full shadow-md w-8 h-8">
                        <AvatarImage
                          src={notification?.assignedBy?.avatar || UserPic}
                        />
                        <AvatarFallback>
                          <img
                            src={UserPic}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                          />
                        </AvatarFallback>
                      </Avatar>
                      {notification?.assignedBy?.fullName && (
                        <span className="text-md font-medium text-black">
                          {notification?.assignedBy?.fullName}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-left text-sm text-black py-4">
                    <div className="font-semibold">
                      {/* {notification?.mentionedUsers && (
                        <span className="text-[#1f76c2] text-xs">
                          {notification.mentionedUsers
                            .map((mention: any) => `@${mention?.fullName}`)
                            .join(", ")}
                        </span>
                      )}{" "}
                      {""} */}
                      {notification.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {notification.message}
                    </div>
                  </TableCell>

                  <TableCell className="text-right text-sm text-muted-foreground py-4">
                    <span className="text-[0.8rem]">
                      <SideDrawer
                        length={notification?.updates?.length || 0}
                        {...{
                          amendmentId:
                            notification.itemType === "Amendment"
                              ? notification.item?._id
                              : undefined,
                          userId:
                            notification.itemType === "User"
                              ? notification.item?._id
                              : undefined,

                          technicalId:
                            notification.itemType === "TechnicalTracker"
                              ? notification.item?._id
                              : undefined,
                          orderId:
                            notification.itemType === "Order"
                              ? notification.item?._id
                              : undefined,
                          leadId:
                            notification.itemType === "Lead"
                              ? notification.item?._id
                              : undefined,
                          productFlowId:
                            notification.itemType === "ProductFlow"
                              ? notification.item?._id
                              : undefined,
                          websiteContentId:
                            notification.itemType === "WebsiteContent"
                              ? notification.item?._id
                              : undefined,
                          copywriterId:
                            notification.itemType === "Copywriter"
                              ? notification.item?._id
                              : undefined,
                        }}
                      />
                    </span>
                  </TableCell>
              
                  <TableCell className="text-left text-sm text-muted-foreground py-4">
                    <span className="text-[0.8rem]">
                      {timeAgo(notification.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground py-4">
                    <span className="text-[0.8rem]">
                      <DeleteDialoge
                        id={notification._id}
                        entity="notifications"
                        // setIsModalOpen={setIsModalOpen}
                        // setIsCommentOpen={setIsCommentOpen}
                        fetchAllFunction={() => fetchNotificationData()}
                        // deleteText="Delete Notification"
                      />
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center font-semibold text-lg text-gray-500 py-4"
                >
                  No Notifications Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter></TableFooter>
        </Table>
      </div>
    </>
  );
};

export default InboxContent;

// import React, { useEffect, useMemo, useState } from "react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "../ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import User from "../../asset/images/user.png";
// import { timeAgo } from "@/common/commonFunctions";
// import { useNotificationStore } from "@/Store/NotificationStore";

// import {
//   Select as Selector,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import SideDrawer from "../common/Editor/SideDrawer";
// const UserPic = User.src;

// const InboxContent: React.FC = () => {
//   const [open, setOpen] = useState<boolean>(true);
//   const router = useRouter();

//   const [notificationTriggered, setNotificationTriggered] = useState(false);

//   const {
//     fetchNotificationData,
//     notificationData,
//     fetchSingleNotificationData,
//     notificationSingleData,
//     fetchSingleReadNotificationData,
//     notificationReadData,
//   } = useNotificationStore();

//   useEffect(() => {
//     fetchNotificationData();
//   }, []);

//   const singleNotificationfecthHandler = async (notificationId: string) => {
//     {console.log("notification?._id",notificationId)}
//     await fetchSingleNotificationData(notificationId);
//     await fetchSingleReadNotificationData(notificationId);
//     setNotificationTriggered(true);
//   };

//   // useEffect(() => {
//   //   if (notificationTriggered) {
//   //     if (
//   //       notificationSingleData &&
//   //       Object.keys(notificationSingleData).length > 0
//   //     ) {
//   //       const itemType = notificationSingleData?.itemType;

//   //       const queryData = { id: notificationSingleData?.item };
//   //       const queryString = new URLSearchParams(queryData).toString();
//   //       const idValue = queryString.split("=")[1]

//   //       if (itemType === "Amendment") {
//   //         router.push(`/amendment`);

//   //       } else if (itemType === "Customer") {
//   //         router.push(`/customers`);
//   //       } else if (itemType === "Order") {
//   //         router.push(`/orders`);
//   //       } else if (itemType === "Lead") {
//   //         router.push(`/leads`);
//   //       } else if (itemType === "NewWebsiteContent") {
//   //         router.push(`/websiteContent`);
//   //       } else if (itemType === "CopywriterTracker") {
//   //         router.push(`/copywriter`);
//   //       } else if (itemType === "TechnicalTracker") {
//   //         router.push(`/technical`);
//   //       } else if (itemType === "ProductFlow") {
//   //         router.push(`/productFlow`);
//   //       }

//   //     }

//   //     setNotificationTriggered(false);
//   //   }
//   // }, [notificationTriggered, notificationSingleData]);

//  const [selectedNotification, setSelectedNotification] = useState<any>(null);
// // console.log("notificationSingleData",notificationSingleData)
// const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [amendmentId, setAmendmentId] = useState<string | null>(null);
//   useEffect(() => {
//     if (notificationTriggered && notificationSingleData) {
//       const { itemType, item, updateId } = notificationSingleData;
//       setSelectedNotification(notificationSingleData); // Store the selected notification

//       // Handle "Amendment" type
//       if (itemType === "Amendment") {
//         setAmendmentId(item); // Store the amendment ID

//         // Navigate to the amendment page with the ID, and add a query parameter to trigger side drawer
//         router.push(`/amendment?id=${item}`);
//       } else {
//         // Handle other item types and navigate accordingly
//         if (itemType === "Customer") router.push("/customers");
//         else if (itemType === "Order") router.push("/orders");
//         else if (itemType === "Lead") router.push("/leads");
//         else if (itemType === "NewWebsiteContent") router.push("/websiteContent");
//         else if (itemType === "CopywriterTracker") router.push("/copywriter");
//         else if (itemType === "TechnicalTracker") router.push("/technical");
//         else if (itemType === "ProductFlow") router.push("/productFlow");
//       }

//       setNotificationTriggered(false); // Reset notification triggered flag
//     }
//   }, [notificationTriggered, notificationSingleData]);

//   // Inside your SideDrawer or the relevant component page where the side drawer is used
//   const [openSideDrawer, setOpenSideDrawer] = useState(false);

//   // useEffect(() => {
//   //   // Make sure `router.query` is not undefined before accessing `openSideDrawer`
//   //   if (router.query && router.query.openSideDrawer === "true") {
//   //     setOpenSideDrawer(true); // Open the side drawer automatically
//   //   }
//   // }, [router.query]);
//   // useEffect(() => {
//   //   fetchNotificationData();
//   // }, [notificationReadData]);
//   const searchParams = useSearchParams();
//   const queryParams = searchParams.get("id");
//   const pathname = usePathname();
//   const initialPage = Number(searchParams.get("page")) || 1;
//   const initialLimit = Number(searchParams.get("limit")) || 20;
//   const [page, setPage] = useState(initialPage);
//   const [limit, setLimit] = useState(initialLimit);
//   const [totalPages, setTotalPages] = useState(1);
//   const onPageChange = (newPage: number, newLimit: number) => {
//     setPage(newPage);
//     const params = new URLSearchParams(searchParams.toString()); // ✅ Convert to string first

//     params.set("page", newPage.toString());
//     params.set("limit", newLimit.toString());

//     router.push(`${pathname}?${params.toString()}`);
//   };
//   return (
//     <div className="px-4 py-0 relative">
//       {openSideDrawer && (
//       <SideDrawer
//       openSideDrawer2 ={true}
//         // orderId={orderId}
//         amendmentId={amendmentId}
//         // length={length}
//         // setIsOpenReplyModel={setIsOpenReplyModel}
//         // customerId={customerId}
//         // productFlowId={productFlowId}
//         // updateId={updateId}
//         // customerName={customerName}
//         // technicalId={technicalId}
//         // copywriterId={copywriterId}
//         // websiteContentId={websiteContentId}
//         // invoice={invoice}
//       />
//     )}
//       <Table className="shadow-md rounded-lg border border-gray-300 ">
//         <TableHeader>
//           <TableRow className="bg-gray-100">
//             <TableHead className="text-sm font-semibold text-white py-3">
//               Assigned By
//             </TableHead>
//             <TableHead className="text-sm font-semibold text-white py-3">
//               Message
//             </TableHead>
//             <TableHead className="text-sm font-semibold text-white py-3 text-right">
//               Time
//             </TableHead>
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {notificationData?.notifications?.length > 0 ? (
//             notificationData.notifications.map((notification: any) => (
//               <TableRow
//                 key={notification._id}
//                 onClick={() =>
//                   singleNotificationfecthHandler(notification?._id)
//                 }

//                 className={`${
//                   notification?.isRead
//                     ? "bg-white text-gray-700 hover:bg-gray-50"
//                     : "bg-blue-50 text-blue-800 hover:bg-blue-100"
//                 } transition-all duration-300 ease-in-out cursor-pointer`}
//               >
//                 {/* Avatar and Assigned To */}
//                 <TableCell className="font-semibold text-sm text-gray-800 py-4">
//                   <div className="flex items-center space-x-2">
//                     <Avatar className="cursor-pointer rounded-full shadow-md w-8 h-8">
//                       <AvatarImage
//                         src={notification?.assignedBy?.avatar || UserPic}
//                       />
//                       <AvatarFallback>
//                         <img
//                           src={UserPic}
//                           alt="User Avatar"
//                           className="w-full h-full object-cover"
//                         />
//                       </AvatarFallback>
//                     </Avatar>
//                     {notification?.assignedBy?.fullName && (
//                       <span className="text-md font-medium text-black">
//                         {notification?.assignedBy?.fullName}
//                       </span>
//                     )}
//                   </div>
//                 </TableCell>

//                 {/* Title and Message */}
//                 <TableCell className="text-left text-sm text-black py-4">
//                   <div className="font-semibold">
//                     {notification?.mentionedUsers && (
//                       <span className="text-[#1f76c2] text-xs">
//                         {notification.mentionedUsers
//                           .map((mention: any) => `@${mention?.fullName}`)
//                           .join(", ")}
//                       </span>
//                     )}{" "}
//                     {""}
//                     {notification.title}
//                   </div>
//                   <div className="text-xs text-gray-600">
//                     {notification.message}
//                   </div>
//                 </TableCell>

//                 {/* Time */}
//                 <TableCell className="text-right text-sm text-muted-foreground py-4">
//                   <span className="text-[0.8rem]">
//                     {timeAgo(notification.createdAt)}
//                   </span>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell
//                 colSpan={5}
//                 className="text-center font-semibold text-lg text-gray-500 py-4"
//               >
//                 No Notifications Found
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>

//         <TableFooter>
//           {/* Optional Footer Row */}
//           {/* <TableRow>
//       <TableCell colSpan={4}>Total Notifications</TableCell>
//       <TableCell className="text-right">{notificationData?.notifications?.length || 0}</TableCell>
//     </TableRow> */}
//         </TableFooter>
//       </Table>
//       {/* {isSidebarOpen && amendmentId && (
//         <SideDrawer amendmentId={amendmentId} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
//       )} */}

//       <div className="flex justify-end mr-10 items-start gap-5">
//         <div className="flex justify-end items-center gap-2 mt-2">
//           <span className="text-sm text-[#29354f]">Rows per page:</span>
//           <Selector
//             onValueChange={(value) => setLimit(Number(value))}
//             name="rowsPerPage"
//             value={limit.toString()}
//           >
//             <SelectTrigger className="border-[#73819c] h-[28px] w-20 text-center">
//               <SelectValue placeholder="Rows" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectGroup>
//                 {[10, 20, 50, 100].map((option) => (
//                   <SelectItem
//                     key={option}
//                     value={option.toString()}
//                     className="text-sm"
//                   >
//                     {option}
//                   </SelectItem>
//                 ))}
//               </SelectGroup>
//             </SelectContent>
//           </Selector>
//         </div>
//         <div className="flex justify-center items-center space-x-2 mt-3 ">
//           <div className="w-full text-center text-[0.8rem]  text-[#29354f]">{`Page ${page} of ${totalPages}`}</div>
//         </div>
//         <div className="flex justify-center items-center space-x-2 mt-2">
//           {/* First Page */}
//           <Button
//             onClick={() => onPageChange(1, limit)}
//             className="px-3 py-1 bg-white border border-gray-400 hover:bg-slate-300"
//             disabled={page === 1 || notificationData?.length === 0}
//           >
//             <svg
//               width="15"
//               height="15"
//               viewBox="0 0 32 32"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fill-rule="evenodd"
//                 clip-rule="evenodd"
//                 d="M25.7071 5.29289C26.0976 5.68342 26.0976 6.31658 25.7071 6.70711L16.4142 16L25.7071 25.2929C26.0976 25.6834 26.0976 26.3166 25.7071 26.7071C25.3166 27.0976 24.6834 27.0976 24.2929 26.7071L14.2929 16.7071C13.9024 16.3166 13.9024 15.6834 14.2929 15.2929L24.2929 5.29289C24.6834 4.90237 25.3166 4.90237 25.7071 5.29289Z"
//                 fill="black"
//               />
//               <path
//                 fill-rule="evenodd"
//                 clip-rule="evenodd"
//                 d="M15.7071 5.29289C16.0976 5.68342 16.0976 6.31658 15.7071 6.70711L6.41421 16L15.7071 25.2929C16.0976 25.6834 16.0976 26.3166 15.7071 26.7071C15.3166 27.0976 14.6834 27.0976 14.2929 26.7071L4.29289 16.7071C3.90237 16.3166 3.90237 15.6834 4.29289 15.2929L14.2929 5.29289C14.6834 4.90237 15.3166 4.90237 15.7071 5.29289Z"
//                 fill="black"
//               />
//             </svg>
//           </Button>

//           {/* Previous Page */}
//           <Button
//             onClick={() => onPageChange(page - 1, limit)}
//             className="px-3 py-1 bg-white border border-gray-400 hover:bg-slate-300"
//             disabled={page === 1 || notificationData?.length === 0}
//           >
//             <svg
//               width="15"
//               height="15"
//               viewBox="0 0 32 32"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fill-rule="evenodd"
//                 clip-rule="evenodd"
//                 d="M20.7071 5.29289C21.0976 5.68342 21.0976 6.31658 20.7071 6.70711L11.4142 16L20.7071 25.2929C21.0976 25.6834 21.0976 26.3166 20.7071 26.7071C20.3166 27.0976 19.6834 27.0976 19.2929 26.7071L9.29289 16.7071C8.90237 16.3166 8.90237 15.6834 9.29289 15.2929L19.2929 5.29289C19.6834 4.90237 20.3166 4.90237 20.7071 5.29289Z"
//                 fill="black"
//               />
//             </svg>
//           </Button>

//           {/* Next Page */}
//           <Button
//             onClick={() => onPageChange(page + 1, limit)}
//             className="px-3 py-1 bg-white  border border-gray-400 hover:bg-slate-300"
//             disabled={page === totalPages || notificationData?.length === 0}
//           >
//             <svg
//               width="15"
//               height="15"
//               viewBox="0 0 32 32"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fill-rule="evenodd"
//                 clip-rule="evenodd"
//                 d="M11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289L22.7071 15.2929C23.0976 15.6834 23.0976 16.3166 22.7071 16.7071L12.7071 26.7071C12.3166 27.0976 11.6834 27.0976 11.2929 26.7071C10.9024 26.3166 10.9024 25.6834 11.2929 25.2929L20.5858 16L11.2929 6.70711C10.9024 6.31658 10.9024 5.68342 11.2929 5.29289Z"
//                 fill="black"
//               />
//             </svg>
//           </Button>

//           {/* Last Page */}
//           <Button
//             onClick={() => onPageChange(totalPages, limit)}
//             className="px-3 py-1 bg-white border border-gray-400 hover:bg-slate-300"
//             disabled={page === totalPages || notificationData?.length === 0}
//           >
//             <svg
//               width="15"
//               height="15"
//               viewBox="0 0 32 32"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fill-rule="evenodd"
//                 clip-rule="evenodd"
//                 d="M6.29289 5.29289C6.68342 4.90237 7.31658 4.90237 7.70711 5.29289L17.7071 15.2929C18.0976 15.6834 18.0976 16.3166 17.7071 16.7071L7.70711 26.7071C7.31658 27.0976 6.68342 27.0976 6.29289 26.7071C5.90237 26.3166 5.90237 25.6834 6.29289 25.2929L15.5858 16L6.29289 6.70711C5.90237 6.31658 5.90237 5.68342 6.29289 5.29289Z"
//                 fill="black"
//               />
//               <path
//                 fill-rule="evenodd"
//                 clip-rule="evenodd"
//                 d="M16.2929 5.29289C16.6834 4.90237 17.3166 4.90237 17.7071 5.29289L27.7071 15.2929C28.0976 15.6834 28.0976 16.3166 27.7071 16.7071L17.7071 26.7071C17.3166 27.0976 16.6834 27.0976 16.2929 26.7071C15.9024 26.3166 15.9024 25.6834 16.2929 25.2929L25.5858 16L16.2929 6.70711C15.9024 6.31658 15.9024 5.68342 16.2929 5.29289Z"
//                 fill="black"
//               />
//             </svg>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InboxContent;
// const [limit, setLimit] = useState(20);
// const [teamData, setTeamData] = useState([]); // Data state
// const [loadingMore, setLoadingMore] = useState(false); // Loading state for pagination
// const [hasMore, setHasMore] = useState(true); // To control if there are more pages to load
// const [page, setPage] = useState(1); // Current page for pagination

// // Fetch data on component mount
// const fetchNotificationList = async (page: number) => {
//   setLoadingMore(true); // Set loading state while fetching data
//   console.log(`Fetching data for page: ${page}`);

//   try {
//     const response = await baseInstance.get(`/customers?page=${page}&limit=${limit}`);
//     const newData = response?.data?.data?.customers || [];

//     console.log("Fetched data:", newData);

//     // Check if newData is not empty

//       setTeamData((prevData) => (page === 1 ? newData : [...prevData, ...newData]));

//     // Update `hasMore` based on response
//     const hasMore = response?.data?.data?.hasMore || false;
//     setHasMore(hasMore); // If `hasMore` is false, stop fetching
//     if (response?.data?.data?.hasMore && newData.length === 0) {
//       setPage(page + 1);
//       fetchNotificationList(page + 1);
//     }
//     console.log("hasMore:", hasMore);

//   } catch (error) {
//     console.error("Error fetching data:", error);
//     setHasMore(false);
//   } finally {
//     setLoadingMore(false);
//   }
// };

// // Effect to fetch initial data
// useEffect(() => {
//   console.log("Fetching data for page:", page);
//   fetchNotificationList(page); // Fetch data when the page number changes
// }, [page]);
// // const loadMoreData = () => {
// //   if (hasMore && !loadingMore) {
// //     setPage((prevPage) => prevPage + 1); // Increment page number
// //   }
// // };

// console.log("teamData.length",teamData.length)
// return (
//   <>
//     <div className="md:flex justify-center sm:justify-end my-2 px-4">
//       <AddDialoge />
//     </div>
{
  /* <div className="px-4 py-0 relative">
      <DataTable
      
        text=""
        queryParams={queryParams ? queryParams : ""}
        columns={columns}
        tableInstance={tableInstance}
        loading={loading}
      />
    </div> */
}
{
  /* <div className="px-4 py-0 relative">
 <InfiniteScroll
        dataLength={teamData.length}
        next={() => {
          setPage(page + 1);
          fetchNotificationList(page + 1);
        }}
        hasMore={hasMore}
        loader={
          loadingMore ? (
            <div className="text-center py-2">
             sdgfjhgsdhjfgjhsdfg
            </div>
          ) : null
        }
        scrollThreshold={0.9}
        scrollableTarget="scrollable-table-container"
        style={{ overflow: "visible" }}
      >
      <Table className="shadow-md rounded-lg border border-gray-300" id="notification-table">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-sm font-semibold text-white py-3">Assigned By</TableHead>
            <TableHead className="text-sm font-semibold text-white py-3">Message</TableHead>
            <TableHead className="text-sm font-semibold text-white py-3">Update</TableHead>
            <TableHead className="text-sm font-semibold text-white py-3 text-right">Time</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {teamData.length > 0 ? (
            teamData.map((notification: any, index: number) => (
              <TableRow
                key={notification._id}
                className={`${
                  notification?.isRead
                    ? "bg-white text-gray-700 hover:bg-gray-50"
                    : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                } transition-all duration-300 ease-in-out cursor-pointer`}
              >
                <TableCell className="font-semibold text-sm text-gray-800 py-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="cursor-pointer rounded-full shadow-md w-8 h-8">
                      <AvatarImage src={notification?.assignedBy?.avatar || UserPic} />
                      <AvatarFallback>
                        <img
                          src={UserPic}
                          alt="User Avatar"
                          className="w-full h-full object-cover"
                        />
                      </AvatarFallback>
                    </Avatar>
                    {notification?.assignedBy?.fullName && (
                      <span className="text-md font-medium text-black">
                        {notification?.assignedBy?.fullName}
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-left text-sm text-black py-4">
                  <div className="font-semibold">{notification.title}</div>
                  <div className="text-xs text-gray-600">{notification.message}</div>
                </TableCell>

                <TableCell className="text-right text-sm text-muted-foreground py-4">
                  {/* Render the appropriate side drawer content */
}
//               </TableCell>

//               <TableCell className="text-right text-sm text-muted-foreground py-4">
//                 <span className="text-[0.8rem]">{timeAgo(notification.createdAt)}</span>
//               </TableCell>
//             </TableRow>
//           ))
//         ) : (
//           <TableRow>
//             <TableCell colSpan={4} className="text-center font-semibold text-lg text-gray-500 py-4">
//               No Notifications Found
//             </TableCell>
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   </InfiniteScroll>
// </div> */}
