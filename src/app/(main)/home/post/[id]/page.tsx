"use client";
import Api from "@/Api/axios";
import { useEffect, use, useState } from "react";
import Post from "@/components/Post/post";

interface prop {
  params: Promise<{ id: string }>;
}
const postDetail = ({ params }: prop) => {
  const { id } = use(params);
  const [postData,setPostData] = useState()
  useEffect(() => {
    (async () => {
      try {
        const responce = await Api(`/post/${id}`);
          if(responce.status == 200){
            setPostData(responce.data)
          }
      } catch (error) {}
    })();
  }, [id]);

  return <div>
      <Post post={postData}/>
  </div>;
};

export default postDetail;
