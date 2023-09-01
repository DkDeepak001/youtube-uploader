import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

const VideoStatus = () => {
  const { id } = useRouter().query;
  const { data: video } = api.upload.getQueueStatus.useQuery(
    { id: id as string },
    {
      enabled: !!id,
    }
  );
  return (
    <div className="felx flex-col">
      <div className="flex flex-row items-center gap-x-16 rounded-lg bg-gray-500 p-5">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-xl font-bold text-white">Video Status</h1>
          <h2 className="text-lg font-bold text-white">{video?.status}</h2>
        </div>
        <div className="flex flex-col gap-y-2">
          <h1 className="text-xl font-bold text-white"> Editor</h1>
          <div className="flex flex-row items-center gap-x-2">
            <img
              src={video?.editor?.image}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
            <h2 className="text-lg font-bold text-white">
              {video?.editor?.name}
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <h1 className="text-xl font-bold text-white">Due Date</h1>
          <h2 className="text-lg font-bold text-white">
            {new Date(video?.dueDate).toLocaleDateString()}
          </h2>
        </div>
        <div className="flex flex-col gap-y-2">
          <h1 className="text-xl font-bold text-white">Original Url</h1>
          <div
            className="w-[500px]  cursor-pointer truncate"
            onClick={() => window.open(video?.videoUrl, "_blank")}
          >
            <p className="truncate text-xl text-white">{video?.videoUrl}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStatus;
