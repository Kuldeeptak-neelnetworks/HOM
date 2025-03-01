import { errorToastingFunction } from "./../common/commonFunctions";
import {
  baseInstance,
  logOutFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { headerOptions } from "@/common/commonFunctions";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type AmendmentDataType = {
  id: number;
  customer: any;
  customer_status: string;
  date_complete: string;
  date_current: string;
  refNo: string;
  status: string;
  priority: string;
  generated_by: any;
  message: any;
};

// export type FetchedUserType = {
//   message: string;
//   users_data: any[];
// };

export type AmendmentState = {
  amendmentData: AmendmentDataType[] | any;
  message?: string;
  loading: boolean;
};

export type AmendmentActions = {
  fetchAmendmentData: () => void;
  addAmendmentData: (data: any, customerId: string) => void;
};

export const useAmendmentStore = create<AmendmentState & AmendmentActions>()(
  devtools((set) => ({
    amendmentData: [],
    loading: false,

    fetchAmendmentData: async () => {
      set({ loading: true });
      try {
        const response = await baseInstance.get("/amendments");
        if (response.status === 200) {
          set({ amendmentData: response.data?.data, loading: false });
        } else {
          set({ amendmentData: response.data?.message, loading: false });
        }
      } catch (error: any) {
        logOutFunction(error?.response?.data?.message);
        set({ amendmentData: error?.response?.data?.message, loading: false });
      }
    },

    addAmendmentData: async (data: any, customerId: string) => {
      set({ loading: true });
      try {
        const response = await baseInstance.post(
          `/amendments/${customerId}`,
          data
        );
        if (response?.status === 201) {
          set({ amendmentData: response.data?.data, loading: false });
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
