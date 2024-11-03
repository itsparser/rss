"use server";

import { NextResponse } from "next/server";
import connectDB, { RssFeed, RssMaster } from "@/lib/db";


/// mark as read for give id feed
export async function POST() {
  try {
    
    await connectDB();
    return NextResponse.json({ message: "Sync successful" });
  } catch (_error) {
    console.error("Database error:", _error);
    return NextResponse.json({ error: "Failed to add feed" }, { status: 500 });
  }
}
