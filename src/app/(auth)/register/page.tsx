"use client";
import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { GiWindmill, GiButterflyFlower } from "react-icons/gi";
import { TbTree } from "react-icons/tb";
import { FcLandscape } from "react-icons/fc";
import { FaGoogle, FaGithub } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Api from "@/Api/axios";
import { useUserStore } from "@/store/store";
import { useRouter } from "next/navigation";

export default function GhibliSignupPage() {
  const router = useRouter()
  const { setUser } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    username: "",
    password: "",
    genral: "",
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username) {
      setError((prev) => ({ ...prev, username: "Username is required" }));
      return;
    }
    if (!formData.email) {
      setError((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (formData.password.length < 6) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      return;
    }

    Api.post(
      "auth/signup",
      {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      },
      { headers: { "content-type": "application/x-www-form-urlencoded" } }
    )
      .then((response) => {
        if (response.status == 200) {
          fetch("/server/setCookie",{
            method: "POST",
            headers:{ "Content-Type": "application/json"},
            body: JSON.stringify({token:response.data.tokenValue})
          })
          setUser({
            userName: formData.username,
            userEmail: formData.email,
            userAvatar: "",
            isLoggedIn: true,})
        }
        router.replace("/profileSetup")
      })
      .catch((error) => {
        if (error.status === 400) {
          setError((prev) => ({ ...prev, genral: "User already exists" }));
          return;
        } else {
          setError((prev) => ({ ...prev, genral: "Something went wrong" }));
          return;
        }
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* Decorative elements */}
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

      {/* Signup Card using shadcn Card component */}
      <div className="relative w-full max-w-md">
        <Card className="border-4 border-muted-foreground shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <GiWindmill className="text-5xl" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Join Our Adventure
            </CardTitle>
            <CardDescription>
              Create your account to begin your journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser />
                  </div>
                  <Input
                    id="username"
                    name="username"
                    placeholder="your_username"
                    type="text"
                    className={`pl-10 ${
                      error.username != "" ? "border-red-400" : ""
                    } `}
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>
                {error.username && (
                  <Label className="py-[1px] text-red-500">
                    {error.username}
                  </Label>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope />
                  </div>
                  <Input
                    id="email"
                    placeholder="your.email@example.com"
                    type="email"
                    className={`pl-10 ${
                      error.email != "" ? "border-red-400" : ""
                    } `}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                {error.email && (
                  <Label className="py-[1px] text-red-500">{error.email}</Label>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-10 ${
                      error.password != "" ? "border-red-400" : ""
                    } `}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                {error.password && (
                  <Label className="py-[1px] text-red-500">
                    {error.password}
                  </Label>
                )}
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <Separator />
              <div className="relative flex justify-center text-xs uppercase -mt-2.5">
                <span className="bg-card px-2">or sign up with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <FaGoogle className="text-sm" />
                <span>Google</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <FaGithub className="text-sm" />
                <span>GitHub</span>
              </Button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login " className="p-0 h-auto hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
