import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEditor, setSelectedEditor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showpopup, setShowpopup] = useState<boolean>(false);

  const { data: editors } = api.user.getEditors.useQuery();
  const { mutateAsync: getUrl } = api.upload.createPresignedUrl.useMutation();
  const { mutateAsync: createVideo } = api.upload.createVideo.useMutation();

  const { data: videoQueue } = api.upload.getVideoQueue.useQuery();

  const handleGetUrl = async () => {
    console.log(selectedEditor);
    if (!selectedFile) return toast.error("Please select a file");
    if (selectedEditor === "") return toast.error("Please select an editor");
    if (selectedEditor.length === 0)
      return toast.error("Please select an editor");
    if (!selectedDate) return toast.error("Please select a date");
    if (selectedDate === new Date().toISOString().split("T")[0])
      return toast.error("Please select a date");
    try {
      console.log(selectedFile);
      const data = await getUrl({
        fileName: selectedFile.name,
        fileType: selectedFile.type,
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
        dueDate: selectedDate,
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
        <button
          className="ml-2 rounded-md bg-blue-500 px-5 py-2 font-bold text-white"
          onClick={() => setShowpopup(true)}
        >
          Upload new video
        </button>
      </div>

      <table className="my-3 w-full table-auto p-2">
        <thead className="border-b-2 border-gray-400">
          <tr className="bg-slate-400 p-2 text-left">
            <th className="p-3">Id</th>
            <th className="p-3">Editor</th>
            <th className="p-3">Status</th>
            <th className="p-3">DueDate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-400 bg-gray-100 text-sm text-gray-700">
          {videoQueue?.length === 0 ? (
            <div className="w-full bg-white  p-5">No Vidoes </div>
          ) : (
            videoQueue?.map((video, index) => (
              <tr key={video.id} className="hover:bg-gray-200">
                <td className="p-2">{index + 1}</td>
                {/* <td className="p-2">
                <img
                  src={video.editor.image}
                  alt="profile"
                  className="h-10 w-10 rounded-full"
                />
              </td> */}
                <td className="p-2">{video.editor.name}</td>
                <td className="p-2">{video.status}</td>
                <td className="p-2">
                  {new Date(video.dueDate).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showpopup && (
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
      )}
    </div>
  );
};

export default Upload;
