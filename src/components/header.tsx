import { useSession } from "next-auth/react";
import { signOut, signIn } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { Button } from "./button";

const Header = () => {
  // if (isLoading)
  //   return (
  //     <div className="flex flex-row justify-between bg-foreground px-5 py-3">
  //       <h1 className="ml-3 text-2xl font-bold text-white">Youtub uploader</h1>
  //       <div> Loading...</div>
  //     </div>
  //   );
  return (
    <div className="flex flex-row justify-between  bg-foreground px-5 py-3">
      <h1 className="ml-3 text-2xl font-bold text-white">Youtub uploader</h1>
    </div>
  );
};

export default Header;
