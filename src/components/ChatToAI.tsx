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
import { chatToAI, summarizeDocument } from "@/actions/actions";
import { toast } from "sonner";
import { BotIcon, MessageCircleMoreIcon, NotebookPen } from "lucide-react";
import Markdown from "react-markdown";
import { Input } from "./ui/input";

const ChatToAI = ({ doc }: { doc: Y.Doc }) => {
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const documentData = doc.get("document-store").toJSON();

    startTransition(async () => {
      const result = await chatToAI(documentData, question);

      if (!result?.success) {
        toast.error("Failed to chat to document", {
          position: "bottom-center",
        });
        return;
      }

      setMessage(result?.message);
      setQuestion("");
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageCircleMoreIcon />
          Chat to Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat to the Document</DialogTitle>
          <DialogDescription>
            Ask a question and chat to the document with AI.
          </DialogDescription>
          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>

        {message && (
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
                <Markdown>{message}</Markdown>
              )}
            </p>
          </div>
        )}

        <form
          className="flex justify-between items-center gap-2"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            placeholder="Ask a question"
            value={question}
            className="flex-1"
            onChange={(e) => setQuestion(e.target.value)}
          />

          <Button type="submit" disabled={isPending || !question}>
            {isPending ? (
              <span className="animate-pulse">Thinking...</span>
            ) : (
              "Ask"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default ChatToAI;
