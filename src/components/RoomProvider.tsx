"use client";
import {
  ClientSideSuspense,
  RoomProvider as RoomProviderWrapper,
} from "@liveblocks/react/suspense";
import { LoaderCircleIcon } from "lucide-react";
import LiveCursorProvider from "./LiveCursorProvider";
import LoadingSpinner from "./LoadingSpinner";

const RoomProvider = ({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: string;
}) => {
  return (
    <RoomProviderWrapper
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        <LiveCursorProvider>{children}</LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderWrapper>
  );
};
export default RoomProvider;
