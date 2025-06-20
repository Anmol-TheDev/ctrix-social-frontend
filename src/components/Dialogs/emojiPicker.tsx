"use client";
import EmojiPicker from "emoji-picker-react";
import { useState, useEffect, useRef } from "react";
import { FaRegSmileBeam } from "react-icons/fa";
import { Dispatch, SetStateAction } from "react";

type EmojiPickerDialogProps = {
  set: Dispatch<SetStateAction<string>>;
};

const EmojiPickerDialog = ({ set }: EmojiPickerDialogProps) => {
  const [isEmojiPicker, setIsEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (emojiRef.current && !emojiRef.current.contains(target)) {
        setIsEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setIsEmojiPicker(!isEmojiPicker)}
        className="p-2 hover:bg-primary/10 transition-colors rounded-full group"
      >
        <FaRegSmileBeam
          className={`w-5 h-5 transition-colors ${
            isEmojiPicker
              ? "text-primary"
              : "text-muted-foreground group-hover:text-primary"
          }`}
        />
      </button>
      {isEmojiPicker && (
        <div
          className="absolute bottom-full left-0 mb-2 z-50 shadow-2xl rounded-lg overflow-hidden"
          ref={emojiRef}
        >
          <EmojiPicker
            onEmojiClick={(e) => set((prev: string) => prev + e.emoji)}
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
    </>
  );
};

export default EmojiPickerDialog;
