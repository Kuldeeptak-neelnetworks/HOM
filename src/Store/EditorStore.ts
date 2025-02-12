import {
  baseInstance,
  errorToastingFunction,
  logOutFunction,
  successToastingFunction,
} from "@/common/commonFunctions";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type EditorDataType = {
  _id: string;
  content: string;
  files: [];
  itemId: string;
  itemType: string;
  isPinned: boolean;
  likes: [];
  mentions: [];
  replies: [];
  views: [];
};

export type EditorState = {
  editorData: EditorDataType[] | any;
  acData:EditorDataType[] | any;
  orderEditorData: EditorDataType[] | any;
  leadsEditorData: EditorDataType[] | any;
  technicalUpdateData: EditorDataType[] | any;
  amendmentUpdateData: EditorDataType[] | any;
  productFlowUpdateData: EditorDataType[] | any;
  copywriterUpdateData: EditorDataType[] | any;
  websiteContentUpdateData:EditorDataType[]|any;
  
  loading: boolean;
};

export type EditorActions = {
  fetchEditorData: (customerId: string) => Promise<void>;
  fetchacData :(customerId: string) => Promise<void>;
  fetchOrderEditorData: (orderId: string) => Promise<void>;
  fetchLeadsEditorData: (leadId: string) => Promise<void>;
  fetchTechnicalUpdateData: (technicalId: string) => Promise<void>;
  fetchAmendmentUpdateData: (amendmentId: string) => Promise<void>;
  fetchProductFlowUpdateData: (productFlowId: string) => Promise<void>;
  fetchCopywriterUpdateData: (copywriterId: string) => Promise<void>;
  fetchWebsiteContentUpdateData:(websiteContentId: string) => Promise<void>;
  addUpdateData: (data: any, customerId: string) => void;
};

