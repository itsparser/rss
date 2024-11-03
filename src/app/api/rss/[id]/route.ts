"use server";

import connectDB, { RssFeed, RssMaster } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const existingRss = await RssMaster.findOne({ _id: params.id });

    if (existingRss) {
      await RssMaster.deleteOne({ _id: params.id });
      await RssFeed.updateMany({ masterId: params.id }, { isDeleted: true });
      return NextResponse.json({ message: "Feed deleted successfully" });
    } else {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete feed" },
      { status: 500 },
    );
  }
}
