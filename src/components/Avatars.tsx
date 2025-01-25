import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import { useOthers } from "@liveblocks/react/suspense";
import { useSelf } from "@liveblocks/react/suspense";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const Avatars = () => {
  const others = useOthers();
  const self = useSelf();

  const users = [self, ...others];

  return (
    <div className="flex items-center gap-2">
      <p className="font-light text-sm">Users currently editing this page:</p>
      <div className="flex -space-x-5">
        {users.map((user, i) => (
          <TooltipProvider key={user.id + i}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="hover:z-50 border-2">
                  <AvatarImage src={user.info.avatar} alt={user.info.name} />
                  <AvatarFallback>{user.info.name}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{self.id === user.id ? "You" : user.info.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};
export default Avatars;
