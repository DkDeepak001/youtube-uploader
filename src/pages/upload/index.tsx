"use client";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/button";
import { api } from "~/utils/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "../../utils/cn";
import { Calendar } from "../../components/calender";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/popover";
import { Input } from "~/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/tabel";

const Upload = () => {
  const context = api.useContext();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEditor, setSelectedEditor] = useState<string>();
  const [date, setDate] = React.useState<Date>();
  const [isOpen, setIsOpen] = React.useState(false);

  const { data: editors } = api.user.getEditors.useQuery();
  const { mutateAsync: getUrl } = api.upload.createPresignedUrl.useMutation();
  const { mutateAsync: createVideo } = api.upload.createVideo.useMutation({
    onSuccess: async () => {
      await context.upload.getVideoQueue.invalidate();
    },
  });

  const { data: videoQueue } = api.upload.getVideoQueue.useQuery();

  const handleGetUrl = async () => {
    if (!selectedFile) return toast.error("Please select a file");
    if (selectedEditor === "") return toast.error("Please select an editor");
    if (selectedEditor?.length === 0)
      return toast.error("Please select an editor");
    if (!date) return toast.error("Please select a date");
    try {
      const data = await getUrl({
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        type: "owner",
      });
      if (!data?.url) return;

      const uploadRes = await toast.promise(
        fetch(data.url, {
          method: "PUT",
          body: selectedFile,
          headers: {
            "Content-Type": selectedFile.type,
          },
        }),
        {
          loading: "Uploading...",
          success: "Uploaded!",
          error: "Failed to upload",
        }
      );
      if (uploadRes.status !== 200) return toast.error("Failed to upload");
      const videoRes = await createVideo({
        editorId: selectedEditor!,
        dueDate: date,

        videoUrl: data.url.split("?")[0]!,
      });
      if (!videoRes?.id) return;
      toast.success("Video uploaded successfully");
    } catch (error) {
      console.log(error);
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-bold">Editing Vidoes</h2>

        <Button onClick={() => setIsOpen(true)}>Upload new video</Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Please fill out details</DialogTitle>
            </DialogHeader>
            <Select
              onValueChange={(value) => setSelectedEditor(value)}
              value={selectedEditor}
            >
              <SelectTrigger className="m-auto w-3/5">
                <SelectValue placeholder="Select Editor" />
              </SelectTrigger>
              <SelectContent>
                {editors?.map((editor) => (
                  <SelectItem value={editor.id} key={editor.id}>
                    {editor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="picture"
              type="file"
              className="m-auto w-3/5"
              onChange={handleFileChange}
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "m-auto w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              onClick={() => void handleGetUrl()}
              variant="outline"
              className="m-auto w-3/5"
            >
              Upload
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <Table className="mt-5">
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Editor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>DueDate</TableHead>
            <TableHead>Reworks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videoQueue?.length === 0 ? (
            <TableRow>
              <TableCell className="font-medium">No Vidoes</TableCell>
            </TableRow>
          ) : (
            videoQueue?.map((video, index) => (
              <TableRow
                key={video.id}
                onClick={() => void router.push(`/upload/${video.id}`)}
              >
                <TableCell>{index + 1}</TableCell>

                <TableCell>{video.editor.name}</TableCell>
                <TableCell>{video.status}</TableCell>
                <TableCell>
                  {new Date(video.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{video._count?.rework} Reworked</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Upload;
