import { Application, Router } from "@oak/oak";
import mongoose from "mongoose";
import Parser from "rss-parser";

const uri =
  Deno.env.get("MONGODB_CONNECTION") ||
  "mongodb+srv://itsparser:xEuslUdeVp0Y7heF@rss-feed-aggregator.oizck.mongodb.net/?retryWrites=true&w=majority&appName=rss-feed-aggregator";

if (!uri) {
  throw new Error("MONGODB_CONNECTION environment variable is not set");
}

mongoose.connect(uri);

const rssURLSchema = new mongoose.Schema({
  userId: { type: String, default: "default" },
  feedUrl: { type: String, required: true },
  description: { type: String, default: "" },
  lastFetched: { type: Date, default: Date.now },
});

const feedDataSchema = new mongoose.Schema({
  feedId: mongoose.Schema.Types.ObjectId,
  data: Object,
  fetchedAt: { type: Date, default: Date.now },
});

const rssURLModel = mongoose.model("Feed", rssURLSchema);
const FeedData = mongoose.model("FeedData", feedDataSchema);

const router = new Router();
const parser = new Parser();

// Add RSS feed URL
router.post("/feed", async (ctx) => {
  const { feedUrl, description } = await ctx.request.body.json();
  const newFeed = new rssURLModel({ feedUrl, description });
  await newFeed.save();
  ctx.response.status = 201;
  ctx.response.body = { message: "Feed added" };
});

router.get("/feed/list", async (ctx) => {
  const page = parseInt(ctx.request.url.searchParams.get("page") || "1");
  const limit = parseInt(ctx.request.url.searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;
  const feeds = await rssURLModel.find().skip(skip).limit(limit);
  ctx.response.status = 200;
  ctx.response.body = { feeds };
});

// Delete RSS feed URL by ID
router.delete("/feed/:id", async (ctx) => {
  const { id } = ctx.params;
  const result = await rssURLModel.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  if (result.deletedCount === 1) {
    ctx.response.status = 200;
    ctx.response.body = { message: "Feed deleted" };
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "Feed not found" };
  }
});

// List all feeds with pagination
router.get("/feeds", async (ctx) => {
  const page = parseInt(ctx.request.url.searchParams.get("page") || "1");
  const limit = parseInt(ctx.request.url.searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const feeds = await FeedData.find()
    .sort({ fetchedAt: -1 })
    .skip(skip)
    .limit(limit);
  const totalFeeds = await FeedData.countDocuments();
  const totalPages = Math.ceil(totalFeeds / limit);

  ctx.response.status = 200;
  ctx.response.body = {
    feeds,
    page,
    totalPages,
    totalFeeds,
  };
});

// Periodic fetch route
router.get("/fetch-feeds", async (ctx) => {
  const feeds = await rssURLModel.find();

  for (const feed of feeds) {
    try {
      const parsedFeed = await parser.parseURL(feed.feedUrl);
      console.log(parsedFeed);

      if (!parsedFeed.items) {
        continue;
      }

      parsedFeed.items.forEach(async (item) => {
        const itemData = {
          title: item.title || "",
          link: item.link || "",
          description: item.contentSnippet || "",
          pubDate: item.pubDate || "",
          author: item.creator || "",
          guid: item.guid || "",
        };

        const newFeedData = new FeedData({
          feedId: feed._id,
          data: itemData,
        });
        await newFeedData.save();
      });
      feed.lastFetched = new Date();
      await feed.save();
    } catch (error) {
      console.error(`Failed to fetch/parse feed from ${feed.feedUrl}:`, error);
    }
  }

  ctx.response.status = 200;
  ctx.response.body = { message: "Feeds fetched, parsed and stored" };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8888 });
