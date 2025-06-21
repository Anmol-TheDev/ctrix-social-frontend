"use client";
import Api from "@/Api/axios";
import { useEffect, use, useState } from "react";
import Post from "@/components/Post/post";
import { feedPost } from "@/types/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FiMessageCircle } from "react-icons/fi";
import CommentInput from "./commentInput";
import CommentItem from "./commentItem";
import { Comment } from "@/types/types"
import { ScrollArea } from "@/components/ui/scroll-area";
interface prop {
  params: Promise<{ id: string }>;
}

const PostDetail = ({ params }: prop) => {
  const { id } = use(params);
  const [postData, setPostData] = useState<feedPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await Api(`/post/${id}`);
        if (response.status == 200) {
          setPostData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id]);


  const addComment = (comment: Comment) => {
    setComments(prev => [comment, ...prev]);
  };

  if (postData === null) return <div>Loading...</div>;

  return (
    <ScrollArea className="max-w-2xl h-[85vh] mx-auto space-y-6">
      <Post post={postData} />

      <Card>
        <CardContent className="space-y-4 ">
          <CommentInput postId={id} />
          <div className="  space-y-4">
            <CommentItem  postId={id} />
            
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default PostDetail;
