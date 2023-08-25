import { api } from "~/utils/api";
import { signIn } from "next-auth/react";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <div>Helloworld</div>
    </>
  );
}
