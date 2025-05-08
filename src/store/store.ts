import { create } from "zustand";
import { UserData } from "@/types/types";

const useUserStore = create<UserData>((set) => ({
  data:{
    userName: "",
    userEmail: "",
    userAvatar: "",
  },
  userAvatar: "",
  userBio: "",
  followers: [],
  following: [],
  postCount: 0,
  bio: "",


}));

export default useUserStore;
