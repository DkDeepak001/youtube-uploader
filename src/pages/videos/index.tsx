import React from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const Videos = () => {
  const { data: videos } = api.upload.videosToEdit.useQuery();

  const { mutateAsync: getUrl } = api.upload.createPresignedUrl.useMutation();
  const { mutateAsync: updateVideoStauts } =
    api.upload.videoEdited.useMutation();

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    oldUrl: string,
    id: string
  ) => {
    const file = e?.target?.files?.[0];
    if (!file) toast.error("Please select a file");
    const oldPath = oldUrl.split("upload-videos.localhost/")[1]?.split("?")[0];
    const url = await getUrl({
      fileName: file?.name!,
      fileType: file?.type!,
      type: "editor",
      oldFilePath: oldPath?.split(".")[0],
    });

    if (!url?.url) return toast.error("Failed to upload");
    const uploadRes = await toast.promise(
      fetch(url?.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file?.type!,
        },
      }),
      {
        loading: "Uploading...",
        success: "Uploaded!",
        error: "Failed to upload",
      }
    );
    if (uploadRes.status !== 200) return toast.error("Failed to upload");
    await toast.promise(
      updateVideoStauts({
        videoUrl: uploadRes.url,
        id,
      }),
      {
        loading: "Updating...",
        success: "Updated!",
        error: "Failed to update",
      }
    );
  };

  return (
    <div>
      <table className="my-3 w-full table-auto p-2">
        <thead className="border-b-2 border-gray-400">
          <tr className="bg-slate-400 p-2 text-left">
            <th className="p-3">Id</th>
            <th className="p-3">Editor</th>
            <th className="p-3">Status</th>
            <th className="p-3">DueDate</th>
            <th className="p-3">Video</th>
            <th className="p-3">last Edit</th>
            <th className="p-3">Upload</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-400 bg-gray-100 text-sm text-gray-700">
          {videos?.length === 0 ? (
            <div className="w-full bg-white  p-5">No Vidoes</div>
          ) : (
            videos?.map((video, index) => (
              <tr key={video.id} className="cursor-pointer hover:bg-gray-200">
                <td className="p-2">{index + 1}</td>

                <td className="p-2">{video.ownerId}</td>
                <td className="p-2">{video.status}</td>
                <td className="p-2">
                  {new Date(video.dueDate).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <button
                    className="rounded-md bg-blue-500 px-5 py-2 text-white"
                    onClick={() => void window.open(video?.videoUrl)}
                  >
                    open
                  </button>
                </td>
                {video.rework.length >= 1 ? (
                  <td className="p-2">
                    <button
                      className="rounded-md bg-blue-500 px-5 py-2 text-white"
                      onClick={() =>
                        void window.open(video?.rework?.[0]?.videoUrl)
                      }
                    >
                      open
                    </button>
                  </td>
                ) : (
                  <td className="p-2">Url not found</td>
                )}
                {video.status === "EDITING" || video.status === "REWORK" ? (
                  <td className="p-2">
                    <input
                      type="file"
                      onChange={(e) =>
                        void handleFileChange(e, video.videoUrl, video.id)
                      }
                    />
                  </td>
                ) : (
                  <td className="p-2">Waiting for approval</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Videos;
