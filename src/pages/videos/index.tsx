import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { Badge } from "~/components/badge";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/tabel";
import { api } from "~/utils/api";

const Videos = () => {
  const router = useRouter();
  const { status } = useSession();
  if (status === "unauthenticated") router.replace("/");
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
      <h2 className="text-2xl font-medium text-foreground">Videos to edit</h2>
      <Table className="mt-5">
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="p-3">Id</TableHead>
            <TableHead className="p-3">Editor</TableHead>
            <TableHead className="p-3">Status</TableHead>
            <TableHead className="p-3">DueDate</TableHead>
            <TableHead className="p-3">Video</TableHead>
            <TableHead className="p-3">last Edit</TableHead>
            <TableHead className="p-3">Upload</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos?.length === 0 ? (
            <TableCell>No Vidoes</TableCell>
          ) : (
            videos?.map((video, index) => (
              <TableRow key={video.id} className="hover:bg-gray-200">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{video.ownerId}</TableCell>
                <TableCell>{video.status}</TableCell>
                <TableCell>
                  {new Date(video.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    className="bg-blue-500 font-bold text-white hover:bg-blue-700"
                    onClick={() => void window.open(video?.videoUrl)}
                  >
                    View
                  </Button>
                </TableCell>
                {video.rework.length >= 1 ? (
                  <TableCell>
                    <Button
                      className="bg-blue-500 font-bold text-white hover:bg-blue-700"
                      onClick={() =>
                        void window.open(video?.rework?.[0]?.videoUrl)
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                ) : (
                  <TableCell>
                    <Badge>Url not found</Badge>
                  </TableCell>
                )}
                {video.status === "EDITING" || video.status === "REWORK" ? (
                  <TableCell>
                    <Input
                      type="file"
                      onChange={(e) =>
                        void handleFileChange(e, video.videoUrl, video.id)
                      }
                    />
                  </TableCell>
                ) : (
                  <TableCell>Waiting for approval</TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Videos;
