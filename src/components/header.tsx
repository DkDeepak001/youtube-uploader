import React from "react";
import { useSession } from "next-auth/react";
import { signOut, signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { Button } from "./button";

const Header = () => {
  const { data: sessionData, status } = useSession();

  const handleSignIn = () => {
    signIn("google");
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully.");
  };

  return (
    <div className="flex flex-row justify-between bg-foreground px-5 py-3">
      <h1 className="ml-3 text-2xl font-bold text-white">YouTube Uploader</h1>
      {status === "authenticated" ? (
        <Button onClick={handleSignOut}>Sign Out</Button>
      ) : (
        <Button onClick={handleSignIn}>Sign In</Button>
      )}
    </div>
  );
};

export default Header;
