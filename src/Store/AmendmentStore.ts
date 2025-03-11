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

export type AmendmentState = {
  amendmentData:
    | {
        amendments: AmendmentDataType[];
        totalPages: number;
        totalCount: number;
        currentPage: number;
        pageSize: number;
        limit: number;
      }
    | any;
  addMultipleFormData: AmendmentDataType[] | any;
  message?: string;
  loading: boolean | any;
};

export type AmendmentActions = {
  fetchAmendmentData: ({
    page,
    limit,
    searchInput,
    filters,
  }: any) => Promise<void>;
  addAmendmentData: (data: any, customerId: string) => void;
  addMultipleForm: (data: any, customerId: string) => void;
};

export const useAmendmentStore = create<AmendmentState & AmendmentActions>()(
  devtools((set) => ({
    amendmentData: [],
    addMultipleFormData:[],
    
    loading: false,

    addMultipleForm: async (data: any, customerId: string) => {
      set({ loading: true });
      try {
        // Construct the query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('customerId', customerId);
        
        // Make the API call with the customerId query parameter
        const response = await baseInstance.post(`/inboxs?${queryParams.toString()}`,data);
        
        if (response?.status === 201) {
          set({ addMultipleFormData: response.data?.data, loading: false });
          successToastingFunction(response.data.message);
        } else {
          errorToastingFunction("Something Went Wrong");
          set({ loading: false });
        }
      } catch (error: any) {
        set({ loading: false });
        errorToastingFunction(error?.response?.data?.message);
      }
    },
    
    fetchAmendmentData: async (params) => {
      set({ loading: true });
      const {
        page = 1,
        limit = 10,
        searchInput = "",
        filters = [],
      } = params || {};

      try {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", String(page));
        if (limit) queryParams.append("limit", String(limit));
        if (searchInput) queryParams.append("search", searchInput);
        if (filters) queryParams.append("status", filters?.status);

        const response = await baseInstance.get(
          `/amendments?${queryParams.toString()}`
        );
        if (response.status === 200) {
          set({
            amendmentData: response.data?.data,
            loading: false,
          });
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
