import {
  baseInstance,
  errorToastingFunction,
  logOutFunction,
} from "@/common/commonFunctions";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type CustomerDataType =
  | {
      _id: number;
      customerNo: string;
      companyName: string;
      customerEmail: string;
      contactName: string;
      mobileNo: string;
      county: string;
      htAccess: string;
      landlineNo: string;
      liveDate: string;
      gaCode: string;
      newGACode: string;
      postcode: string;
      sitemap: string;
      ssl: string;
      ordersRenewals: string;
      logo: string;
      status: string;
      streetNoName: string;
      town: string;
      url: string;
      vatInvoice: string;
    }
  | any;
export type CustomerState = {
  customerData:
    | {
        customers: CustomerDataType[];
        totalPages: number;
        totalCount: number;
        currentPage: number;
        pageSize: number;
        limit: number;
      }
    | any;
  loading: boolean | any;
};


export type CustomerActions = {
  fetchAllCustomerData: ({
    page,
    limit,
    searchInput,
    filters,
  }: any) => Promise<void>;
};

export const useCustomerStore = create<CustomerState & CustomerActions>()(
  devtools((set) => ({
    customerData: [],
    addedOrder: {},
    loading: false,
    fetchAllCustomerData: async ({ page, limit, searchInput, filters}) => {
      set({ loading: true });
      try {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", String(page));
        if (limit) queryParams.append("limit", String(limit));
        if (searchInput) queryParams.append("search", searchInput);
        if (filters) queryParams.append("status", filters?.status);
    

        const response = await baseInstance.get(
          `/customers?${queryParams.toString()}`
        );
        if (response.status === 200) {
          set({ customerData: response?.data?.data, loading: false });
        } else {
          set({ customerData: response?.data?.message, loading: false });
        }
      } catch (error: any) {
        logOutFunction(error?.response?.data?.message);
        set({ customerData: error?.response?.data?.message, loading: false });
      }
    },
  }))
);

// export const useCustomerStore = create<CustomerState & CustomerActions>()(
//   devtools((set: any) => ({
//     customerData: {
//       customers: [],
//     },
//     loading: false,

//     fetchAllCustomerData: async (page: number, limit: number) => {
//       set({ loading: true });
//       try {
//         const response = await baseInstance.get("/customers", {
//           params: { page, limit },
//         });

//         if (response.status === 200) {
//           set({ customerData: response?.data?.data, loading: false });
//         } else {
//           set({ customerData: response?.data?.message, loading: false });
//         }
//       } catch (error: any) {
//         logOutFunction(error?.response?.data?.message);
//         set({ customerData: error?.response?.data?.message, loading: false });
//       }
//     },
//   }))
// );

// export const useCustomerStore = create<CustomerState & CustomerActions>()(
//   devtools((set: any) => ({
//     customerData: [] as CustomerDataType[],
//     loading: false,

//     fetchAllCustomerData: async () => {
//       set({ loading: true });
//       try {
//         const response = await baseInstance.get("/customers");

//         if (response.status === 200) {
//           set({ customerData: response?.data?.data, loading: false });
//         } else {
//           set({ customerData: response?.data?.message, loading: false });
//         }
//       } catch (error: any) {
//         logOutFunction(error?.response?.data?.message);
//         set({ customerData: [], loading: false });
//       }
//     },
//   }))
// );
