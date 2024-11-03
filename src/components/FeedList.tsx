"use client";
import { Feed, RSS } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCheck, ExternalLink } from "lucide-react";

interface FeedListProps {
  rss: RSS[];
  feeds?: Feed[];
  markreadAction: (id: string) => void;
}

export default function FeedList({
  rss,
  feeds,
  markreadAction,
}: FeedListProps) {
  if (rss.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {feeds && feeds.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Latest Feed Items</h2>
          <div className="flex flex-col space-y-4">
            {feeds.map((item) => (
              <Card key={item._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg truncate">
                      {item.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => markreadAction(item._id)}
                      >
                        <CheckCheck className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
