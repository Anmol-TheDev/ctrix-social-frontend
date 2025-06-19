"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useDialogStore } from "@/store/store";
import { FiEdit3, FiSend, FiX } from "react-icons/fi";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import EmojiPicker from "emoji-picker-react";
import { FaRegSmileBeam } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
import { FiPlay } from "react-icons/fi";
import toast from "react-hot-toast";
import Image from "next/image";
import Api from "@/Api/axios";
import { AxiosProgressEvent } from "axios";
import { Progress } from "@/components/ui/progress";

const PostInputDialog = () => {
  const { postDialogBox, setPostDialogBox } = useDialogStore();
  const [postData, setPostData] = useState<{
    postText: string;
    postImages: {
      urls: string[];
      files: File[];
    };
    postVideo: {
      url: string;
      file: File | null;
    };
  }>({
    postText: "",
    postImages: {
      urls: [],
      files: [],
    },
    postVideo: {
      url: "",
      file: null,
    },
  });
  const CHARACTER_LIMIT = 280;
  const characterCount = postData.postText.length;
  const isOverLimit = characterCount > CHARACTER_LIMIT;
  const remainingCharacters = CHARACTER_LIMIT - characterCount;
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const progressPercentage = Math.min(
    (characterCount / CHARACTER_LIMIT) * 100,
    100
  );
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const formData = new FormData();

  useEffect(() => {
    if (!postDialogBox) {
      setIsShowEmoji(false);
    }
  }, [postDialogBox]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (pickerRef.current && !pickerRef.current.contains(target)) {
        setIsShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostData((prev) => ({ ...prev, postText: e.target.value }));
  };

  const createFormData = (): FormData => {
    const formData = new FormData();

    formData.append(
      "post_data",
      JSON.stringify({ text_content: postData.postText })
    );

    postData.postImages.files.forEach((file) => {
      formData.append("files", file);
    });

    if (postData.postVideo.file) {
      formData.append("files", postData.postVideo.file);
    }

    return formData;
  };

  const handleSubmit = async () => {
    if (postData.postText === "") return toast.error("Please enter ");
    if (postData.postText.trim() && !isOverLimit) {
      const formData = createFormData();
      try {
        setLoading(true);
        await Api.post("/post", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          },
        });
      } catch (error) {
      } finally {
        setPostData({
          postText: "",
          postImages: {
            urls: [],
            files: [],
          },
          postVideo: {
            url: "",
            file: null,
          },
        });
        setProgress(0);
        setLoading(false);
      }
      setPostDialogBox(false);
    }
  };

  const getProgressBarColor = () => {
    if (characterCount <= CHARACTER_LIMIT * 0.7) return "bg-primary";
    if (characterCount <= CHARACTER_LIMIT * 0.9) return "bg-yellow-500";
    return "bg-destructive";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files?.length === 0) return;

    const images = files?.filter((file) => file.type.startsWith("image/"));
    const videos = files?.filter((file) => file.type.startsWith("video/"));

    if (images.length > 0) {
      if (images.length > 3) {
        toast.error("You can only upload up to 3 images.");
        return;
      }
      if (postData.postVideo.url !== "" && images.length > 0) {
        toast.error("You can only choose either 1 video or 3 images");
        return;
      }
      const imageUrls = images.map((file) => {
        formData.append("files", file);
        return URL.createObjectURL(file);
      });

      setPostData((prev) => ({
        ...prev,
        postImages: {
          urls: imageUrls,
          files: images,
        },
        postVideo: { url: "", file: null },
      }));
    }

    if (videos.length > 1) {
      toast.error("You can only upload 1 video.");
      return;
    }
    if (postData.postImages.urls.length > 0 && videos.length === 1) {
      toast.error("You can only choose either 1 video or 3 images");
      return;
    }

    if (videos.length === 1) {
      const videoUrl = URL.createObjectURL(videos[0]);
      setPostData((prev) => ({
        ...prev,
        postVideo: { url: videoUrl, file: videos[0] },
        postImages: { urls: [], files: [] },
      }));
      formData.append("files",videos[0])
    }
    e.target.value = "";
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    const prevImages = postData.postImages.urls;
    const prevFile = postData.postImages.files;
    const videos: File[] = [];

    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file && file.type.startsWith("image/")) {
          const imageUrl = URL.createObjectURL(file);
          prevImages.push(imageUrl);
          prevFile.push(file);
        }
        if (file && file.type.startsWith("video/")) {
          videos.push(file);
        }
      }
    }

    if (prevImages.length > 0) {
      e.preventDefault();

      if (prevImages.length > 3) {
        toast.error("You can only upload up to 3 images.");
        return;
      }
      setPostData((prev) => ({
        ...prev,
        postImages: {
          urls: prevImages,
          files: prevFile,
        },
        postVideo: {
          url: "",
          file: null,
        },
      }));
    }
    if (videos.length > 0 && prevImages.length == 0) {
      if (videos.length == 1) {
        const videoUrl = URL.createObjectURL(videos[0]);
        setPostData((prev) => ({
          ...prev,
          postVideo: { url: videoUrl, file: videos[0] },
          postImages: { urls: [], files: [] },
        }));
      } else {
        toast.error("Only one video allowed ");
        return;
      }
    } else {
      toast.error("You can only choose either 1 video or 3 images");
    }
  };

  const removeImage = (indexToRemove: number) => {
    setPostData((prev) => ({
      ...prev,
      postImages: {
        urls: prev.postImages.urls.filter((_, i) => i !== indexToRemove),
        files: prev.postImages.files.filter((_, i) => i !== indexToRemove),
      },
    }));
  };

  const removeVideo = () => {
    setPostData((prev) => ({ ...prev, postVideo: { url: "", file: null } }));
  };
  const handleClose = () => {
    setPostDialogBox(false);
    setPostData({
      postText: "",
      postImages: { urls: [], files: [] },
      postVideo: { url: "", file: null },
    });
  };

  return (
    <Dialog open={postDialogBox} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-4 ">
        {/* {loading && (
          <Progress
            value={progress}
            className="absolute top-0 left-0 w-full z-50 rounded-none"
          />
        )} */}

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiEdit3 size={18} />
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/avtars/image copy.png" alt="User avatar" />
              </Avatar>
              <Label htmlFor="post-content" className="text-sm font-medium">
                What's on your mind?
              </Label>
            </div>
            <Textarea
              id="post-content"
              placeholder="Share your thoughts..."
              value={postData.postText}
              onChange={handleTextChange}
              className="min-h-[120px] resize-none  focus-visible:ring-0 text-base "
              onPaste={handlePaste}
            />
          </div>
          {postData.postImages.urls.length > 0 && (
            <div className="space-y-2 ">
              <div className={`grid gap-2 grid-cols-2 sm:grid-cols-3`}>
                {postData.postImages.urls.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-xl border-2 border-border/50 group"
                  >
                    <Image
                      src={image}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {postData.postVideo.url && (
            <div className="space-y-2">
              <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-border/50 group">
                <video
                  src={postData.postVideo.url}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                />
                <button
                  onClick={removeVideo}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <FiX size={14} />
                </button>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/30 rounded-full p-3">
                    <FiPlay size={24} className="text-white ml-1" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span
                className={`${
                  isOverLimit ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {characterCount} / {CHARACTER_LIMIT} characters
              </span>
              <span
                className={`${
                  isOverLimit ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {isOverLimit
                  ? `${Math.abs(remainingCharacters)} over limit`
                  : `${remainingCharacters} remaining`}
              </span>
            </div>

            <div className="w-full bg-secondary rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 relative pt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsShowEmoji(!isShowEmoji)}
              className="p-2 hover:bg-primary/10 transition-colors rounded-full group"
            >
              <FaRegSmileBeam
                className={`w-5 h-5 transition-colors ${
                  isShowEmoji
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary"
                }`}
              />
            </button>

            <button
              onClick={() => inputRef.current?.click()}
              className="p-2 hover:bg-primary/10 transition-colors rounded-full group"
            >
              <FaRegImage className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <input
                multiple
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*"
              />
            </button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!postData.postText.trim() || isOverLimit || loading}
            className="gap-2 min-w-[80px]"
          >
            <FiSend size={16} />
            {loading ? "Posting..." : "Post"}
          </Button>
          {isShowEmoji && (
            <div
              className="absolute bottom-full left-0 mb-2 z-50 shadow-2xl rounded-lg overflow-hidden"
              ref={pickerRef}
            >
              <EmojiPicker
                onEmojiClick={(e) => {
                  setPostData((prev) => ({
                    ...prev,
                    postText: prev.postText + e.emoji,
                  }));
                  setIsShowEmoji(false);
                }}
                width={300}
                height={350}
                searchDisabled={false}
                skinTonesDisabled={false}
                previewConfig={{
                  showPreview: false,
                }}
              />
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostInputDialog;
