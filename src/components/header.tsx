import { useSession } from "next-auth/react";
import { signOut, signIn } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

const Header = () => {
  const { data: userData, status } = useSession();
  const { data: self, isLoading } = api.user.self.useQuery();
  const { mutateAsync: genUrl } = api.youtube.genUrl.useMutation();

  const handleGetYoutubeAccess = async () => {
    try {
      const url = await genUrl();
      window.open(url, "_blank");
    } catch (error) {
      console.log(error);
    }
  };
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-row justify-between bg-red-500 px-5 py-3">
      <h1 className="ml-3 text-2xl font-bold text-white">Youtub uploader</h1>
      {status === "authenticated" ? (
        <div className="flex flex-row items-center justify-center gap-x-5">
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
          <button
            className="rounded-md bg-white px-3 py-1 text-black"
            onClick={() => void signOut()}
          >
            Logout
          </button>
          {self?.yt_expiry_date < Date.now() && (
            <button
              className="rounded-md bg-white px-3 py-1 text-black"
              onClick={() => void handleGetYoutubeAccess()}
            >
              Refresh Token
            </button>
          )}
        </div>
      ) : (
        <>
          <button
            className="rounded-md bg-white px-3 py-1 text-black"
            onClick={() => void signIn()}
          >
            Login
          </button>
        </>
      )}
    </div>
  );
};

export default Header;
