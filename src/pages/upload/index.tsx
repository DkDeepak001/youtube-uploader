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
  DialogTrigger,
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
  TableCaption,
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
    if (selectedEditor.length === 0)
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
        editorId: selectedEditor,
        dueDate: date,
        videoUrl: data.url,
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

        <Dialog>
          <DialogTrigger className="">
            <Button>Upload new video</Button>
          </DialogTrigger>
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
          {/* <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow> */}
        </TableBody>
      </Table>

      {/* <table className="my-3 w-full table-auto p-2">
        <thead className="border-b-2 border-gray-400">
          <tr className="bg-slate-400 p-2 text-left">
            <th className="p-3">Id</th>
            <th className="p-3">Editor</th>
            <th className="p-3">Status</th>
            <th className="p-3">DueDate</th>
            <th className="p-3">Reworks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-400 bg-gray-100 text-sm text-gray-700">
          {videoQueue?.length === 0 ? (
            <div className="w-full bg-white  p-5">No Vidoes </div>
          ) : (
            videoQueue?.map((video, index) => (
              <tr
                key={video.id}
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => void router.push(`/upload/${video.id}`)}
              >
                <td className="p-2">{index + 1}</td>

                <td className="p-2">{video.editor.name}</td>
                <td className="p-2">{video.status}</td>
                <td className="p-2">
                  {new Date(video.dueDate).toLocaleDateString()}
                </td>
                <td className="p-2">{video._count?.rework} Reworked</td>
              </tr>
            ))
          )}
        </tbody>
      </table> */}

      {/* {showpopup && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="z-20 flex min-h-screen flex-col items-center justify-center ">
            <div className="z-50 flex w-96 flex-col gap-y-5 rounded-lg bg-gray-200 p-10 shadow-lg">
              <div className="flex flex-row items-center justify-between">
                <h1 className="text-2xl font-bold">Upload Video</h1>
                <button onClick={() => setShowpopup(false)}>X</button>
              </div>
              <select
                className="rounded-md border-2 border-gray-400 p-2"
                defaultValue="Select Editor"
                value={selectedEditor}
                onChange={(e) => setSelectedEditor(e.target.value)}
              >
                {[
                  {
                    id: "",
                    name: "Select Editor",
                  },
                  ...editors,
                ]?.map((editor) => (
                  <option
                    value={editor.id}
                    key={editor.id}
                    className="rounded-md border-2 border-gray-400 p-2"
                  >
                    {editor.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="rounded-md border-2 border-gray-400 p-2"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="rounded-md border-2 border-gray-400 p-2"
              />
              <button onClick={() => void handleGetUrl()}>Upload</button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Upload;
