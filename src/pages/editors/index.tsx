import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const Editors = () => {
  const [q, setQ] = useState<string>("");
  const { data: editors } = api.user.searchEditors.useQuery({ q });
  const { mutateAsync: addEditor } = api.user.addEditor.useMutation();

  const handleAddEditor = async (id: string) => {
    try {
      await toast.promise(addEditor({ id }), {
        loading: "Adding...",
        success: "Added!",
        error: "Failed to add",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <input
        type="text"
        className="rounded-md border-2 border-gray-400 p-2"
        placeholder="Search"
        onChange={(e) => setQ(e.target.value)}
        value={q}
      />
      <table className="my-3 w-full table-auto p-2">
        <thead className="border-b-2 border-gray-400">
          <tr className="bg-slate-400 p-2 text-left">
            <th className="p-3">Id</th>
            <th className="p-3">Profile</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-400 bg-gray-100 text-sm text-gray-700">
          {editors?.length === 0 ? (
            <div className="w-full bg-white  p-5">No editors found</div>
          ) : (
            editors?.map((editor, index) => (
              <tr key={editor.id} className="hover:bg-gray-200">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <img
                    src={editor.image}
                    alt="profile"
                    className="h-10 w-10 rounded-full"
                  />
                </td>
                <td className="p-2">{editor.name}</td>
                <td className="p-2">{editor.email}</td>
                <td className="p-2">
                  <button
                    className="rounded-md bg-green-500 px-5 py-2 text-white"
                    onClick={() => void handleAddEditor(editor.id)}
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Editors;
