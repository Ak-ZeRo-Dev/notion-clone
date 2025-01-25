import { inviteUserAction } from "@/actions/actions";
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
import { convertZodErrors } from "@/lib/utils";
import { useRoom } from "@liveblocks/react";
import { ChangeEvent, useActionState, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const EmailSchema = z.object({
  email: z.string().email(),
});

const InviteUser = () => {
  const room = useRoom();
  const [errors, setErrors] = useState<Record<string, string>>();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleInvite = async (state: any, form: FormData): Promise<any> => {
    const roomId = room.id;
    if (!roomId) return;

    try {
      const result = await inviteUserAction(state, form, roomId);
      if (result.success === true) {
        toast.success("User Invited Successfully", {
          position: "bottom-center",
        });
        return {
          success: true,
        };
      } else {
        toast.error("Failed to invite user!", {
          position: "bottom-center",
        });
        return {
          success: false,
        };
      }
    } catch (error) {
      console.error("Error inviting user", error);

      return {
        success: false,
      };
    }
  };

  const [state, action, isPending] = useActionState(handleInvite, {
    success: false,
  });

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    state.email = email;

    const validEmail = EmailSchema.safeParse({ email });

    if (email.trim()) {
      setErrors({});
      setIsDisabled(true);
      return;
    }

    if (validEmail.error) {
      setErrors({ email: convertZodErrors(validEmail.error).email });
      setIsDisabled(true);
      return;
    }

    setErrors({});
    setIsDisabled(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    state.email = email;

    const validEmail = EmailSchema.safeParse({ email });

    if (validEmail.success) {
      setErrors({});
      setIsDisabled(false);
      return;
    }

    if (email.trim()) {
      setErrors({});
      setIsDisabled(true);
      return;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Invite</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a user to collaborate!</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to invite.
          </DialogDescription>
        </DialogHeader>

        <form
          action={action}
          className="flex gap-2 items-center justify-center"
        >
          <Input
            placeholder="Enter email"
            type="email"
            value={state.email}
            required
            name="email"
            className="flex-1"
            // onBlur={handleBlur}
            // onChange={handleChange}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" disabled={isPending || isDisabled}>
                {isPending ? (
                  <span className="animate-pulse">Inviting...</span>
                ) : (
                  "Invite"
                )}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
        {errors && errors.email && (
          <span className="text-destructive">{errors.email}</span>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default InviteUser;
