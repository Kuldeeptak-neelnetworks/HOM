import { baseInstance, logOutFunction } from "@/common/commonFunctions";
import { headerOptions } from "@/common/commonFunctions";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type UserDataType = {
  id: number;
  additionalData: string;
  email: string;
  name: string;
  userRoles: string;
  isComplete: boolean;
  message: any;
};
export type UserOrderDataType = {
  id: number;
  additionalData: string;
  email: string;
  name: string;
  userRoles: string;
  isComplete: boolean;
  message: any;
};
export type FetchedUserType = {
  message: string;
  users_data: any[];
};

export type UserState = {
  userData: UserDataType[] | any;
  userTotalOrderData:UserOrderDataType[] | any;
  message?: string;
  loading: boolean;
};

export type UserActions = {
  addNewUser: (data: UserDataType) => void;
  fetchUsersData: () => void;
};

export const useUserStore = create<UserState & UserActions>()(
  devtools((set) => ({
    userData: [],
    userTotalOrderData:[],
    loading: false,
    addNewUser: (data: UserDataType) =>
      set((state) => ({
        userData: [...state.userData, data],
      })),

    fetchUsersData: async () => {
      set({ loading: true });
      try {
        const response = await baseInstance.get("/users");
        if (response.status === 200) {
          set({ userData: response.data?.data, loading: false });
        } else {
          set({ userData: response.data?.message, loading: false });
        }
      } catch (error: any) {
        logOutFunction(error?.response?.data?.message);
        set({ userData: error?.response?.data?.message, loading: false });
      }
    },


    fetchUsersToatlOrders: async () => {
      set({ loading: true });
      try {
        const response = await baseInstance.get("/users/dashboard");
        if (response.status === 200) {
          set({ userTotalOrderData: response.data?.data, loading: false });
        } else {
          set({ userTotalOrderData: response.data?.message, loading: false });
        }
      } catch (error: any) {
        logOutFunction(error?.response?.data?.message);
        set({ userTotalOrderData: error?.response?.data?.message, loading: false });
      }
    },
  }))
);



