"use client";
import PostInputDialog from "@/components/Dialogs/PostDialogbox";
import Sidebar from "@/components/HomePage/sidebar/sidebar";
import ChatComponent from "@/components/HomePage/friendsSection/chat";
import { useEffect, useState } from "react";
import { feedPost } from "@/types/types";
import Api from "@/Api/axios";
import toast from "react-hot-toast";
import { avatarExtension } from "@/app/(auth)/profileSetup/page";

const postLastUpdated = (time: string): string => {
  const postDate = new Date(time);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - postDate.getTime(); // Difference in milliseconds

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Calculate months and years more accurately
  // By comparing year and month components directly
  const postYear = postDate.getFullYear();
  const postMonth = postDate.getMonth(); // 0-11
  const postDay = postDate.getDate();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Calculate years ago
  let years = currentYear - postYear;
  if (
    currentMonth < postMonth ||
    (currentMonth === postMonth && currentDay < postDay)
  ) {
    years--; // Adjust if the current date hasn't reached the post date in the current year
  }

  // Calculate months ago (relative to the same year, or difference if years are different)
  let months = (currentYear - postYear) * 12 + (currentMonth - postMonth);
  if (currentDay < postDay) {
    months--; // Adjust if the current day hasn't reached the post day in the current month
  }
  // Only consider months if less than a year, or after accounting for full years
  const effectiveMonths = months % 12; // Months within the current year's scope

  if (years > 0) {
    return `${years} year${years === 1 ? "" : "s"} ago`;
  }
  if (months > 0) {
    // Check total months, not just effectiveMonths here for display
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }
  if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  // If less than a minute, show seconds
  return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
};

export default function PageLayout() {
  const [posts, setPosts] = useState<feedPost[]>([]);

  useEffect(() => {
    Api.get("/feed")
      .then((res) => {
        toast.success("Fetched posts successfully");
        setPosts(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        toast.error("Error fetching posts");
        console.log(err);
      });
  }, []);

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      {/* Main content area (middle) for posts */}

      <div className="container flex border-4 border-muted-foreground rounded-xl  ">
        <Sidebar />
        {/* Chat component (right section) */}

        <div className="flex-1 overflow-y-auto p-4">
          {/* Your posts content will go here */}
          <h1 className="text-2xl font-bold mb-6   px-4">Home Feed</h1>
          <div className="space-y-6 overflow-scroll h-[85vh]">
            {/* Example post items */}
            {posts.map((post,index) => (
              <div
                key={post.id}
                className="rounded-lg border p-4 bg-white shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={"avatars/" + post.avatar + avatarExtension}
                    alt={`Avatar ${index + 1}`}
                    className="h-12 w-10 border-2 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{post.username}</h3>
                    <p className="text-sm text-gray-500">
                      {postLastUpdated(post.updated_at)}
                    </p>
                  </div>
                </div>
                <p>{post.text_content}</p>
              </div>
            ))}
          </div>
        </div>
        <ChatComponent />
        <PostInputDialog />
      </div>

      {/* Sidebar (right) */}
    </div>
  );
}
