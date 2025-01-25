"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/db/firebase";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  id: string;
}

const SidebarOption = ({ href, id }: Props) => {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const pathname = usePathname();
  const isActive = href.includes(pathname) && pathname !== "/";

  return (
    <Link
      href={href}
      className={cn(
        "border p-2 rounded-md block mt-2 truncate",
        isActive ? "bg-gray-300 font-bold border-black" : "border-gray-400"
      )}
      title={data?.title}
      aria-label={data?.title}
    >
      <p className="truncate text-center max-w-40">{data?.title}</p>
    </Link>
  );
};
export default SidebarOption;
