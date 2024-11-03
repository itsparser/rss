"use server";

import connectDB, { RssFeed } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    await connectDB();
    const feedID = context.params.id;
    const existingFeed = await RssFeed.findOne({ _id: feedID });
    if (!existingFeed) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }
    existingFeed.isDeleted = true;
    await existingFeed.save();
    return NextResponse.json({ message: "Feed marked as read" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete feed" },
      { status: 500 },
    );
  }
}
