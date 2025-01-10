"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cross1Icon, TrashIcon } from "@radix-ui/react-icons";
import {
  baseInstance,
  errorToastingFunction,
  successToastingFunction,
} from "@/common/commonFunctions";

const DeleteDialoge = ({
  id,
  entity,
  fetchAllFunction,
  setIsModalOpen,
  setIsOpenReplyModel,
  setIsCommentOpen,
  deleteText,
}: any) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    setOpen(false);
    try {
      const response = await baseInstance.delete(`/${entity}/${id}`);
      if (response?.status === 200) {
        successToastingFunction(response?.data?.message);
        fetchAllFunction();
        setIsModalOpen(false);
        setIsOpenReplyModel ? setIsOpenReplyModel(false) : "";
        setIsCommentOpen ? setIsCommentOpen(false) : "";
      }
    } catch (error: any) {
      if (error?.response && error?.response?.data) {
        errorToastingFunction(error?.response?.data.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Button Section  */}
      <DialogTrigger>
        {entity === "updates/replies" ? (
          <>
            <Cross1Icon className="h-6 w-6 p-1 " />
          </>
        ) : (
          <div className="flex items-center">
            <TrashIcon className="h-6 w-7 p-1 hover:bg-[#29354f] text-black hover:text-[white] " />
            <span className="text-gray-700 text-[0.8rem] ml-2">
              {deleteText}
            </span>
          </div>
        )}
      </DialogTrigger>
      {/* form Section  */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            <div style={{ fontSize: "14px" }}>
              {entity === "updates/replies"
                ? "Delete this reply?"
                : entity === "updates"
                ? "Delete this update?"
                : "Are you sure you want to delete?"}
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialoge;
