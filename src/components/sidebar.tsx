"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { EditorSideBar, OwnerSideBar } from "~/constants/sidebars";
import { api } from "~/utils/api";
import { Button } from "./button";

const Sidebar = () => {
  const { data: self, isLoading } = api.user.self.useQuery();
  const { data: userData, status } = useSession();
  const { mutateAsync: genUrl } = api.youtube.genUrl.useMutation();
  const [firstTime, setFirstTime] = useState<boolean>(true);

  const handleGetYoutubeAccess = async () => {
    try {
      const url = await genUrl();
      window.open(url, "_blank");
    } catch (error) {
      console.log(error);
    }
  };
  const handleSwtichRoleAlert = async () => {
    if (self?.role === "EDITOR" && firstTime) {
      setFirstTime(false);
      toast.custom((t) => (
        <div className="z-30 flex flex-col items-center justify-between rounded-lg bg-white p-5 shadow-lg">
          <p>Are you sure you want to switch to Editor?</p>
          <div className="flex flex-row gap-x-2">
            <Button
              className="rounded-md bg-green-400 px-3 py-1 text-white"
              onClick={() => {
                void toast.dismiss(t.id);
                void handleGetYoutubeAccess();
              }}
            >
              Yes
            </Button>
            <button
              className="rounded-md bg-red-400 px-3 py-1 text-white"
              onClick={() => {
                void toast.dismiss(t.id);
                setFirstTime(true);
              }}
            >
              No
            </button>
          </div>
        </div>
      ));
    } else {
      setFirstTime(false);
      await handleGetYoutubeAccess();
    }
  };

  const sideBar = self?.role === "OWNER" ? OwnerSideBar : EditorSideBar;
  if (isLoading)
    return (
      <div className="flex min-h-screen w-2/12 flex-col justify-between bg-foreground ">
        <div className="flex flex-col  bg-foreground px-5 pt-5">
          {sideBar.map((item) => (
            <Link
              href={item.link}
              key={item.name}
              className="p-3 font-medium text-background"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen w-2/12 flex-col justify-between bg-foreground ">
      <div className="flex flex-col  bg-foreground px-5 pt-5">
        {sideBar.map((item) => (
          <Link
            href={item.link}
            key={item.name}
            className="p-3 font-medium text-background"
          >
            {item.name}
          </Link>
        ))}
      </div>
      {status === "authenticated" ? (
        <div className="mb-10 ml-5 flex w-full flex-col justify-center gap-x-5 gap-y-5 ">
          <div className="flex flex-row items-center justify-start gap-x-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Profile picture"
              src={userData?.user?.image!}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <h2 className="font-bold text-white ">{userData?.user?.name}</h2>
              <h3 className="text-sm text-white">{userData?.user?.email}</h3>
            </div>
          </div>
          <div className="flex flex-row items-center justify-start  gap-x-2">
            <Button
              variant="default"
              // className="rounded-md bg-white px-3 py-1 text-black"
              onClick={() => void signOut()}
            >
              Logout
            </Button>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            {self?.yt_expiry_date < Date.now() && (
              <Button
                className="rounded-md bg-white px-3 py-1 text-black"
                onClick={() => void handleSwtichRoleAlert()}
              >
                {self?.role === "EDITOR" ? "Swtich Role" : "Get Access"}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Button
          className="mx-10 mb-6"
          variant="outline"
          onClick={() => void signIn("google")}
        >
          Login
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
