import { useState } from "react";
import toast from "react-hot-toast";
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
      <Input
        placeholder="Search"
        onChange={(e) => setQ(e.target.value)}
        value={q}
      />
      {/* <input
        type="text"
        className="rounded-md border-2 border-gray-400 p-2"
        placeholder="Search"
        onChange={(e) => setQ(e.target.value)}
        value={q}
      /> */}
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead className="p-3">Id</TableHead>
            <TableHead className="p-3">Profile</TableHead>
            <TableHead className="p-3">Name</TableHead>
            <TableHead className="p-3">Email</TableHead>
            <TableHead className="p-3">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {editors?.length === 0 ? (
            <TableCell>No editors found</TableCell>
          ) : (
            editors?.map((editor, index) => (
              <TableRow key={editor.id} className="hover:bg-gray-200">
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <img
                    src={editor.image}
                    alt="profile"
                    className="h-10 w-10 rounded-full"
                  />
                </TableCell>
                <TableCell>{editor.name}</TableCell>
                <TableCell>{editor.email}</TableCell>
                <TableCell>
                  <button
                    className="rounded-md bg-green-500 px-5 py-2 text-white"
                    onClick={() => void handleAddEditor(editor.id)}
                  >
                    Add
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Editors;
