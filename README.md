# Blogify

Blogify is a simple social blogging app I built with Node.js, Express, EJS, and MongoDB. It lets users create an account, write posts, upload cover images, like and comment on posts, follow other writers, and browse blogs from the home feed.

The project is mostly meant as a full-stack practice app, so it covers the usual pieces of a small web application: authentication, database models, server-side views, file uploads, user profiles, and a few social features.

## What It Can Do

- Sign up, sign in, and log out with cookie-based JWT authentication
- Create blog posts with a title, body, category, and optional cover image
- Like or unlike posts
- Comment on blog posts
- View public user profiles
- Follow and unfollow other users
- Search for blogs and users from the home page
- Filter posts by category
- Show trending posts based on likes
- Store uploaded images locally during development
- Use Cloudinary for image uploads when credentials are provided
- Seed the database with demo users, posts, follows, likes, and comments

## Tech Used

- Node.js
- Express
- EJS
- MongoDB and Mongoose
- JSON Web Tokens
- Multer
- Cloudinary

## Project Structure

```text
.
|-- index.js                  # Main Express app
|-- routes/                   # Blog and user routes
|-- models/                   # Mongoose schemas
|-- middlewares/              # Authentication middleware
|-- services/                 # Auth and image upload helpers
|-- views/                    # EJS pages and partials
|-- public/                   # Static files and local uploads
`-- scripts/seedDemoContent.js
```

## Getting Started

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the root folder:

```env
PORT=3001
MONGODB_URL=mongodb://127.0.0.1:27017/blogify
JWT_SECRET=your-secret-key

# Optional, only needed if you want Cloudinary uploads
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`MONGODB_URL` is required. `JWT_SECRET` should also be set, even though the app has a fallback value.

## Running the App

For development:

```bash
npm run dev
```

For a normal Node start:

```bash
npm start
```

Then open:

```text
http://localhost:3001
```

## Demo Content

If you want some sample data to test the feed, profiles, likes, comments, and follows, run:

```bash
npm run seed:demo
```

The seed script clears old demo content first, then creates fresh demo users and posts.

## Main Pages

- `/` - home feed with search, categories, suggested users, and trending posts
- `/user/signup` - signup page
- `/user/signin` - signin page
- `/user/me` - redirects to the logged-in user's profile
- `/user/profile/:id` - public profile page
- `/blog/add-new` - create a new blog post
- `/blog/:Id` - blog detail page with likes and comments

## Image Uploads

If Cloudinary credentials are available in `.env`, cover images are uploaded to Cloudinary. If they are not set, the app saves uploads inside `public/uploads/`.

Local uploads are fine while developing, but they may disappear on some hosting platforms. For deployment, Cloudinary is the safer option.

## Notes

- The app uses `index.js` as the main entry file.
- `server.js` is present, but the npm scripts run `index.js`.
- In production mode, `index.js` exports the Express app instead of starting the listener directly. This is useful for platforms that handle the server process themselves.

## Things I Might Add Later

- Edit blog posts
- Better form validation
- Rich text editing
- More image checks before upload
- Automated tests
- Pagination or infinite scrolling

create a flow for rate limit 