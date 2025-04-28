"use client"
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
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function GhibliSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup attempt with:", { email, username, password });
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
            <CardTitle className="text-2xl font-bold">Join Our Adventure</CardTitle>
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
                    placeholder="your_username"
                    type="text" 
                    className="pl-10"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
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
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
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
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
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
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <FaGoogle className="text-sm" />
                <span>Google</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2">
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