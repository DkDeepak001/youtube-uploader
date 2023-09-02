import { useSession } from "next-auth/react";
import { signOut, signIn } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { Button } from "./button";

const Header = () => {
  const { data: userData, status } = useSession();
  const { data: self, isLoading } = api.user.self.useQuery();
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
  if (isLoading)
    return (
      <div className="flex flex-row justify-between border-b bg-foreground px-5 py-3">
        <h1 className="ml-3 text-2xl font-bold text-white">Youtub uploader</h1>
        <div> Loading...</div>
      </div>
    );
  return (
    <div className="flex flex-row justify-between border-b bg-foreground px-5 py-3">
      <h1 className="ml-3 text-2xl font-bold text-white">Youtub uploader</h1>
      {status === "authenticated" ? (
        <div className="flex flex-row items-center justify-center gap-x-5">
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
          <Button
            variant="default"
            // className="rounded-md bg-white px-3 py-1 text-black"
            onClick={() => void signOut()}
          >
            Logout
          </Button>
          {self?.yt_expiry_date < Date.now() && (
            <Button
              className="rounded-md bg-white px-3 py-1 text-black"
              onClick={() => void handleSwtichRoleAlert()}
            >
              {self?.role === "EDITOR" ? "Swtich Role" : "Get Access"}
            </Button>
          )}
        </div>
      ) : (
        <>
          <Button
            className="rounded-md bg-white px-3 py-1 text-black"
            onClick={() => void signIn("google")}
          >
            Login
          </Button>
        </>
      )}
    </div>
  );
};

export default Header;
