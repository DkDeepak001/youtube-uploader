import { api } from "~/utils/api";

export default function ChannelDetail() {
  const { data: channelData } = api.youtube.getChannel.useQuery();
  console.log(channelData);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center  gap-x-3 py-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={channelData?.channels?.[0]?.snippet?.thumbnails?.default?.url!}
          className="h-20 w-20 rounded-full"
          alt=""
        />
        <div className="flex flex-col gap-x-2">
          <h1 className="text-2xl font-bold">
            {channelData?.channels?.[0]?.snippet?.title}
          </h1>
          <p className="text-base ">
            {channelData?.channels?.[0]?.statistics?.subscriberCount}
            {" Subscribers"} |{" "}
            {channelData?.channels?.[0]?.statistics?.videoCount}
            {" Videos "} | {channelData?.channels?.[0]?.statistics?.viewCount}
            {" Views"}
          </p>
        </div>
      </div>
      {channelData?.videos?.map((video) => (
        <div
          className="flex flex-row  gap-x-10 py-2"
          key={video?.snippet?.title}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video?.snippet?.thumbnails?.default?.url!}
            className="h-28 w-36 rounded-lg"
            alt=""
          />
          <div className="mt-3 flex h-full flex-col gap-y-1">
            <h1 className="text-2xl font-bold">{video?.snippet?.title}</h1>
            <p className="text-base ">{video?.snippet?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