export const useEditorStore = create<EditorState & EditorActions>()(
  devtools((set) => ({
    editorData: [],
    acData:[],
    orderEditorData: [],
    leadsEditorData: [],
    technicalUpdateData: [],
    amendmentUpdateData: [],
    productFlowUpdateData: [],
    copywriterUpdateData: [],
    websiteContentUpdateData:[],
    loading: false,

    fetchEditorData: async (customerId: string) => {
      if (customerId) {
        set({ loading: true });
        try {
          const response = await baseInstance.get(
            `/updates/customer/${customerId}`
          );
          if (response.status === 200) {
            set({ editorData: response?.data?.data?.updates, loading: false });
          } else {
            set({ editorData: response.data?.message, loading: false });
          }
        } catch (error: any) {
          set({ editorData: error?.response?.data?.message, loading: false });
        }
      }
    },


    fetchacData: async (customerId: string) => {
      if (customerId) {
        set({ loading: true });
        try {
          const response = await baseInstance.get(
            `/activitylogs/${customerId}`
          );
          if (response.status === 200) {
            set({ acData: response?.data?.data, loading: false });
          } else {
            set({ acData: response.data?.message, loading: false });
          }
        } catch (error: any) {
          set({ acData: error?.response?.data?.message, loading: false });
        }
      }
    },

    fetchOrderEditorData: async (orderId: string) => {
      if (orderId) {
        set({ loading: true });
        try {
          const response = await baseInstance.get(`/updates/order/${orderId}`);
          if (response.status === 200) {
            set({
              orderEditorData: response?.data?.data?.updates,
              loading: false,
            });
          } else {
            set({ orderEditorData: response.data?.message, loading: false });
          }
        } catch (error: any) {
          set({
            orderEditorData: error?.response?.data?.message,
            loading: false,
          });
        }
      }
    },

    fetchLeadsEditorData: async (leadId: string) => {
      if (leadId) {
        set({ loading: true });
        try {
          const response = await baseInstance.get(`/updates/lead/${leadId}`);
          if (response.status === 200) {
            set({
              leadsEditorData: response?.data?.data?.updates,
              loading: false,
            });
            
          } else {
            set({ leadsEditorData: response.data?.message, loading: false });
          }
        } catch (error: any) {
          set({
            leadsEditorData: error?.response?.data?.message,
            loading: false,
          });
        }
      }
    },

    fetchTechnicalUpdateData: async (technicalId: string) => {
      if (technicalId) {
        set({ loading: true });
        try {
          const response = await baseInstance.get(
            `/updates/technicaltracker/${technicalId}`
          );
          if (response.status === 200) {
            set({
              technicalUpdateData: response?.data?.data?.updates,
              loading: false,
            });
          
          } else {
            set({
              technicalUpdateData: response.data?.message,
              loading: false,
            });
          }
        } catch (error: any) {
          set({
            technicalUpdateData: error?.response?.data?.message,
            loading: false,
          });
        }
      }
    },

    fetchCopywriterUpdateData: async (copywriterId: string) => {
      if (copywriterId) {
        set({ loading: true });
        try {
          const response = await baseInstance.get(
            `/updates/copywritertracker/${copywriterId}`
          );
          if (response.status === 200) {
            set({
              copywriterUpdateData: response?.data?.data?.updates,
              loading: false,
            });
           
          } else {
            set({
              copywriterUpdateData: response.data?.message,
              loading: false,
            });
          }
        } catch (error: any) {
          set({
            copywriterUpdateData: error?.response?.data?.message,
            loading: false,
          });
        }
      }
    },

    fetchAmendmentUpdateData: async (amendmentId: string) => {
      if (amendmentId) {
        set({ loading: true });
        try {
          const response = await baseInstance.get(
            `/updates/amendment/${amendmentId}`
          );
          if (response.status === 200) {
            set({
              amendmentUpdateData: response?.data?.data?.updates,
              loading: false,
            });
       
          } else {
            set({
              amendmentUpdateData: response.data?.message,
              loading: false,
            });
          }
        } catch (error: any) {
          set({
            technicalUpdateData: error?.response?.data?.message,
            loading: false,
          });
        }
      }
    },
    fetchProductFlowUpdateData: async (productFlowId: string) => {
      if (productFlowId) {
        set({ loading: true });
        try {
          const response = await baseInstance.get(
            `/updates/productflow/${productFlowId}`
          );
          if (response.status === 200) {
            set({
              productFlowUpdateData: response?.data?.data?.updates,
              loading: false,
            });
         
          } else {
            set({
              productFlowUpdateData: response.data?.message,
              loading: false,
            });
          }
        } catch (error: any) {
          set({
            productFlowUpdateData: error?.response?.data?.message,
            loading: false,
          });
        }
      }
    },
    // addUpdateData: async (data: any, customerId: string) => {
    //   set({ loading: true });
    //   try {
    //     const response = await baseInstance.post(
    //       `/updates/customer/${customerId}`,
    //       data
    //     );
    //     console.log("useEditorStore", useEditorStore);
    //     if (response.status === 200) {
    //       set({ editorData: response?.data?.data?.updates, loading: false });
    //     } else {
    //       errorToastingFunction("Something Went Wrong"),
    //         set({
    //           loading: false,
    //         });
    //     }
    //   } catch (error: any) {
    //     logOutFunction(error?.response?.data?.message);
    //     set({ editorData: error?.response?.data?.message, loading: false });
    //   }
    // },

    addUpdateData: async (data: any, customerId: string) => {
      set({ loading: true });
      try {
        const response = await baseInstance.post(
          `/updates/customer/${customerId}`,
          data
        );
        if (response?.status === 201) {
          set({ loading: false });
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

    addReplyData: async (data: any, updateId: string) => {
      set({ loading: true });
      try {
        const response = await baseInstance.post(
          `/updates/update/reply/${updateId}`,
          data
        );
        if (response?.status === 200) {
          set({ loading: false });
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


    fetchWebsiteContentUpdateData: async (websiteContentId: string) => {
      if (websiteContentId) {
        set({ loading: true });
        try {
          const response = await baseInstance.get(
            `/updates/newwebsitecontent/${websiteContentId}`
          );
          if (response.status === 200) {
            set({
              websiteContentUpdateData: response?.data?.data?.updates,
              loading: false,
            });
           
          } else {
            set({
              websiteContentUpdateData: response.data?.message,
              loading: false,
            });
          }
        } catch (error: any) {
          set({
            websiteContentUpdateData: error?.response?.data?.message,
            loading: false,
          });
        }
      }
    },
  }))
);
