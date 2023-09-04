import { api } from "~/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export default function ChannelDetail() {
  const { data: channelData, isLoading } = api.youtube.getChannel.useQuery();
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-row items-center  gap-x-3 py-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={channelData?.channels?.[0]?.snippet?.thumbnails?.default?.url!}
          className="h-20 w-20 rounded-full"
          alt=""
        />
        <div className="flex flex-col gap-x-2">
          <h1 className="text-background">
            {channelData?.channels?.[0]?.snippet?.title}
          </h1>
          <p className="text-base text-background">
            {channelData?.channels?.[0]?.statistics?.subscriberCount}
            {" Subscribers"} |{" "}
            {channelData?.channels?.[0]?.statistics?.videoCount}
            {" Videos "} | {channelData?.channels?.[0]?.statistics?.viewCount}
            {" Views"}
          </p>
        </div>
      </div>
      <div className="flex flex-row flex-wrap  gap-x-5  gap-y-10">
        {channelData?.videos?.map((video, i) => (
          <Card className="w-1/5" key={i}>
            <img
              src={video?.snippet?.thumbnails?.high?.url!}
              className=" m-auto w-10/12 rounded-3xl"
              alt=""
            />
            <CardHeader>
              <CardTitle> {video?.snippet?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{video?.snippet?.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
