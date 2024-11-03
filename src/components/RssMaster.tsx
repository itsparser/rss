"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RSS } from "@/lib/types";
import { ListTree, ExternalLink, Trash } from "lucide-react";
import { useState } from "react";

interface RssEndpointsDialogProps {
  rss: RSS[];
  onDelete: (id: string) => void;
}

export default function RssDialog({ rss, onDelete }: RssEndpointsDialogProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = (id: string) => {
    onDelete(id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ListTree className="h-4 w-4 mr-2" />
          View All Endpoints
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text ">
            RSS Endpoints
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {rss.length === 0 ? (
            <p>No RSS endpoints added yet.</p>
          ) : (
            <div className="space-y-3">
              {rss.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 rounded-lg group border-2"
                >
                  <div className="space-y-1 flex-1 mr-4">
                    {item.title && (
                      <p className="text-lg font-medium">{item.title}</p>
                    )}
                    <p className="text-sm font-medium break-all">{item.url}</p>
                    {item.description && (
                      <p className="text-xs">{item.description}</p>
                    )}
                  </div>
                  <Button size="icon" variant="ghost" className="" asChild>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open RSS feed"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-800"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
