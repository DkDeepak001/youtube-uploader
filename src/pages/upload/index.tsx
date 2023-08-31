import { useState } from "react";
import { api } from "~/utils/api";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutateAsync: getUrl } = api.upload.createPresignedUrl.useMutation();

  const handleGetUrl = async () => {
    if (!selectedFile) alert("Please select a file");
    try {
      console.log("handleGetUrl");
      const data = await getUrl();

      console.log(data);
      if (!data?.url) return;

      const resp = await fetch(data.url, {
        method: "PUT",
        headers: {
          "Content-Type": "video/mp4",
        },
        body: selectedFile,
      });
      console.log(resp);
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
      Upload
      <input type="file" onChange={handleFileChange} />
      <button onClick={() => void handleGetUrl()}>Get Url</button>
    </div>
  );
};

export default Upload;
