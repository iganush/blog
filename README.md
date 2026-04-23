# Blogify

Blogify is a full-stack social blogging app built with Express, EJS, MongoDB, and JWT cookie authentication. Users can sign up, publish posts with cover images, like and comment on blogs, follow other writers, and browse a searchable home feed with category filters and trending content.

## Features

- Email/password signup and signin with JWT-based auth cookies
- Create blog posts with categories and optional cover images
- Like/unlike posts and join discussions through comments
- Public user profiles with follower/following counts
- Follow or unfollow other creators from the feed, blog page, or profile page
- Search across blogs and users from the home feed
- Category-based filtering and trending posts sidebar
- Cloudinary image uploads in production-ready setups, with local file fallback for development
- Demo content seeding script for quickly populating the app

## Tech Stack

- Node.js
- Express 5
- EJS
- MongoDB with Mongoose
- JWT
- Multer
- Cloudinary

## Project Structure

```text
.
|-- index.js                  # Main app entrypoint
|-- routes/                   # User and blog routes
|-- models/                   # Mongoose models
|-- middlewares/              # Authentication middleware
|-- services/                 # Auth, media, and Cloudinary helpers
|-- views/                    # EJS templates
|-- public/                   # Static assets and local uploads
`-- scripts/seedDemoContent.js
```

## Requirements

- Node.js 18+
- MongoDB database URI

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=3001
MONGODB_URL=mongodb://127.0.0.1:27017/blogify
JWT_SECRET=replace-this-with-a-secure-secret

# Optional: enables Cloudinary uploads instead of local file storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Notes

- `MONGODB_URL` is required.
- `JWT_SECRET` should always be set explicitly, even though the app has a fallback.
- If Cloudinary credentials are not provided, blog cover images are stored under `public/uploads/`.
- Local uploads are convenient for development, but they are not durable on many cloud/serverless platforms.

## Installation

```bash
npm install
```

## Running Locally

Start the development server:

```bash
npm run dev
```

Or start without nodemon:

```bash
npm start
```

Open:

```text
http://localhost:3001
```

## Demo Data

Populate the app with sample users, posts, follows, likes, and comments:

```bash
npm run seed:demo
```

The seed script:

- creates demo users
- creates demo posts across multiple categories
- wires follower relationships
- adds likes and comments
- removes old seeded demo content before recreating it

## Available Scripts

- `npm run dev` - start the app with nodemon
- `npm start` - run the app with Node
- `npm run seed:demo` - seed demo users and blog content

## Core Routes

- `/` - home feed with search, filters, suggestions, and trending posts
- `/user/signup` - create an account
- `/user/signin` - sign in
- `/user/me` - redirect to the logged-in user's profile
- `/user/profile/:id` - public profile page
- `/blog/add-new` - create a new post
- `/blog/:Id` - blog detail page

## Production Note

The app starts its HTTP listener from `index.js` only when `NODE_ENV` is not `production`. That works well for local development, but if you run `node index.js` with `NODE_ENV=production`, the process will not call `app.listen()`.

This usually means the project is intended to:

- run locally with `NODE_ENV` unset or non-production
- export the Express app for a hosting platform that handles the server process separately

Also note that `server.js` is not the main application entry used by the npm scripts.

## Screens in the App

- Social home feed
- Blog details with likes, comments, and author follow action
- User profile pages
- Signup and signin pages
- Add blog form

## Future Improvements

- Edit blog posts
- Password hashing with `bcrypt`
- Rich text editor for posts
- Image optimization and validation improvements
- Automated tests
- Pagination or infinite scrolling

## License

ISC
