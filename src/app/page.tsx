"use client";

import { useState, useEffect } from "react";
import { Rss, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Feed, RSS } from "@/lib/types";
import AddFeedDialog from "@/components/AddFeedDialog";
import FeedList from "@/components/FeedList";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import RssDialog from "@/components/RssMaster";

export default function Home() {
  const [rss, setRss] = useState<RSS[]>([]);
  const [feedData, setFeedData] = useState<Feed[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchRssList();
    fetchFeedData(currentPage);
  }, [currentPage]);

  const fetchRssList = async () => {
    const response = await api.getRssList();
    if (response.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.data) {
      setRss(response.data);
    }
  };

  const handleAddFeed = async (
    title: string,
    url: string,
    description: string,
  ) => {
    setIsLoading(true);
    const response = await api.addRssFeed(title, url, description);

    if (response.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: response.message,
      });
      setIsOpen(false);
      handleRefreshFeeds();
      fetchRssList();
    }

    setIsLoading(false);
  };

  const handleRefreshFeeds = async () => {
    setIsRefreshing(true);
    const response = await api.fetchFeeds();

    if (response.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: response.message,
      });
      fetchFeedData(currentPage);
    }

    setIsRefreshing(false);
  };

  const fetchFeedData = async (page: number) => {
    setIsLoading(true);
    const response = await api.getFeeds(page);

    if (response.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.data) {
      setFeedData(response.data.data);
      setTotalPages(response.data.totalPages);
    }

    setIsLoading(false);
  };

  const handleDeleteRss = async (id: string) => {
    const response = await api.deleteRss(id);

    if (response.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: response.message,
      });
      fetchRssList();
      fetchFeedData(currentPage);
    }
  };

  const markFeedAsRead = async (id: string) => {
    const response = await api.markFeedAsRead(id);
    if (response.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: response.message,
      });
      fetchFeedData(currentPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Rss className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">RSS Feed Aggregator</h1>
          </div>

          <div className="flex items-center gap-3">
            <RssDialog rss={rss} onDelete={handleDeleteRss} />
            <Button
              variant="outline"
              onClick={handleRefreshFeeds}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh Feeds
            </Button>

            <AddFeedDialog
              isOpen={isOpen}
              isLoading={isLoading}
              onOpenChange={setIsOpen}
              onSubmit={handleAddFeed}
            />
          </div>
        </div>

        {feedData.length > 0 ? (
          <>
            <FeedList
              rss={rss}
              feeds={feedData}
              markreadAction={markFeedAsRead}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
