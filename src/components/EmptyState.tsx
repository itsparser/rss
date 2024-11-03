import { Rss } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <Rss className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">No feeds yet</h3>
      <p className="text-muted-foreground">
        Add your first RSS feed to get started
      </p>
    </div>
  );
}