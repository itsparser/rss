import mongoose from 'mongoose';

const uri = 'your_mongodb_connection_string';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const feedSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  feedUrl: String,
  data: String,
  lastFetched: Date,
});

const User = mongoose.model('User', userSchema);
const Feed = mongoose.model('Feed', feedSchema);

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname

  if (path.startsWith('/user')) {
    return handleUser(request)
  } else if (path.startsWith('/feed')) {
    return handleFeed(request)
  } else {
    return new Response('Not Found', { status: 404 })
  }
}

async function handleUser(request) {
  const { method } = request;
  const body = await request.json();

  if (method === 'POST') {
    const { username, password } = body;
    const user = await User.findOne({ username });
    if (user) {
      // Logic for user login
      // ... existing code ...
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      return new Response('User registered', { status: 201 });
    }
  } else {
    return new Response('Method Not Allowed', { status: 405 });
  }
}

async function handleFeed(request) {
  const { method } = request;
  const body = await request.json();

  if (method === 'POST') {
    const { userId, feedUrl } = body;
    const newFeed = new Feed({ userId, feedUrl });
    await newFeed.save();
    return new Response('Feed added', { status: 201 });
  } else if (method === 'GET') {
    const userId = new URL(request.url).searchParams.get('userId');
    const feeds = await Feed.find({ userId });
    return new Response(JSON.stringify(feeds), { status: 200 });
  } else {
    return new Response('Method Not Allowed', { status: 405 });
  }
}

async function fetchFeeds() {
  const feeds = await Feed.find();

  for (const feed of feeds) {
    const response = await fetch(feed.feedUrl);
    const feedData = await response.text();
    feed.data = feedData;
    feed.lastFetched = new Date();
    await feed.save();
  }
} 