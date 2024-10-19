"use client";

import type { Quiz } from "@prisma/client";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";

export function ShareButton({ quiz, domain }: { quiz: Quiz; domain: string }) {
  const handleShareClick = () => {
    const shareText = `https://${domain}/play/${quiz.id}`;
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        toast.success("Copied to clipboard", {
          description: shareText,
        });
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="transition-transform duration-300 ease-in-out hover:scale-105"
      onClick={handleShareClick}
      aria-label={`Share ${quiz.theme} quiz`}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
