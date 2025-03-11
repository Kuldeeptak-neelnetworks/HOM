export interface QuillEditorProps {
  customerId?: string | string[];
  updateId?: string | string[];
  indicatorText?: string | string[];
  handleEdit?: string | string[];
  orderId?: string | string[];
  productFlowId?: string | string[];
  cust?: string | string[];
  leadId?: string | string[];
  technicalId?: string | string[];
  copywriterId?: string | string[];
  amendmentId?: string | string[];
  websiteContentId?: string | string[];
  text?: string | string[];
  quillSize?: string | string[];
  userId?: string | string[];
  setIsOpenReplyModel: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenQuill: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface MentionUser {
  id: number;
  value: string;
  avatar: string;
}
