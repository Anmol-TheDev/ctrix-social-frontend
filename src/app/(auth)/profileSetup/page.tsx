"use client";
import { useState } from "react";
import { FaChevronRight, FaSave } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GiWindmill, GiButterflyFlower } from "react-icons/gi";
import { TbTree } from "react-icons/tb";
import { FcLandscape } from "react-icons/fc";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import Api from "@/Api/axios";
import { useRouter } from "next/navigation";

export const avatarExtension = ".png"
export const predefinedAvatars = [
  "crawk",
  "gojo",
  "itachi",
  "kakashi",
  "sasuke",
  "zoro",
];

export default function ProfileSetup() {
  const router = useRouter()
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const  handleSave = () => {
    detailValidation(gender,selectedAvatar,bio);
    try {
      Api.post("/profile/profile-setup",{
        bio:bio,
        gender:gender,
        avatar:selectedAvatar
      }).then((res)=>{
        if(res.status == 200){
          router.replace("/home")
        }
      })
    } catch (error) {
      console.log(error)
    }

  };
  return (
    <div
      className={`min-h-screen  flex items-center justify-center p-4 relative`}
    >
      <div className="fixed top-20 left-10 opacity-30 animate-bounce duration-1000">
        <GiWindmill className="text-6xl text-sky-50" />
      </div>
      <div className="fixed bottom-20 right-10 opacity-30 animate-pulse duration-3000">
        <TbTree className="text-6xl text-sky-50" />
      </div>
      <div className="fixed top-1/4 right-1/4 opacity-20 animate-pulse duration-2000">
        <GiButterflyFlower className="text-4xl text-sky-50" />
      </div>
      <div className="fixed bottom-1/4 left-1/4 opacity-20">
        <FcLandscape className="text-6xl" />
      </div>

      <Card
        className={`w-full max-w-3xl shadow-xl border-muted-foreground border-4 `}
      >
        <CardHeader className="text-center border-b-4 pb-6">
          <CardTitle className="text-3xl font-bold ">Profile Setup</CardTitle>
          <CardDescription className="t">
            Create your magical profile
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div>
            <h3 className="text-lg font-medium  mb-4">Choose Your Avatar</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {predefinedAvatars.map((avatar, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-full aspect-square rounded-full overflow-hidden cursor-pointer border-4 ${
                    selectedAvatar === avatar
                      ? "border-muted"
                      : "border-transparent"
                  } transition-all hover:scale-105`}
                >
                  <img
                    src={"avatars/"+avatar + avatarExtension}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-lg font-medium">Gender</Label>
            <div className="flex gap-2">
              <Checkbox
                checked={gender == "male"}
                id="male"
                onCheckedChange={(e) => {
                  e == true ? setGender("male") : setGender("");
                }}
              />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex gap-2">
              <Checkbox
                checked={gender == "female"}
                id="female"
                onCheckedChange={(e) => {
                  e == true ? setGender("female") : setGender("");
                }}
              />
              <Label htmlFor="female">female</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-lg font-medium">
              Bio
            </Label>

            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              maxLength={200}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t ">
          <Button onClick={handleSave}>
            Next <FaChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function detailValidation(gender: string,avtar:string ,bio: string) {
  if(avtar === ""){
    toast.error("select a profile picture ")
    return 
  }
  if (gender === "") {
    toast.error("Please sleact a gender");
    return 
  }


}
