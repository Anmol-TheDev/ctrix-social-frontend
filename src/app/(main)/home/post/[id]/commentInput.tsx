"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FiSend } from "react-icons/fi";
import { Comment } from "@/types/types";
import { useRef } from "react";
import { FiX } from "react-icons/fi";
import Giphy from "@/components/Dialogs/gifDialog";
import toast from "react-hot-toast";
import Api from "@/Api/axios";

export default function CommentInput({id } : string) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [gifUrl, setGifUrl] = useState("");
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    setNewComment(e.target.value);
  };
  async function handleSubmit() {
    if (newComment === "") {
      return toast.error("Please enter a message before submit");
    }
    setIsSubmitting(true)
    try {
      const response = await Api.post(
        `/post/comments/${id}`,
        {
          content: newComment,
          giff: gifUrl,
        },
      );
      if (response.status == 200) {
        return toast.success("Reply added to post");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setNewComment("");
      setGifUrl("")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-3 border-b rounded-sm ">
      <div className="flex flex-col gap-2 ">
        <div className="flex space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <Textarea
            ref={textareaRef}
            placeholder="Write a comment..."
            value={newComment}
            onChange={handleInput}
            className="flex-1 min-h-[40px] max-h-[200px] overflow-hidden resize-none border-0 shadow-none "
          />
          <Button
            onClick={handleSubmit}
            disabled={(!newComment.trim() && !gifUrl) || isSubmitting}
          >
            <FiSend className="mr-1" />
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
        {gifUrl !== "" && (
          <div className="relative w-full aspect-video overflow-hidden rounded-md border">
            <img
              src={gifUrl}
              alt="GIF"
              className="w-full h-full object-cover z-10"
            />
            <button
              onClick={() => setGifUrl("")}
              className="absolute top-2 right-2 z-20 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full"
            >
              <FiX size={18} />
            </button>
          </div>
        )}
        {gifUrl === "" && <Giphy set={setGifUrl} />}
      </div>
    </div>
  );
}
