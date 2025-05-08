import { create } from "zustand";
import { UserData } from "@/types/types";

const useUserStore = create<UserData>((set) => ({
  data:{
    userName: "",
    userEmail: "",
    userAvatar: "",
    isLoggedIn: false,
  },
  userAvatar: "",
  userBio: "",
  followers: [],
  following: [],
  postCount: 0,
  bio: "",

    setUser: (data) => set((state) => ({ data: { ...state.data, ...data } })),
    setfollowers: (followers) => set((state) => ({ followers: [...state.followers, ...followers] })),
    setfollowing: (following) => set((state) => ({ following: [...state.following, ...following] })),
    setpostCount: (postCount) => set(() => ({ postCount: postCount })),
    setbio: (bio) => set((state) => ({ bio: bio })),
}));

export default useUserStore;
