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

const PostInputDialog = () => {
  const { postDialogBox, setPostDialogBox } = useDialogStore();
  const [postText, setPostText] = useState("");
  const CHARACTER_LIMIT = 280;
  const pickerRef = useRef<HTMLDivElement | null>(null)
  const characterCount = postText.length;
  const isOverLimit = characterCount > CHARACTER_LIMIT;
  const remainingCharacters = CHARACTER_LIMIT - characterCount;
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const progressPercentage = Math.min(
    (characterCount / CHARACTER_LIMIT) * 100,
    100
  );
useEffect(()=>{
    if(!postDialogBox){
      setIsShowEmoji(false)
    }
},[postDialogBox])
  useEffect(() => {
    const handleClickOutside = (event:MouseEvent) => {
      const target = event.target as Node
      if (
        pickerRef.current &&
        !pickerRef.current.contains(target) 
      ) {
        setIsShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  const handleSubmit = () => {
    if (postText.trim() && !isOverLimit) {
      console.log("Submitting post:", postText);
      setPostText("");
      setPostDialogBox(false);
    }
  };

  const handleCancel = () => {
    setPostText("");
    setPostDialogBox(false);
  };

  const getProgressBarColor = () => {
    if (characterCount <= CHARACTER_LIMIT * 0.7) return "bg-primary";
    if (characterCount <= CHARACTER_LIMIT * 0.9) return "bg-yellow-500";
    return "bg-destructive";
  };

  return (
    <Dialog open={postDialogBox} onOpenChange={setPostDialogBox}>
      <DialogContent className="sm:max-w-[500px] top-[30%]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiEdit3 size={18} />
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 ">
          <div className="space-y-2">
            <div className="flex">
              <Avatar className="w-18 h-18">
                <AvatarImage src="/avtars/image copy.png" />
              </Avatar>
              <Label htmlFor="post-content">What's on your mind?</Label>
            </div>
            <Textarea
              id="post-content"
              placeholder="Share your thoughts..."
              value={postText}
              onChange={handleTextChange}
              className="min-h-[170px] resize-none "
            />
          </div>

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

            {/* Progress Bar */}
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between items-center relative">
          <div className="">
            <FaRegSmileBeam
              className="w-5 h-5"
              onClick={() => setIsShowEmoji(!isShowEmoji)}
            />
          </div>
          <div className="flex  ">
            <Button variant="outline" onClick={handleCancel} className="gap-2">
              <FiX size={16} />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!postText.trim() || isOverLimit}
              className="gap-2"
            >
              <FiSend size={16} />
              Post
            </Button>
          </div>
          {isShowEmoji && (
            <div className="absolute top-8 -left-7" ref={pickerRef}>
              <EmojiPicker onEmojiClick={(e)=>setPostText((prev)=>(prev+e.emoji))} />
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostInputDialog;
