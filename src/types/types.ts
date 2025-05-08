type user ={
    userName: string,
    userEmail: string,
    userAvatar: string,
    isLoggedIn: boolean,
}

type UserData = {
    userAvatar: string,
    data:user
    userBio: string,
    followers: string[],
    following: string[],
    postCount: number,
    bio: string,
   setUser?: (data: user) => void,
   setfollowers?: (followers: string[]) => void,
   setfollowing?: (following: string[]) => void,
   setpostCount?: (postCount: number) => void,
   setbio?: (bio: string) => void,
}


export type { UserData }