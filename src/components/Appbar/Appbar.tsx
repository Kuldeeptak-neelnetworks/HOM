"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logOutFunction } from "@/common/commonFunctions";
import { NotificationBellIconSVG } from "@/utils/SVGs/SVGs";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import User from "../../asset/images/user.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const UserPic = User.src;

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardProps = React.ComponentProps<typeof Card>;

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellRing, Check } from "lucide-react";
import { baseURL } from "@/utils/constants/apiConstants";
import { AxiosError } from "axios";
import {
  baseInstance,
  errorToastingFunction,
  headerOptions,
  successToastingFunction,
} from "@/common/commonFunctions";
import { useNotificationStore } from "@/Store/NotificationStore";
import NotificationCard from "./components/NotificationCard";

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
];

interface NavBarProps {
  toggleSider: boolean;
  titleData: string;
}
interface UserData {
  fullName?: string;
  avatar?: string;
  email?: string;
}

const Appbar: React.FC<NavBarProps> = ({ toggleSider }) => {
  const [position, setPosition] = React.useState("bottom");
  const router = useRouter();
  const [notificationTriggered, setNotificationTriggered] = useState(false);

  const [openDropDown, setOpenDropDown] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const {
    fetchNotificationData,
    notificationData,
    fetchSingleNotificationData,
    notificationSingleData,
    fetchSingleReadNotificationData,
    notificationReadData,
  } = useNotificationStore();

  const openDropdownMenu = () => {
    setOpenDropDown((prev) => !prev);
  };

  const logOutAccount = async () => {
    try {
      const response = await baseInstance.post("/users/logout");
      if (response.status === 200) {
        router.push("/auth/login");
        logOutFunction("Logout Successfully !!");
        // set({ amendmentData: response.data?.data, loading: false });
      } else {
        // set({ amendmentData: response.data?.message, loading: false });
      }
    } catch (error: any) {
      // logOutFunction(error?.response?.data?.message);
    }
  };

  const profile = () => {
    router.push("/auth/login");
  };

  let userDataString: any =
    typeof window !== "undefined" ? localStorage?.getItem("user") : null;
  const userData2 = JSON.parse(userDataString);
  const userId = userData2?._id;

  const fetchUserData = async () => {
    try {
      const response = await baseInstance.get(`/users/${userId}`);
      if (response.status === 200) {
        setUserData(response.data.data as UserData);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching user data:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchNotificationData();
  }, []);

  const singleNotificationfecthHandler = async (notificationId: string) => {
    await fetchSingleNotificationData(notificationId);
    await fetchSingleReadNotificationData(notificationId);
    setNotificationTriggered(true); // Trigger the effect
  };

  useEffect(() => {
    if (notificationTriggered) {
      // Only run when triggered
      if (
        notificationSingleData &&
        Object.keys(notificationSingleData).length > 0
      ) {
        const itemType = notificationSingleData?.itemType;

        const queryData = {
          id: notificationSingleData?.item,
        };

        const queryString = new URLSearchParams(queryData).toString();
        console.log("queryString", queryString);
        if (itemType === "Amendment") {
          router.push(`/amendment?${queryString}`);
        } else if (itemType === "Customer") {
          router.push(`/customers?${queryString}`);
        } else if (itemType === "Order") {
          router.push(`/orders?${queryString}`);
        } else if (itemType === "Lead") {
          router.push(`/leads?${queryString}`);
        } else if (itemType === "NewWebsiteContent") {
          router.push(`/websiteContent?${queryString}`);
        }

        // if (itemType === "Amendment") {
        //   router.push("/amendment");
        // } else if (itemType === "Customer") {
        //   router.push("/customers");
        // } else if (itemType === "Order") {
        //   router.push("/orders");
        // } else if (itemType === "Lead") {
        //   router.push("/leads");
        // } else if (itemType === "NewWebsiteContent") {
        //   router.push("/websiteContent");
        // }
      }

      setNotificationTriggered(false); // Reset the trigger state
    }
  }, [notificationTriggered, notificationSingleData]); // Include notificationSingleData if needed

  useEffect(() => {
    fetchNotificationData();
  }, [notificationReadData]);

  return (
    <nav
      className="bg-[#fff] border-gray-200 dark:bg-gray-900 shadow-lg "
      style={{ boxShadow: "0px 4px 40px rgba(39, 32, 120, 0.1)" }}
      // className="bg-[#f2f6fa] dark:bg-gray-900"
      // // style={{ boxShadow: "0px 4px 40px rgba(39, 32, 120, 0.1)" }}
    >
      <div
        className={
          toggleSider
            ? `pl-[7rem] pr-3 flex flex-wrap items-center justify-end mx-auto py-[0.5rem] transition-all duration-300 h-[100%]`
            : `pl-[18rem] pr-3 flex flex-wrap items-center justify-end mx-auto py-[0.5rem] transition-all duration-300 h-[100%]`
        }
      >
        {/* Notification section  */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="text-[#29354f] mr-5 relative cursor-pointer">
              <div className="h-4 w-4 rounded-full bg-red-600 absolute flex justify-center items-center right-3 -top-1">
                <span className="font-bold text-white text-[10px]">
                  {notificationData?.notifications?.filter(
                    (notification: any) => !notification.isRead
                  ).length || 0}
                </span>
              </div>
              <NotificationBellIconSVG />
            </div>

            {/* <Button variant="outline">Open</Button> */}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-20 bg-slate-400">
            <Card className="">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                {/* <CardDescription>
                  You have{" "}
                  <span className="font-bold">
                    {
                      notificationData?.notifications?.filter((e) =>
                        e.isRead ? "0" : "0"
                      ).length
                    }
                  </span>{" "}
                  unread messages.
                </CardDescription> */}
                <CardDescription>
                  You have{" "}
                  <span className="font-bold">
                    {notificationData?.notifications?.filter(
                      (notification: any) => !notification.isRead
                    ).length || 0}
                  </span>{" "}
                  unread messages.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="h-[500px]">
                  <Tabs defaultValue="All" className="w-[700px] ">
                    <TabsList className="grid w-full grid-cols-3 bg-[#ffffff] boxShadow">
                      <TabsTrigger value="All">All</TabsTrigger>
                      <TabsTrigger value="Mentioned">Mentioned</TabsTrigger>
                      <TabsTrigger value="Assigned to me">
                        Assigned to me
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="All">
                      <Card>
                        <CardContent className="overflow-y-auto text-[0.8rem] py-2 px-5 my-2">
                          {notificationData?.notifications?.length > 0 ? (
                            <div className="h-[430px]">
                              {notificationData.notifications.map(
                                (notification: any) => (
                                  <NotificationCard
                                    notification={notification}
                                    key={notification?._id}
                                    singleNotificationfecthHandler={
                                      singleNotificationfecthHandler
                                    }
                                  />
                                )
                              )}
                            </div>
                          ) : (
                            <div>No Data found</div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="Mentioned">
                      <Card>
                        <CardContent className="overflow-y-auto text-[0.8rem] py-2 px-5 my-2">
                          {notificationData?.notifications?.filter(
                            (notification: any) =>
                              notification.category === "i_was_mentioned"
                          ).length > 0 ? (
                            <div className="h-[430px]">
                              {notificationData.notifications
                                .filter(
                                  (notification: any) =>
                                    notification.category === "i_was_mentioned"
                                )
                                .map((notification: any) => (
                                  <NotificationCard
                                    notification={notification}
                                    key={notification?._id}
                                    singleNotificationfecthHandler={
                                      singleNotificationfecthHandler
                                    }
                                  />
                                ))}
                            </div>
                          ) : (
                            <div>No Data found</div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="Assigned to me">
                      <Card>
                        <CardContent className="overflow-y-auto text-[0.8rem] py-2 px-5 my-2">
                          {notificationData?.notifications?.filter(
                            (notification: any) =>
                              notification.category === "assigned_to_me"
                          ).length > 0 ? (
                            <div className="h-[430px]">
                              {notificationData.notifications
                                .filter(
                                  (notification: any) =>
                                    notification.category === "assigned_to_me"
                                )
                                .map((notification: any) => (
                                  <NotificationCard
                                    notification={notification}
                                    key={notification?._id}
                                    singleNotificationfecthHandler={
                                      singleNotificationfecthHandler
                                    }
                                  />
                                ))}
                            </div>
                          ) : (
                            <div>No Data found</div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
              {/* <CardFooter>
                <Button className="w-full">Show all Notifications</Button>
              </CardFooter> */}
            </Card>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile DropDown section */}
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
          <button
            type="button"
            className="flex text-[0.8rem] bg-gray-800 rounded-md md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
            onClick={() => openDropdownMenu()}
            // onBlur={() => openDropdownMenu()}
          >
            <span className="sr-only">Open user menu</span>
            {userData?.avatar ? (
              <img
                className="w-8 h-8 rounded-full"
                src={`${userData?.avatar}`}
                alt="user photo"
              />
            ) : (
              <img
                className="w-8 h-8 rounded-full"
                src={UserPic}
                alt="user photo"
              />
            )}
          </button>
          {/* <!-- Dropdown menu --> */}

          <div
            className={
              openDropDown
                ? `z-50 absolute right-2 top-6  my-4 text-base list-none bg-white divide-y border border-gray-400 divide-gray-100 rounded-md shadow dark:bg-gray-700 dark:divide-gray-600 w-[157px]`
                : `z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-md shadow dark:bg-gray-700 dark:divide-gray-600 w-[157px]`
            }
            id="user-dropdown"
          >
            <div className="px-4 py-3">
              <span className="block text-[0.8rem] text-gray-900 dark:text-white">
                {userData?.fullName ? userData?.fullName : ""}
              </span>
              <span className="block text-[0.8rem]  text-gray-500 truncate dark:text-gray-400">
                {userData?.email ? userData?.email : ""}
              </span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li className="cursor-pointer">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-[0.8rem] text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Profile
                </Link>
              </li>
              <li onClick={logOutAccount} className="cursor-pointer">
                <p className="block px-4 py-2 text-[0.8rem] text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                  Sign out
                </p>
              </li>
            </ul>
          </div>
          {/* <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-[0.8rem] text-gray-500 rounded-md md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Appbar;
