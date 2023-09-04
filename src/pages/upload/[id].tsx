import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { Badge } from "~/components/badge";
import { Button } from "~/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/dialog";
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

const VideoStatus = () => {
  const [title, setTitle] = React.useState("");

  const [description, setDescription] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const { data: userData } = useSession();

  const { id } = useRouter().query;
  const { data: video } = api.upload.getQueueStatus.useQuery(
    { id: id as string },
    {
      enabled: !!id,
    }
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const context = api.useContext();
  const { mutateAsync: changeStatus } = api.upload.changeStatus.useMutation({
    onSuccess: async () => {
      await context?.upload.getQueueStatus.invalidate();
    },
  });

  const handleChangeStatus = async (
    id: string,
    status: "EDITING" | "READY" | "REWORK" | "APPROVED" | "PUBLISHED"
  ) => {
    try {
      await toast.promise(
        changeStatus({ id, status }),
        {
          loading: "Changing Status",
          success: "Status Changed",
          error: "Error while changing status",
        },
        {
          style: {
            minWidth: "250px",
          },
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Please select a file");
    if (!title) return toast.error("Please enter title");
    if (!description) return toast.error("Please enter description");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title);
    formData.append("description", description);

    await fetch(`/api/upload?userid=${userData?.user.id}`, {
      method: "POST",
      body: formData,
    });
  };

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
                        void handleChangeStatus(video.id, "APPROVED")
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
                      variant="default"
                      onClick={() =>
                        void handleChangeStatus(video.id, "REWORK")
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
      {video?.status === "APPROVED" && (
        <div className="mt-5 flex flex-row justify-end gap-x-5">
          <Button
            className="bg-green-500  font-bold text-white hover:bg-green-700"
            onClick={() => setIsOpen(true)}
          >
            Publish
          </Button>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please fill details To Publish Video</DialogTitle>
          </DialogHeader>
          <Input
            className="w-full"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            className=" w-full"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input type="file" onChange={handleFileChange} />
          <Button
            className="bg-green-500  font-bold text-white hover:bg-green-700"
            onClick={() => void handleUpload()}
          >
            Publish
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoStatus;
