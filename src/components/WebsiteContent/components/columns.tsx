"use client";

import User from "../../../asset/images/user.png";
import { DataTableColumnHeader } from "../../common/data-table-column-header";
import { DataTableRowActions } from "../../common/data-table-row-actions";
import TooltipCommon from "@/components/common/TooltipCommon";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeletedUserUIconSVG } from "@/utils/SVGs/SVGs";
import { ChevronsUpDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

const ChatModel = dynamic(
  () => import("@/components/common/Editor/ChatModel"),
  { ssr: false }
);
const UserPic = User.src;
// Company Logo
const companyLogoStyles: { [key: string]: string } = {
  "Create new company logo": "border-l-[#3A5276]",
  "Logo file attached in monday": "border-l-[#1O6776]",
  "Take from current website": "border-l-[#1B5276]",
  "Added logo to general master": "border-l-[#1C9276] ",
};
const renderCompanyLogo = (data: string[]) => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="h-5 bg-slate-100">
          Show
        </NavigationMenuTrigger>
        <NavigationMenuContent className="z-50">
          <ul
            className={`lg:w-fit p-2 ${
              data?.length > 1 ? "overflow-auto h-[77px]" : "h-fit"
            }`}
          >
            {data.map((item, index) => (
              <div
                className={`p-1 rounded text-center font-bold border border-l-8 text-nowrap mb-1 ${
                  companyLogoStyles[item] || ""
                }`}
                key={index}
              >
                {item}
              </div>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
// Contact Info
const contactInforStyles: { [key: string]: string } = {
  "New Contact Information": "border-l-[#FF6347]",
  "Use From Current Website": "border-l-[#4682B4]",
};
const renderCotactInfo = (data: string[]) => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="h-5 bg-slate-100">
          Show
        </NavigationMenuTrigger>
        <NavigationMenuContent className="z-50">
          <ul
            className={`lg:w-fit p-2   ${
              data?.length > 1 ? "overflow-auto h-[77px]" : "h-fit"
            }`}
          >
            {data.map((item, index) => (
              <div
                className={`p-1 rounded text-center font-bold border border-l-8 text-nowrap mb-1 ${
                  contactInforStyles[item] || ""
                }`}
                key={index}
              >
                {item}
              </div>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
// Type of Customer
const typeOfCustomerStyles: { [key: string]: string } = {
  "Existing HOM Customer": "border-l-[#4682B4]",
  "New Customer": "border-l-[#32CD32]",
  Renewal: "border-l-[#FFD700]",
};
const renderTypeOfCustomer = (data: string) => (
  <div
    className={`p-1 rounded text-center font-bold border border-l-8 w-[190px] text-nowrap ${
      typeOfCustomerStyles[data] || ""
    }`}
  >
    {data}
  </div>
);
// Domain Transferred
const domainTransferredStyles: { [key: string]: string } = {
  "N/A": "border-l-red-200",
  No: "border-l-red-500",
  Yes: "border-l-red-700",
};
const renderDomainTransferred = (data: string[]) => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="h-5 bg-slate-100">
          Show
        </NavigationMenuTrigger>
        <NavigationMenuContent className="z-50">
          <ul
            className={`lg:w-[200px] p-2 ${
              data?.length > 1 ? "overflow-auto h-[77px]" : "h-fit"
            }`}
          >
            {data.map((item, index) => (
              <div
                className={`p-1 rounded text-center font-bold border border-l-8 text-nowrap mb-1 ${
                  domainTransferredStyles[item] || ""
                }`}
                key={index}
              >
                {item}
              </div>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
// Blog To Be Added
const blogToBeAddedStyles: { [key: string]: string } = {
  No: "border-l-orange-400",
  Yes: "border-l-orange-700",
};
const renderBlogToBeAdded = (data: string[]) => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="h-5 bg-slate-100">
          Show
        </NavigationMenuTrigger>
        <NavigationMenuContent className="z-50">
          <ul
            className={`lg:w-[100px] p-2 ${
              data?.length > 1 ? "overflow-auto h-[77px]" : "h-fit"
            }`}
          >
            {data.map((item, index) => (
              <div
                className={`p-1 rounded text-center font-bold border border-l-8 text-nowrap mb-1 ${
                  blogToBeAddedStyles[item] || ""
                }`}
                key={index}
              >
                {item}
              </div>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
// Customer Email
const customerEmailStyles: { [key: string]: string } = {
  "Create New Company Emails": "border-l-amber-300",
  "Existing Emails Attached to Domain": "border-l-amber-500",
  "N/A - Customer Has Their Own": "border-l-amber-700",
};
const renderCustomerEmail = (data: string[]) => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="h-5 bg-slate-100">
          Show
        </NavigationMenuTrigger>
        <NavigationMenuContent className="z-50">
          <ul
            className={`lg:w-[250px] p-2 ${
              data?.length > 1 ? "overflow-auto h-[77px]" : "h-fit"
            }`}
          >
            {data.map((item, index) => (
              <div
                className={`p-1 rounded text-center font-bold border border-l-8 text-nowrap mb-1 ${
                  customerEmailStyles[item] || ""
                }`}
                key={index}
              >
                {item}
              </div>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
// Images
const imagesStyles: { [key: string]: string } = {
  "Client to send & images attached in Monday.com": "border-l-teal-300",
  "Photographer to be booked": "border-l-teal-600",
  "Take from current website": "border-l-teal-900",
};
const renderImages = (data: string[]) => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="h-5 bg-slate-100">
          Show
        </NavigationMenuTrigger>
        <NavigationMenuContent className="z-50">
          <ul
            className={`lg:w-fit p-2 ${
              data?.length > 1 ? "overflow-auto h-[77px]" : "h-fit"
            }`}
          >
            {data.map((item, index) => (
              <div
                className={`p-1 rounded text-center font-bold border border-l-8 text-nowrap mb-1 ${
                  imagesStyles[item] || ""
                }`}
                key={index}
              >
                {item}
              </div>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
// Google Reviews
const googleReviewsStyles: { [key: string]: string } = {
  "Currently Live": "border-l-cyan-200",
  "New Set-Up Required": "border-l-cyan-400",
  Yes: "border-l-cyan-800",
};
const renderGoogleReviews = (data: string[]) => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="h-5 bg-slate-100">
          Show
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div
            className={`lg:w-fit p-2 ${
              data?.length > 1 ? "overflow-auto h-[77px]" : "h-fit"
            }`}
          >
            {data.map((item, index) => (
              <div
                className={`p-1 rounded text-center font-bold border border-l-8 text-nowrap mb-1 ${
                  googleReviewsStyles[item] || ""
                }`}
                key={index}
              >
                {item}
              </div>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
// Copywriter
const isCopywriterStyles: { [key: string]: string } = {
  No: "border-l-blue-500",
  Yes: "border-l-blue-800",
};
const renderIsCopywriter = (data: string[]) => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="h-5 bg-slate-100">
          Show
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul
            className={`lg:w-[130px] p-2 ${
              data?.length > 1 ? "overflow-auto h-[77px]" : "h-fit"
            }`}
          >
            {data.map((item, index) => (
              <div
                className={`p-1 rounded text-center font-bold border border-l-8 text-nowrap mb-1 ${
                  isCopywriterStyles[item] || ""
                }`}
                key={index}
              >
                {item}
              </div>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
// Contact Required
const contentRequiredStyles: { [key: string]: string } = {
  "Additional Pages": "border-l-indigo-400",
  "New content based on copywriter questionnaire": "border-l-rose-400",
  "New content based on current website": "border-l-indigo-900",
  SEO: "border-l-purple-600",
  "Non SEO": "border-l-purple-900",
  Rework: "border-l-fuchsia-500",
  "Blog Posts": "border-l-pink-700",
};
const renderContentRequired = (data: string[]) => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="h-5 bg-slate-100">
          Show
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul
            className={`lg:w-[350px] p-2 ${
              data?.length > 1 ? "overflow-auto h-[77px]" : "h-fit"
            }`}
          >
            {data.map((item, index) => (
              <div
                className={`p-1 rounded text-center font-bold border border-l-8 text-nowrap mb-1 ${
                  contentRequiredStyles[item] || ""
                }`}
                key={index}
              >
                {item}
              </div>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

export const columns = [
  {
    accessorKey: "companyName",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }: any) => {
      return (
        <Link
          href={`/websiteContent/websiteContentDetails/${row?.original?._id}`}
        >
          <span className="text-nowrap hover:underline">
            {row?.original?.customer?.companyName}
          </span>
        </Link>
      );
    },
  },
  {
    accessorKey: "update",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Update" />
    ),
    cell: ({ row }: any) => (
      <ChatModel
        websiteContentId={row?.original?._id}
        length={row?.original?.updates?.length}
        customerName={row?.original?.customer?.contactName}
      />
    ),
  },

  {
    accessorKey: "typeOfCustomer",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Type Of Customer" />
    ),

    cell: ({ row }: any) => {
      if (row?.original?.typeOfCustomer) {
        return renderTypeOfCustomer(row?.original?.typeOfCustomer);
      } else {
        return <div className="text-gray-400">-</div>;
      }
    },
  },
  {
    accessorKey: "currentDomain",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Current Domain" />
    ),
    cell: ({ row }: any) =>
      row?.original?.currentDomain || <div className="text-gray-400">-</div>,
  },

  {
    accessorKey: "newDomain",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="New Domain" />
    ),
    cell: ({ row }: any) =>
      row?.original?.newDomain || <div className="text-gray-400">-</div>,
  },

  {
    accessorKey: "domainTransferred",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Domain Transferred" />
    ),
    cell: ({ row }: any) => {
      const data = row?.original?.domainTransferred || [];

      return Array.isArray(data) &&
        data.length > 0 &&
        data.some((item) => item.trim()) ? (
        renderDomainTransferred(data)
      ) : (
        <div className="text-gray-400">-</div>
      );
    },
  },

  {
    accessorKey: "domainInfo",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Domain Info" />
    ),
    cell: ({ row }: any) =>
      <div className="text-nowrap">{row?.original?.domainInfo}</div> || (
        <div className="text-gray-400">-</div>
      ),
  },

  {
    accessorKey: "customerEmails",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Customer Emails" />
    ),

    cell: ({ row }: any) => {
      const data = row?.original?.customerEmails || [];

      return Array.isArray(data) &&
        data.length > 0 &&
        data.some((item) => item.trim()) ? (
        renderCustomerEmail(data)
      ) : (
        <div className="text-gray-400">-</div>
      );
    },
  },

  {
    accessorKey: "emailsToBeCreated",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Emails To Be Created" />
    ),
    cell: ({ row }: any) =>
      row?.original?.emailsToBeCreated || (
        <div className="text-gray-400">-</div>
      ),
  },
  {
    accessorKey: "existingEmailsAttached",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Existing Emails Attached" />
    ),
    cell: ({ row }: any) =>
      row?.original?.existingEmailsAttached || (
        <div className="text-gray-400">-</div>
      ),
  },

  {
    accessorKey: "socialMedia",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="SocialMedia" />
    ),
    cell: ({ row }: any) =>
      row?.original?.socialMedia || <div className="text-gray-400">-</div>,
  },
  {
    accessorKey: "keyPhrasesAgreed",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Key Phrases Agreed" />
    ),
    cell: ({ row }: any) =>
      row?.original?.keyPhrasesAgreed || <div className="text-gray-400">-</div>,
  },
  {
    accessorKey: "keyAreasAgreed",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Key Areas Agreed" />
    ),
    cell: ({ row }: any) =>
      row?.original?.keyAreasAgreed || <div className="text-gray-400">-</div>,
  },

  {
    accessorKey: "theme",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Theme" />
    ),
    cell: ({ row }: any) =>
      row?.original?.theme || <div className="text-gray-400">-</div>,
  },
  {
    accessorKey: "colours",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Colours" />
    ),
    cell: ({ row }: any) =>
      <div className="text-nowrap">{row?.original?.colours}</div> || (
        <div className="text-gray-400">-</div>
      ),
  },

  {
    accessorKey: "blogToBeAdded",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Blog To Be Added?" />
    ),

    cell: ({ row }: any) => {
      const data = row?.original?.blogToBeAdded || [];
      return Array.isArray(data) &&
        data.length > 0 &&
        data.some((item) => item.trim()) ? (
        renderBlogToBeAdded(data)
      ) : (
        <div className="text-gray-400">-</div>
      );
    },
  },
  {
    accessorKey: "keywordforblogposts",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Keyword for blog posts" />
    ),
    cell: ({ row }: any) =>
      row?.original?.keywordforblogposts || (
        <div className="text-gray-400">-</div>
      ),
  },
  {
    accessorKey: "companyLogo",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="companyLogo" />
    ),
    cell: ({ row }: any) => {
      const data = row?.original?.companyLogo || [];
      return Array.isArray(data) &&
        data.length > 0 &&
        data.some((item) => item.trim()) ? (
        renderCompanyLogo(data)
      ) : (
        <div className="text-gray-400">-</div>
      );
    },
  },
  {
    accessorKey: "images",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Images" />
    ),
    cell: ({ row }: any) => {
      const data = row?.original?.images || [];
      return Array.isArray(data) &&
        data.length > 0 &&
        data.some((item) => item.trim()) ? (
        renderImages(data)
      ) : (
        <div className="text-gray-400">-</div>
      );
    },
  },

  {
    accessorKey: "isCopywriterRequired",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Is Copywriter Required" />
    ),
    cell: ({ row }: any) => {
      const data = row?.original?.isCopywriterRequired || [];
      return Array.isArray(data) &&
        data.length > 0 &&
        data.some((item) => item.trim()) ? (
        renderIsCopywriter(data)
      ) : (
        <div className="text-gray-400">-</div>
      );
    },
  },

  {
    accessorKey: "contactInformation",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Contact Information" />
    ),
    cell: ({ row }: any) => {
      const data = row?.original?.contactInformation || [];
      return Array.isArray(data) &&
        data.length > 0 &&
        data.some((item) => item.trim()) ? (
        renderCotactInfo(data)
      ) : (
        <div className="text-gray-400">-</div>
      );
    },
  },
  {
    accessorKey: "pageName",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Page Name" />
    ),
    cell: ({ row }: any) =>
      row?.original?.pageName || <div className="text-gray-400">-</div>,
  },
  {
    accessorKey: "contentRequired",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Content Required" />
    ),
    cell: ({ row }: any) => {
      const data = row?.original?.contentRequired || [];
      return Array.isArray(data) &&
        data.length > 0 &&
        data.some((item) => item.trim()) ? (
        renderContentRequired(data)
      ) : (
        <div className="text-gray-400">-</div>
      );
    },
  },

  {
    accessorKey: "newContactInformation",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="New Contact Information" />
    ),
    cell: ({ row }: any) =>
      (
        <div className="text-nowrap">
          {row?.original?.newContactInformation}
        </div>
      ) || <div className="text-gray-400">-</div>,
  },
  {
    accessorKey: "notesForDesign",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Notes For Design" />
    ),
    cell: ({ row }: any) =>
      <div className="text-nowrap">{row?.original?.notesForDesign}</div> || (
        <div className="text-gray-400">-</div>
      ),
  },

  {
    accessorKey: "notesForCopywriter",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Notes For Copywriter" />
    ),
    cell: ({ row }: any) =>
      (
        <div className="text-nowrap">{row?.original?.notesForCopywriter}</div>
      ) || <div className="text-gray-400">-</div>,
  },

  {
    accessorKey: "googleReviews",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Google Reviews" />
    ),

    cell: ({ row }: any) => {
      const data = row?.original?.googleReviews || [];
      return Array.isArray(data) &&
        data.length > 0 &&
        data.some((item) => item.trim()) ? (
        renderGoogleReviews(data)
      ) : (
        <div className="text-gray-400">-</div>
      );
    },
  },

  {
    accessorKey: "linkToCurrentGoogleReviews",
    header: ({ column }: any) => (
      <DataTableColumnHeader
        column={column}
        title="Link To Current Google Reviews"
      />
    ),
    cell: ({ row }: any) =>
      row?.original?.linkToCurrentGoogleReviews || (
        <div className="text-gray-400">-</div>
      ),
  },

  {
    accessorKey: "preferredPageNamesForBlog",
    header: ({ column }: any) => (
      <DataTableColumnHeader
        column={column}
        title="Preferred Page Names For Blog"
      />
    ),
    cell: ({ row }: any) =>
      row?.original?.preferredPageNamesForBlog || (
        <div className="text-gray-400">-</div>
      ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => <DataTableRowActions row={row} />,
  },
];
