import { baseInstance, logOutFunction } from "@/common/commonFunctions";
import { headerOptions } from "@/common/commonFunctions";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type SalesDataType = {
  orderStats: [];
  totalOverallResult: {};
  orderMonth: string;
  orderYear: string;
};

export type FetchedSalesType = {
  message: string;
};

export type SalesState = {
  SalesData: SalesDataType | any;
  MonthlySalesData: SalesDataType | any;
  message?: string;
  loading: boolean;
};

export type SalesActions = {
  //   addNewUser: (data: SalesDataType) => void;
  fetchSalesData: (orderYear: SalesDataType) => void;
  fetchMonthlySalesData: (
    orderMonth: SalesDataType,
    orderYear: SalesDataType
  ) => void;
  // fetchMonthlySalesData: () => void;
};

export const useSalesStore = create<SalesState & SalesActions>()(
  devtools((set) => ({
    SalesData: {},
    MonthlySalesData: {},
    loading: false,
    // addNewUser: (data: SalesDataType) =>
    //   set((state) => ({
    //     userData: [...state.userData, data],
    //   })),

    fetchSalesData: async (orderYear) => {
      set({ loading: true });
      if (orderYear) {
        try {
          const response = await baseInstance.get(`/sales?year=${orderYear}`);
          if (response.status === 200) {
            set({ SalesData: response.data?.data, loading: false });
          } else {
            set({ SalesData: response.data?.message, loading: false });
          }
        } catch (error: any) {
          logOutFunction(error?.response?.data?.message);
          set({ SalesData: error?.response?.data?.message, loading: false });
        }
      }
    },
    fetchMonthlySalesData: async (orderMonth, orderYear) => {
      set({ loading: true });
      if (orderYear && orderMonth) {
        try {
          const response = await baseInstance.get(
            `/sales/monthly-status?month=${orderMonth}&year=${orderYear}`
          );
          // const response = await baseInstance.get(
          //   `/sales/monthly-status?month=03&year=2024`
          // );
          if (response.status === 200) {
            set({ MonthlySalesData: response.data?.data, loading: false });
          } else {
            set({ MonthlySalesData: response.data?.message, loading: false });
          }
        } catch (error: any) {
          logOutFunction(error?.response?.data?.message);
          set({
            MonthlySalesData: error?.response?.data?.message,
            loading: false,
          });
        }
      }
    },
  }))
);
