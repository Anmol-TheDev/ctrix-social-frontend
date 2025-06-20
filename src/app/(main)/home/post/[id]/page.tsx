"use client";
import Api from "@/Api/axios";
import { useEffect, use, useState } from "react";
import Post from "@/components/Post/post";
import { feedPost } from "@/types/types";


interface prop {
  params: Promise<{ id: string }>;
}
const PostDetail = ({ params }: prop) => {
  const { id } = use(params);
  const [postData,setPostData] = useState<feedPost | null >(null)
  useEffect(() => {
    (async () => {
      try {
        const responce = await Api(`/post/${id}`);
          if(responce.status == 200){
            setPostData(responce.data)
          }
      } catch (error) {
        console.log(error)
      }
    })();
  }, [id]);
  
  if (postData === null) return 

  return <div>
      <Post post={postData}/>
  </div>;
};

export default PostDetail;
