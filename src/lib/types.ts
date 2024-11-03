export interface RSS {
  _id: string;
  url: string;
  title?: string;
  description?: string;
  lastFetched: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feed {
  _id: string;
  masterId: string;
  title: string;
  description?: string;
  link: string;
  createdAt: Date;
}

// export interface Feed {
//   _id: string;
//   userId: string;
//   feedUrl: string;
//   description: string;
//   lastFetched: string;
// }

export interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author?: string;
  guid: string;
}

export interface FeedData {
  _id: string;
  feedId: string;
  data: FeedItem;
  fetchedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}
