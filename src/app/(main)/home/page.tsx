"use client";
import PostInputDialog from "@/components/Dialogs/PostDialogbox";
import Sidebar from "@/components/HomePage/sidebar/sidebar";
import ChatComponent from "@/components/HomePage/friendsSection/chat";
import { useEffect, useState } from "react";
import { feedPost } from "@/types/types";
import Api from "@/Api/axios";
import toast from "react-hot-toast";
import Post from "@/components/Post/post";
import PostCommentDialog from "@/components/Dialogs/newComment";


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
          <div className="space-y-6  h-[85vh]">
            {/* Example post items */}
            {posts.map((post, index) => (
              <Post post={post} key={index} />
            ))}
          </div>
        </div>
        <PostCommentDialog />
        <ChatComponent />
        <PostInputDialog />
      </div>

      {/* Sidebar (right) */}
    </div>
  );
}
