import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import User from "../../../asset/images/user.png";
import { timeAgo } from "@/common/commonFunctions";
import {
  NotificationFlowerUIconSVG,
  NotificationUserUIconSVG,
} from "@/utils/SVGs/SVGs";
import { useNotificationStore } from "@/Store/NotificationStore";
const UserPic = User.src;

const NotificationCard = ({
  notification,
  singleNotificationfecthHandler,
}: any) => {
  // console.log("notification", notification);
  return (
    <div
      onClick={() => singleNotificationfecthHandler(notification?._id)}
      className={`mb-4 flex items-start p-4 gap-4 ${
        notification?.isRead ? "" : "bg-[#f0f7ff]"
      } hover:cursor-pointer hover:bg-[#eff2f5]`}
    >
      <span>
        <Avatar className="cursor-pointer">
          <AvatarImage src={notification?.assignedBy?.avatar} />
          <AvatarFallback>
            <img src={UserPic} />
          </AvatarFallback>
        </Avatar>
      </span>

      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-full">
            <span className="font-semibold text-[0.85rem]">
              {notification?.assignedBy?.fullName}
            </span>

            {notification?.category === "i_was_mentioned" &&
              notification?.mentionedUsers && (
                <span className="text-[0.8rem] text-[#1f76c2]">
                  {notification.mentionedUsers
                    .map((mention: any) => `@${mention?.fullName}`)
                    .join(", ")}
                </span>
              )}

            {notification?.category === "assigned_to_me" &&
              notification?.assignedTo?.fullName && (
                <span className="text-[0.8rem] text-[#1f76c2] flex">
                  <NotificationUserUIconSVG />
                  {notification?.assignedTo?.fullName}
                </span>
              )}

            <p className="text-[0.8rem] font-medium leading-none flex-grow text-left w-[230px] text-wrap">
              {notification.title}
            </p>

            <span className="text-[0.8rem] text-muted-foreground text-[#a8acb3] ml-2 flex items-center gap-1">
              <span>{timeAgo(notification.createdAt)}</span>

              {!notification.isRead && (
                <span className="flex h-2 w-2 bg-sky-500" />
              )}
            </span>
          </div>
        </div>

        <p className="text-[0.8rem] text-muted-foreground pl-12 mt-1">
          {notification.message}
        </p>
        <p className="text-[0.8rem] text-muted-foreground mt-5 flex items-center gap-2">
          <span>
            <NotificationFlowerUIconSVG />
          </span>
          {notification.itemType === "NewWebsiteContent"
            ? "New Website Content"
            : notification.itemType}
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;

// <div
//   className={`mb-4 flex items-center p-4 gap-4 ${
//     notification?.isRead ? "" : "bg-[#f0f7ff]"
//   }  hover:cursor-pointer hover:bg-[#eff2f5]`}
// >
//   <div className="w-full">
//     <div className="flex gap-2 items-center w-full">
//       {!notification.isRead && (
//         <span className="flex h-2 w-2 translate-y-1  bg-sky-500" />
//       )}
//       <span>
//         <Avatar className="cursor-pointer">
//           <AvatarImage src={notification?.assignedBy?.avatar} />
//           <AvatarFallback>
//             <img src={UserPic} />
//           </AvatarFallback>
//         </Avatar>
//       </span>
//       <span className="font-semibold text-[0.85rem]">
//         {notification?.assignedBy?.fullName}
//       </span>
//       {notification?.category === "i_was_mentioned" ? (
//         <span className="text-[0.8rem] flex gap-1 text-[#1f76c2] w-fit">
//           {notification?.mentionedUsers &&
//             notification?.mentionedUsers.map(
//               (mention: any) => `@${mention?.fullName}`
//             )}
//         </span>
//       ) : notification?.category === "assigned_to_me" ? (
//         <span className="text-[0.8rem] flex gap-1 text-[#1f76c2] w-fit">
//           {notification?.assignedTo?.fullName &&
//             `@${notification?.assignedTo?.fullName}`}
//         </span>
//       ) : (
//         ""
//       )}
//       <div className="flex items-center w-full">
//         <p className="text-[0.8rem] font-medium leading-none">
//           {notification.title}
//         </p>
//         <span className="text-[0.8rem] text-muted-foreground text-[#a8acb3]">
//           {timeAgo(notification.createdAt)}
//         </span>
//       </div>
//     </div>
//     <p className="text-[0.8rem] text-muted-foreground pl-12">
//       {notification.message}
//     </p>
//   </div>
// </div>
