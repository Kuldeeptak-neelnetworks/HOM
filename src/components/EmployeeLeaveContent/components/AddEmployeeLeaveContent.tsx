"use client";
import React from "react";
import AddEmployeeLeaveForm from "./AddEmployeeLeaveForm";

// import AddUserForm from "./AddUserForm";
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

const AddEmployeeLeaveContent = () => {
  return (
    <div className="px-4 py-0 relative">
      <div className="text-md font-semibold absolute top-[-30px]">
        Add Employee Leave
      </div>
      {/* <div className="mb-4">
        <BreadcrumbSection crumbs={crumbs} />
      </div> */}
      <div className=" flex gap-5 justify-center">
        <AddEmployeeLeaveForm />
      </div>
    </div>
  );
};

export default AddEmployeeLeaveContent;
