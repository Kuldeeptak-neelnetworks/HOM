"use client";
import React from "react";
import AddCustomerForm from "./AddCustomerForm";

const crumbs = [
  {
    id: 1,
    title: "Home",
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Users",
    link: "/users",
  },
  {
    id: 3,
    title: "Edit User Details",
    link: "",
  },
];

const AddCustomerContent = () => {
  return (
    <div className="px-4 py-0 relative">
      <div className="text-md font-semibold absolute top-[-30px]">
        Add Customer
      </div>
      {/* <div className="mb-4">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}
      <div className=" flex gap-5 justify-center ">
        <AddCustomerForm />
      </div>
    </div>
  );
};

export default AddCustomerContent;
