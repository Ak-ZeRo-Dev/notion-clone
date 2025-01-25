import { ArrowLeftCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex space-x-2 items-center animate-pulse">
      <ArrowLeftCircle className="w-10 h-10" />
      <h1 className="font-bold">Get started with creating a New Document</h1>
    </div>
  );
}
