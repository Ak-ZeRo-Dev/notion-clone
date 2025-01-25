import { stringToColor } from "@/lib/stringToColor";
import { cn } from "@/lib/utils";
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { Button } from "./ui/button";
import SummarizeDocument from "./SummarizeDocument";
import ChatToAI from "./ChatToAI";

type EditorProps = {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  darkMode: boolean;
};

const BlockNote = ({ doc, provider, darkMode }: EditorProps) => {
  const userInfo = useSelf((me) => me.info);
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo.name,
        color: stringToColor(userInfo.email),
      },
    },
  });
  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView
        editor={editor}
        theme={darkMode ? "dark" : "light"}
        className="min-h-screen"
      />
    </div>
  );
};

const Editor = () => {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);

    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 justify-end mb-10">
        <SummarizeDocument doc={doc} />

        <ChatToAI doc={doc} />

        {/* Dark Mode */}
        <Button
          onClick={() => setDarkMode((prev) => !prev)}
          className={cn(
            darkMode
              ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
              : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
          )}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
      {/* Block Note */}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
};
export default Editor;
