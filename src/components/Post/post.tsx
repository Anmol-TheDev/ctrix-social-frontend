"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MdMoreVert } from "react-icons/md";
import {
  AiOutlineHeart,
  AiOutlineComment,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { feedPost } from "@/types/types";
import { avatarExtension } from "@/app/(auth)/profileSetup/page";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useDialogStore } from "@/store/store";

const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h`;
  } else if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)}d`;
  } else {
    return postDate.toLocaleDateString();
  }
};

const isVideoUrl = (url: string) => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

const Post = ({ post }: { post: feedPost }) => {
  const {
    id,
    text_content,
    media_attached,
    username,
    avatar,
    verified_user,
    bio,
    created_at,
  } = post;
  const { setCommentDialogBox } = useDialogStore();

  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const timeAgo = getTimeAgo(created_at);
  const safeMedia = Array.isArray(media_attached) ? media_attached : [];

  const isVideo = safeMedia.length === 1 && isVideoUrl(safeMedia[0]);
  const images = !isVideo ? safeMedia.slice(0, 3) : [];
  console.log(verified_user);

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow gap-0 ">
      <CardHeader className=" px-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-1">
            <img
              src={"avatars/" + avatar + avatarExtension}
              alt={`${username}'s avatar`}
              className="h-12 w-12 border-2 rounded-full object-cover"
            />

            <div className="flex flex-col">
              <div className="flex items-center gap-2 ">
                <h3 className="font-semibold text-gray-900 hover:underline cursor-pointer">
                  @{username}
                </h3>
                {verified_user && <RiVerifiedBadgeFill className="w-5 h-5 " />}
                <span className="text-gray-500 text-sm">{timeAgo}</span>
              </div>
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MdMoreVert className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-0  px-16">
        {text_content && (
          <p className="text-gray-900 text-xl font-light mb-4 pl-4 leading-relaxed">
            {text_content}
          </p>
        )}

        <div className="mb-4">
          {isVideo ? (
            <video src={safeMedia[0]}  controls className="w-full rounded-xl max-h-[550px] object-cover" />
          ) : (
            <div
              className={`grid gap-2 ${
                images.length === 1
                  ? "grid-cols-1"
                  : images.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2"
              }`}
            >
              {images.map((imgUrl, idx) => (
                <Dialog key={idx}>
                  <DialogTrigger asChild>
                    <div
                      onClick={() => setPreviewImg(imgUrl)}
                      className={`relative w-full h-64 ${
                        images.length === 3 && idx === 2 ? "col-span-2" : ""
                      } cursor-zoom-in`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Post media ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="rounded-xl object-cover"
                        priority={idx === 0}
                      />
                    </div>
                  </DialogTrigger>

                  <DialogContent className=" w-full p-0 overflow-hidden bg-transparent border-none">
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={imgUrl}
                        alt="Preview"
                        fill
                        className="object-contain rounded-xl"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t ">
          <button className="flex items-center space-x-2  hover:text-red-500 transition-colors group">
            <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
              <AiOutlineHeart className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Like</span>
          </button>

          <button
            className="flex items-center space-x-2 text-gray-500 hover:text-secondry-foreground transition-colors group"
            onClick={() => setCommentDialogBox(true)}
          >
            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
              <AiOutlineComment className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-500 hover:text-secondary-foreground transition-colors group">
            <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
              <AiOutlineShareAlt className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Post;
