import { useState } from "react";
import { InputText } from "primereact/inputtext";
import ChannelDetail from "~/components/channelDetail";
import { useSession } from "next-auth/react";

export default function Home() {
  return (
    <>
      <ChannelDetail />
    </>
  );
}
