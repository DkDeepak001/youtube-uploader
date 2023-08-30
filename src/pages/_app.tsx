import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Link from "next/link";
import Header from "~/components/header";

const sideBar = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Upload",
    link: "/upload",
  },
];

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Header />
      <div className="flex flex-row">
        <div className="flex min-h-screen w-2/12 flex-col  bg-gray-200 px-5 pt-5">
          {sideBar.map((item) => (
            <Link
              href={item.link}
              key={item.name}
              className="p-3 hover:bg-gray-300"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="w-10/12 p-5">
          <Component {...pageProps} />{" "}
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
