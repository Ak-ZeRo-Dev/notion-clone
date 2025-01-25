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
import {
  ChangeEvent,
  useActionState,
  useEffect,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { deleteUserAction, inviteUserAction } from "@/actions/actions";
import * as z from "zod";
import { convertZodErrors } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import useOwner from "@/lib/useOwner";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "@/db/firebase";
import { collectionGroup, query, where } from "firebase/firestore";
import { XIcon } from "lucide-react";

export const EmailSchema = z.object({
  email: z.string().email(),
});

const ManageUsers = () => {
  const room = useRoom();
  const isOwner = useOwner();
  const { user } = useUser();
  const userEmail = user?.emailAddresses[0].emailAddress.toString();

  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  const [isPending, startTransition] = useTransition();

  const handleDelete = (userId: string) => {
    const roomId = room.id;
    if (!roomId) return;

    startTransition(async () => {
      try {
        const { success } = await deleteUserAction(roomId, userId);

        if (success) {
          toast.success("User deleted successfully");
        }
      } catch (error) {
        toast.error("Failed to delete user");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Users ({usersInRoom?.size})</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">Users with access</DialogTitle>
          <DialogDescription>
            Below is a list of users who have access to this document.
          </DialogDescription>
        </DialogHeader>
        <hr className="my-2" />

        <div className="overflow-y-auto max-h-40 space-y-2">
          {usersInRoom?.docs.map((doc) => (
            <div key={doc.id} className="flex justify-between items-center">
              <p>
                {doc.data().userId === userEmail
                  ? `You (${doc.data().userId})`
                  : doc.data().userId}
              </p>

              <div className="flex gap-2 items-center ">
                <Button
                  variant="outline"
                  size="sm"
                  className="capitalize disabled:opacity-100 pointer-events-none"
                  disabled
                >
                  {doc.data().role}
                </Button>
                {isOwner && doc.data().userId !== userEmail && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(doc.data().userId)}
                  >
                    {isPending ? (
                      <span className="animate-pulse">Deleting...</span>
                    ) : (
                      <XIcon />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ManageUsers;
