"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { createNewDocument } from "@/actions/actions";

const NewDocumentButton = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNewDocument = () => {
    startTransition(async () => {
      const { docId } = await createNewDocument();
      router.push(`/doc/${docId}`);
    });
  };

  if (user) {
    return (
      <div className="w-full flex justify-center">
        <Button onClick={handleNewDocument} disabled={isPending}>
          {isPending ? (
            <span className="animate-pulse">Creating...</span>
          ) : (
            "New Document"
          )}
        </Button>
      </div>
    );
  }
};

export default NewDocumentButton;
