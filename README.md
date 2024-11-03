# RSS Aggregator

This is a simple RSS aggregator built with Next.js and MongoDB.

## Features

- Add RSS feeds
- View RSS feeds
- Mark RSS feeds as read
- Pagination
- Dark mode

## create new MongoDB (Optional)

You can create a new MongoDB instance on [MongoDB Atlas](https://www.mongodb.com/atlas/database) or any other MongoDB provider.

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
NEXT_PUBLIC_API_BASE_URL=http://localhost:8888
```

Replace the values with your own MongoDB URI, API base URL, and username, password, cluster URL, and database name.

## how to setup cloudflare page

1. Create a new cloudflare page
2. Create Cloudflare page using github action
3. Add the cloudflare page url to the .env.local file (refer to the environment variables section)
4. Deploy the application

## How to add RSS feeds

1. Open the application in your browser.
2. Click on the "Add Feed" button.
3. Enter the URL of the RSS feed.
4. Click on the "Submit" button.
5. The RSS feed will be added to the list.

## How to view RSS feeds

1. Open the application in your browser.
2. Click on the "Refresh Feeds" button.
3. The RSS feeds will be displayed on the page.

## How to mark RSS feeds as read

1. Open the application in your browser.
2. Click on the "Mark as Read" button next to the RSS feed.
3. The RSS feed will be marked as read.
