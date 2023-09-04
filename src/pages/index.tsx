import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

export default function Home() {
  const { data: session } = useSession();
  const { data: channelData, isLoading } = api.youtube.getChannel.useQuery(
    undefined,
    {
      enabled: !!session?.user?.email,
    }
  );
  if (!session?.user?.email) return <div>Not logged in</div>;
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      {" "}
      <div className="flex flex-row items-center  gap-x-3 py-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={channelData?.channels?.[0]?.snippet?.thumbnails?.default?.url!}
          className="h-20 w-20 rounded-full"
          alt=""
        />
        <div className="flex flex-col gap-x-2">
          <h1 className="text-lg font-medium text-foreground">
            {channelData?.channels?.[0]?.snippet?.title}
          </h1>
          <p className="text-base text-foreground">
            {channelData?.channels?.[0]?.statistics?.subscriberCount}
            {" Subscribers"} |{" "}
            {channelData?.channels?.[0]?.statistics?.videoCount}
            {" Videos "} | {channelData?.channels?.[0]?.statistics?.viewCount}
            {" Views"}
          </p>
        </div>
      </div>
    </div>
  );
}
