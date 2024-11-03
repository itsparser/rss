// "use server";

import mongoose, { Document, Schema } from "mongoose";
import { config } from "./config";

if (!config.mongodb.uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

// Interfaces
interface IRssMaster extends Document {
  url: string;
  title?: string;
  description?: string;
  lastFetched?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IRssFeed extends Document {
  masterId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  link: string; // link to the article
  createdAt: Date;
  isDeleted?: boolean;
}

// Add this interface for the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global type
declare global {
  var mongoose: MongooseCache | undefined;
}

// Schemas
const RssMasterSchema = new Schema<IRssMaster>({
  url: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  lastFetched: { type: Date },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const RssFeedSchema = new Schema<IRssFeed>({
  masterId: { type: Schema.Types.ObjectId, ref: "RssMaster", required: true },
  title: { type: String, required: true },
  description: { type: String },
  link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

// Models remain the same
export const RssMaster =
  mongoose.models.RssMaster ||
  mongoose.model<IRssMaster>("RssMaster", RssMasterSchema);
export const RssFeed =
  mongoose.models.RssFeed || mongoose.model<IRssFeed>("RssFeed", RssFeedSchema);

// Connection handling with proper typing
let cached = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(dbName: string = `rss-${config.env}`) {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: dbName,
    };

    cached.promise = mongoose
      .connect(config.mongodb.uri, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

// Type exports
export type { IRssMaster, IRssFeed };
