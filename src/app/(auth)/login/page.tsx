"use client";
import { FormEvent, useState } from "react";
import Api from "@/Api/axios";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { GiWindmill, GiButterflyFlower } from "react-icons/gi";
import { TbTree } from "react-icons/tb";
import { FcLandscape } from "react-icons/fc";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function GhibliLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    username: "",
    password: "",
    genral: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.username) {
      setError((prev) => ({ ...prev, username: "Username is required" }));
      return;
    }
    if (formData.password.length < 6) {
      setError((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }

    Api.post("auth/login", {
      username: formData.username,
      password: formData.password,
    },{ headers: { "content-type": "application/x-www-form-urlencoded" } })
      .then((response) => {
        if (response.status === 200) {
          fetch("/server/setCookie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: response.data.tokenValue }),
          });
        }
      })
      .catch((error) => {
        if (error.status === 404) {
          setError((prev) => ({ ...prev, genral: "User not found" }));
        } else if (error.response.status == 401) {
          setError((prev) => ({
            ...prev,
            genral: "Incorrect email or password",
          }));
          return;
        } else {
          setError((prev) => ({
            ...prev,
            genral: "An error occurred. Please try again.",
          }));
        }
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center ">
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

      {/* Login Card */}
      <Card className="w-full max-w-md shadow-lg border-4 border-muted-foreground backdrop-blur-sm ">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <GiWindmill className="text-5xl" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to continue your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser />
                  </div>
                  <Input
                    id="username"
                    placeholder="your username"
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
              <div className="flex items-center justify-between">
                <a href="#" className="text-sm hover:underline">
                  Forgot password?
                </a>
              </div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-secondary px-2">or continue with</span>
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
            Don't have an account?{" "}
            <Link href="/register" className="hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
