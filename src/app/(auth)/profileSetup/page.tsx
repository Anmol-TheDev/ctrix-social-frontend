"use client";
import { useState } from "react";
import { FaChevronRight, FaSave } from "react-icons/fa";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GiWindmill, GiButterflyFlower } from "react-icons/gi";
import { TbTree } from "react-icons/tb";
import { FcLandscape } from "react-icons/fc";

// Predefined avatars
const predefinedAvatars = [
  "/avtars/ChatGPT_Image_Apr_29__2025__03_54_44_PM-removebg-preview.png",
  "/avtars/ChatGPT Image Apr 29, 2025, 03_55_08 PM.png",
  "/avtars/image.png",
  "/avtars/image copy.png",
  "/avtars/image copy 2.png",
  "/avtars/image copy 3.png",
];

// Main component
export default function ProfileSetup() {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [savedImage, setSavedImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  // Handle avatar selection
  const handleAvatarSelect = (index: number) => {
    setSelectedAvatar(index);
  };

  // Handle save
  const handleSave = () => {
    if (selectedAvatar !== null) {
      setSavedImage(predefinedAvatars[selectedAvatar]);
      setSuccessMessage(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
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
                  onClick={() => handleAvatarSelect(index)}
                  className={`w-full aspect-square rounded-full overflow-hidden cursor-pointer border-4 ${
                    selectedAvatar === index
                      ? "border-muted"
                      : "border-transparent"
                  } transition-all hover:scale-105`}>
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className=""
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="">
              Bio
            </Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className=""
            />
          </div>

          {successMessage && (
            <Alert className="">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your profile has been updated successfully.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-end border-t ">
          <Button>
            Next <FaChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
