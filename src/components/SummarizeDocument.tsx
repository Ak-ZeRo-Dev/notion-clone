"use client";
import * as Y from "yjs";
import {
  DialogFooter,
  DialogHeader,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { FormEvent, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { summarizeDocument } from "@/actions/actions";
import { toast } from "sonner";
import { BotIcon, NotebookPen } from "lucide-react";
import Markdown from "react-markdown";

const languages = [
  "arabic",
  "english",
  "french",
  "german",
  "spanish",
  "italian",
  "japanese",
  "korean",
  "chinese",
  "russian",
  "hindi",
  "bengali",
  "portuguese",
];

const SummarizeDocument = ({ doc }: { doc: Y.Doc }) => {
  const [language, setLanguage] = useState("english");
  const [summary, setSummary] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSummarize = (e: FormEvent) => {
    e.preventDefault();
    const documentData = doc.get("document-store").toJSON();

    startTransition(async () => {
      const result = await summarizeDocument(documentData, language);

      if (!result?.success) {
        toast.error("Failed to summarize document", {
          position: "bottom-center",
        });
        return;
      }

      setSummary(result?.summary);
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <NotebookPen />
          Summarize
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Summarize the document in any language you want.
          </DialogTitle>
          <DialogDescription>
            Select a language and AI will summarize the document for you and
            translate it to the selected language.
          </DialogDescription>
        </DialogHeader>

        {summary && (
          <div className="flex flex-col items-start max-h-96  overflow-y-auto gap-2 p-5 bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0 " />
              <p>
                GPT{" "}
                {isPending ? (
                  <span className="animate-pulse">is thinking...</span>
                ) : (
                  "Says:"
                )}
              </p>
            </div>

            <p>
              {isPending ? (
                <span className="animate-pulse">Thinking...</span>
              ) : (
                <Markdown>{summary}</Markdown>
              )}
            </p>
          </div>
        )}

        <form
          className="flex justify-between items-center"
          onSubmit={handleSummarize}
        >
          <Select
            value={language}
            onValueChange={(e) => setLanguage(e)}
            defaultValue="english"
          >
            <SelectTrigger className="w-[180px] capitalize">
              <SelectValue className="capitalize" placeholder={language} />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem
                  key={language}
                  value={language}
                  className="capitalize"
                >
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" disabled={isPending || !language}>
            {isPending ? (
              <span className="animate-pulse">Summarizing...</span>
            ) : (
              "Summarize"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default SummarizeDocument;
