import { create } from "zustand";
import { User, UserProfile } from "@/types/types";

type UserStore = {
  user: User | null;
  profile: UserProfile | null;
  setUser: (data: User) => void;
  setfollowers: (followers: string[]) => void;
  setfollowing: (following: string[]) => void;
  setpostCount: (postCount: number) => void;
  setbio: (bio: string) => void;
};

type DialogStore ={
  postDialogBox : boolean,
  setPostDialogBox : (status : boolean) => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  profile: null,

  setUser: (data: Partial<User>) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, ...data }
        : ({
            ...data,
            isLoggedIn: true,
          } as User),
    })),
  setfollowers: (followers: string[]) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, followers } : null,
    })),
  setfollowing: (following: string[]) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, following } : null,
    })),
  setpostCount: (postCount: number) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, postCount } : null,
    })),
  setbio: (bio: string) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, bio } : null,
    })),
}));

const useDialogStore = create <DialogStore> ((set) => ({
  postDialogBox: false,

  setPostDialogBox: (status: boolean) => set(() => ({ postDialogBox: status,})),


}));

export { useUserStore,useDialogStore};
