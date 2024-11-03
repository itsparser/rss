import { Feed, ApiResponse, PaginatedResponse, RSS } from "./types";

export const api = {
  async addRssFeed(
    title: string,
    url: string,
    description: string,
  ): Promise<ApiResponse<Feed>> {
    try {
      const response = await fetch("/api/rss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add feed");
      }

      return { data: data.data, message: data.message };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to add feed",
      };
    }
  },
  async getRssList(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<RSS[]>> {
    try {
      const response = await fetch(`/api/rss?page=${page}&limit=${limit}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch RSS list");
      }

      return { data: data.rss };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to fetch RSS list",
      };
    }
  },

  async deleteRss(id: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`/api/rss/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete Rss");
      }

      return { message: data.message };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to delete Rss",
      };
    }
  },

  async getFeedList(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<Feed[]>> {
    try {
      const response = await fetch(
        `/api/feed/list?page=${page}&limit=${limit}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch feed list");
      }

      return { data: data.feeds };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to fetch feed list",
      };
    }
  },

  async getFeeds(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<PaginatedResponse<Feed>>> {
    try {
      const response = await fetch(
        `/api/feed/list?page=${page}&limit=${limit}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch feed list");
      }

      return {
        data: data,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to fetch feed list",
      };
    }
  },

  async fetchFeeds(): Promise<ApiResponse> {
    try {
      const response = await fetch("/api/rss/fetch");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch feeds");
      }

      return { message: data.message };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to fetch feeds",
      };
    }
  },

  async markFeedAsRead(id: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`/api/feed/${id}/read`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to mark feed as read");
      }

      return { message: data.message };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark feed as read",
      };
    }
  },
};
