# Blogify

`Blogify` is a full-stack blogging platform built with `Express`, `EJS`, `MongoDB`, and `Mongoose`.
It supports authentication, publishing posts with cover images, comments, likes, creator profiles, and follow/unfollow flows.

## Features

- User signup, signin, and logout with JWT-based auth stored in cookies
- Create blog posts with optional cover image upload
- Browse a home feed with latest posts and trending posts
- Filter blogs by category
- Search across blogs, users, or both
- Like and unlike posts
- Comment on posts
- View public user profiles
- Follow and unfollow creators
- Delete your own posts

## Tech Stack

- `Node.js`
- `Express 5`
- `EJS`
- `MongoDB`
- `Mongoose`
- `Multer`
- `jsonwebtoken`
- `cookie-parser`

## Project Structure

```text
.
├── controllers/
├── middlewares/
├── models/
├── public/
├── routes/
├── services/
├── views/
├── index.js
├── server.js
└── package.json
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a `.env` file

Add the following variables:

```env
PORT=3001
MONGODB_URL=your_mongodb_connection_string
```

### 3. Start the app

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Then open `http://localhost:3001` unless you changed `PORT`.

## Available Scripts

- `npm run dev` — starts the app with `nodemon` using `index.js`
- `npm start` — starts the app with `node index.js`
- `npm test` — currently not implemented

## Main Routes

### App

- `GET /` — home feed, search, category filtering, trending posts, suggested users

### User Routes

- `GET /user/signin` — signin page
- `POST /user/signin` — signin action
- `GET /user/signup` — signup page
- `POST /user/signup` — signup action
- `GET /user/logout` — logout
- `GET /user/me` — redirect to logged-in user profile
- `GET /user/profile/:id` — public profile page
- `POST /user/:id/follow` — follow or unfollow a user

### Blog Routes

- `GET /blog/add-new` — create post page
- `POST /blog` — create a new blog post
- `GET /blog/:Id` — blog detail page
- `POST /blog/:Id/like` — like or unlike a post
- `POST /blog/comment/:blogId` — add a comment
- `POST /blog/:id/delete` — delete your own post

## Blog Categories

The app currently supports these categories:

- `Technology`
- `Programming`
- `Web Development`
- `Mobile Apps`
- `Artificial Intelligence`
- `Cyber Security`
- `Career & Interviews`
- `Tutorials`
- `Lifestyle`
- `Travel`
- `Health & Fitness`
- `Finance`
- `Education`
- `Sports`
- `Movies`
- `Short Stories`
- `Poetry`
- `Personal Experiences`
- `Motivation`
- `Book Reviews`
- `History`
- `Science`
- `Entertainment`
- `Others`
- `Business`
- `General`

## Notes

- The active app entry point is `index.js`.
- `server.js` contains a separate cluster-based experiment and is not used by the npm scripts.
- Uploaded images are stored under `public/uploads/<userId>/`.
- Authentication currently uses a JWT secret defined in `services/auth.js`; moving that secret to an environment variable is recommended before production use.

## Future Improvements

- Move JWT secret to `.env`
- Add validation and better error handling
- Add tests
- Add edit/update post support
- Add pagination for feeds and profiles

