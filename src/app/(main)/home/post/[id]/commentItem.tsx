import { FiHeart, FiMessageCircle, FiMoreHorizontal } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment } from "@/types/types"
import { useEffect, useState } from "react";
import Api from "@/Api/axios";
import { avatarExtension } from "@/app/(auth)/profileSetup/page";


export default function CommentItem({ postId }: { postId: string }) {
  const [commentsData, setcommentsData] = useState<Comment[]>([]);
  useEffect(()=>{
    (async()=>{
     const responce = await Api(`/post/comments/${postId}`)
     if(responce.status == 200) {
       setcommentsData(responce.data)
       return 
     }
    })()
  },[postId])
  
  return (
    commentsData.map((comment)=>(
      <Card key={comment.id} className="border-0 shadow-sm rounded-sm py-2">
        <CardContent className="p-0 ">
          <div className="flex space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={"/avatars/"+comment.avatar + avatarExtension} />
              <AvatarFallback>{comment.username}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm">{comment.username}</span>
                <span className="text-xs text-gray-500">{comment.createdAt}</span>
              </div>
              {comment.content && <p className="text-sm">{comment.content}</p>}
              {comment.giff && (
                <img src={comment.giff} alt="GIF" className="rounded max-h-32 object-cover" />
              )}
              <div className="flex space-x-4 text-xs text-gray-500 mt-2">
                <button className="flex items-center space-x-1 hover:text-red-500">
                  <FiHeart className="w-4 h-4" />
                  <span>{comment.likesCount}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-blue-500">
                  <FiMessageCircle className="w-4 h-4" />
                  <span>Reply</span>
                </button>
                <FiMoreHorizontal className="w-4 h-4 ml-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))
  );
}
