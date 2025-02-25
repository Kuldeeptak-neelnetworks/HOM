


"use client";
import React, { useEffect, useRef, useState, memo } from "react";
import { RightArrowIconSVG } from "@/utils/SVGs/SVGs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuItem = memo((props: any) => {
  const {
    label,
    href,
    submenuItems = [], 
    isSidebarOpen,
    icon,
  } = props;
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = href === pathname;
  const menuItemRef = useRef<HTMLLIElement>(null);


  useEffect(() => {
    const isInitialLoad = !localStorage.getItem("hasScrolled");
    if (isActive && menuItemRef.current && isInitialLoad) {
      menuItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      localStorage.setItem("hasScrolled", "true");
    }
  }, [isActive]);

  return (
    <li
      ref={menuItemRef}
      className={`${isSidebarOpen ? "my-4" : "mt-[1rem]"} onHover px-1`}
    >
      <div className="relative">
        <Link href={href} scroll={false}> 
          <button
            type="button"
            className={
              isActive
                ? "w-full bg-white text-gray-700 dark:text-white transition duration-75 p-1"
                : "w-full transition duration-75 p-1"
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
              <span>{icon}</span>
              <span className={`${isSidebarOpen ? "" : "text-[12px]"}`}>
                {label}
              </span>
            </div>
          </button>
        </Link>

        {/* Submenu toggle arrow */}
        {isSidebarOpen && submenuItems?.length > 0 && (
          <span
            className="absolute top-4 right-4"
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          >
            {open ? (
              <RightArrowIconSVG cssClass={"sidebar-icon-svg rotated"} />
            ) : (
              <RightArrowIconSVG cssClass={"sidebar-icon-svg"} />
            )}
          </span>
        )}

        {/* Submenu items */}
        {open && isSidebarOpen && submenuItems?.length > 0 && (
          <ul className="text-center" style={{ borderLeft: "1px solid white" }}>
            {submenuItems.map((el: any) => (
              <li
                key={el.label}
                className="outline-white outline-[20px] py-1 my-1 rounded-r-lg mb-2 hover:border-[#4b9437] hover:border-l-8 hover:bg-gray-300 hover:font-bold hover:text-gray-700 cursor-pointer"
              >
                <Link href={el?.href} scroll={false}>
                  {el.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
});

export default MenuItem;












