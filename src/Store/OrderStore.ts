import {
  baseInstance,
  logOutFunction,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { headerOptions } from "@/common/commonFunctions";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type OrderDataType = {
  _id: string;
  createdBy: any;
  customer: any;
  orderType: string;
  orderNo: string;
  dateOfOrder: string;
  orderValue: number;
  deposit: number;
  numberOfInstallments: number;
  DdMonthly: number;
  cashFlow: number;
  increase: number;
  expected2024OrderValue: number;
  dateOfFirstDd: string;
  ddSetUp: string;
  invoiceSent: string;
  vatInvoice: [];
  depositMethod: string;
  renewalStatus: string;
  renewalNotes: string;
  renewalValue: any;
  renewalApptDandT: string;
  buildingAddress: string;
  numberOfKeyPhrase: any;
  numberOfKeyAreas: any;
  customerAccountName: string;
  customerAccountNumber: string;
  customerSortCode: string;
  googleEmailRenewCampaign: string;
  customerSignature: string;
  renewalDate2024: string;
  DdChange: any;
  status: string;
  isComplete: boolean;
};

export type OrderState = {
  orderData: OrderDataType[];
  addedOrder: any;
  loading: boolean | any;
};

export type OrderActions = {
  fetchAllOrdersData: ({
    page,
    limit,
    searchInput,
    orderType,
    year,
    filters,
  }: any) => Promise<void>;
};

export const useOrderStore = create<OrderState & OrderActions>()(
  devtools((set) => ({
    orderData: [],
    addedOrder: {},
    loading: false,
    fetchAllOrdersData: async ({
      page = 1,
      limit = 10,
      searchInput = "",
      filters = [],
      year,
    } = {}) => {
      set({ loading: true });
      try {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", String(page));
        if (limit) queryParams.append("limit", String(limit));
        if (searchInput) queryParams.append("search", searchInput);
        if (filters) queryParams.append("orderType", filters?.orderType);
        if (year) queryParams.append("year", String(year));

        const response = await baseInstance.get(
          `/orders?${queryParams.toString()}`
        );
        if (response.status === 200) {
          set({ orderData: response?.data?.data, loading: false });
        } else {
          set({ orderData: response?.data?.message, loading: false });
        }
      } catch (error: any) {
        logOutFunction(error?.response?.data?.message);
        set({ orderData: error?.response?.data?.message, loading: false });
      }
    },
  }))
);
// export const useOrderStore = create<OrderState & OrderActions>()(
//   devtools((set) => ({
//     orderData: [],
//     addedOrder: {},
//     loading: false,
//     fetchAllOrdersData: async (orderYear) => {
//       set({ loading: true });
//       try {
//         const response = await baseInstance.get(`/orders?year=${orderYear}`);
//         if (response.status === 200) {
//           set({ orderData: response?.data?.data, loading: false });
//         } else {
//           set({ orderData: response?.data?.message, loading: false });
//         }
//       } catch (error: any) {
//         logOutFunction(error?.response?.data?.message);
//         set({ orderData: error?.response?.data?.message, loading: false });
//       }
//     },
//   }))
// );
