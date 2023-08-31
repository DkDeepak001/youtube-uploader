import { useState } from "react";
import { api } from "~/utils/api";

const Editors = () => {
  const [q, setQ] = useState<string>("");
  const { data: editors } = api.user.searchEditors.useQuery({ q });
  console.log(editors);
  return (
    <div>
      <input
        type="text"
        className="rounded-md border-2 border-gray-400 p-2"
        placeholder="Search"
        onChange={(e) => setQ(e.target.value)}
        value={q}
      />

      {editors?.map((editor) => (
        <div className="flex flex-row gap-x-2" key={editor.id}>
          <p>{editor?.name}</p>
          <p>{editor?.email}</p>
        </div>
      ))}
    </div>
  );
};

export default Editors;
