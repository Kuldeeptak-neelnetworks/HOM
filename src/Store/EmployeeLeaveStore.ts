import {
  baseInstance,
  errorToastingFunction,
  logOutFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { headerOptions } from "@/common/commonFunctions";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type EmployeeLeaveType = {
  id: number;
  additionalData: string;
  email: string;
  name: string;
  userRoles: string;
  isComplete: boolean;
  message: any;
};

export type EmployeeType = {
  _id: string;
  employeeId: string;
  fullName: string;
  email: string;
  avatar: string;
  totalWorkingDays: number;
  totalHolidays: number;
  warning: boolean;
  toalremaingleave: number;
  leaveRequests: [
    {
      startDate: string;
      endDate: string;
      returnDate: string;
      managerResponse: string;
    }
  ];
  name: string;
  userRoles: string;
  isComplete: boolean;
  message: any;
};

export type FetchedEmployeeLeaveType = {
  leaveType: string;
  leaveReason: string;
  startDate: string;
  endDate: string;
  returnDate: string;
};

export type EmployeeLeaveState = {
  EmployeeLeaveData: EmployeeLeaveType[] | any;
  EmployeeData: EmployeeType[] | any;
  message?: string;
  loading: boolean;
};

export type EmployeeLeaveActions = {
  fetchEmployeeLeaveData: () => void;
  addEmployeeLeaveData: (data: FetchedEmployeeLeaveType) => void;
  fetchEmployeeData: (employeeId: EmployeeType) => void;
};

export const useEmployeeLeaveStore = create<
  EmployeeLeaveState & EmployeeLeaveActions
>()(
  devtools((set) => ({
    EmployeeLeaveData: [],
    EmployeeData: [],
    loading: false,

    fetchEmployeeLeaveData: async () => {
      set({ loading: true });
      try {
        const response = await baseInstance.get("/leaves");
        if (response.status === 200) {
          set({ EmployeeLeaveData: response.data?.data, loading: false });
        } else {
          set({ EmployeeLeaveData: response.data?.message, loading: false });
        }
      } catch (error: any) {
        logOutFunction(error?.response?.data?.message);
        set({
          EmployeeLeaveData: error?.response?.data?.message,
          loading: false,
        });
      }
    },
    fetchEmployeeData: async (employeeId) => {
      // console.log("in Store", employeeId);
      set({ loading: true });
      try {
        const response = await baseInstance.get(
          `leaves/employee/${employeeId}`
        );
        if (response.status === 200) {
          set({ EmployeeData: response.data?.data[0], loading: false });
        } else {
          set({ EmployeeData: response.data?.message, loading: false });
        }
      } catch (error: any) {
        logOutFunction(error?.response?.data?.message);
        set({
          EmployeeData: error?.response?.data?.message,
          loading: false,
        });
      }
    },

    addEmployeeLeaveData: async (data) => {
      set({ loading: true });
      try {
        const response = await baseInstance.post(`/leaves`, data);
        if (response?.status === 201) {
          // set({ EmployeeLeaveData: response.data?.data, loading: false });
          set({ loading: false });
          successToastingFunction(response.data.message);
          return true; // Indicate success
        } else {
          errorToastingFunction("Something Went Wrong"),
            set({
              loading: false,
            });
          return false; // Indicate failure
        }
      } catch (error: any) {
        set({ loading: false });
        console.log("error", error);
        errorToastingFunction(
          error?.response?.data?.message || "An error occurred"
        );
        return false; // Indicate failure
      } finally {
        set({ loading: false });
      }
    },
  }))
);
