import { deleteDocument } from "@/actions/actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRoom } from "@liveblocks/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

const DeleteDocument = () => {
  const [isPending, startTransition] = useTransition();
  const room = useRoom();
  const router = useRouter();

  const handleDelete = () => {
    const roomId = room.id;
    if (!roomId) return;

    startTransition(async () => {
      const { success } = await deleteDocument(roomId);

      if (success) {
        // Redirect to home
        router.replace("/");
        toast.success("Room Deleted Successfully", {
          position: "bottom-center",
        });
      } else {
        toast.error("Failed to delete room!", {
          position: "bottom-center",
        });
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to{" "}
            <span className="text-destructive">Delete</span>?
          </DialogTitle>
          <DialogDescription>
            This will delete the document and all its contents, removing all
            users from the document.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <Button
            variant="destructive"
            type="button"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <span className="animate-pulse">Deleting...</span>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteDocument;
