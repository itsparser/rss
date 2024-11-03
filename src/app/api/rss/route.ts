"use server";

import { NextResponse } from "next/server";
import connectDB, { RssMaster } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    await connectDB();

    const rss = await RssMaster.find().skip(skip).limit(limit).lean();

    return NextResponse.json({ rss });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feeds" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, url, description } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "Feed URL is required" },
        { status: 400 },
      );
    }

    await connectDB();

    // Check if feed already exists
    const existingFeed = await RssMaster.findOne({ url: url });

    if (existingFeed) {
      return NextResponse.json(
        { error: "Feed URL already exists" },
        { status: 400 },
      );
    }

    const newFeed = await RssMaster.create({
      url: url,
      title: title || "",
      description: description || "",
      lastFetched: new Date(),
      active: true,
    });

    return NextResponse.json(
      {
        data: newFeed,
        message: "Feed added successfully",
      },
      { status: 201 },
    );
  } catch (_error) {
    console.error("Database error:", _error);
    return NextResponse.json({ error: "Failed to add feed" }, { status: 500 });
  }
}
