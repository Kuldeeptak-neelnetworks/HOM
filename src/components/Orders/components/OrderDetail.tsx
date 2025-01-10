"use client";

import BreadcrumbSection from "@/components/common/BreadcrumbSection";
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { baseInstance, headerOptions } from "@/common/commonFunctions";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { DownloadIconSVG, LoaderIconSVG } from "@/utils/SVGs/SVGs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

const crumbs = [
  {
    id: 1,
    title: "Home",
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Orders",
    link: "/orders",
  },
  {
    id: 3,
    title: "Order Details",
    link: "",
  },
];

interface OrderDetailType {
  contactName: string;
  companyName: number;
  representativeName: string;
  Address: string;
  fullName: string; // Assuming fullName is a string
  orderDetail: any;
  createdBy: {
    fullName: string; // Update this line to include fullName
  };
  customer?: string;
}

const OrderDetail = () => {
  const { orderId } = useParams();

  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState<OrderDetailType | any>(
    undefined
  );

  // const [orderDetail, setOrderDetail] = React.useState<OrderDetailType | undefined>(undefined);

  // const [orderDetail, setOrderDetail] = React.useState<OrderDetailType[]>([]);

  const getOrderDetails = async () => {
    try {
      const result = await baseInstance.get(`/orders/${orderId}`);
      if (result.status === 200) {
        setOrderDetail(result?.data?.data);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // logOutFunction(error?.response?.data?.message);
        router.push("/auth/login");
      }
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  return (
    <div className="px-4 py-0  relative text-[0.8rem]">
      <div className="text-[1rem] font-semibold absolute top-[-35px]">
        {orderDetail?.customer?.companyName
          ? orderDetail?.customer?.companyName
          : "loading..."}
      </div>
      {/* <div className="mb-4">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}
      {/* Main Customer details section  */}
      <div className="flex gap-5  justify-center mt-2">
        <div className="my-3 text-[0.8rem] hover:bg-gray-300 h-fit px-2 py-1 rounded cursor-pointer hidden text-center sm:block w-fit bg-[#fff] boxShadow">
          <Link href={`/orders`}>Back</Link>
        </div>
        <div className="w-[80%] boxShadow">
          <Card>
            <CardHeader>
              <CardTitle className="text-center my-3">
                {orderDetail?.createdBy?.fullName}
                <span className="mx-2">({orderDetail?.orderNo})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              {/* Contact Name  */}
              <ScrollArea className="h-[75vh]   px-3 py-3">
                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Full Name :
                    </Label>

                    <p className="mx-2">{orderDetail?.createdBy?.fullName}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Contact Name :
                    </Label>
                    <p className="mx-2">{orderDetail?.customer?.contactName}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  {/* Company Name  */}
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Company Name :
                    </Label>
                    <p className="mx-2">{orderDetail?.customer?.companyName}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Mobile No :
                    </Label>
                    <p className="mx-2">{orderDetail?.customer?.mobileNo}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Landline No :
                    </Label>
                    <p className="mx-2">{orderDetail?.customer?.landlineNo}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Customer Email :
                    </Label>
                    <p className="mx-2">
                      {orderDetail?.customer?.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Street No Name :
                    </Label>
                    <p className="mx-2">
                      {orderDetail?.customer?.streetNoName}
                    </p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Town :
                    </Label>
                    <p className="mx-2">{orderDetail?.customer?.town}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      County :
                    </Label>
                    <p className="mx-2">{orderDetail?.customer?.county}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Post Code :
                    </Label>
                    <p className="mx-2">{orderDetail?.customer?.postcode}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="username" className="text-right font-bold">
                      Order Type :
                    </Label>
                    <p className="mx-2">{orderDetail?.orderType}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="username" className="text-right font-bold">
                      Order Value :
                    </Label>
                    <p className="mx-2">{orderDetail?.orderValue}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  {/*   Deposit */}
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="username" className="text-right font-bold">
                      Deposit :
                    </Label>
                    <p className="mx-2">{orderDetail?.deposit}</p>
                  </div>

                  {/*  Building Address  */}
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="username" className="text-right font-bold">
                      Building Address :
                    </Label>
                    <p className="mx-2">{orderDetail?.buildingAddress}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="username" className="text-right font-bold">
                      Number Of Installments :
                    </Label>
                    <p className="mx-2">{orderDetail?.numberOfInstallments}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="username" className="text-right font-bold">
                      Date Of First DD :
                    </Label>
                    <p className="mx-2">
                      {orderDetail && orderDetail.dateOfFirstDd
                        ? orderDetail.dateOfFirstDd.split("T")[0]
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="username" className="text-right font-bold">
                      Deposit Method :
                    </Label>
                    <p className="mx-2">{orderDetail?.depositMethod}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="username" className="text-right font-bold">
                      Order No :
                    </Label>
                    <p className="mx-2">{orderDetail?.orderNo}</p>
                  </div>
                </div>
                {/* <div className="flex items-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b">
                <Label htmlFor="name" className="text-right font-bold">
                  URl:
                </Label>
                <p className="mx-2">{orderDetail?.customer?.url}</p>
              </div> */}

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Status :
                    </Label>
                    <p className="mx-2 bg-slate-100 px-1">
                      {orderDetail?.customer?.status}
                    </p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Live Date :
                    </Label>
                    <p className="mx-2">
                      {orderDetail && orderDetail.liveDate
                        ? orderDetail.liveDate.split("T")[0]
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      SSL :
                    </Label>
                    <p className="mx-2">{orderDetail?.customer?.ssl}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Sitemap :
                    </Label>
                    <p className="mx-2">{orderDetail?.customer?.sitemap}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Ht Access :
                    </Label>
                    <p className="mx-2">{orderDetail?.customer?.htAccess}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Ga Code :
                    </Label>
                    <p className="mx-2">{orderDetail?.customer?.gaCode}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      New GACode :
                    </Label>
                    <p className="mx-2">{orderDetail?.customer?.newGACode}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Logo :
                    </Label>
                    <p className="mx-2">{orderDetail?.customer?.logo}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Vat Invoice :
                    </Label>
                    {orderDetail?.customer?.vatInvoice ? (
                      <p className="mx-2">
                        <a
                          className="flex justify-center items-center hover:bg-slate-300 px-3 py-1 rounded"
                          href={orderDetail?.customer?.vatInvoice}
                          target="_blank"
                        >
                          <span className="mr-4 text-[0.8rem]"> View PDF </span>
                          <DownloadIconSVG />
                        </a>
                      </p>
                    ) : (
                      <span className="ml-3">-</span>
                    )}
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Orders Renewals :
                    </Label>
                    <p className="mx-2">
                      {orderDetail?.customer?.ordersRenewals}
                    </p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      DD Monthly :
                    </Label>
                    <p className="mx-2">{orderDetail?.DdMonthly}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      DD Change :
                    </Label>
                    <p className="mx-2">{orderDetail?.DdChange}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Customer Account Name :
                    </Label>
                    <p className="mx-2">{orderDetail?.customerAccountName}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Customer Account Number :
                    </Label>
                    <p className="mx-2">{orderDetail?.customerAccountNumber}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Customer Sort Code :
                    </Label>
                    <p className="mx-2">{orderDetail?.customerSortCode}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Google Email Renew Campaign :
                    </Label>
                    <p className="mx-2">
                      {orderDetail?.googleEmailRenewCampaign}
                    </p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Renewal Date :
                    </Label>
                    <p className="mx-2">
                      {orderDetail && orderDetail.renewalDate2024
                        ? orderDetail.renewalDate2024.split("T")[0]
                        : ""}
                    </p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Increase :
                    </Label>
                    <p className="mx-2">{orderDetail?.increase}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Expected Order Value :
                    </Label>
                    <p className="mx-2">
                      {orderDetail?.expected2024OrderValue}
                    </p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Building Address :
                    </Label>
                    <p className="mx-2">{orderDetail?.buildingAddress}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Number Of Key Phrase :
                    </Label>
                    <p className="mx-2">{orderDetail?.numberOfKeyPhrase}</p>
                  </div>

                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Number Of Key Areas :
                    </Label>
                    <p className="mx-2">{orderDetail?.numberOfKeyAreas}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Cash Flow :
                    </Label>
                    <p className="mx-2">{orderDetail?.cashFlow}</p>
                  </div>
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      DD Set Up :
                    </Label>
                    <p className="mx-2">{orderDetail?.ddSetUp}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Invoice :
                    </Label>
                    <p className="mx-2">{orderDetail?.invoiceSent}</p>
                  </div>
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Renewal Status :
                    </Label>
                    <p className="mx-2">{orderDetail?.renewalStatus}</p>
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Renewal Notes :
                    </Label>

                    {orderDetail?.renewalNotes !== "" ? (
                      <p className="mx-2">{orderDetail?.renewalNotes}</p>
                    ) : (
                      <span className="ml-2">-</span>
                    )}
                  </div>
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Renewal Value :
                    </Label>
                    {orderDetail?.renewalValue !== null ? (
                      <p className="mx-2">{orderDetail?.renewalValue}</p>
                    ) : (
                      <span className="ml-2">-</span>
                    )}
                  </div>
                </div>

                <div className="xl:flex lg:justify-between xl:px-16 mt-2 xl:border-b-[#ddd] xl:border-b">
                  <div className="flex items-center justify-center pb-[10px] mb-[10px]  border-b-[#ddd] border-b xl:border-none">
                    <Label htmlFor="name" className="text-right font-bold">
                      Renewal Date And Time :
                    </Label>
                    <p className="mx-2">
                      {orderDetail && orderDetail.renewalApptDandT ? (
                        orderDetail.renewalApptDandT.split("T")[0]
                      ) : (
                        <span className="ml-2">-</span>
                      )}
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

// <div className="p-4 relative text-[0.8rem]">
// <div className="text-xl font-semibold absolute top-[-65px]">
//   Order Details
// </div>
// <div className="mb-4">
//   <BreadcrumbSection crumbs={crumbs} />
// </div>

// <div className="flex gap-5  justify-center">
//   <div className="w-[72%]">
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-center my-3">
//           {orderDetail?.createdBy?.fullName}
//         </CardTitle>
//       </CardHeader>
//       <CardContent>

//         <ScrollArea className="h-[67vh]   px-3 py-3 ">
//         <div className=" p-4 relative ">

// <div className="flex gap-5 justify-center">
// <div className=" gap-5 justify-center">
// <div className="mt-4 ">
// <Card className="h-[100%]">
//   <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-10">
//     <div className="flex items-center pb-4 mb-4 border-b-[#ddd] border-b">
//       <Label htmlFor="name" className="text-right font-bold">
//         Contact Name:
//       </Label>
//       <p className="mx-2">{orderDetail?.customer?.contactName}</p>
//     </div>
//         {/* Company Name  */}

//         <div className="flex items-center pb-4 mb-4 border-b-[#ddd] border-b">
//           <Label htmlFor="name" className="text-right font-bold">
//             Company Name :
//           </Label>
//           <p className="mx-2">{orderDetail?.customer?.companyName}</p>

//         </div>
//         <div className="flex items-center pb-4 mb-4 border-b-[#ddd] border-b">
//           <Label htmlFor="name" className="text-right font-bold">
//           Mobile No :
//           </Label>
//           <p className="mx-2">{orderDetail?.customer?.mobileNo}</p>

//         </div>

//      <div className="flex items-center pb-4 mb-4 border-b-[#ddd] border-b">
//           <Label htmlFor="name" className="text-right font-bold">
//           Landline No :
//           </Label>
//           <p className="mx-2">{orderDetail?.customer?.landlineNo}</p>

//         </div>
//         <div className="flex items-center pb-4 mb-4 border-b-[#ddd] border-b">
//           <Label htmlFor="name" className="text-right font-bold">
//           Customer Email:
//           </Label>
//           <p className="mx-2">{orderDetail?.customer?.customerEmail}</p>

//         </div>
//         <div className="flex items-center pb-4 mb-4 border-b-[#ddd] border-b">
//           <Label htmlFor="name" className="text-right font-bold">
//           Street No Name:
//           </Label>
//           <p className="mx-2">{orderDetail?.customer?.streetNoName}</p>

//         </div>
//         <div className="flex items-center pb-4 mb-4 border-b-[#ddd] border-b">
//           <Label htmlFor="name" className="text-right font-bold">
//           Town:
//           </Label>
//           <p className="mx-2">{orderDetail?.customer?.town}</p>

//         </div>
//         <div className="flex items-center pb-4 mb-4 border-b-[#ddd] border-b">
//           <Label htmlFor="name" className="text-right font-bold">
//           Country:
//           </Label>
//           <p className="mx-2">{orderDetail?.customer?.county}</p>

//         </div>
//         <div className="flex items-center pb-4 mb-4 border-b-[#ddd] border-b">
//           <Label htmlFor="name" className="text-right font-bold">
//          Post Code:
//           </Label>
//           <p className="mx-2">{orderDetail?.customer?.postcode}</p>

//         </div>

//        <div className="flex items-center pb-4 mb-4 border-b-[#ddd] border-b">
//           <Label htmlFor="username" className="text-right font-bold">
//           Order Type:
//           </Label>
//           <p className="mx-2">{orderDetail?.orderType}</p>

//         </div>
//         <div className="flex items-center pb-4 mb-4 border-b-[#ddd] border-b">
//           <Label htmlFor="username" className="text-right font-bold">
//           Order Value:
//           </Label>
//           <p className="mx-2">{orderDetail?.orderValue}</p>

//         </div>
//         <div className="flex items-center pb-4 mb-4 border-b-[#ddd] border-b">
//           <Label htmlFor="username" className="text-right font-bold">
//           Deposit:
//           </Label>
//           <p className="mx-2">{orderDetail?.deposit}</p>

//         </div>

//         {/* Email  */}
//         <div className="flex items-center pb-4 mb-4 border-b-[#ddd] border-b">
//           <Label htmlFor="username" className="text-right font-bold">
//           Building Address:
//           </Label>
//           <p className="mx-2">{orderDetail?.buildingAddress}</p>

//         </div>
//         </div>

//     </Card>

//   </div>

// </div>

// </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   </div>
// </div>
// </div>
