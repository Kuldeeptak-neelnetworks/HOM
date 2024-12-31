import { errorToastingFunction } from "../common/commonFunctions";
import {
  baseInstance,
  logOutFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { headerOptions } from "@/common/commonFunctions";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type CopywriterDataType = {
  id: number;
  customer: any;
  status: string;
  dateComplete: string;
};

export type CopywriterState = {
  copywriterData: CopywriterDataType[] | any;
  message?: string;
  loading: boolean;
  currentPage: number;
  totalCopywriterTrackers: number;
  totalPages: number;
};

export type CopywriterActions = {
  fetchCopywriterData: (page: any, limit: any) => void;
  addCopywriterData: (data: any, customerId: string) => void;
};

export const useCopywriterStore = create<CopywriterState & CopywriterActions>()(
  devtools((set) => ({
    copywriterData: [],
    loading: false,
    currentPage: 1,
    totalCopywriterTrackers: 0,
    totalPages: 0,

    fetchCopywriterData: async (page, limit) => {
      set({ loading: true });
      try {
        // const response = await baseInstance.get("/copywritertrackers");
        const response = await baseInstance.get("/copywritertrackers", {
          params: {
            ...(page && { page }),
            ...(limit && { limit }),
          },
        });
        console.log("response", response);
        if (response.status === 200) {
          set({
            copywriterData: response.data?.data?.copywriterTrackers,
            currentPage: response.data?.data?.currentPage,
            totalCopywriterTrackers:
              response.data?.data?.totalCopywriterTrackers,
            totalPages: response.data?.data?.totalPages,
            loading: false,
          });
        } else {
          set({ copywriterData: response.data?.message, loading: false });
        }
      } catch (error: any) {
        logOutFunction(error?.response?.data?.message);
        set({ copywriterData: error?.response?.data?.message, loading: false });
      }
    },

    addCopywriterData: async (data: any, customerId: string) => {
      set({ loading: true });
      try {
        const response = await baseInstance.post(
          `/copywritertrackers/${customerId}`,
          data
        );
        if (response?.status === 201) {
          set({ copywriterData: response.data?.data, loading: false });
          successToastingFunction(response.data.message);
        } else {
          errorToastingFunction("Something Went Wrong"),
            set({
              loading: false,
            });
        }
      } catch (error: any) {
        set({ loading: false });
        errorToastingFunction(error?.response?.data?.message);
      }
    },
  }))
);
