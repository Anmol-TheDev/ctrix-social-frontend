"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FiPaperclip, FiSend } from "react-icons/fi";
import { useState } from "react";
import { useDialogStore } from "@/store/store";

type comment = {
  message: string;
  gif: string;
  media: File | null;
};

const PostCommentDialog = () => {
  const [commendData, setCommentData] = useState<comment>({
    message: "",
    gif: "",
    media: null,
  });
  const { commentDialogBox, setCommentDialogBox } = useDialogStore();
  return (
    <Dialog open={commentDialogBox} onOpenChange={setCommentDialogBox}>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reply to Comment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            placeholder="Write your reply..."
            value={commendData.message}
            onChange={(e) =>
              setCommentData((prev) => ({ ...prev, message: e.target.value }))
            }
          />
          <div className="flex items-center gap-2">
            <label
              htmlFor="mediaUpload"
              className="cursor-pointer text-sm text-muted-foreground hover:underline flex items-center gap-1"
            >
              <FiPaperclip className="text-base" />
              Attach file
            </label>
            {/* {media && (
              <span className="text-xs text-foreground truncate max-w-[150px]">
                {media.name}
              </span>
            )} */}
            {/* <input
              id="mediaUpload"
              type="file"
              className="hidden"
              onChange={(e) => setMedia(e.target.files?.[0] || null)}
            /> */}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setCommentDialogBox(false)}>
            Cancel
          </Button>
          <Button>
            <FiSend className="mr-2" />
            Reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostCommentDialog;
