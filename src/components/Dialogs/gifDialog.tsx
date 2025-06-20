"use client";
import { useState, useEffect, useCallback } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import { PiGifBold } from "react-icons/pi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";
const gf = new GiphyFetch("QvZLoV1GXn2qyQBC1FrE1KxfX7iCwum0");
import { Dispatch,SetStateAction } from "react";
type gifPickerDialogProps = {
  set: Dispatch<SetStateAction<string>>;
};

export default function Giphy({set}:gifPickerDialogProps) {
  const [searchTerm, setSearchTerm] = useState("trending");
  const [inputValue, setInputValue] = useState("");
  const [containerWidth, setContainerWidth] = useState(460);
  const [columns, setColumns] = useState(3);
  const [isGifOpen,setIsGifOpen]=useState(false)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(inputValue.trim() === "" ? "trending" : inputValue.trim());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;

      if (width < 480) {
        setContainerWidth(Math.min(width - 60, 320));
        setColumns(2);
      } else if (width < 640) {
        setContainerWidth(Math.min(width - 80, 380));
        setColumns(2);
      } else if (width < 768) {
        setContainerWidth(Math.min(width - 120, 460));
        setColumns(3);
      } else {
        setContainerWidth(460);
        setColumns(3);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const fetchGifs = useCallback(
    (offset: number) => gf.search(searchTerm, { offset, limit: 10 }),
    [searchTerm],
  );

  return (
    <Dialog open={isGifOpen} onOpenChange={setIsGifOpen} >
      <DialogTrigger asChild>
        <Button
          
          className="p-2 hover:bg-primary/10 transition-colors rounded-full group  "
          variant="ghost"
        >
          <PiGifBold className="w-5 h-5 " />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[70vh] min-h-[60vh] px-0 flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Choose a GIF
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Search GIFs..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full"
          />
          <div className="overflow-hidden ">
            <ScrollArea
              className="h-[70dvh]"
              style={{
                maxHeight: "calc(70vh - 160px)",
                minHeight: "300px",
              }}
            >
              <Grid
                key={searchTerm}
                fetchGifs={fetchGifs}
                width={containerWidth}
                columns={columns}
                gutter={6}
                onGifClick={(gif, e) => {
                  e.preventDefault();
                  set(gif.images.original.url)
                  setIsGifOpen(false)
                }}
              />
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
