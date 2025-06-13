"use client";

import React, { ChangeEvent, useEffect, useRef, useState, useCallback } from "react";
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
import { FiEdit3, FiSend, FiX, FiPlay } from "react-icons/fi";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import EmojiPicker from "emoji-picker-react";
import { FaRegSmileBeam, FaRegImage } from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";

interface PostData {
  postText: string;
  postImages: {
    urls: string[];
    files: File[];
  };
  postVideo: {
    url: string;
    file: File | null;
  };
}

const PostInputDialog = () => {
  const { postDialogBox, setPostDialogBox } = useDialogStore();
  const [postData, setPostData] = useState<PostData>({
    postText: "",
    postImages: {
      urls: [],
      files: []
    },
    postVideo: {
      url: "",
      file: null
    },
  });

  const CHARACTER_LIMIT = 280;
  const MAX_IMAGES = 3;
  const MAX_VIDEOS = 1;

  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const characterCount = postData.postText.length;
  const isOverLimit = characterCount > CHARACTER_LIMIT;
  const remainingCharacters = CHARACTER_LIMIT - characterCount;
  const progressPercentage = Math.min((characterCount / CHARACTER_LIMIT) * 100, 100);
  const canSubmit = postData.postText.trim() && !isOverLimit && !isSubmitting;
  useEffect(() => {
    if (!postDialogBox) {
      resetPostData();
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetPostData = useCallback(() => {
    postData.postImages.urls.forEach(url => URL.revokeObjectURL(url));
    if (postData.postVideo.url) {
      URL.revokeObjectURL(postData.postVideo.url);
    }

    setPostData({
      postText: "",
      postImages: { urls: [], files: [] },
      postVideo: { url: "", file: null },
    });
  }, [postData]);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostData(prev => ({ ...prev, postText: e.target.value }));
  };

  const validateMediaConstraints = (images: File[], videos: File[]): string | null => {
    if (images.length > MAX_IMAGES) {
      return `You can only upload up to ${MAX_IMAGES} images.`;
    }
    if (videos.length > MAX_VIDEOS) {
      return `You can only upload ${MAX_VIDEOS} video.`;
    }
    if (postData.postVideo.file && images.length > 0) {
      return "You can only choose either 1 video or up to 3 images.";
    }
    if (postData.postImages.files.length > 0 && videos.length > 0) {
      return "You can only choose either 1 video or up to 3 images.";
    }
    return null;
  };

  const processMediaFiles = (files: File[]): { images: File[]; videos: File[] } => {
    return {
      images: files.filter(file => file.type.startsWith("image/")),
      videos: files.filter(file => file.type.startsWith("video/"))
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const { images, videos } = processMediaFiles(files);
    const validationError = validateMediaConstraints(images, videos);

    if (validationError) {
      toast.error(validationError);
      e.target.value = "";
      return;
    }

    if (images.length > 0) {
      const imageUrls = images.map(file => URL.createObjectURL(file));
      setPostData(prev => ({
        ...prev,
        postImages: {
          urls: [...prev.postImages.urls, ...imageUrls],
          files: [...prev.postImages.files, ...images]
        },
        postVideo: { url: "", file: null }
      }));
    }

    if (videos.length === 1) {
      const videoUrl = URL.createObjectURL(videos[0]);
      postData.postImages.urls.forEach(url => URL.revokeObjectURL(url));
      
      setPostData(prev => ({
        ...prev,
        postVideo: { url: videoUrl, file: videos[0] },
        postImages: { urls: [], files: [] }
      }));
    }

    e.target.value = "";
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);
    const files: File[] = [];

    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
          files.push(file);
        }
      }
    }

    if (files.length === 0) return;

    e.preventDefault();
    const { images, videos } = processMediaFiles(files);
    const validationError = validateMediaConstraints(images, videos);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (images.length > 0) {
      const imageUrls = images.map(file => URL.createObjectURL(file));
      setPostData(prev => ({
        ...prev,
        postImages: {
          urls: [...prev.postImages.urls, ...imageUrls],
          files: [...prev.postImages.files, ...images]
        }
      }));
    }

    if (videos.length === 1) {
      const videoUrl = URL.createObjectURL(videos[0]);
      setPostData(prev => ({
        ...prev,
        postVideo: { url: videoUrl, file: videos[0] },
        postImages: { urls: [], files: [] }
      }));
    }
  };

  const removeImage = (indexToRemove: number) => {
    const urlToRevoke = postData.postImages.urls[indexToRemove];
    URL.revokeObjectURL(urlToRevoke);

    setPostData(prev => ({
      ...prev,
      postImages: {
        urls: prev.postImages.urls.filter((_, i) => i !== indexToRemove),
        files: prev.postImages.files.filter((_, i) => i !== indexToRemove)
      }
    }));
  };

  const removeVideo = () => {
    if (postData.postVideo.url) {
      URL.revokeObjectURL(postData.postVideo.url);
    }
    setPostData(prev => ({ 
      ...prev, 
      postVideo: { url: "", file: null } 
    }));
  };

  const createFormData = (): FormData => {
    const formData = new FormData();
    
    formData.append('postText', postData.postText);
    
    postData.postImages.files.forEach((file, index) => {
      formData.append(`image_${index}`, file);
    });
    
    if (postData.postVideo.file) {
      formData.append('video', postData.postVideo.file);
    }
    
    formData.append('imageCount', postData.postImages.files.length.toString());
    formData.append('hasVideo', (!!postData.postVideo.file).toString());
    
    return formData;
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const formData = createFormData();
      
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      setPostDialogBox(false);
      toast.success('Post created successfully!');
      
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setPostDialogBox(false);
  };

  const handleEmojiClick = (emojiData: any) => {
    setPostData(prev => ({
      ...prev,
      postText: prev.postText + emojiData.emoji
    }));
    setIsShowEmoji(false);
  };

  const getProgressBarColor = (): string => {
    if (characterCount <= CHARACTER_LIMIT * 0.7) return "bg-primary";
    if (characterCount <= CHARACTER_LIMIT * 0.9) return "bg-yellow-500";
    return "bg-destructive";
  };

  return (
    <Dialog open={postDialogBox} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-4">
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
              onPaste={handlePaste}
              className="min-h-[120px] resize-none focus-visible:ring-0 text-base"
              disabled={isSubmitting}
            />
          </div>

          {postData.postImages.urls.length > 0 && (
            <div className="space-y-2">
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
                {postData.postImages.urls.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-xl border-2 border-border/50 group"
                  >
                    <Image
                      src={imageUrl}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:cursor-not-allowed"
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
                  disabled={isSubmitting}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:cursor-not-allowed"
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
              <span className={isOverLimit ? "text-destructive" : "text-muted-foreground"}>
                {characterCount} / {CHARACTER_LIMIT} characters
              </span>
              <span className={isOverLimit ? "text-destructive" : "text-muted-foreground"}>
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
          {/* Media Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsShowEmoji(!isShowEmoji)}
              disabled={isSubmitting}
              className="p-2 hover:bg-primary/10 transition-colors rounded-full group disabled:cursor-not-allowed disabled:opacity-50"
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
              disabled={isSubmitting}
              className="p-2 hover:bg-primary/10 transition-colors rounded-full group disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaRegImage className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <input
                multiple
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*"
                disabled={isSubmitting}
              />
            </button>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="gap-2 min-w-[80px]"
          >
            <FiSend size={16} />
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>

          {/* Emoji Picker */}
          {isShowEmoji && (
            <div
              className="absolute bottom-full left-0 mb-2 z-50 shadow-2xl rounded-lg overflow-hidden"
              ref={pickerRef}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={300}
                height={350}
                searchDisabled={false}
                skinTonesDisabled={false}
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostInputDialog;