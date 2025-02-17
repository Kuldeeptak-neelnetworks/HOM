"use client";
import React, { useEffect, useRef, useState } from "react";
import { AmendmentIconSVG, RightArrowIconSVG } from "@/utils/SVGs/SVGs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenueItem = (props: any) => {
  const {
    label,
    href,
    submenuItems,
    isSidebarOpen,
    icon,
    // open,
    // setOpen,
    setClickedTitleName,
  } = props;
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = href === pathname;

  const menuItemRef = useRef<HTMLLIElement>(null);

  

  // useEffect(() => {
  //   if (isActive && menuItemRef.current) {
  //     menuItemRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center",
  //       window.scrollTo(0, 0);
  //     });
  //   }
  // }, [isActive]);

  // const handleMenuItemClick = (e: React.MouseEvent) => {
  //   e.preventDefault(); // Prevent default scrolling
  //   window.scrollTo(0, 0); // Optionally reset scroll position
  //   setClickedTitleName(label);
  //   setOpen(label);
  // }
  const handleMenuItemClick = (e: React.MouseEvent) => {
    window.scrollTo(0, 0); // Scroll to the top
    setClickedTitleName(label);
  };
  useEffect(() => {
    if (isActive && menuItemRef.current) {
      menuItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // This will scroll the element to the center of the viewport
      });
  
      // If you want to scroll the window to the top, you can do it separately:
      window.scrollTo(0, 0); // This will scroll the window to the top
     
    }
    
  }, [isActive]);
  return (
    <li
      ref={menuItemRef}
      className={`${isSidebarOpen ? "my-4" : "mt-[1rem]"} onHover px-1`}
    >
      <div className="relative">
        <Link href={href} className="flex justify-center">
          {/* <button onClick={handleMenuItemClick}
           */}
            <button
             onClick={handleMenuItemClick}
            type="button"
            // className={`${
            //   isActive
            //     ? "w-full bg-gray-400 text-gray-700 dark:text-white dark:hover:bg-gray-700 hover:text-gray-700 transition duration-75  p-1"
            //     : "w-[81px] hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 hover:text-gray-700 transition duration-75  p-1"
            // }

            // `}
            className={
              isActive
                ? "w-full bg-gray-400 text-gray-700 dark:text-white dark:hover:bg-gray-700 hover:text-gray-700 transition duration-75  p-1"
                : "w-full hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 hover:text-gray-700 transition duration-75  p-1"
            }
            aria-controls="dropdown-example"
            data-collapse-toggle="dropdown-example"
          >
            <div
              className={`relative ${
                isSidebarOpen
                  ? "flex gap-10 my-[0.5rem]"
                  : "my-[0.5rem] flex flex-col justify-center items-center"
              }`}
            >
              <span className="">{icon}</span>
              <span className={`${isSidebarOpen ? "" : "text-[12px]"}`}>
                {label}
              </span>
            </div>
          </button>
        </Link>
        {/* Arrow Section  */}
        {isSidebarOpen && submenuItems?.length > 0 && (
          <span
            className="absolute top-4 right-4"
            onClick={() => {
              setOpen((prev: any) => !prev);
              setClickedTitleName(label);
            }}
          >
            {open ? (
              <RightArrowIconSVG cssClass={"sidebar-icon-svg rotated"} />
            ) : (
              <RightArrowIconSVG cssClass={"sidebar-icon-svg"} />
            )}
          </span>
        )}

        {open && isSidebarOpen ? (
          <ul
            className="text-center "
            style={{ borderLeft: "1px solid white" }}
          >
            {submenuItems?.length > 0 &&
              submenuItems?.map((el: any) => (
                <li
                  key={el.label}
                  className="outline-white outline-[20px] py-1 my-1 rounded-r-lg mb-2 hover:border-[#4b9437] hover:border-l-8 hover:bg-gray-300 hover:font-bold hover:text-gray-700 cursor-pointer"
                >
                  <Link href={el?.href}>{el.label}</Link>
                </li>
              ))}
          </ul>
        ) : (
          ""
        )}

        {isSidebarOpen && (
          <ul
            className="text-center submenuItem rounded"
            style={{ borderLeft: "1px solid white" }}
          >
            {submenuItems?.length > 0 &&
              submenuItems?.map((el: any) => (
                <li
                  key={el.label}
                  className={`outline-white outline-[20px] py-1 my-1 rounded-r-lg mb-2 hover:border-[#4b9437] hover:border-l-8
                   hover:bg-gray-300 hover:font-bold hover:text-gray-700 cursor-pointer`}
                >
                  {el.label}
                </li>
              ))}
          </ul>
        )}
      </div>
    </li>
  );
};

export default MenueItem;
