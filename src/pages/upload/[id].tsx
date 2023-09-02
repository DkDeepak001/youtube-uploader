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
  const { mutate: changeStatus } = api.upload.changeStatus.useMutation();

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
      <table className="my-3 w-full table-auto p-2">
        <thead className="border-b-2 border-gray-400">
          <tr className="bg-slate-400 p-2 text-left">
            <th className="p-3">Id</th>
            <th className="p-3">Edited At</th>
            <th className="p-3">Video</th>
            <th className="p-3">Approve</th>
            <th className="p-3">Rework</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-400 bg-gray-100 text-sm text-gray-700">
          {video?.length === 0 ? (
            <div className="w-full bg-white  p-5">No Vidoes </div>
          ) : (
            video?.rework?.map((v, index) => (
              <tr
                key={v.id}
                className="cursor-pointer hover:bg-gray-200"
                // onClick={() => void router.push(`/upload/${video.id}`)}
              >
                <td className="p-2">{index + 1}</td>

                <td className="p-2">
                  {" "}
                  {new Date(v?.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <button
                    className="rounded-md bg-blue-500 px-5 py-2 text-white"
                    onClick={() => void window.open(v?.videoUrl)}
                  >
                    View
                  </button>
                </td>
                <td className="p-2">
                  {index === video.rework.length - 1 &&
                  video.status !== "APPROVED" ? (
                    <button
                      className="rounded-md bg-green-500 px-5 py-2 text-white"
                      onClick={() =>
                        changeStatus({ id: video.id, status: "APPROVED" })
                      }
                    >
                      Approve
                    </button>
                  ) : (
                    <div className="">___________</div>
                  )}
                </td>
                <td className="p-2">
                  {index === video.rework.length - 1 &&
                  video.status !== "REWORK" ? (
                    <button
                      className="rounded-md bg-red-500 px-5 py-2 text-white"
                      onClick={() =>
                        changeStatus({ id: video.id, status: "REWORK" })
                      }
                    >
                      Ask For Rework
                    </button>
                  ) : (
                    <div className="">___________</div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VideoStatus;
