"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FiSend } from "react-icons/fi";
import { useState } from "react";
import { useDialogStore } from "@/store/store";
import EmojiPickerDialog from "./emojiPicker";
import Giphy from "./gifDialog";
import { FiX } from "react-icons/fi";
import Api from "@/Api/axios";
import toast from "react-hot-toast";

const PostCommentDialog = () => {
  const [commentMessage, setCommentMessage] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const { commentDialogBox, setCommentDialogBox } = useDialogStore();

  async function handleSubmit() {
    if (commentMessage === "") {
      return toast.error("Please enter a message before submit");
    }
    try {
      const response = await Api.post(
        `/post/comments/${commentDialogBox.postId}`,
        {
          content: commentMessage,
          giff: gifUrl,
        },
      );
      if (response.status == 200) {
        return toast.success("Reply added to post");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCommentDialogBox(false, commentDialogBox.postId);
      setCommentMessage("");
    }
  }
  return (
    <Dialog
      open={commentDialogBox.status}
      onOpenChange={() =>
        setCommentDialogBox(!commentDialogBox.status, commentDialogBox.postId)
      }
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reply to Comment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            className="min-h-[120px] resize-none  focus-visible:ring-0 text-xl"
            placeholder="Write your reply..."
            value={commentMessage}
            onChange={(e) => setCommentMessage(e.target.value)}
          />
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

        <DialogFooter className="flex flex-rowflex flex-col sm:flex-row sm:justify-between items-center gap-3 relative pt-4 justify-between">
          <div className="flex gap-2">
            <EmojiPickerDialog set={setCommentMessage} />
            <Giphy set={setGifUrl} />
          </div>
          <Button onClick={handleSubmit}>
            <FiSend className="mr-2" />
            Reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostCommentDialog;
