"use server";

import { NextResponse } from "next/server";
import connectDB, { RssFeed, RssMaster } from "@/lib/db";
import Parser from "rss-parser";

export async function GET() {
  try {
    await connectDB();
    const parser = new Parser();
    const existingFeeds = await RssMaster.find({ active: true });

    if (existingFeeds.length > 0) {
      for (const feed of existingFeeds) {
        try {
          const parsedFeed = await parser.parseURL(feed.url);

          for (const item of parsedFeed.items) {
            const existingItem = await RssFeed.findOne({
              $or: [{ guid: item.guid }, { link: item.link }],
            });

            if (!existingItem) {
              await RssFeed.create({
                title: item.title || "",
                link: item.link || "",
                description: item.content || item.description || "",
                pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                guid: item.guid || item.link || "",
                author: item.creator || item.author || "",
                category: item.categories?.[0] || "",
                enclosure: item.enclosure?.url || "",
                masterId: feed._id,
              });
            }
          }
        } catch (feedError) {
          console.error(`Error parsing feed ${feed.url}:`, feedError);
          continue; // Skip to next feed if there's an error
        }
      }
    }

    return NextResponse.json(
      { message: "Feeds updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to add feed" }, { status: 500 });
  }
}
