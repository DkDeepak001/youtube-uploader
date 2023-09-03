import { useRouter } from "next/router";
import React from "react";
import { Badge } from "~/components/badge";
import { Button } from "~/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/tabel";
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
      <div className="flex flex-row items-center gap-x-10 rounded-lg bg-foreground p-5">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-lg font-semibold text-white">Video Status</h1>
          <Badge
            variant="default"
            className="items-center justify-center py-1 text-center"
          >
            {video?.status}
          </Badge>
        </div>
        <div className="flex flex-col gap-y-2">
          <h1 className="text-lg font-semibold text-white"> Editor</h1>
          <div className="flex flex-row items-center gap-x-2">
            <img
              src={video?.editor?.image}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
            <h2 className="text-lg font-bold text-white/80">
              {video?.editor?.name}
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <h1 className="text-lg font-semibold text-white">Due Date</h1>
          <h2 className="text-base font-medium text-white/80">
            {new Date(video?.dueDate).toLocaleDateString()}
          </h2>
        </div>
        <div className="flex flex-col gap-y-2">
          <h1 className="text-lg font-semibold text-white">Original Url</h1>
          <div
            className="w-[500px]  cursor-pointer truncate"
            onClick={() => window.open(video?.videoUrl, "_blank")}
          >
            <p className="text-baes truncate text-white/80">
              {video?.videoUrl}
            </p>
          </div>
        </div>
      </div>

      <Table className="mt-5">
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="p-3">Id</TableHead>
            <TableHead className="p-3">Edited At</TableHead>
            <TableHead className="p-3">Video</TableHead>
            <TableHead className="p-3">Approve</TableHead>
            <TableHead className="p-3">Rework</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {video?.length === 0 ? (
            <TableRow>
              <TableCell className="font-medium">No Vidoes</TableCell>
            </TableRow>
          ) : (
            video?.rework?.map((v, index) => (
              <TableRow key={v.id}>
                <TableCell className="p-3">{index + 1}</TableCell>
                <TableCell className="p-3">
                  {" "}
                  {new Date(v?.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="p-3">
                  <Button
                    variant="destructive"
                    onClick={() => void window.open(v?.videoUrl)}
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell className="p-3">
                  {index === video.rework.length - 1 &&
                  video.status !== "APPROVED" ? (
                    <Button
                      className=" bg-green-500 px-5 py-2 text-white hover:bg-green-700"
                      onClick={() =>
                        changeStatus({ id: video.id, status: "APPROVED" })
                      }
                    >
                      Approve
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="text-center">
                      _____________
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="p-3">
                  {index === video.rework.length - 1 &&
                  video.status !== "REWORK" ? (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        changeStatus({ id: video.id, status: "REWORK" })
                      }
                    >
                      Ask For Rework
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="text-center">
                      _____________
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* <table className="my-3 w-full table-auto p-2">
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
      </table> */}
    </div>
  );
};

export default VideoStatus;
