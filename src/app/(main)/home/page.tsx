"use client";
import { useEffect, useState } from "react";
import { feedPost } from "@/types/types";
import Api from "@/Api/axios";
import toast from "react-hot-toast";
import Post from "@/components/Post/post";

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
    <>
      {posts.map((post, index) => (
        <Post post={post} key={index} />
      ))}
    </>
  );
}
