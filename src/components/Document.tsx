"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/db/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

const Document = ({ id }: { id: string }) => {
  const isOwner = useOwner();

  const [data, loading, error] = useDocumentData(doc(db, "documents", id));

  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const isDisabled = Boolean(isPending || !input || input === data?.title);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  return (
    <div className="flex-1 bg-white p-5 h-full ">
      <div className="max-w-6xl mx-auto ">
        <div className=" pb-5 flex items-center gap-1">
          <form onSubmit={updateTitle} className="flex space-x-2 flex-1">
            {/* Update title */}
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" disabled={isDisabled}>
              {isPending ? (
                <span className="animate-pulse">Updating...</span>
              ) : (
                "Update"
              )}
            </Button>
          </form>

          {/* IF user is owner && invite and delete */}
          {isOwner && (
            <>
              <InviteUser />
              <DeleteDocument />
            </>
          )}
        </div>

        <div className="flex justify-between items-center mb-5">
          <ManageUsers />
          <Avatars />
        </div>
      </div>

      <hr className="mb-5" />

      <Editor />
    </div>
  );
};
export default Document;
