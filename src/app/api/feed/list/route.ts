"use server";

import { NextResponse } from "next/server";
import connectDB, { RssFeed } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    await connectDB();

    const feeds = await RssFeed.find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await RssFeed.countDocuments({ isDeleted: false });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: feeds,
      page: page,
      totalPages: totalPages,
      totalItems: limit,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feeds" },
      { status: 500 },
    );
  }
}
