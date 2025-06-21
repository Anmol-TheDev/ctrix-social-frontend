"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MdMoreVert } from "react-icons/md";
import {
  AiOutlineHeart,
  AiOutlineComment,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { X } from "lucide-react"; // Added X import
import { feedPost } from "@/types/types";
import { avatarExtension } from "@/app/(auth)/profileSetup/page";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useDialogStore } from "@/store/store";
import Link from "next/link";
import Api from "@/Api/axios";

const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

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
    created_at,
  } = post;
  const { setCommentDialogBox } = useDialogStore();
  const [isLiked, setIsLiked] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const timeAgo = getTimeAgo(created_at);
  const safeMedia = Array.isArray(media_attached) ? media_attached : [];

  const isVideo = safeMedia.length === 1 && isVideoUrl(safeMedia[0]);
  const images = !isVideo ? safeMedia.slice(0, 3) : [];

  const handleLike = async () => {
    const response = await Api.patch(`/post/${id}/liketoggler`, { toggle: true, like_type: "haha" });
    if (response.status == 200) {
      setIsLiked(!isLiked);
    }
  };

  const openPreview = (imgUrl: string) => {
    setPreviewImg(imgUrl);
    document.body.style.overflow = 'hidden';
  };

  const closePreview = () => {
    setPreviewImg(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow gap-0">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-1">
            <img
              src={"/avatars/" + avatar + avatarExtension}
              alt={`${username}'s avatar`}
              className="h-12 w-12 border-2 rounded-full object-cover"
            />

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 hover:underline cursor-pointer">
                  @{username}
                </h3>
                {verified_user && <RiVerifiedBadgeFill className="w-5 h-5" />}
                <span className="text-gray-500 text-sm">{timeAgo}</span>
              </div>
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MdMoreVert className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-16">
        <Link href={`/home/post/${id}  `}>
          {text_content && (
            <p className=" text-lg font-lite mb-4 pl-4 leading-relaxed">
              {text_content}
            </p>
          )}
        </Link>
        
        <div className="mb-4">
          {isVideo ? (
            <video
              src={safeMedia[0]}
              controls
              className="w-full rounded-xl max-h-[550px] object-cover"
            />
          ) : (
            <div className={`grid gap-2 ${images.length === 1 ? "" : "grid-cols-2"} auto-rows-[200px]`}>
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => openPreview(imgUrl)}
                  className={`relative w-full h-full rounded-lg overflow-hidden cursor-zoom-in ${
                    images.length === 3 && idx === 2 ? "col-span-2" : ""
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Post image ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors group ${
              isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
              <AiOutlineHeart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </div>
            <span className="text-sm font-medium">Like</span>
          </button>

          <button
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group"
            onClick={() => setCommentDialogBox(true, id)}
          >
            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
              <AiOutlineComment className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors group">
            <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
              <AiOutlineShareAlt className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </CardContent>

      {previewImg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            onClick={closePreview}
          />
          
          <button
            onClick={closePreview}
            className="absolute top-4 right-4 z-10 p-2 e bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-all"
          >
            <X size={24} />
          </button>

          <div className="relative max-w-4xl w-full aspect-video">
            <img
              src={previewImg}
              alt="Preview"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default Post;