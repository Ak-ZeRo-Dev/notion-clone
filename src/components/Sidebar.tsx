"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import NewDocumentButton from "./NewDocumentButton";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import {
  collectionGroup,
  DocumentData,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import { useEffect, useState } from "react";
import SidebarOption from "./SidebarOption";

interface RoomDocument extends DocumentData {
  role: "owner" | "editor";
  userId: string;
  roomId: string;
  createdAt: Date;
}

interface IGroupedData {
  owner: RoomDocument[];
  editor: RoomDocument[];
}

const Sidebar = () => {
  const { user } = useUser();

  const [groupedData, setGroupedData] = useState<IGroupedData>({
    owner: [],
    editor: [],
  });

  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user.emailAddresses[0].emailAddress.toString())
      )
  );

  const menuOptions = (
    <>
      <NewDocumentButton />
      {
        // loading ? (
        //   <div className="animate-pulse">Loading...</div>
        // ) : (
        <>
          {/* My Documents */}
          <div>
            <h2 className="text-gray-500 font-semibold text-sm text-start mt-2">
              My Documents
            </h2>
            {groupedData.owner.length === 0 ? (
              <h3 className="text-gray-500 font-semibold text-sm  text-center mt-2">
                No documents found
              </h3>
            ) : (
              groupedData.owner.map((doc) => (
                <SidebarOption
                  key={doc.id}
                  href={`/doc/${doc.id}`}
                  id={doc.roomId}
                />
              ))
            )}
          </div>

          {/* Shared Documents */}
          <div>
            {groupedData.editor.length > 0 && (
              <>
                <h2 className="text-gray-500 font-semibold text-sm text-start mt-2">
                  Shared Documents
                </h2>
                {groupedData.editor.map((doc) => (
                  <SidebarOption
                    key={doc.id}
                    href={`/doc/${doc.id}`}
                    id={doc.roomId}
                  />
                ))}
              </>
            )}
          </div>
        </>
        //)
      }
    </>
  );

  useEffect(() => {
    if (data) {
      const grouped = data.docs.reduce<IGroupedData>(
        (acc, curr) => {
          const roomData = curr.data() as RoomDocument;

          if (roomData.role === "owner") {
            acc.owner.push({
              id: curr.id,
              ...roomData,
            });
          } else {
            acc.editor.push({
              id: curr.id,
              ...roomData,
            });
          }

          return acc;
        },
        {
          owner: [],
          editor: [],
        }
      );

      setGroupedData(grouped);
    }
  }, [data]);

  return (
    <aside className="p-2 md:p-5 bg-gray-200 relative flex justify-center">
      <div className="hidden md:block">{menuOptions}</div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon
              className="p-2 hover:opacity-30 rounded-lg transition-opacity"
              size={40}
            />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </aside>
  );
};

export default Sidebar;
