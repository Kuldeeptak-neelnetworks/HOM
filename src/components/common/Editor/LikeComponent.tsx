import { LikeDarkUIconSVG, LikeUIconSVG } from "@/utils/SVGs/SVGs";
import { useMemo } from "react";

interface LikeStatusProps {
  likes: any[]; // The likes array for the editor
  userId: string; // The current user's ID
  likeClick: (editorId: string) => void; // The function to call when the user clicks like
  editorId: string; // The editor ID to identify which editor is being liked
}
const LikeComponent: React.FC<LikeStatusProps> = ({
  likes,
  userId,
  likeClick,
  editorId,
}) => {
  // Memoize the like status for this particular editor
  const isLiked = useMemo(() => {
    return Array.isArray(likes) && likes.some((like) => like?._id === userId);
  }, [likes, userId]);

  console.log("isLiked", isLiked);
  console.log("likes", likes);
  console.log("userId", userId);

  return (
    <div
      className="text-[0.8rem] border-r-2 pr-2 border-gray-200 flex gap-2 mt-1 items-center cursor-pointer"
      onClick={() => likeClick(editorId)} // Trigger likeClick when user clicks on the like section
    >
      <span className={`${isLiked ? "text-[#3a5894] font-bold" : ""}`}>
        Like
      </span>
      {isLiked ? <LikeDarkUIconSVG /> : <LikeUIconSVG />}
    </div>
  );
};

export default LikeComponent;
