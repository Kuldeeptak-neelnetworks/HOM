"use client";
import { baseURL } from "@/utils/constants/apiConstants";
import axios from "axios";
import { toast } from "sonner";

axios.defaults.withCredentials = true;
// token
const getToken = () => {
  const token =
    typeof window !== "undefined" ? localStorage?.getItem("token") : null;
  const bearer = "Bearer " + token;
  const newBearer = bearer.replace(/['"]+/g, "");
  return newBearer;
};

// api headers
export const headerOptions = (isFormData: any) => ({
  "Content-Type": isFormData ? "multipart/form-data" : "application/json",
  Accept: "application/json",
  Authorization: getToken(),
});

// Base URL
export const baseInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// get User Token from Local Storage
export function getUserToken() {
  if (typeof localStorage !== "undefined") {
    const token =
      typeof window !== "undefined" ? localStorage?.getItem("token") : null;
    if (token) {
      return token;
    }
    return null;
  }
}
// get User Data from Local Storage
export function getUserData() {
  if (typeof localStorage !== "undefined") {
    const userData =
      typeof window !== "undefined" ? localStorage?.getItem("user") : null;
    if (userData) {
      return userData;
    }
  }
  return null;
}
export const logOutFunction = async (message: any) => {
  if (localStorage?.getItem("token")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRoleHOM");
    localStorage.removeItem("userIdHOM");
    localStorage.removeItem("userNameHOM");
  }

  if (message === "Logout Successfully !!") {
    toast.success(message, {
      action: {
        label: "Close",
        onClick: () => console.log("Close"),
      },
    });
  } else {
    // toast.error(message, {
    //   action: {
    //     label: "Close",
    //     onClick: () => console.log("Close"),
    //   },
    // });
  }

  return;
};
export const successToastingFunction = (message: any) => {
  toast.success(message, {
    action: {
      label: "Close",
      onClick: () => console.log("Close"),
    },
  });
};
export const errorToastingFunction = (message: any) => {
  toast.error(message, {
    action: {
      label: "Close",
      onClick: () => console.log("Close"),
    },
  });
};

export const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  const options: any = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  };
  const formattedDate = date.toLocaleDateString("en-GB", options); // Using "en-GB" for day-month-year format
  return formattedDate;
};

export function formatDateYYYYMMDD(date: any) {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  let month = (d.getMonth() + 1).toString().padStart(2, "0");
  let day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// time elapsed since the creation date of a notification in a human-readable format
export const timeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000); // years
  if (interval > 1) return `${interval} years`;

  interval = Math.floor(seconds / 2592000); // months
  if (interval > 1) return `${interval} months`;

  interval = Math.floor(seconds / 86400); // days
  if (interval > 1) return `${interval} days`;

  interval = Math.floor(seconds / 3600); // hours
  if (interval > 1) return `${interval} h`;

  interval = Math.floor(seconds / 60); // minutes
  if (interval > 1) return `${interval} m`;

  return "just now";
};
